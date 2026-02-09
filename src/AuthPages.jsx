import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { API_BASE_URL,API_ENDPOINTS } from './constants/appConstants';

const AuthPages = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }

    if (!isLogin && !formData.name) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = isLogin 
      ? `${API_BASE_URL}${API_ENDPOINTS.Login}`
      : `${API_BASE_URL}${API_ENDPOINTS.Register}`

    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      // Check for success status
      if (result.status === 'success' && result.data) {
        setSuccess(isLogin ? 'Login successful! Redirecting...' : 'Registration successful! Redirecting...');
        
        // Extract user and token from response
        const userData = result.data.user;
        const authToken = result.data.token;
        
        // Update auth context
        login(userData, authToken);
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // Handle error response
        setError(result.message || 'Something went wrong!');
      }
    } catch (err) {
      setError('Network error. Please check if backend is running.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-logo">
            <div className="logo-circle">
              <i className="bi bi-lock-fill"></i>
            </div>
            <h2 className="brand-name">APLU</h2>
          </div>
          <p className="auth-subtitle">
            {isLogin ? 'Welcome back! Please login to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        <div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <i className="bi bi-person input-icon"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control custom-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <i className="bi bi-envelope input-icon"></i>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control custom-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <i className="bi bi-lock input-icon"></i>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control custom-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger custom-alert" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success custom-alert" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {success}
            </div>
          )}

          {isLogin && (
            <div className="forgot-password">
              <a href="#forgot">Forgot Password?</a>
            </div>
          )}

          <button 
            onClick={handleSubmit}
            className="btn btn-auth w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing...
              </>
            ) : (
              isLogin ? 'Login' : 'Create Account'
            )}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="toggle-link" 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
                setFormData({ name: '', email: '', password: '' });
              }}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .auth-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #f5f6f8, #eef0f3);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .auth-card {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          padding: 40px;
          width: 100%;
          max-width: 440px;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .logo-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f96700, #ff7a1a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(249, 103, 0, 0.3);
        }

        .brand-name {
          font-size: 28px;
          font-weight: 700;
          color: #f96700;
          letter-spacing: 1px;
          margin: 0;
        }

        .auth-subtitle {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-size: 18px;
          z-index: 1;
        }

        .custom-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.25s ease;
          background: #f5f6f8;
        }

        .custom-input:focus {
          outline: none;
          border-color: #f96700;
          background: white;
          box-shadow: 0 0 0 3px rgba(249, 103, 0, 0.12);
        }

        .custom-input::placeholder {
          color: #9ca3af;
        }

        .forgot-password {
          text-align: right;
          margin-bottom: 20px;
        }

        .forgot-password a {
          color: #f96700;
          font-size: 13px;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.25s ease;
        }

        .forgot-password a:hover {
          color: #ff7a1a;
        }

        .btn-auth {
          background: #f96700;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px 24px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 12px rgba(249, 103, 0, 0.3);
          margin-top: 8px;
        }

        .btn-auth:hover:not(:disabled) {
          background: #ff7a1a;
          box-shadow: 0 6px 20px rgba(249, 103, 0, 0.45);
          transform: translateY(-1px);
        }

        .btn-auth:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-auth:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .auth-footer p {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }

        .toggle-link {
          color: #f96700;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.25s ease;
        }

        .toggle-link:hover {
          color: #ff7a1a;
          text-decoration: underline;
        }

        .custom-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
        }

        .alert-danger {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.2);
        }

        .alert-success {
          background: rgba(25, 135, 84, 0.1);
          color: #198754;
          border: 1px solid rgba(25, 135, 84, 0.2);
        }

        .spinner-border {
          display: inline-block;
          width: 16px;
          height: 16px;
          vertical-align: text-bottom;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border 0.75s linear infinite;
        }

        @keyframes spinner-border {
          to { transform: rotate(360deg); }
        }

        .spinner-border-sm {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        .me-2 {
          margin-right: 8px;
        }

        .w-100 {
          width: 100%;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 28px 24px;
          }

          .brand-name {
            font-size: 24px;
          }

          .logo-circle {
            width: 42px;
            height: 42px;
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthPages;