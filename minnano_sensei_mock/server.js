const express = require('express');
const cors = require('cors');

// Create express app
const app = express();
const PORT = process.env.PORT || 4001; // Changed to 4001 to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data
let users = [
  {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    nativeLanguage: 'English',
    learningGoal: 'General Conversation',
    level: 'Beginner (N5-N4)',
    completedLessons: 0,
    totalLessons: 20,
    totalStudyTime: 0,
    currentStreak: 0,
    achievements: [],
    authToken: 'mock_auth_token_12345'
  }
];

let courses = [
  {
    id: 1,
    title: 'Beginner Japanese',
    description: 'Learn basic Japanese for beginners',
    category: 'Grammar',
    level: 'N5',
    duration: '4 weeks',
    lessons: 10,
    enrolled: 150
  },
  {
    id: 2,
    title: 'Kanji Fundamentals',
    description: 'Master basic kanji characters',
    category: 'Vocabulary',
    level: 'N5-N4',
    duration: '6 weeks',
    lessons: 15,
    enrolled: 89
  }
];

// Helper functions
const generateToken = () => `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Import API routes
const authRoutes = require('./api/auth');
const courseRoutes = require('./api/courses');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Minnano Sensei Mock API Server' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - Auth: http://localhost:${PORT}/api/auth`);
  console.log(`  - Courses: http://localhost:${PORT}/api/courses`);
});

module.exports = app;