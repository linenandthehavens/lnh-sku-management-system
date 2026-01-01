// Authentication utility functions

const TOKEN_KEY = 'linen_havens_auth_token';

export const authService = {
  // Store JWT token
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get JWT token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove JWT token
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch (e) {
      return false;
    }
  },

  // Get authorization header
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};
