# Minnano Sensei Project Summary

## Project Overview
Minnano Sensei is a comprehensive Japanese learning platform with AI-powered tutoring features, user authentication, and course management capabilities.

## Repository Structure
- `minnano_sensei_vue` - Frontend Vue.js application with interactive learning features
- `minnano_sensei_backend` - Backend API server with authentication and course management
- `minnano_sensei_mock` - Standalone mock API server for frontend development

## Key Features
- User registration and authentication system
- AI-powered Japanese tutoring with Qwen API integration
- Course management system with CRUD operations
- Vocabulary and grammar practice modules
- Interactive conversation practice
- Progress tracking and user statistics

## Technology Stack
- Frontend: Vue.js 3, Vite, JavaScript/CSS
- Backend: Node.js, Express.js, MongoDB with Mongoose
- Database: MongoDB for user data and course content
- AI Integration: Qwen API for language learning assistance
- Containerization: Docker and Docker Compose
- Authentication: JWT-based system

## Development Workflow
1. The frontend communicates with the backend via REST API
2. Authentication is handled through JWT tokens
3. Course content is dynamically loaded from the backend
4. AI tutoring features are integrated through API calls
5. All services can be run locally or deployed via Docker

## Deployment Options
- Local development with separate frontend/backend servers
- Docker-based deployment with all services orchestrated
- Production-ready configuration with nginx for frontend serving

## Future Enhancements
- Advanced AI tutoring features
- Mobile application support
- Enhanced course creation tools
- Social learning features
- Advanced analytics and reporting