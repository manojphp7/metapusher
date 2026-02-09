import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "./constants/appConstants";

export default function Settings() {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.ChangePassword}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const json = await res.json();

      if (res.ok && json.status === "success") {
        setSuccessMessage(json.message);
        // Reset form
        setFormData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        if (json.errors) {
          setErrors(json.errors);
        } else {
          setErrors({ general: json.message });
        }
      }
    } catch (error) {
      setErrors({ general: "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="content-area p-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center fw-bold bg-white">
          <span>Change Password</span>
          <i className="bi bi-shield-lock fs-5 text-primary"></i>
        </div>

        <div className="card-body p-4">
          {/* Success Message */}
          {successMessage && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              <i className="bi bi-check-circle me-2"></i>
              {successMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccessMessage("")}
              ></button>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.general}
              <button
                type="button"
                className="btn-close"
                onClick={() => setErrors({})}
              ></button>
            </div>
          )}

          <div className="row">
            {/* Form Section - Left Side */}
            <div className="col-lg-7">
              <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className="mb-3">
                  <label htmlFor="current_password" className="form-label fw-semibold">
                    Current Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword.current ? "text" : "password"}
                      className={`form-control ${errors.current_password ? "is-invalid" : ""}`}
                      id="current_password"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                    >
                      <i
                        className={`bi bi-eye${showPassword.current ? "-slash" : ""}`}
                      ></i>
                    </button>
                    {errors.current_password && (
                      <div className="invalid-feedback">
                        {errors.current_password[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label htmlFor="new_password" className="form-label fw-semibold">
                    New Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <input
                      type={showPassword.new ? "text" : "password"}
                      className={`form-control ${errors.new_password ? "is-invalid" : ""}`}
                      id="new_password"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                    >
                      <i
                        className={`bi bi-eye${showPassword.new ? "-slash" : ""}`}
                      ></i>
                    </button>
                    {errors.new_password && (
                      <div className="invalid-feedback">
                        {errors.new_password[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="mb-4">
                  <label
                    htmlFor="new_password_confirmation"
                    className="form-label fw-semibold"
                  >
                    Confirm New Password <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-key-fill text-muted"></i>
                    </span>
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      className={`form-control ${errors.new_password_confirmation ? "is-invalid" : ""}`}
                      id="new_password_confirmation"
                      name="new_password_confirmation"
                      value={formData.new_password_confirmation}
                      onChange={handleChange}
                      placeholder="Re-enter your new password"
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                    >
                      <i
                        className={`bi bi-eye${showPassword.confirm ? "-slash" : ""}`}
                      ></i>
                    </button>
                    {errors.new_password_confirmation && (
                      <div className="invalid-feedback">
                        {errors.new_password_confirmation[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Update Password
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => {
                      setFormData({
                        current_password: "",
                        new_password: "",
                        new_password_confirmation: "",
                      });
                      setErrors({});
                      setSuccessMessage("");
                    }}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* Instructions Section - Right Side */}
            <div className="col-lg-5">
              <div className="bg-light rounded-3 p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-info-circle text-primary fs-5"></i>
                  </div>
                  <h6 className="mb-0 fw-bold">Password Requirements</h6>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex align-items-start mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                    <span className="text-muted small">
                      Must be at least <strong>8 characters</strong> long
                    </span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                    <span className="text-muted small">
                      New password must be <strong>different</strong> from current
                    </span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                    <span className="text-muted small">
                      Password and confirmation must <strong>match</strong>
                    </span>
                  </div>
                </div>

                <hr className="my-3" />

                <div className="d-flex align-items-center mb-2">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                    <i className="bi bi-shield-check text-warning fs-5"></i>
                  </div>
                  <h6 className="mb-0 fw-bold">Security Tips</h6>
                </div>
                
                <div>
                  <div className="d-flex align-items-start mb-2">
                    <i className="bi bi-dot text-primary fs-4 me-1"></i>
                    <span className="text-muted small">
                      Use a mix of letters, numbers & symbols
                    </span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <i className="bi bi-dot text-primary fs-4 me-1"></i>
                    <span className="text-muted small">
                      Avoid common words or patterns
                    </span>
                  </div>
                  <div className="d-flex align-items-start">
                    <i className="bi bi-dot text-primary fs-4 me-1"></i>
                    <span className="text-muted small">
                      Don't reuse passwords from other sites
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}