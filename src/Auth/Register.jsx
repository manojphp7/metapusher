import React from "react";

const Register = ({ 
  formData, 
  handleChange, 
  handleKeyPress, 
  error, 
  success, 
  loading, 
  handleSubmit,
  countryCodes 
}) => {
  return (
    <>
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

      <div className="form-group">
        <label htmlFor="mobile">Mobile Number</label>
        <div className="mobile-input-wrapper">
          <div className="country-code-selector">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="country-code-select"
            >
              {countryCodes.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  data-country={country.country}
                >
                  {country.code} {country.name}
                </option>
              ))}
            </select>
            <div className="selected-country">
              <span
                className={`fi fi-${countryCodes.find((c) => c.code === formData.countryCode)?.country || "in"}`}
              ></span>
              <span className="selected-code">
                {formData.countryCode}
              </span>
              <i className="bi bi-chevron-down dropdown-arrow"></i>
            </div>
          </div>
          <div className="input-wrapper mobile-number-input">
            <i className="bi bi-phone input-icon"></i>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className="form-control custom-input"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              maxLength="15"
            />
          </div>
        </div>
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
          "Create Account"
        )}
      </button>
    </>
  );
};

export default Register;