// Authentication utility functions
import store from '@/store';

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  // In a real app, we would check the actual auth state
  // For this mock implementation, we check if user exists in store
  return store.state.isAuthenticated && !!store.state.user;
};

/**
 * Get authentication token
 * @returns {string|null} Auth token if exists, null otherwise
 */
export const getAuthToken = () => {
  return store.state.authToken;
};

/**
 * Logout user
 */
export const logout = () => {
  store.dispatch('logout');
};