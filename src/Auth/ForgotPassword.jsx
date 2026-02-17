import React from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/appConstants";

const ForgotPassword = ({ 
  formData, 
  handleChange, 
  error, 
  success, 
  loading, 
  setLoading,
  setError,
  setSuccess,
  setIsResetEmailSent,
  setIsForgot,
  setFormData 
}) => {
  
  const handleSendResetLink = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.ForgotPassword}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        setIsResetEmailSent(true);
      } else {
        setError(data.message || "Failed to send reset link");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <h2 className="email-title">Forgot Password</h2>
        <p className="auth-subtitle">
          Enter your registered email address.
          <br />
          We'll send you a password reset link.
        </p>
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <div className="input-wrapper">
          <i className="bi bi-envelope input-icon"></i>
          <input
            type="email"
            name="email"
            className="form-control custom-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger custom-alert">{error}</div>
      )}
      {success && (
        <div className="alert alert-success custom-alert">
          {success}
        </div>
      )}

      <button
        className="btn btn-accent w-100"
        onClick={handleSendResetLink}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      <div className="back-to-register">
        <button
          className="back-btn"
          onClick={() => {
            setIsForgot(false);
            setIsResetEmailSent(false);
            setError("");
            setSuccess("");
            setFormData({
              ...formData,
              email: "",
            });
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Login
        </button>
      </div>
    </>
  );
};

export default ForgotPassword;