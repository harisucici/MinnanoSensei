const express = require('express');
const {
  getCourses,
  getCourse,
  getCourseContent,
  addCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getUserEnrolledCourses,
  getUserCreatedCourses
} = require('../proxyController'); // Changed to use proxy controller
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getCourses).post(protect, addCourse);
router.route('/my').get(protect, getUserCreatedCourses);
router.route('/enrolled').get(protect, getUserEnrolledCourses);
router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse);
router.route('/:id/content').get(getCourseContent);
router.route('/:id/enroll').post(protect, enrollInCourse);

module.exports = router;