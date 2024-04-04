const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

//@desc     GET all users
//@route    GET /
//@access   Public
exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (err) {
    res.status(400).json({ message: err })
  }
}

//@desc     Create user
//@route    POST /
//@access   Admin
exports.createUser = async (req, res, next) => {
  const { username, password, role } = req.body
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password,
        role
      }
    })
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ message: err })
  }
}
