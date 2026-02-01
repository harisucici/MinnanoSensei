import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: null, // Initially no user is logged in
    isAuthenticated: false,
    authToken: null,
    lessons: [], // Now fetched from API
    conversation: [] // Now managed separately or fetched from API
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_AUTH_STATUS(state, { isAuthenticated, authToken = null }) {
      state.isAuthenticated = isAuthenticated;
      state.authToken = authToken;
    },
    SET_LESSONS(state, lessons) {
      state.lessons = lessons;
    },
    ADD_MESSAGE(state, message) {
      state.conversation.push(message);
    },
    UPDATE_USER_LESSON_PROGRESS(state, lessonId) {
      if (state.user) {
        // Update user's lesson completion status
        state.user.completedLessons = Math.min(
          state.user.completedLessons + 1, 
          state.user.totalLessons
        );
      }
    },
    SET_USER(state, userData) {
      state.user = { ...state.user, ...userData };
    },
    LOGOUT(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.authToken = null;
      state.lessons = [];
      state.conversation = [];
    }
  },
  actions: {
    async fetchLessons({ commit }) {
      // Fetch lessons from the mock API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api'}/courses`);
        if (response.ok) {
          const data = await response.json();
          // Transform the course data to match the expected lesson format
          const lessons = data.data.map(course => ({
            id: parseInt(course._id),
            title: course.title,
            textbook: "Minna no Nihongo", // Default textbook
            chapter: `Lesson ${course._id}`, // Default chapter format
            content: course.description,
            grammarPoints: course.content?.grammarPoints || [],
            vocabulary: course.content?.vocabulary || [],
            exercises: course.content?.exercises || []
          }));
          commit('SET_LESSONS', lessons);
        }
      } catch (error) {
        console.error('Failed to fetch lessons:', error);
      }
    },
    login({ commit }, loginData) {
      return new Promise((resolve, reject) => {
        // Simulate API call delay
        setTimeout(async () => {
          // Mock validation - in a real app, this would be server-side
          const { identifier, password } = loginData;
          
          // Simulate login failure for certain test cases
          if (identifier === 'fail@test.com' || password === 'wrong') {
            reject(new Error('Invalid credentials. Please try again.'));
            return;
          }
          
          // Create mock user on successful login
          const mockUser = {
            id: Date.now(),
            name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
            email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
            nativeLanguage: 'English',
            learningGoal: 'General Conversation',
            level: 'Beginner (N5-N4)',
            completedLessons: 0,
            totalLessons: 3, // Updated to match actual lesson count from API
            totalStudyTime: 0,
            currentStreak: 0,
            achievements: [],
            authToken: `mock_login_token_${Date.now()}`
          };
          
          commit('SET_USER', mockUser);
          commit('SET_AUTH_STATUS', { isAuthenticated: true, authToken: mockUser.authToken });
          // Fetch lessons after successful login
          await this.dispatch('fetchLessons');
          resolve(mockUser);
        }, 500);
      });
    },
    register({ commit }, registrationData) {
      return new Promise((resolve, reject) => {
        // Simulate API call delay
        setTimeout(async () => {
          // Mock validation - in a real app, this would be server-side
          const { email, phone, password, name, nativeLanguage, learningGoal } = registrationData;
          
          // Simulate registration failure for certain test cases
          if (email === 'duplicate@test.com') {
            reject(new Error('Email already registered. Please use a different email.'));
            return;
          }
          
          // Create mock user on successful registration
          const mockUser = {
            id: Date.now(),
            name: name || (email ? email.split('@')[0] : phone),
            email: email,
            phone: phone,
            nativeLanguage: nativeLanguage,
            learningGoal: learningGoal,
            level: 'Beginner (N5-N4)',
            completedLessons: 0,
            totalLessons: 3, // Updated to match actual lesson count from API
            totalStudyTime: 0,
            currentStreak: 0,
            achievements: [],
            authToken: `mock_register_token_${Date.now()}`
          };
          
          commit('SET_USER', mockUser);
          commit('SET_AUTH_STATUS', { isAuthenticated: true, authToken: mockUser.authToken });
          // Fetch lessons after successful registration
          await this.dispatch('fetchLessons');
          resolve(mockUser);
        }, 1000);
      });
    },
    async sendMessage({ commit }, { message, userId }) {
      // Add user message to conversation
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        message: message,
        timestamp: new Date(),
        userId: userId
      };
      
      commit('ADD_MESSAGE', userMessage);
      
      // In a real app, this would call the backend API
      // For now, we'll return the user message to simulate the flow
      return userMessage;
    },
    async getAIResponse({ commit }, { userInput, context = '', conversationHistory = [] }) {
      // Placeholder function that returns a promise
      // Actual AI functionality is handled in the component to avoid import issues
      return new Promise((resolve) => {
        // In the actual implementation, AI processing happens in the component
        // This is just a placeholder to maintain the interface
        resolve("This would be processed by the AI service.");
      });
    },
    loginSuccess({ commit, dispatch }, userData) {
      // Directly set user data after successful social login or other auth methods
      const user = {
        ...userData,
        authToken: userData.authToken || `mock_token_${Date.now()}`
      };
      commit('SET_USER', user);
      commit('SET_AUTH_STATUS', { isAuthenticated: true, authToken: user.authToken });
      // Fetch lessons after successful login
      dispatch('fetchLessons');
      return Promise.resolve(user);
    },
    logout({ commit }) {
      // Clear user data and authentication status
      commit('LOGOUT');
    },
    addMessage({ commit }, message) {
      commit('ADD_MESSAGE', message);
    },
    completeLesson({ commit, state }, lessonId) {
      commit('UPDATE_USER_LESSON_PROGRESS', lessonId);
    },
    updateUser({ commit }, userData) {
      commit('SET_USER', userData);
    }
  },
  getters: {
    getUser: state => state.user,
    isAuthenticated: state => state.isAuthenticated,
    getAuthToken: state => state.authToken,
    getLessons: state => state.lessons,
    getConversation: state => state.conversation,
    getLessonById: state => id => {
      return state.lessons.find(lesson => lesson.id === id);
    },
    getUserStats: state => {
      if (!state.user) {
        return {
          completedLessons: 0,
          totalLessons: 3, // Updated to match actual lesson count from API
          totalStudyTime: 0,
          currentStreak: 0,
          progressPercentage: 0
        };
      }
      const { completedLessons, totalLessons, totalStudyTime, currentStreak } = state.user;
      return {
        completedLessons,
        totalLessons,
        totalStudyTime,
        currentStreak,
        progressPercentage: totalLessons > 0 
          ? Math.round((completedLessons / totalLessons) * 100) 
          : 0
      };
    }
  }
})

export default store