const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Import proxy controller (which handles both auth and course requests)
const proxyController = require('./proxyController');

// Route files - now using proxy controller
const auth = require('./routes/auth');
const courses = require('./routes/courses');
const tts = require('./routes/tts');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/courses', courses);
app.use('/api/tts', tts);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'BE service running and connected to mock service',
    mockServiceUrl: process.env.MOCK_SERVICE_URL || 'http://localhost:4001'
  });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});