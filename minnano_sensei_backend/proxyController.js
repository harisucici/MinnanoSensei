const axios = require('axios');

// Proxy controller to forward requests to mock service
const MOCK_SERVICE_URL = process.env.MOCK_SERVICE_URL || 'http://localhost:4001';

// Get all courses from mock service
exports.getCourses = async (req, res, next) => {
  try {
    const response = await axios.get(`${MOCK_SERVICE_URL}/api/courses`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching courses from mock service:', error);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Error fetching courses from mock service' 
    });
  }
};

// Get single course from mock service
exports.getCourse = async (req, res, next) => {
  try {
    const response = await axios.get(`${MOCK_SERVICE_URL}/api/courses/${req.params.id}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching course from mock service:', error);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Error fetching course from mock service' 
    });
  }
};

// Get course content from mock service
exports.getCourseContent = async (req, res, next) => {
  try {
    const response = await axios.get(`${MOCK_SERVICE_URL}/api/courses/${req.params.id}/content`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching course content from mock service:', error);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Error fetching course content from mock service' 
    });
  }
};

// Enroll in course via mock service
exports.enrollInCourse = async (req, res, next) => {
  try {
    const response = await axios.post(`${MOCK_SERVICE_URL}/api/courses/${req.params.id}/enroll`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error enrolling in course via mock service:', error);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Error enrolling in course via mock service' 
    });
  }
};

// Get user enrolled courses from mock service
exports.getUserEnrolledCourses = async (req, res, next) => {
  try {
    // For now, we'll simulate this with a mock response
    // In a real scenario, this would be stored in our database
    res.status(200).json({
      success: true,
      data: [],
      count: 0
    });
  } catch (error) {
    console.error('Error fetching enrolled courses from mock service:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching enrolled courses' 
    });
  }
};

// Get user created courses from mock service
exports.getUserCreatedCourses = async (req, res, next) => {
  try {
    // For now, we'll simulate this with a mock response
    // In a real scenario, this would be stored in our database
    res.status(200).json({
      success: true,
      data: [],
      count: 0
    });
  } catch (error) {
    console.error('Error fetching created courses from mock service:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching created courses' 
    });
  }
};

// Create course via mock service
exports.addCourse = async (req, res, next) => {
  try {
    const response = await axios.post(`${MOCK_SERVICE_URL}/api/courses`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating course via mock service:', error);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Error creating course via mock service' 
    });
  }
};

// Update course via mock service
exports.updateCourse = async (req, res, next) => {
  try {
    const response = await axios.put(`${MOCK_SERVICE_URL}/api/courses/${req.params.id}`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error updating course via mock service:', error);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Error updating course via mock service' 
    });
  }
};

// Delete course via mock service
exports.deleteCourse = async (req, res, next) => {
  try {
    const response = await axios.delete(`${MOCK_SERVICE_URL}/api/courses/${req.params.id}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error deleting course via mock service:', error);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Error deleting course via mock service' 
    });
  }
};

// Authentication functions remain with our own database
// Import the original authController functions
const authController = require('./controllers/authController');

// Export both proxy and auth functions
module.exports = {
  // Proxy functions for courses
  getCourses: exports.getCourses,
  getCourse: exports.getCourse,
  getCourseContent: exports.getCourseContent,
  enrollInCourse: exports.enrollInCourse,
  getUserEnrolledCourses: exports.getUserEnrolledCourses,
  getUserCreatedCourses: exports.getUserCreatedCourses,
  addCourse: exports.addCourse,
  updateCourse: exports.updateCourse,
  deleteCourse: exports.deleteCourse,
  // Auth functions from original controller
  register: authController.register,
  login: authController.login,
  getMe: authController.getMe,
  updateMe: authController.updateMe,
  forgotPassword: authController.forgotPassword,
  resetPassword: authController.resetPassword
};