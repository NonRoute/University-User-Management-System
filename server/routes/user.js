const express = require('express')
const { getUsers, createUser, login } = require('../controllers/user')
const { protect, authorize } = require('../middleware/auth')
const router = express.Router()

router.route('/').get(protect, authorize('admin'), getUsers).post(protect, authorize('admin'), createUser)
router.route('/login').post(login)

module.exports = router
