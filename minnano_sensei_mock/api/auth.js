const express = require('express');
const router = express.Router();

// Mock data
let users = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: null,
    nativeLanguage: 'English',
    learningGoal: 'General Conversation',
    level: 'Beginner (N5-N4)',
    completedLessons: 0,
    totalLessons: 3,  // Updated to match actual lesson count
    totalStudyTime: 0,
    currentStreak: 0,
    achievements: [],
    authToken: 'mock_auth_token_12345'
  }
];

// Helper function to generate tokens
const generateToken = () => `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Register endpoint
router.post('/register', (req, res) => {
  const { email, phone, password, name, nativeLanguage, learningGoal } = req.body;
  
  // Validate required fields
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
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email || u.phone === phone);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email or phone already exists'
    });
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    name: name || (email && email.split('@')[0]) || (phone && `User${Date.now()}`) || 'New User',
    email: email || null,
    phone: phone || null,
    nativeLanguage: nativeLanguage,
    learningGoal: learningGoal,
    level: 'Beginner (N5-N4)',
    completedLessons: 0,
    totalLessons: 20,
    totalStudyTime: 0,
    currentStreak: 0,
    achievements: [],
    authToken: generateToken()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      token: newUser.authToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        nativeLanguage: newUser.nativeLanguage,
        learningGoal: newUser.learningGoal,
        level: newUser.level,
        completedLessons: newUser.completedLessons,
        totalLessons: newUser.totalLessons,
        totalStudyTime: newUser.totalStudyTime,
        currentStreak: newUser.currentStreak,
        achievements: newUser.achievements,
        authToken: newUser.authToken
      }
    }
  });
});

// Login endpoint
router.post('/login', (req, res) => {
  const { identifier, password } = req.body; // identifier can be email or phone
  
  // In a real app, you would verify the password
  // For mock, we just check if user exists
  const user = users.find(u => u.email === identifier || u.phone === identifier);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Update the token
  user.authToken = generateToken();
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      token: user.authToken,
      user: {
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
        authToken: user.authToken
      }
    }
  });
});

// Profile endpoint
router.get('/profile', (req, res) => {
  // Extract token from header (format: "Bearer <token>")
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Find user by token
  const user = users.find(u => u.authToken === token);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  res.json({
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
      achievements: user.achievements
    }
  });
});

// Update profile endpoint
router.put('/profile', (req, res) => {
  // Extract token from header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Find user by token
  const userIndex = users.findIndex(u => u.authToken === token);
  if (userIndex === -1) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  // Update user properties with provided values
  const updates = req.body;
  const updatedUser = { ...users[userIndex], ...updates };
  
  // Don't update id or token
  updatedUser.id = users[userIndex].id;
  updatedUser.authToken = users[userIndex].authToken;
  
  users[userIndex] = updatedUser;
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      nativeLanguage: updatedUser.nativeLanguage,
      learningGoal: updatedUser.learningGoal,
      level: updatedUser.level,
      completedLessons: updatedUser.completedLessons,
      totalLessons: updatedUser.totalLessons,
      totalStudyTime: updatedUser.totalStudyTime,
      currentStreak: updatedUser.currentStreak,
      achievements: updatedUser.achievements
    }
  });
});

module.exports = router;