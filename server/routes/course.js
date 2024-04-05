const express = require('express')
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  assignTeacher
} = require('../controllers/course')
const { protect, authorize } = require('../middleware/auth')
const router = express.Router()

router.route('/').get(getCourses).post(protect, authorize('admin', 'teacher'), createCourse)
router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin', 'teacher'), updateCourse)
  .delete(protect, authorize('admin', 'teacher'), deleteCourse)
router.route('/assign').post(protect, authorize('admin', 'teacher'), assignTeacher)

module.exports = router
