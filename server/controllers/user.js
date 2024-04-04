const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

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
  const salt = await bcrypt.genSalt(10)
  hashedPassword = await bcrypt.hash(password, salt)
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role
      }
    })
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ message: err })
  }
}
