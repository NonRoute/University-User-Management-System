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
  assignGrade,
  myCourse
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
/**
 * @swagger
 * /course:
 *   post:
 *     summary: (Admin, Teacher) Create a new course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the course to create
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the created course
 *                 name:
 *                   type: string
 *                   description: Name of the created course
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/').get(getCourses).post(protect, authorize('admin', 'teacher'), createCourse)
/**
 * @swagger
 * /course/{id}/grade:
 *   post:
 *     summary: (Admin, Teacher) Assign a grade to a student in a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to assign the grade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the student to assign the grade
 *               grade:
 *                 type: string
 *                 description: Grade to assign to the student
 *     responses:
 *       201:
 *         description: Grade assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 enrollment:
 *                   type: object
 *                   description: Details of the enrollment with the assigned grade
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the enrollment
 *                     userId:
 *                       type: integer
 *                       description: ID of the student
 *                     courseId:
 *                       type: integer
 *                       description: ID of the course
 *                     grade:
 *                       type: string
 *                       description: Assigned grade
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Student or course not found
 */
router.route('/:id/grade').post(protect, authorize('admin', 'teacher'), assignGrade)
/**
 * @swagger
 * /course/my-course:
 *   get:
 *     summary: (Admin, Teacher) Get courses taught by me
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coursesData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: integer
 *                         description: ID of the course
 *                       courseName:
 *                         type: string
 *                         description: Name of the course
 *                       enrolledStudents:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             studentId:
 *                               type: integer
 *                               description: ID of the student
 *                             studentUsername:
 *                               type: string
 *                               description: Username of the student
 *                             grade:
 *                               type: string
 *                               description: Grade of the student in the course
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/my-course').get(protect, authorize('admin', 'teacher'), myCourse)
/**
 * @swagger
 * /course/{id}/teacher:
 *   post:
 *     summary: (Admin, Teacher) Assign a teacher to a course
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to assign the teacher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the teacher to assign
 *     responses:
 *       201:
 *         description: Teacher assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 teaching:
 *                   type: object
 *                   description: Details of the teaching assignment
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID of the teaching assignment
 *                     userId:
 *                       type: integer
 *                       description: ID of the assigned teacher
 *                     courseId:
 *                       type: integer
 *                       description: ID of the course assigned
 *             example:
 *                value:
 *                  message: Assign teacher successfully
 *                  teaching:
 *                    id: 4
 *                    userId: 5
 *                    courseId: 1
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or course not found
 *       409:
 *         description: Conflict, teacher already assigned to the course
 */
router.route('/:id/teacher').post(protect, authorize('admin', 'teacher'), assignTeacher)
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
/**
 * @swagger
 * /course/{id}:
 *   put:
 *     summary: (Admin, Teacher) Update a course by ID
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the course
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the updated course
 *                 name:
 *                   type: string
 *                   description: Updated name of the course
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: (Admin, Teacher) Delete a course by ID
 *     tags: [Course]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to delete
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID of the deleted course
 *                 name:
 *                   type: string
 *                   description: Name of the deleted course
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin', 'teacher'), updateCourse)
  .delete(protect, authorize('admin', 'teacher'), deleteCourse)

module.exports = router
