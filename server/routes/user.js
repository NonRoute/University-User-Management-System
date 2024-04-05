const express = require('express')
const { getUsers, createUser, login, getMe, logout, enrollCourse, getMyEnrollments } = require('../controllers/user')
const { protect, authorize } = require('../middleware/auth')
const router = express.Router()

router.route('/').get(protect, authorize('admin'), getUsers).post(protect, authorize('admin'), createUser)
router.route('/login').post(login)
router.route('/me').get(protect, getMe)
router.route('/logout').get(logout)
router.route('/enroll').post(protect, authorize('admin', 'student'), enrollCourse)
router.route('/enrollments').get(protect, authorize('admin', 'student'), getMyEnrollments)

module.exports = router
