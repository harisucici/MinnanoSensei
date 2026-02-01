# Minnano Sensei - User Flow Demo

This document outlines the complete user flow for the Minnano Sensei Vue application, demonstrating
registration, login, and usage scenarios.

## 1. Registration Flow

### Step 1: Navigate to Registration

- User visits `http://localhost:3000/login`
- Clicks on "Register" tab
- Sees registration form with fields:
    - Email or Phone Number
    - Password (min 6 chars)
    - Confirm Password
    - Full Name
    - Native Language
    - Learning Goal

### Step 2: Fill Registration Details

Sample registration data:

```
Email or Phone: user@example.com
Password: mypassword123
Confirm Password: mypassword123
Full Name: John Doe
Native Language: English
Learning Goal: General Conversation
```

### Step 3: Submit Registration

- Click "Create Account"
- System validates all fields
- On success, user is registered and logged in automatically
- Redirected to homepage

## 2. Login Flow

### Step 1: Navigate to Login

- User visits `http://localhost:3000/login`
- Clicks on "Sign In" tab

### Step 2: Enter Credentials

```
Email or Phone: user@example.com
Password: mypassword123
```

### Step 3: Submit Login

- Click "Sign In"
- System validates credentials
- On success, user is logged in
- Redirected to intended page (or homepage)

## 3. Social Login Flow

### Available Options:

- Google
- Apple
- WeChat
- LINE

### Process:

- User clicks social login button
- Simulated OAuth flow occurs
- Mock user data is created
- User is logged in automatically
- Redirected to homepage

## 4. Post-Login Experience

### Homepage

- Shows personalized greeting
- Displays user's progress stats
- Access to lessons, practice, and profile

### Lessons Page (`/lessons`)

- Shows available lessons
- Lesson titles, descriptions, and content
- Grammar points and vocabulary lists

### Practice Page (`/practice`)

- AI-powered Japanese practice session
- Chat interface to interact with AI tutor
- Get feedback on grammar, vocabulary, etc.

### Profile Page (`/profile`)

- User information
- Learning statistics
- Achievements
- Edit profile options

## 5. Mock Data Structure

When a user registers/logs in, the following mock data structure is created:

```javascript
{
  id: 1234567890,
  name: "John Doe",
  email: "user@example.com",
  nativeLanguage: "English",
  learningGoal: "General Conversation",
  level: "Beginner (N5-N4)",
  completedLessons: 0,
  totalLessons: 20,
  totalStudyTime: 0,
  currentStreak: 0,
  achievements: [],
  authToken: "mock_token_1234567890"
}
```

## 6. Error Handling

### Registration Errors:

- Password mismatch
- Invalid email/phone format
- Missing required fields
- Duplicate email (simulated)

### Login Errors:

- Invalid credentials
- Network errors

## 7. Security Features

- Authentication state stored in Vuex
- Protected routes (lessons, practice, profile)
- Secure logout functionality
- Token-based authentication (simulated)

## 8. Testing Scenarios

### Successful Registration:

```
Email: test@example.com
Password: password123
```

### Failed Login (to see error):

```
Email: fail@test.com
Password: any_password
```

### Failed Registration (to see error):

```
Email: duplicate@test.com
```

## 9. Development Notes

- All authentication flows are simulated for demonstration
- In a production environment, these would connect to real backend services
- The application uses Vue Router navigation guards to protect routes
- Vuex manages the authentication state throughout the app