# Minnano Sensei - Japanese Learning Platform

Welcome to Minnano Sensei, a comprehensive Japanese learning platform with AI-powered tutoring features.

## Project Structure

This repository contains three main components:

- `minnano_sensei_vue` - Frontend Vue.js application
- `minnano_sensei_backend` - Backend API server with authentication and course management
- `minnano_sensei_mock` - Standalone mock API server for frontend development

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd MinnanoSensei
   ```

2. Navigate to each project directory and install dependencies:
   ```bash
   # Backend setup
   cd minnano_sensei_backend
   npm install
   cp .env.example .env
   # Edit .env to set your JWT_SECRET
   cd ..

   # Frontend setup
   cd minnano_sensei_vue
   npm install
   cd ..

   # Mock API setup (optional)
   cd minnano_sensei_mock
   npm install
   cd ..
   ```

## Running the Applications

### Option 1: Full Stack with Docker

Navigate to the backend directory and use Docker Compose:

```bash
cd minnano_sensei_backend
docker-compose up -d
```

The applications will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Option 2: Development Mode

For development, you can run each service separately:

#### Backend API Server
```bash
cd minnano_sensei_backend
npm run dev
```

#### Frontend Development Server
```bash
cd minnano_sensei_vue
npm run dev
```

#### Mock API Server (Alternative to real backend)
```bash
cd minnano_sensei_mock
npm run dev
```

## Environment Configuration

### Backend (.env)
- `JWT_SECRET` - Secret key for JWT token generation (required)
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Port for the API server (default: 5000)

### Frontend (.env)
- `VUE_APP_API_BASE_URL` - Base URL for API calls (e.g., http://localhost:5000/api)

## Features

- User authentication (registration/login)
- Course management system
- AI-powered Japanese tutoring
- Vocabulary and grammar practice
- Interactive lessons
- Progress tracking

## API Documentation

The backend provides a comprehensive REST API:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (teacher/admin only)
- `PUT /api/courses/:id` - Update course (owner/admin only)
- `DELETE /api/courses/:id` - Delete course (owner/admin only)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/my` - Get my created courses (teacher/admin only)
- `GET /api/courses/enrolled` - Get my enrolled courses

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.