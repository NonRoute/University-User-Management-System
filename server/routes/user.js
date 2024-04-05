/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: User
 */

const express = require('express')
const { getUsers, createUser, login, getMe, logout, enrollCourse, getMyEnrollments } = require('../controllers/user')
const { protect, authorize } = require('../middleware/auth')
const router = express.Router()

/**
 * @swagger
 * /user:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: (Admin) Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: User ID
 *                   username:
 *                     type: string
 *                     description: User's username
 *                   role:
 *                     type: string
 *                     description: User's role
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /user:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: (Admin) Create a new user
 *     tags: [User]
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                  password:
 *                    type: string
 *                  role:
 *                    type: string
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: User ID
 *                 username:
 *                   type: string
 *                   description: User's username
 *                 role:
 *                   type: string
 *                   description: User's role
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/').get(protect, authorize('admin'), getUsers).post(protect, authorize('admin'), createUser)
router.route('/login').post(login)
router.route('/me').get(protect, getMe)
router.route('/logout').get(logout)
router.route('/enroll').post(protect, authorize('admin', 'student'), enrollCourse)
router.route('/enrollments').get(protect, authorize('admin', 'student'), getMyEnrollments)

module.exports = router
