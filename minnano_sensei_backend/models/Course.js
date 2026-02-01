const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Grammar', 'Vocabulary', 'Reading', 'Writing', 'Listening', 'Speaking', 'Culture', 'Kanji', 'Phrases']
  },
  level: {
    type: String,
    required: [true, 'Please add a level'],
    enum: ['N5', 'N4', 'N3', 'N2', 'N1', 'Beginner', 'Intermediate', 'Advanced']
  },
  duration: {
    type: String,
    default: '4 weeks'
  },
  lessons: {
    type: Number,
    default: 10
  },
  enrolled: {
    type: Number,
    default: 0
  },
  thumbnail: {
    type: String,
    default: 'https://example.com/images/default-course.jpg'
  },
  instructor: {
    type: String,
    required: [true, 'Please add an instructor name'],
    maxlength: [50, 'Instructor name cannot be more than 50 characters']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  enrolledUsers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  content: {
    grammarPoints: [{
      id: String,
      pattern: String,
      explanation: String,
      examples: [String],
      usageNotes: String
    }],
    vocabulary: [{
      id: String,
      word: String,
      reading: String,
      meaning: String,
      level: String,
      exampleSentences: [String]
    }],
    exercises: [{
      id: String,
      type: String,
      question: String,
      options: [String],
      correctAnswer: String,
      explanation: String
    }]
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);