import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { API_BASE_URL,API_ENDPOINTS } from './constants/appConstants';

export default function AddDomainModal({ show, onClose }) {
  const { token } = useAuth();
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  // ✅ Validate HTTPS URL only
  const validateDomain = (value) => {
    value = value.trim();

    // ❌ Empty check
    if (!value) return { valid: false, domain: null };

    // ❌ http not allowed
    if (value.startsWith("http://")) {
      return { valid: false, domain: null, error: "HTTP is not allowed. Please use HTTPS" };
    }

    // ✅ Must start with https://
    if (!value.startsWith("https://")) {
      return { valid: false, domain: null, error: "Please enter domain with https://" };
    }

    try {
      const url = new URL(value);
      
      // ✅ Valid HTTPS URL
      if (url.protocol === "https:") {
        return { valid: true, domain: url.origin.replace(/\/$/, "") };
      }

      return { valid: false, domain: null, error: "Only HTTPS URLs are allowed" };
    } catch {
      return { valid: false, domain: null, error: "Invalid URL format" };
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setDomain(value);

    // Clear error on valid input
    const validation = validateDomain(value);
    if (validation.valid) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    const validation = validateDomain(domain);

    // ❌ Validation failed
    if (!validation.valid) {
      setError(validation.error || "Please enter a valid HTTPS URL");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.Domains}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          domain_name: validation.domain,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setDomain("");
        onClose();
      } else {
        setError(result.message || "Failed to add domain");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Add Domain</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <label className="form-label fw-semibold">Domain</label>
              
              {/* ✅ Info text */}
              <div className="text-muted small mb-2">
                <i className="bi bi-info-circle me-1"></i>
                Please enter domain name with <strong>https://</strong>
              </div>

              <input
                type="text"
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder="https://example.com"
                value={domain}
                onChange={handleChange}
              />

              {error && (
                <div className="text-danger small mt-2">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {error}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-sm btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="btn btn-sm btn-accent"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
}