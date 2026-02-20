import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LeftBar({ isOpen, onClose }) {
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [paidCampaignOpen, setPaidCampaignOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/send-notification" || location.pathname === "/campaigns") {
      setActiveLink(location.pathname);
      setNotifyOpen(true);
    } else {
      setNotifyOpen(false);
    }

    if (
      location.pathname === "/send-notification" ||
      location.pathname === "/campaigns" ||
      location.pathname === "/paid-dashboard" ||
      location.pathname === "/paid-campaigns" ||
      location.pathname === "/send-paid-notification" ||
      location.pathname === "/traffic-packages" ||
      location.pathname === "/terms-conditions"
    ) {
      setActiveLink(location.pathname);
      setPaidCampaignOpen(true);
    } else {
      setPaidCampaignOpen(false);
    }

    if (
      location.pathname !== "/send-notification" &&
      location.pathname !== "/campaigns" &&
      location.pathname !== "/paid-dashboard" &&
      location.pathname !== "/paid-campaigns" &&
      location.pathname !== "/send-paid-notification" &&
      location.pathname !== "/traffic-packages" &&
      location.pathname !== "/terms-conditions"
    ) {
      setActiveLink(location.pathname);
    }
  }, [location.pathname]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  return (
    <>
      {/* Dark backdrop — mobile only, shown when sidebar is open */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar p-3${isOpen ? " sidebar-open" : ""}`}>

        {/* Brand + close button row */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="brand">
            <img src={`${process.env.PUBLIC_URL}/logo.jpg`} className="logo" alt="logo" />
          </div>
          {/* Close (×) button — visible only on mobile via CSS */}
          <button
            className="sidebar-close-btn btn btn-link p-0"
            onClick={onClose}
            aria-label="Close sidebar"
            style={{ color: "var(--text-muted)", fontSize: "1.2rem" }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <ul className="nav nav-pills flex-column">

          {/* Dashboard */}
          <li className="nav-item">
            <div
              className={`nav-link ${activeLink === "/" ? "active" : ""}`}
              onClick={() => { setActiveLink("/"); navigate("/"); }}
            >
              <span className="nav-left">
                <i className="bi bi-speedometer2 menu-icon"></i>
                Dashboard
              </span>
            </div>
          </li>

          {/* Domains */}
          <li className="nav-item">
            <div
              className={`nav-link ${activeLink === "/domains" ? "active" : ""}`}
              onClick={() => { setActiveLink("/domains"); navigate("/domains"); }}
            >
              <span className="nav-left">
                <i className="bi bi-globe menu-icon"></i>
                Domains
              </span>
            </div>
          </li>

          {/* Notifications */}
          <li className="nav-item">
            <div
              className={`nav-link ${activeLink === "/send-notification" || activeLink === "/campaigns" ? "active" : ""}`}
              onClick={() => setNotifyOpen(!notifyOpen)}
            >
              <span className="nav-left">
                <i className="bi bi-bell menu-icon"></i>
                Notifications
              </span>
              <i className={`bi bi-chevron-down chevron ${notifyOpen ? "rotate-180" : ""}`}></i>
            </div>

            <div className={`collapse ps-3 ${notifyOpen ? "show" : ""}`}>
              <div
                className={`nav-link ${activeLink === "/send-notification" ? "active" : ""}`}
                onClick={() => { setActiveLink("/send-notification"); setNotifyOpen(true); navigate("/send-notification"); }}
              >
                <span className="submenu-icon"><i className="bi bi-circle"></i></span>
                Send Notification
              </div>
              <div
                className={`nav-link ${activeLink === "/campaigns" ? "active" : ""}`}
                onClick={() => { setActiveLink("/campaigns"); setNotifyOpen(true); navigate("/campaigns"); }}
              >
                <span className="submenu-icon"><i className="bi bi-circle"></i></span>
                Campaigns
              </div>
            </div>
          </li>

          {/* Paid Campaigns */}
          <li className="nav-item">
            <div
              className={`nav-link ${
                activeLink === "/paid-dashboard" ||
                activeLink === "/paid-campaigns" ||
                activeLink === "/traffic-packages" ||
                activeLink === "/terms-conditions"
                  ? "active" : ""
              }`}
              onClick={() => setPaidCampaignOpen(!paidCampaignOpen)}
            >
              <span className="nav-left">
                <i className="bi bi-currency-rupee menu-icon"></i>
                Paid Campaigns
              </span>
              <i className={`bi bi-chevron-down chevron ${paidCampaignOpen ? "rotate-180" : ""}`}></i>
            </div>

            <div className={`collapse ps-3 ${paidCampaignOpen ? "show" : ""}`}>
              <div
                className={`nav-link ${activeLink === "/paid-dashboard" ? "active" : ""}`}
                onClick={() => { setActiveLink("/paid-dashboard"); setPaidCampaignOpen(true); navigate("/paid-dashboard"); }}
              >
                <span className="submenu-icon"><i className="bi bi-circle"></i></span>
                Dashboard
              </div>
              <div
                className={`nav-link ${activeLink === "/paid-campaigns" ? "active" : ""}`}
                onClick={() => { setActiveLink("/paid-campaigns"); setPaidCampaignOpen(true); navigate("/paid-campaigns"); }}
              >
                <span className="submenu-icon"><i className="bi bi-circle"></i></span>
                Campaigns
              </div>
              <div
                className={`nav-link ${activeLink === "/traffic-packages" ? "active" : ""}`}
                onClick={() => { setActiveLink("/traffic-packages"); setPaidCampaignOpen(true); navigate("/traffic-packages"); }}
              >
                <span className="submenu-icon"><i className="bi bi-circle"></i></span>
                Traffic Packages
              </div>
              <div
                className={`nav-link ${activeLink === "/terms-conditions" ? "active" : ""}`}
                onClick={() => { setActiveLink("/terms-conditions"); setPaidCampaignOpen(true); navigate("/terms-conditions"); }}
              >
                <span className="submenu-icon"><i className="bi bi-circle"></i></span>
                Terms & Conditions
              </div>
            </div>
          </li>

          {/* Add Funds */}
          <li className="nav-item">
            <div
              className={`nav-link ${activeLink === "/addFund" ? "active" : ""}`}
              onClick={() => { setActiveLink("/addFund"); navigate("/addFund"); }}
            >
              <span className="nav-left">
                <i className="bi bi-wallet2 menu-icon"></i>
                Add Funds
              </span>
            </div>
          </li>

          {/* Settings */}
          <li className="nav-item">
            <div
              className={`nav-link ${activeLink === "/settings" ? "active" : ""}`}
              onClick={() => { setActiveLink("/settings"); navigate("/settings"); }}
            >
              <span className="nav-left">
                <i className="bi bi-gear menu-icon"></i>
                Settings
              </span>
            </div>
          </li>

        </ul>
      </aside>
    </>
  );
}