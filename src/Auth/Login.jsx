import React from "react";

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
  setSuccess 
}) => {
  return (
    <>
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
            textDecoration: 'none',
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
        disabled={loading}
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