import React, { useState } from "react";

const MobileModal = ({ googleUserData, onSubmit, onClose, loading, countryCodes }) => {
  const [countryCode, setCountryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const selectedFlag = countryCodes.find((c) => c.code === countryCode)?.country || "in";

  const handleSubmit = async () => {
    if (!mobile) {
      setError("Please enter your mobile number");
      return;
    }
    if (!/^\d+$/.test(mobile)) {
      setError("Only numbers are allowed");
      return;
    }
    if (mobile.length < 7 || mobile.length > 15) {
      setError("Please enter a valid mobile number (7-15 digits)");
      return;
    }

    setError("");

    // onSubmit se error aaye to modal mein dikhao
    const errorMsg = await onSubmit(countryCode + mobile);
    if (errorMsg) {
      setError(errorMsg);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="mobile-modal">
        <div className="modal-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="modal-icon">
            <i className="bi bi-phone-fill"></i>
          </div>
          <h3>One Last Step!</h3>
          <p>
            Hi <strong>{googleUserData?.name}</strong>! We need your mobile
            number to complete your account setup.
          </p>
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#1f2937', marginBottom: 8, fontSize: 14 }}>
            Mobile Number
          </label>
          <div className="mobile-input-wrapper">
            <div className="country-code-selector">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="country-code-select"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} {country.name}
                  </option>
                ))}
              </select>
              <div className="selected-country">
                <span className={`fi fi-${selectedFlag}`}></span>
                <span className="selected-code">{countryCode}</span>
                <i className="bi bi-chevron-down dropdown-arrow"></i>
              </div>
            </div>
            <div className="input-wrapper mobile-number-input">
              <i className="bi bi-phone input-icon"></i>
              <input
                type="tel"
                className="form-control custom-input"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => {
                  // Sirf numbers allow karo
                  const val = e.target.value.replace(/\D/g, "");
                  setMobile(val);
                  setError("");
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                maxLength="15"
                autoFocus
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger custom-alert" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="btn btn-accent w-100"
          disabled={loading}
          style={{ marginTop: 8 }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-2"></i>
              Complete Setup
            </>
          )}
        </button>

        <button
          onClick={onClose}
          className="back-btn"
          style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MobileModal;