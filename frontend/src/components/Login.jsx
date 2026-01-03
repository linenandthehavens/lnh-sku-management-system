import { useState } from 'react';
import axios from 'axios';
import { authService } from '../utils/auth';
import './Login.css';

// ✅ Read backend URL from environment variable (same as App.jsx)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/skus/auth/login`;

// Debug logging
console.log('🔐 Login Configuration:');
console.log('API Base URL:', API_BASE_URL);
console.log('Login Endpoint:', LOGIN_ENDPOINT);

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    passwordSalt: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login to:', LOGIN_ENDPOINT);
      const response = await axios.post(LOGIN_ENDPOINT, formData);
      
      if (response.data && response.data.token) {
        console.log('✅ Login successful!');
        authService.setToken(response.data.token);
        onLoginSuccess();
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      console.error('Request was to:', LOGIN_ENDPOINT);
      if (err.response?.status === 401) {
        setError('Invalid username or password');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <img src="/logo.png" alt="Linen & The Havens" className="login-logo" />
            <h1>Linen & The Havens</h1>
            <p className="login-subtitle">Private Limited</p>
            <p className="login-tagline">SKU Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <span>⚠</span> {error}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>© 2024 Linen & The Havens Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
