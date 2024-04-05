/**
 * @swagger
 * tags:
 *   name: Course
 */

const express = require('express')
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  assignTeacher,
  assignGrade
} = require('../controllers/course')
const { protect, authorize } = require('../middleware/auth')
const router = express.Router()

/**
 * @swagger
 * /course:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
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
 *                     description: Course ID
 *                   name:
 *                     type: string
 *                     description: Course name
 *       400:
 *         description: Bad request
 */
router.route('/').get(getCourses).post(protect, authorize('admin', 'teacher'), createCourse)
/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to retrieve
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
 *                   description: Course ID
 *                 name:
 *                   type: string
 *                   description: Course name
 *                 teach:
 *                   type: array
 *                   description: List of teachers for the course
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Teacher ID
 *                       userId:
 *                         type: integer
 *                         description: ID of the teacher user
 *                       username:
 *                         type: string
 *                         description: Teacher's username
 *                       role:
 *                         type: string
 *                         description: Teacher's role
 *                 enroll:
 *                   type: array
 *                   description: List of enrolled students for the course
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Enrollment ID
 *                       userId:
 *                         type: integer
 *                         description: ID of the enrolled user
 *                       username:
 *                         type: string
 *                         description: Student's username
 *                       role:
 *                         type: string
 *                         description: Student's role
 *       400:
 *         description: Bad request
 *       404:
 *         description: Course not found
 */
router.route('/:id/grade').post(protect, authorize('admin', 'teacher'), assignGrade)
router.route('/:id/teacher').post(protect, authorize('admin', 'teacher'), assignTeacher)
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin', 'teacher'), updateCourse)
  .delete(protect, authorize('admin', 'teacher'), deleteCourse)

module.exports = router
