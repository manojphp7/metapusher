import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const Login = ({ 
  formData, 
  handleChange, 
  handleKeyPress, 
  error, 
  success, 
  loading, 
  handleSubmit, 
  setIsForgot,
  setError,
  setSuccess,
  onGoogleSuccess,
  googleLoading
}) => {

  const googleLogin = useGoogleLogin({
    onSuccess: onGoogleSuccess,
    onError: () => setError("Google login failed. Please try again."),
  });

  return (
    <>
      <button
        type="button"
        onClick={() => googleLogin()}
        className="google-btn w-100"
        disabled={loading || googleLoading}
      >
        {googleLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Connecting...
          </>
        ) : (
          <>
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </>
        )}
      </button>

      <div className="auth-divider">
        <span>or login with email</span>
      </div>

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

      <div className="forgot-password">
        <button
          type="button"
          onClick={() => {
            setIsForgot(true);
            setError("");
            setSuccess("");
          }}
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: 0,
            color: '#f96700',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Forgot Password?
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="btn btn-accent w-100"
        disabled={loading || googleLoading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Processing...
          </>
        ) : (
          "Login"
        )}
      </button>
    </>
  );
};

export default Login;