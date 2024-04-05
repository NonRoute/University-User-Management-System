const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//@desc     GET all courses
//@route    GET /course
//@access   Public
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany()
    res.status(200).json(courses)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//@desc     GET course
//@route    GET /course/:id
//@access   Public
exports.getCourse = async (req, res, next) => {
  try {
    let course = await prisma.course.findUnique({
      where: {
        id: Number(req.params.id)
      },
      include: {
        teach: {
          include: {
            user: {
              select: {
                username: true,
                role: true
              }
            }
          }
        },
        enroll: {
          include: {
            user: {
              select: {
                username: true,
                role: true
              }
            }
          }
        }
      }
    })

    course = {
      id: course.id,
      name: course.name,
      teach: course.teach.map((teacher) => ({
        id: teacher.id,
        userId: teacher.userId,
        username: teacher.user.username,
        role: teacher.user.role
      })),
      enroll: course.enroll.map((enrollment) => ({
        id: enrollment.id,
        userId: enrollment.userId,
        username: enrollment.user.username,
        role: enrollment.user.role
      }))
    }
    res.status(200).json(course)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//@desc     Create course
//@route    POST /course
//@access   Admin, Teacher
exports.createCourse = async (req, res, next) => {
  const { name } = req.body
  try {
    const course = await prisma.course.create({
      data: {
        name
      }
    })
    res.status(201).json(course)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//@desc     Update course
//@route    PUT /course/:id
//@access   Admin, Teacher
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await prisma.course.update({
      where: {
        id: Number(req.params.id)
      },
      data: req.body
    })
    res.status(200).json(course)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//@desc     Delete course
//@route    DELETE /course/:id
//@access   Admin, Teacher
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await prisma.course.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    res.status(200).json(course)
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
  }
}

//@desc		Assign teacher to course
//@route 	POST /course/assign
//@access	Admin, Teacher
exports.assignTeacher = async (req, res, next) => {
  const courseId = Number(req.params.id)
  const { userId } = req.body
  try {
    // Check if userId is a teacher
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.role != 'teacher' && user.role != 'admin') {
      return res.status(400).json({ message: 'User is not a teacher' })
    }
    // Check if the course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }
    // Check if the teacher already exists
    const existingTeacher = await prisma.teach.findFirst({
      where: { userId: userId, courseId }
    })
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher are already teach in this course' })
    }
    // Create the teaching
    const teaching = await prisma.teach.create({
      data: { userId: userId, courseId }
    })
    res.status(201).json({ message: 'Assign teacher successfully', teaching })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Failed to assign teacher' })
  }
}

//@desc		Assign grade
//@route 	POST /course/:id/grade
//@access	Admin, Student
exports.assignGrade = async (req, res, next) => {
  const { courseId } = req.params.id
  const { userId, grade } = req.body
  try {
    // Check if the enrollment exists
    let enrollment = await prisma.enroll.findFirst({
      where: { userId: userId, courseId }
    })
    if (!enrollment) {
      return res.status(404).json({ message: 'Student or course not found' })
    }
    // Update grade
    enrollment = await prisma.enroll.update({
      where: {
        id: Number(enrollment.id)
      },
      data: { grade }
    })
    res.status(201).json({ message: 'Assign grade successfully', enrollment })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: 'Failed to assign grade' })
  }
}
