const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, // Allows null values but ensures uniqueness when present
    validate: {
      validator: function(v) {
        // Simple phone number validation (can be enhanced based on requirements)
        return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Exclude password from queries by default
  },
  nativeLanguage: {
    type: String,
    required: [true, 'Please specify your native language'],
    enum: {
      values: ['English', 'Chinese', 'Korean', 'Vietnamese', 'Thai', 'French', 'Spanish', 'Other'],
      message: 'Please select a valid native language'
    }
  },
  learningGoal: {
    type: String,
    required: [true, 'Please specify your learning goal'],
    enum: {
      values: ['Business Japanese', 'Travel Japanese', 'Academic Japanese', 'General Conversation', ' JLPT Preparation', 'Cultural Understanding'],
      message: 'Please select a valid learning goal'
    }
  },
  level: {
    type: String,
    default: 'Beginner (N5-N4)',
    enum: {
      values: ['Beginner (N5-N4)', 'Intermediate (N4-N3)', 'Advanced (N3-N2)', 'Fluent (N1)'],
      message: 'Please select a valid level'
    }
  },
  completedLessons: {
    type: Number,
    default: 0
  },
  totalLessons: {
    type: Number,
    default: 0
  },
  totalStudyTime: {
    type: Number,
    default: 0 // in minutes
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  enrolledCourses: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Course'
  }],
  avatar: {
    type: String, // URL to avatar image
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpire: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'fallback_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Generate reset password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set reset password expire
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);