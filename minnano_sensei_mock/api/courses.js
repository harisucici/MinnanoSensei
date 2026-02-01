const express = require('express');
const router = express.Router();

// Mock data
let courses = [
  {
    _id: '1',
    title: 'はじめまして - Introduction',
    description: 'Basic greetings and introductions in Japanese. Learn to say hello, goodbye, and introduce yourself.',
    category: 'Grammar',
    level: 'N5',
    duration: '1 week',
    lessons: 1,
    enrolled: 150,
    thumbnail: 'https://example.com/images/introduction.jpg',
    instructor: 'Sensei Tanaka',
    rating: 4.8,
    reviews: 120,
    content: {
      grammarPoints: [
        {
          id: 'gr-1',
          pattern: "です (desu)",
          explanation: "The copula verb used to end sentences formally",
          examples: [
            'これは本です (This is a book)',
            '私は学生です (I am a student)'
          ],
          usageNotes: 'Used in formal situations and written language'
        },
        {
          id: 'gr-2',
          pattern: "は (wa)",
          explanation: "Topic particle marking the topic of the sentence",
          examples: [
            '私は田中です (I am Tanaka)',
            'これは何ですか？(What is this?)'
          ],
          usageNotes: 'Pronounced as "wa" when used as a particle'
        }
      ],
      vocabulary: [
        { id: 'voc-1', word: "こんにちは", reading: "konnichiwa", meaning: "Hello", level: "N5", exampleSentences: ['こんにちは、元気ですか？(Hello, how are you?)'] },
        { id: 'voc-2', word: "さようなら", reading: "sayōnara", meaning: "Goodbye", level: "N5", exampleSentences: ['じゃあ、また明日。さようなら。(Well, see you tomorrow. Goodbye.)'] },
        { id: 'voc-3', word: "ありがとう", reading: "arigatō", meaning: "Thank you", level: "N5", exampleSentences: ['どうもありがとう。(Thank you very much.)'] }
      ],
      exercises: [
        {
          id: 'ex-1',
          type: 'vocabulary',
          question: 'What does こんにちは mean?',
          options: ['Good morning', 'Hello', 'Good night', 'See you later'],
          correctAnswer: 'Hello',
          explanation: 'こんにちは is a greeting used during the day'
        }
      ]
    }
  },
  {
    _id: '2',
    title: '家族 - Family Members',
    description: 'Learn about family members and relationships in Japanese culture.',
    category: 'Vocabulary',
    level: 'N5',
    duration: '1 week',
    lessons: 1,
    enrolled: 89,
    thumbnail: 'https://example.com/images/family-members.jpg',
    instructor: 'Sensei Yamamoto',
    rating: 4.7,
    reviews: 78,
    content: {
      grammarPoints: [
        {
          id: 'gr-3',
          pattern: "の (no)",
          explanation: "Possessive particle connecting nouns",
          examples: [
            '私の本 (My book)',
            '田中さんの車 (Tanaka\'s car)'
          ],
          usageNotes: 'Used to show possession or relation between nouns'
        },
        {
          id: 'gr-4',
          pattern: "が (ga)",
          explanation: "Subject particle marking the subject of the sentence",
          examples: [
            '猫がいます (There is a cat/I have a cat)',
            '彼が先生です (He is the teacher)'
          ],
          usageNotes: 'Often used with existence verbs (aru, iru) and certain adjectives'
        }
      ],
      vocabulary: [
        { id: 'voc-4', word: "家族", reading: "かぞく", meaning: "Family", level: "N5", exampleSentences: ['家族は大切です。(Family is important.)'] },
        { id: 'voc-5', word: "父", reading: "ちち", meaning: "Father", level: "N5", exampleSentences: ['父は医者です。(My father is a doctor.)'] },
        { id: 'voc-6', word: "母", reading: "はは", meaning: "Mother", level: "N5", exampleSentences: ['母は料理が得意です。(My mother is good at cooking.)'] }
      ],
      exercises: []
    }
  },
  {
    _id: '3',
    title: '数字と時間 - Numbers and Time',
    description: 'Numbers, counting, and telling time in Japanese.',
    category: 'Vocabulary',
    level: 'N5',
    duration: '1 week',
    lessons: 1,
    enrolled: 112,
    thumbnail: 'https://example.com/images/numbers-time.jpg',
    instructor: 'Sensei Sato',
    rating: 4.9,
    reviews: 95,
    content: {
      grammarPoints: [
        {
          id: 'gr-5',
          pattern: "時 (ji)",
          explanation: "Counter for hours",
          examples: [
            '三時 (Three o\'clock)',
            '午後七時 (Seven PM)'
          ],
          usageNotes: 'Used with numbers to indicate hours'
        },
        {
          id: 'gr-6',
          pattern: "分 (fun/bun)",
          explanation: "Counter for minutes",
          examples: [
            '十五分 (Fifteen minutes)',
            '三分 (Three minutes)'
          ],
          usageNotes: 'Has irregular pronunciations for certain numbers (1, 4, 6, 8, 10)'
        }
      ],
      vocabulary: [
        { id: 'voc-7', word: "一", reading: "いち", meaning: "One", level: "N5", exampleSentences: ['一つのりんご。(One apple.)'] },
        { id: 'voc-8', word: "二", reading: "に", meaning: "Two", level: "N5", exampleSentences: ['二冊の本。(Two books.)'] },
        { id: 'voc-9', word: "三", reading: "さん", meaning: "Three", level: "N5", exampleSentences: ['三人の友達。(Three friends.)'] }
      ],
      exercises: []
    }
  }
];

// Get all courses
router.get('/', (req, res) => {
  // Query parameters for filtering
  const { category, level, search } = req.query;
  
  let filteredCourses = [...courses];
  
  // Apply filters
  if (category) {
    filteredCourses = filteredCourses.filter(course => 
      course.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  if (level) {
    filteredCourses = filteredCourses.filter(course => 
      course.level.toLowerCase().includes(level.toLowerCase())
    );
  }
  
  if (search) {
    filteredCourses = filteredCourses.filter(course => 
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: filteredCourses,
    count: filteredCourses.length
  });
});

// Get course by ID
router.get('/:id', (req, res) => {
  const courseId = req.params.id;
  
  const course = courses.find(c => c._id === courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  res.json({
    success: true,
    data: course
  });
});

// Create a new course (admin only)
router.post('/', (req, res) => {
  // In a real app, you would check for admin privileges here
  const { title, description, category, level, duration, lessons, content } = req.body;
  
  // Validate required fields
  if (!title || !description || !category || !level) {
    return res.status(400).json({
      success: false,
      message: 'Title, description, category, and level are required'
    });
  }
  
  const newCourse = {
    _id: String(courses.length + 1),
    title,
    description,
    category,
    level,
    duration: duration || '4 weeks',
    lessons: lessons || 10,
    enrolled: 0,
    thumbnail: 'https://example.com/images/default-course.jpg',
    instructor: 'System Generated',
    rating: 0,
    reviews: 0,
    content: content || {}
  };
  
  courses.push(newCourse);
  
  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse
  });
});

// Update a course (admin only)
router.put('/:id', (req, res) => {
  const courseId = req.params.id;
  const updates = req.body;
  
  const courseIndex = courses.findIndex(c => c._id === courseId);
  
  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // Update course properties with provided values
  courses[courseIndex] = { ...courses[courseIndex], ...updates, _id: courseId };
  
  res.json({
    success: true,
    message: 'Course updated successfully',
    data: courses[courseIndex]
  });
});

// Delete a course (admin only)
router.delete('/:id', (req, res) => {
  const courseId = req.params.id;
  
  const courseIndex = courses.findIndex(c => c._id === courseId);
  
  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  courses.splice(courseIndex, 1);
  
  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
});

// Enroll in a course
router.post('/:id/enroll', (req, res) => {
  // Extract token from header to identify user
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  const courseId = req.params.id;
  
  const course = courses.find(c => c._id === courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  // In a real app, you would record the enrollment in a database
  // For now, we just increment the enrolled counter
  course.enrolled = (course.enrolled || 0) + 1;
  
  res.json({
    success: true,
    message: 'Successfully enrolled in course',
    data: {
      courseId: course._id,
      title: course.title,
      enrolledCount: course.enrolled
    }
  });
});

// Get user's enrolled courses
router.get('/enrolled', (req, res) => {
  // Extract token from header to identify user
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // For mock, return all courses as enrolled
  res.json({
    success: true,
    data: courses,
    count: courses.length
  });
});

// Get user's created courses (for instructors)
router.get('/my', (req, res) => {
  // Extract token from header to identify user
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // For mock, return all courses as created by user
  res.json({
    success: true,
    data: courses,
    count: courses.length
  });
});

// Get detailed content for a specific lesson
router.get('/:id/content', (req, res) => {
  const courseId = req.params.id;
  
  const course = courses.find(c => c._id === courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  res.json({
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
});

module.exports = router;