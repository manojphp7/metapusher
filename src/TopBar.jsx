import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <nav className="navbar topbar px-4">
      <div className="ms-auto d-flex align-items-center gap-3">
        <button
          className="btn btn-accent btn-sm"
          onClick={() => navigate("/domains")}
        >
          + Domains
        </button>

        {/* Profile Dropdown */}
        <div className="position-relative">
          <div
            className="profile-img-wrapper"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div class="bg-light rounded-circle">
              <i class="bi bi-person-fill fs-5"></i>
            </div>
          </div>

          {showDropdown && (
            <>
              {/* Backdrop to close dropdown */}
              <div
                className="dropdown-backdrop"
                onClick={() => setShowDropdown(false)}
              />

              {/* Dropdown Menu */}
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="fw-bold text-white">
                    {user?.name || "User"}
                  </div>
                  <div className="text-white-muted small">
                    {user?.email || "user@mail.com"}
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                {/* <button className="dropdown-item" onClick={() => {
                  setShowDropdown(false);
                  navigate('/profile');
                }}>
                  <i className="bi bi-person me-2"></i>
                  My Profile
                </button>
                 */}
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/settings");
                  }}
                >
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
