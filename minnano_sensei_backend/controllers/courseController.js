const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    let query;

    // Filter by category, level, or search term
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = Course.find(JSON.parse(queryStr)).populate({
      path: 'createdBy',
      select: 'name email'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Course.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const courses = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.previous = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      pagination,
      data: courses
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching courses'
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'createdBy',
      select: 'name email'
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || `Course not found with id of ${req.params.id}`
    });
  }
};

// @desc    Get course content
// @route   GET /api/courses/:id/content
// @access  Public
exports.getCourseContent = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: course._id,
        title: course.title,
        content: course.description,
        grammarPoints: course.content?.grammarPoints || [],
        vocabulary: course.content?.vocabulary || [],
        exercises: course.content?.exercises || []
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || `Course not found with id of ${req.params.id}`
    });
  }
};

// @desc    Add course
// @route   POST /api/courses
// @access  Private
exports.addCourse = async (req, res, next) => {
  try {
    // Add user id to req.body
    req.body.createdBy = req.user.id;

    // Check for published course
    const publishedCourse = await Course.findOne({ createdBy: req.user.id });

    // If the user is not an admin, they can only add one course
    if (publishedCourse && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already published a course`
      });
    }

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error adding course'
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with id of ${req.params.id}`
      });
    }

    // Make sure user is course owner or admin
    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this course`
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || `Course not found with id of ${req.params.id}`
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with id of ${req.params.id}`
      });
    }

    // Make sure user is course owner or admin
    if (course.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this course`
      });
    }

    await course.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || `Course not found with id of ${req.params.id}`
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with id of ${req.params.id}`
      });
    }

    // Add user to enrolled users array
    course.enrolledUsers.push(req.user.id);
    course.enrolled = course.enrolledUsers.length;
    await course.save();

    // Update user's enrolled courses
    const user = await User.findById(req.user.id);
    if (!user.enrolledCourses.includes(req.params.id)) {
      user.enrolledCourses.push(req.params.id);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        courseId: course._id,
        title: course.title,
        enrolledCount: course.enrolled
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || `Course not found with id of ${req.params.id}`
    });
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private
exports.getUserEnrolledCourses = async (req, res, next) => {
  try {
    // Find user and populate their enrolled courses
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses',
      select: 'title description category level duration lessons enrolled instructor rating reviews'
    });

    res.status(200).json({
      success: true,
      data: user.enrolledCourses,
      count: user.enrolledCourses.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching enrolled courses'
    });
  }
};

// @desc    Get user's created courses
// @route   GET /api/courses/my
// @access  Private
exports.getUserCreatedCourses = async (req, res, next) => {
  try {
    // Find courses created by the user
    const courses = await Course.find({ createdBy: req.user.id });

    res.status(200).json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error fetching created courses'
    });
  }
};