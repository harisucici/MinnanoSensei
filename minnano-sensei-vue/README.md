# Minnano Sensei - Vue.js Version

A modern, AI-powered Japanese learning application built with Vue.js. This Vue implementation
provides interactive lessons, AI-powered conversation practice, and progress tracking using the
latest Vue ecosystem tools.

## Features

- **Vue 3 Composition API**: Latest Vue.js features and best practices
- **Vue Router**: Client-side navigation between app sections
- **Vuex Store**: Centralized state management for user data and lessons
- **Interactive Japanese Lessons**: Based on Minna no Nihongo curriculum
- **AI-Powered Practice**: Simulated AI tutor for conversation practice
- **Progress Tracking**: Monitor your learning journey
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface designed for language learning

## Technology Stack

- **Framework**: Vue.js 3
- **Router**: Vue Router 4
- **State Management**: Vuex 4
- **Build Tool**: Vite
- **Styling**: CSS with responsive design
- **Fonts**: Google Fonts (Noto Sans JP for Japanese characters)

## Components Structure

```
src/
├── main.js               # App entry point
├── App.vue               # Main application component
├── assets/
│   └── css/
│       └── style.css     # Global styles
├── components/           # Reusable components
├── views/                # Page components
│   ├── HomeView.vue      # Home page
│   ├── LessonsView.vue   # Lessons browsing
│   ├── PracticeView.vue  # AI conversation practice
│   └── ProfileView.vue   # User profile
├── router/
│   └── index.js          # Vue Router configuration
└── store/
    └── index.js          # Vuex store with state management
```

## State Management

The application uses Vuex for centralized state management, including:

- User profile and learning progress
- Course content and lessons
- Conversation history
- Achievements and statistics

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. The application will be available at `http://localhost:3000`

### Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be placed in the `dist/` directory and can be deployed to any static hosting
service.

## Pages

1. **Home**: Dashboard showing user progress and quick access to learning materials
2. **Lessons**: Browse structured lessons with grammar and vocabulary
3. **Practice**: AI conversation practice with simulated responses
4. **Profile**: Track your progress and achievements

## AI Response System

The Vue version includes the same simulated AI response system as the vanilla JS version, providing
contextually relevant responses based on user input. The system recognizes keywords related to:

- Greetings and basic phrases
- Grammar points (particles, verb forms, etc.)
- Vocabulary and word usage
- Counting and numbers
- Politeness levels

## Responsive Design

The application is designed with a mobile-first approach and includes:

- Responsive navigation with hamburger menu on mobile
- Flexible grid layouts that adapt to screen size
- Touch-friendly interface elements
- Optimized typography for readability

## Customization

The application is easily customizable:

- Modify the Vuex store in `src/store/index.js` to change data structures
- Update components in the `src/views/` directory
- Adjust styling in `src/assets/css/style.css`

## Deployment

The application is built with Vite, which generates optimized static assets. To deploy:

1. Build the application: `npm run build`
2. Upload the contents of the `dist/` directory to any static web hosting service
3. Configure the hosting service to serve the `index.html` file for all routes (for client-side
   routing)

## Browser Compatibility

The application is compatible with all modern browsers that support ES6 JavaScript features and Vue

3.

## Development Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run preview`: Preview the production build locally