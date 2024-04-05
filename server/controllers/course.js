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
    res.status(400).json({ message: err })
  }
}

//@desc     GET course
//@route    GET /course/:id
//@access   Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: Number(req.params.id)
      }
    })
    res.status(200).json(course)
  } catch (err) {
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
    res.status(400).json({ message: err })
  }
}
