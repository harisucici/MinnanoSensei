import ApiService from './apiService';

// API Factory to manage different API services
class ApiFactory {
  static getAuthService() {
    return {
      login: (credentials) => ApiService.login(credentials),
      register: (userData) => ApiService.register(userData),
      getProfile: () => ApiService.getProfile(),
      updateProfile: (profileData) => ApiService.updateProfile(profileData),
    };
  }

  static getCourseService() {
    return {
      getCourses: (filters = {}) => ApiService.getCourses(filters),
      getCourseById: (courseId) => ApiService.getCourseById(courseId),
      getCourseContent: (courseId) => ApiService.getCourseContent(courseId),
      enrollInCourse: (courseId) => ApiService.enrollInCourse(courseId),
      getUserEnrolledCourses: () => ApiService.getUserEnrolledCourses(),
      getUserCreatedCourses: () => ApiService.getUserCreatedCourses(),
      createCourse: (courseData) => ApiService.createCourse(courseData),
      updateCourse: (courseId, courseData) => ApiService.updateCourse(courseId, courseData),
      deleteCourse: (courseId) => ApiService.deleteCourse(courseId),
    };
  }

  static getAuthStatus() {
    return ApiService.isAuthenticated();
  }

  static logout() {
    return ApiService.logout();
  }
}

export default ApiFactory;