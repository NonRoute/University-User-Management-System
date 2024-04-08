const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const courseController = require('../controllers/course')

let validCourseId
let validTeacherId
let validStudentId

beforeAll(async () => {
  await prisma.enroll.deleteMany({})
  await prisma.teach.deleteMany({})
  await prisma.course.deleteMany({})
  await prisma.user.deleteMany({})

  const course = await prisma.course.create({ data: { name: 'Test Course' } })
  validCourseId = course.id

  const teacher = await prisma.user.create({ data: { username: 'testteacher', password: '123', role: 'teacher' } })
  validTeacherId = teacher.id

  const student = await prisma.user.create({ data: { username: 'teststudent', password: '123', role: 'student' } })
  validStudentId = student.id
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('getCourses', () => {
  test('should return an array of courses', async () => {
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.getCourses(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.any(Array))
  })
})

describe('getCourse', () => {
  test('should return a course when id is valid', async () => {
    const req = { params: { id: validCourseId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.getCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.any(Object))
  })

  test('should return 404 when course is not found', async () => {
    const req = { params: { id: 999 } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.getCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Course not found' })
  })
})

describe('createCourse', () => {
  test('should create a new course', async () => {
    const req = { body: { name: 'Another Course' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.createCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Another Course' }))
  })

  test('should fail when name is missing', async () => {
    const req = { body: {} }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.createCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})

describe('updateCourse', () => {
  test('should update an existing course', async () => {
    const req = { params: { id: validCourseId }, body: { name: 'Updated Course' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.updateCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated Course' }))
  })

  test('should fail when course name is invalid type', async () => {
    const req = { params: { id: validCourseId }, body: { name: 234234 } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.updateCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
  })
})

describe('deleteCourse', () => {
  test('should delete an existing course', async () => {
    const req = { params: { id: validCourseId + 1 } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.deleteCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.any(Object))
  })
})

describe('assignTeacher', () => {
  test('should assign a teacher to a course', async () => {
    const req = { params: { id: validCourseId }, body: { userId: validTeacherId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.assignTeacher(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Assign teacher successfully' }))
  })

  test('should fail to assign a non-teacher user', async () => {
    const nonTeacherId = (
      await prisma.user.create({ data: { username: 'nonteacher', password: '456', role: 'student' } })
    ).id
    const req = { params: { id: validCourseId }, body: { userId: nonTeacherId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.assignTeacher(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'User is not a teacher' })
  })

  test('should fail to assign a teacher to a non-existent course', async () => {
    const req = { params: { id: 999 }, body: { userId: validTeacherId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.assignTeacher(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Course not found' })
  })

  test('should fail to assign the same teacher twice', async () => {
    await prisma.teach.create({ data: { userId: validTeacherId, courseId: validCourseId } })
    const req = { params: { id: validCourseId }, body: { userId: validTeacherId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.assignTeacher(req, res)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ message: 'Teacher already assigned to the course' })
  })
})

describe('assignGrade', () => {
  test('should fail to assign a grade to a non-enrolled student', async () => {
    const req = { params: { id: validCourseId }, body: { userId: validStudentId, grade: 'B+' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.assignGrade(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Student or course not found' })
  })

  test('should assign a grade to a student in a course', async () => {
    // First, enroll the student in the course
    await prisma.enroll.create({ data: { userId: validStudentId, courseId: validCourseId } })

    const req = { params: { id: validCourseId }, body: { userId: validStudentId, grade: 'A' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.assignGrade(req, res)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Assign grade successfully' }))
  })

  test('should fail to assign a grade to a non-existent course', async () => {
    const req = { params: { id: 789 }, body: { userId: validStudentId, grade: 'C' } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.assignGrade(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Student or course not found' })
  })
})

describe('myCourse', () => {
  test('should return courses for the logged-in teacher', async () => {
    // Assign the teacher to the course
    await prisma.teach.create({ data: { userId: validTeacherId, courseId: validCourseId } })

    const req = { user: { id: validTeacherId } }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    await courseController.myCourse(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ coursesData: expect.any(Array) }))
  })
})
