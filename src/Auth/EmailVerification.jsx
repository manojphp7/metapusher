import React from "react";
import { API_BASE_URL, API_ENDPOINTS } from "../constants/appConstants";

const EmailVerification = ({ 
  formData, 
  isForgot,
  error,
  success,
  loading,
  setLoading,
  setError,
  setSuccess,
  setShowEmailSent,
  setIsForgot,
  setIsResetEmailSent 
}) => {

  const handleResendEmail = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.ResendVerification}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        setSuccess("Verification email sent successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to resend verification email");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Resend email error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="email-sent-header">
        <div className="email-icon">
          <i className="bi bi-envelope-check-fill"></i>
        </div>
        <h2 className="email-title">
          {isForgot ? "Reset Link Sent" : "Check Your Email"}
        </h2>
        <p className="email-subtitle">
          {isForgot
            ? "We've sent a password reset link to"
            : "We've sent a verification link to"}
          <br />
          <strong>{formData.email}</strong>
        </p>
        <p className="email-note">
          {isForgot
            ? "Please click the link in your email to reset your password."
            : "Please click the link in your email to verify your account and complete registration."}
        </p>
      </div>

      <div className="email-instructions">
        <div className="instruction-item">
          <div className="step-number">1</div>
          <span>Open your email inbox</span>
        </div>
        <div className="instruction-item">
          <div className="step-number">2</div>
          <span>Click the verification link</span>
        </div>
        <div className="instruction-item">
          <div className="step-number">3</div>
          <span>Your account will be activated</span>
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

      <div className="email-footer">
        <p>Didn't receive the email?</p>
        <button
          onClick={handleResendEmail}
          className="resend-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Sending...
            </>
          ) : isForgot ? (
            "Resend Reset Email"
          ) : (
            "Resend Verification Email"
          )}
        </button>
      </div>

      <div className="back-to-register">
        <button
          onClick={() => {
            setShowEmailSent(false);
            setIsForgot(false);
            setIsResetEmailSent(false);
            setError("");
            setSuccess("");
          }}
          className="back-btn"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Registration
        </button>
      </div>
    </>
  );
};

export default EmailVerification;