const express = require('express')
const { getUsers, createUser, login, getMe, logout } = require('../controllers/user')
const { protect, authorize } = require('../middleware/auth')
const router = express.Router()

router.route('/').get(protect, authorize('admin'), getUsers).post(protect, authorize('admin'), createUser)
router.route('/login').post(login)
router.route('/me').get(protect, getMe)
router.route('/logout').get(logout)

module.exports = router
