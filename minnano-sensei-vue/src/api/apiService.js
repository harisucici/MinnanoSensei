import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:4001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data if unauthorized
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// API Service class
class ApiService {
  // Authentication APIs
  static async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  static async getProfile() {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  static async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      if (response.data.success) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Course APIs
  static async getCourses(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await apiClient.get(`/courses?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get courses error:', error);
      throw error;
    }
  }

  static async getCourseById(courseId) {
    try {
      const response = await apiClient.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Get course by ID error:', error);
      throw error;
    }
  }

  static async getCourseContent(courseId) {
    try {
      const response = await apiClient.get(`/courses/${courseId}/content`);
      return response.data;
    } catch (error) {
      console.error('Get course content error:', error);
      throw error;
    }
  }

  static async enrollInCourse(courseId) {
    try {
      const response = await apiClient.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      console.error('Enroll in course error:', error);
      throw error;
    }
  }

  static async getUserEnrolledCourses() {
    try {
      const response = await apiClient.get('/courses/enrolled');
      return response.data;
    } catch (error) {
      console.error('Get enrolled courses error:', error);
      throw error;
    }
  }

  static async getUserCreatedCourses() {
    try {
      const response = await apiClient.get('/courses/my');
      return response.data;
    } catch (error) {
      console.error('Get created courses error:', error);
      throw error;
    }
  }

  static async createCourse(courseData) {
    try {
      const response = await apiClient.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  }

  static async updateCourse(courseId, courseData) {
    try {
      const response = await apiClient.put(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Update course error:', error);
      throw error;
    }
  }

  static async deleteCourse(courseId) {
    try {
      const response = await apiClient.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  }

  // Utility method to check if user is authenticated
  static isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Utility method to logout
  static logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}

export default ApiService;