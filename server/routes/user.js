const express = require('express')
const { getUsers, createUser, login } = require('../controllers/user')
const router = express.Router()

router.route('/').get(getUsers).post(createUser)
router.route('/login').post(login)

module.exports = router
