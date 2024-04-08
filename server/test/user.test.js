const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const userController = require('../controllers/user')
const bcrypt = require('bcryptjs')

let validUserId
let validCourseId

beforeAll(async () => {
  await prisma.enroll.deleteMany({})
  await prisma.teach.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.user.deleteMany({})

  const user = await prisma.user.create({
    data: {
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
      role: 'student'
    }
  })
  validUserId = user.id

  const course = await prisma.course.create({ data: { name: 'Test Course' } })
  validCourseId = course.id
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('getUsers', () => {
  test('should return an array of users', async () => {
    const req = { user: { role: 'admin' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.getUsers(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.any(Array))
  })
})

describe('createUser', () => {
  test('should create a new user', async () => {
    const req = {
      body: {
        username: 'newuser',
        password: 'newpassword',
        role: 'student'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: 'newuser', role: 'student' }))
  })

  test('should fail when role is invalid', async () => {
    const req = {
      body: {
        username: 'invaliduser',
        password: 'invalidpassword',
        role: 'invalid'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.createUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid role' })
  })
})

describe('login', () => {
  test('should login with valid credentials', async () => {
    const req = {
      body: {
        username: 'testuser',
        password: 'testpassword'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.login(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ username: 'testuser', role: 'student' }))
  })

  test('should fail with invalid credentials', async () => {
    const req = {
      body: {
        username: 'testuser',
        password: 'wrongpassword'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.login(req, res)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' })
  })
})

describe('getMe', () => {
  test('should return the logged-in user', async () => {
    const req = { user: { id: validUserId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.getMe(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: validUserId, username: 'testuser', role: 'student' })
    )
  })
})

describe('logout', () => {
  test('should clear the cookie', async () => {
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.logout(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.cookie).toHaveBeenCalledWith('token', 'none', expect.any(Object))
    expect(res.json).toHaveBeenCalledWith({ message: 'success' })
  })
})

describe('enrollCourse', () => {
  test('should enroll a student in a course', async () => {
    const req = { user: { id: validUserId }, body: { courseId: validCourseId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.enrollCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Enrolled successfully' }))
  })

  test('should fail to enroll in the same course', async () => {
    const req = { user: { id: validUserId }, body: { courseId: validCourseId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.enrollCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'You already enrolled in this course' }))
  })

  test('should fail to enroll in a non-existent course', async () => {
    const req = { user: { id: validUserId }, body: { courseId: 999 } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.enrollCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Course not found' })
  })
})

describe('getMyEnrollments', () => {
  test("should return the user's enrollments", async () => {
    await prisma.enroll.create({ data: { userId: validUserId, courseId: validCourseId } })
    const req = { user: { id: validUserId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await userController.getMyEnrollments(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ enrollments: expect.any(Array) }))
  })
})
