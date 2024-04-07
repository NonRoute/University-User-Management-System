const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//@desc     GET all users
//@route    GET /user
//@access   Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true
      }
    })
    res.status(200).json(users)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//@desc     Create user
//@route    POST /user
//@access   Admin
exports.createUser = async (req, res, next) => {
  const { username, password, role } = req.body
  // Check if the role is valid ('admin', 'teacher', or 'student')
  if (!['admin', 'teacher', 'student'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' })
  }
  const salt = await bcrypt.genSalt(10)
  hashedPassword = await bcrypt.hash(password, salt)

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        username: true,
        role: true
      }
    })
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//@desc		Login user
//@route	POST /user/login
//@access	Public
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    //Validate email & password
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide an username and password' })
    }

    //Check for user
    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    //Check if password matches
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    sendTokenResponse(user, 200, res)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    id: user.id,
    username: user.username,
    role: user.role,
    token
  })
}

//@desc		Get current Logged in user
//@route 	GET /user/me
//@access	Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.user.id)
      },
      select: {
        id: true,
        username: true,
        role: true
      }
    })
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//@desc		Log user out / clear cookie
//@route 	GET /user/logout
//@access	Public
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    })
    res.status(200).json({ message: 'success' })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//@desc		Enroll me in a course
//@route 	POST /user/enroll
//@access	Admin, Student
exports.enrollCourse = async (req, res, next) => {
  const { courseId } = req.body
  try {
    // Check if the course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    // Check if the enrollment already exists
    const existingEnrollment = await prisma.enroll.findFirst({
      where: { userId: req.user.id, courseId }
    })
    if (existingEnrollment) {
      return res.status(409).json({ message: 'You already enrolled in this course' })
    }
    // Create the enrollment
    const enrollment = await prisma.enroll.create({
      data: { userId: req.user.id, courseId }
    })
    res.status(201).json({ message: 'Enrolled successfully', enrollment })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Failed to enroll student' })
  }
}

//@desc		GET my enrollment
//@route 	GET /user/enrollments
//@access	Admin, Student
exports.getMyEnrollments = async (req, res, next) => {
  try {
    let enrollments = await prisma.enroll.findMany({
      where: { userId: req.user.id },
      include: {
        course: true
      }
    })
    enrollments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      courseName: enrollment.course.name,
      grade: enrollment.grade
    }))
    res.status(200).json({ enrollments })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Failed to retrieve enrollments' })
  }
}
