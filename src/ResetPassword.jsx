import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS } from "./constants/appConstants";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔍 Verify reset token
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.VerifyResetPassword}/${token}`,
          {
            headers: { Accept: "application/json" },
          }
        );

        if (!res.ok) {
          throw new Error();
        }
      } catch {
        setError("Reset link expired or invalid");
      }
    };

    verifyToken();
  }, [token]);

  // 🔐 Submit new password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.ResetPassword}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            token,
            password,
            password_confirmation: passwordConfirmation,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h4 className="text-center mb-3">Reset Password</h4>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              {success && (
                <div className="alert alert-success">{success}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm password"
                    value={passwordConfirmation}
                    onChange={(e) =>
                      setPasswordConfirmation(e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>

              <div className="text-center mt-3">
                <small>
                  Remembered password?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
