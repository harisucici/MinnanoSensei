const User = require('../models/User');
const FileDB = require('../db/fileDb');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // We'll create this later

// Initialize file database as fallback
const fileDB = new FileDB('./data/users.json');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, nativeLanguage, learningGoal } = req.body;

    // Validation
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (!nativeLanguage || !learningGoal) {
      return res.status(400).json({
        success: false,
        message: 'Native language and learning goal are required for registration'
      });
    }

    try {
      // Try to create user in MongoDB
      const user = await User.create({
        name,
        email,
        phone,
        password,
        nativeLanguage,
        learningGoal
      });

      sendTokenResponse(user, 201, res);
    } catch (dbError) {
      // If MongoDB fails, fallback to file database
      console.log('MongoDB connection failed, using file database as fallback');
      
      // Check if user already exists in file database
      const existingUser = await fileDB.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Create user in file database
      const userData = {
        name,
        email,
        phone,
        password, // Note: In a real implementation, you'd hash the password
        nativeLanguage,
        learningGoal
      };
      
      const user = await fileDB.createUser(userData);
      
      // For file database, we'll just send success response without JWT
      // In a production environment, you'd still want to generate a proper token
      res.status(201).json({
        success: true,
        message: 'User registered successfully using file database',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          nativeLanguage: user.nativeLanguage,
          learningGoal: user.learningGoal,
          createdAt: user.createdAt
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error registering user'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { identifier, password } = req.body; // identifier can be email or phone

  // Validate email/phone and password
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email/phone and password'
    });
  }

  try {
    // Try to find user in MongoDB
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    }).select('+password'); // Include password field

    if (user) {
      // Check if password matches
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last active
      user.lastActive = Date.now();
      await user.save();

      sendTokenResponse(user, 200, res);
    } else {
      // If not found in MongoDB, try file database
      const fileUser = await fileDB.findUserByEmail(identifier);
      
      if (!fileUser) {
        // User doesn't exist in either database
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // User exists in file database, check password
      if (fileUser.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // For file database, we'll just send success response
      res.status(200).json({
        success: true,
        message: 'Login successful using file database',
        data: {
          id: fileUser.id,
          name: fileUser.name,
          email: fileUser.email,
          nativeLanguage: fileUser.nativeLanguage,
          learningGoal: fileUser.learningGoal
        }
      });
    }
  } catch (dbError) {
    // If MongoDB fails completely, try file database
    console.log('MongoDB connection failed, checking file database for login');
    
    const fileUser = await fileDB.findUserByEmail(identifier);
    
    if (!fileUser) {
      // User doesn't exist in file database
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // User exists in file database, check password
    if (fileUser.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // For file database, we'll just send success response
    res.status(200).json({
      success: true,
      message: 'Login successful using file database',
      data: {
        id: fileUser.id,
        name: fileUser.name,
        email: fileUser.email,
        nativeLanguage: fileUser.nativeLanguage,
        learningGoal: fileUser.learningGoal
      }
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      nativeLanguage: user.nativeLanguage,
      learningGoal: user.learningGoal,
      level: user.level,
      completedLessons: user.completedLessons,
      totalLessons: user.totalLessons,
      totalStudyTime: user.totalStudyTime,
      currentStreak: user.currentStreak,
      achievements: user.achievements,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
  });
};

// @desc    Update user details
// @route   PUT /api/auth/me
// @access  Private
exports.updateMe = async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    nativeLanguage: req.body.nativeLanguage,
    learningGoal: req.body.learningGoal,
    level: req.body.level,
    avatar: req.body.avatar
  };

  // Remove undefined values
  Object.keys(fieldsToUpdate).forEach(key => {
    if (fieldsToUpdate[key] === undefined) {
      delete fieldsToUpdate[key];
    }
  });

  try {
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    // Handle duplicate field error
    if (error.code === 11000) {
      let message = 'Duplicate field value entered';
      if (error.keyPattern.email) {
        message = 'Email already registered';
      } else if (error.keyPattern.phone) {
        message = 'Phone number already registered';
      }
      return res.status(400).json({
        success: false,
        message
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Error updating user'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message
    });

    res.status(200).json({
      success: true,
      message: 'Email sent'
    });
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      success: false,
      message: 'Email could not be sent'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid token'
    });
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      nativeLanguage: user.nativeLanguage,
      learningGoal: user.learningGoal,
      level: user.level,
      completedLessons: user.completedLessons,
      totalLessons: user.totalLessons,
      totalStudyTime: user.totalStudyTime,
      currentStreak: user.currentStreak,
      achievements: user.achievements,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
  });
};