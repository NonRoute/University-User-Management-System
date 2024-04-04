const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//@desc     GET all users
//@route    GET /user
//@access   Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (err) {
    res.status(400).json({ message: err })
  }
}

//@desc     Create user
//@route    POST /user
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
    success: true,
    token
  })
}
