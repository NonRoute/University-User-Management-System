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
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Log-in to the system
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
 *     responses:
 *       200:
 *         description: Log-in Successfully
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
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/login').post(login)
/**
 * @swagger
 * /user/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Return information about me
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successful operation
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
router.route('/me').get(protect, getMe)
/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Log user out / clear cookie
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logout success message
 *             example:
 *               message: success
 *       400:
 *         description: Bad request
 */
router.route('/logout').get(logout)
/**
 * @swagger
 * /user/enroll:
 *   post:
 *     summary: (Admin, Student) Enroll me in a course
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: integer
 *                 description: ID of the course to enroll in
 *     responses:
 *       201:
 *         description: Successfully enrolled in the course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Enrollment success message
 *                 enrollment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Enrollment ID
 *                     userId:
 *                       type: integer
 *                       description: ID of the enrolled user
 *                     courseId:
 *                       type: integer
 *                       description: ID of the enrolled course
 *                     grade:
 *                       type: string
 *                       description: Grade of the enrolled student (null initially)
 *             example:
 *               message: Enrolled successfully
 *               enrollment:
 *                 id: 2
 *                 userId: 1
 *                 courseId: 2
 *                 grade: null
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized
 */
router.route('/enroll').post(protect, authorize('admin', 'student'), enrollCourse)
/**
 * @swagger
 * /user/enrollments:
 *   get:
 *     summary: (Admin, Student) Get my enrollments
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrollments:
 *                   type: array
 *                   description: List of my enrollments
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Enrollment ID
 *                       userId:
 *                         type: integer
 *                         description: ID of the enrolled user
 *                       courseId:
 *                         type: integer
 *                         description: ID of the enrolled course
 *                       courseName:
 *                         type: string
 *                         description: Name of the enrolled course
 *                       grade:
 *                         type: string
 *                         description: Grade of the enrolled student (null initially)
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Conflict, You are already enrolled in this course
 */
router.route('/enrollments').get(protect, authorize('admin', 'student'), getMyEnrollments)

module.exports = router
