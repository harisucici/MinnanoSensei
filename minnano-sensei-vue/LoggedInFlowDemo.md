# Minnano Sensei - Logged In User Flow Demo

This document outlines the complete user experience after successful authentication in the Minnano
Sensei Vue application.

## 1. Homepage Dashboard (`/`)

### Upon Successful Login

- User is redirected to homepage
- Personalized greeting appears: "Welcome back, [Username]!"
- Shows quick overview of learning progress:
    - Lessons completed
    - Current streak (days)
    - Total study time
    - Overall completion percentage

### Homepage Sections:

#### Hero Section

- Personalized welcome message
- Quick access to "Continue Learning" button
- Motivational quote about Japanese learning

#### Features Section

- Structured Curriculum: Following Minna no Nihongo
- AI Tutor: Personalized feedback
- Progress Tracking: Monitor learning journey

#### Progress Stats Section

- Visual progress indicators:
    - 3/20 Lessons Completed
    - 42 Hours Studied
    - 7 Day Streak
    - 15% Complete

## 2. Navigation Menu

### Updated Navigation Options:

- Home (Always visible)
- Lessons (Visible when authenticated)
- Practice (Visible when authenticated)
- Profile (Visible when authenticated)
- Logout (Replaces login/register when authenticated)

### Mobile Responsive:

- Hamburger menu on smaller screens
- Smooth transitions between states

## 3. Lessons Page (`/lessons`)

### Lesson Cards Display:

- Grid layout of available lessons
- Each card shows:
    - Lesson title (e.g., "はじめまして - Introduction")
    - Textbook and chapter reference
    - Brief content description
    - Number of grammar points
    - Number of vocabulary items
    - Progress indicator (completed/not started)

### Lesson Card Interaction:

- Clicking a lesson card opens details
- Shows grammar points with explanations
- Displays vocabulary with readings and meanings
- Provides example sentences
- Includes practice exercises

## 4. Practice Page (`/practice`)

### AI Chat Interface:

- Interactive conversation with AI tutor
- Real-time feedback on Japanese usage
- Grammar correction suggestions
- Vocabulary recommendations

### Chat Features:

- Input area for typing Japanese sentences/questions
- Auto-scrolling message history
- Different styling for user vs AI messages
- Shift+Enter for new lines in messages

### AI Responses:

- Contextual feedback based on user input
- Grammar explanations when relevant
- Vocabulary suggestions
- Cultural notes when appropriate

### Sample AI Interactions:

1. User: "こんにちは、元気ですか？"
   AI: "Kon'nichiwa! こんにちは！ You used the greeting correctly. 'Genki desu ka?' is the polite way
   to ask 'How are you?' Remember, in formal settings, it's better to respond with 'Genki desu'
   rather than 'Genki da'."

2. User: "How do I say 'I want to eat sushi'?"
   AI: "To express wanting to do something, use the -tai form. 'Sushi wo tabetai desu' means 'I want
   to eat sushi.' The -tai form is created by taking the -masu stem of a verb and adding -tai."

## 5. Profile Page (`/profile`)

### User Information Section:

- Avatar with initials
- Full name display
- Email address
- Native language
- Learning goal
- Current level

### Learning Statistics:

- Total lessons completed
- Total study time
- Current learning streak
- Achievement badges earned

### Achievements Display:

- Visual representation of earned badges
- Descriptions of each achievement
- Progress toward unearned achievements

### Action Buttons:

- Edit Profile (for updating information)
- Change Password (for security)

## 6. Learning Progression

### Lesson Completion Flow:

1. User navigates to Lessons page
2. Selects a lesson to study
3. Reviews grammar points and vocabulary
4. Completes practice exercises
5. Returns to dashboard to see updated progress

### Practice Session Flow:

1. User accesses Practice page
2. Engages in conversation with AI tutor
3. Receives feedback on Japanese usage
4. Learns new grammar/vocabulary points
5. Builds confidence through interaction

## 7. State Management

### User Data Persistence:

- Authentication state maintained throughout session
- User progress saved in Vuex store
- Achievements and statistics updated in real-time

### Component Communication:

- Parent components pass authentication status to children
- Components conditionally render content based on auth status
- Navigation guards prevent unauthorized access

## 8. Responsive Design

### Desktop Experience:

- Full navigation menu visible
- Multi-column layouts for content
- Larger interactive elements

### Mobile Experience:

- Collapsible navigation menu
- Single-column layouts optimized for small screens
- Touch-friendly interface elements

## 9. Error Handling & Edge Cases

### Session Expiration:

- Automatic redirect to login if session expires
- Warning notification before automatic logout
- Preservation of unsaved progress where possible

### Network Issues:

- Graceful degradation of features
- Offline capability for cached content
- Retry mechanisms for failed requests

## 10. Performance Considerations

### Loading States:

- Skeleton loaders during data fetching
- Optimistic updates for immediate feedback
- Efficient rendering of large datasets

### Caching Strategy:

- Lessons and vocabulary cached locally
- User progress synchronized efficiently
- Minimal network requests for repeated data

## 11. Accessibility Features

### Keyboard Navigation:

- Full functionality via keyboard
- Proper focus management
- Screen reader compatibility

### Visual Design:

- High contrast text
- Scalable text sizes
- Color-blind friendly palettes

## 12. Learning Analytics

### Progress Tracking:

- Detailed statistics on completed lessons
- Time spent studying per session
- Areas of difficulty identification
- Personalized recommendations

### Achievement System:

- Milestone-based rewards
- Motivational badges
- Progress toward next achievements