import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { API_BASE_URL,API_ENDPOINTS } from './constants/appConstants';
import usePageTitle from "./hooks/usePageTitle";

export default function SendNotification() {
  usePageTitle("Send Notification");
  const { token,user } = useAuth();

  const [campaignName, setCampaignName] = useState("");
  const [landingUrl, setLandingUrl] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [icon, setIcon] = useState("https://metapusher.com/cdn/bell.png");
  const [timing, setTiming] = useState("instant");

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Fetch meta data
  const handleGetData = async () => {
    if (!landingUrl.startsWith("https://")) {
      alert("Please enter valid https URL");
      return;
    }

    setLoadingMeta(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.FetchMeta}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: landingUrl }),
      });

      const json = await res.json();

      setTitle(json?.data?.title || "");
      setBody(json?.data?.description || "");
      setImage(json?.data?.image || "");
    } catch (err) {
      alert("Failed to fetch meta data");
      console.error(err);
    } finally {
      setLoadingMeta(false);
    }
  };

  // 🔥 Submit notification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      user_key: user?.public_key,
      domains:'https://eipreschool.com/',
      campaignName,
      landingUrl,
      title,
      body,
      image,
      icon,
      timing,
    };

    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SendNotification}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send notification");
      }

      console.log("SEND NOTIFICATION PAYLOAD:", payload);
      alert("Notification sent successfully 🚀");
    } catch (err) {
      setError("Network error. Please check backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area p-4">
      <div className="row">
        <div className="col-md-7">
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-body">
                <h5 className="fw-bold mb-4">Send Notification</h5>

                {/* Campaign Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Campaign Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    required
                  />
                </div>

                {/* Landing URL */}
                <div className="mb-1 fw-semibold">
                  Landing Page URL <span className="text-danger">*</span>
                </div>
                <div className="text-muted small mb-2">
                  Please enter URL with <strong>https://</strong>
                </div>

                <div className="input-group mb-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://example.com"
                    value={landingUrl}
                    onChange={(e) => setLandingUrl(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-accent-outline"
                    onClick={handleGetData}
                    disabled={loadingMeta}
                  >
                    {loadingMeta ? "Fetching..." : "Get Data"}
                  </button>
                </div>

                {/* Title */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Body */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Notification Message <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  />
                </div>

                {/* Image */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Notification Image
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Image URL"
                  />
                </div>

                {/* Icon */}
                {/* <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Banner Icon
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Icon URL"
                  />
                </div> */}

                {/* Timing */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Notification Timing
                  </label>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked={timing === "instant"}
                      onChange={() => setTiming("instant")}
                    />
                    <label className="form-check-label">
                      Instant Notification
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      checked={timing === "schedule"}
                      onChange={() => setTiming("schedule")}
                    />
                    <label className="form-check-label">
                      Schedule Notification
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-purple"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* 🔥 Preview */}
        <div className="col-md-5">
          <div className="card">
            <div className="card-body">
              {image && (
                <div className="notification_view"> <img src={image || ''} alt="" className="feat_img" /> </div>
              )}

              <div className="notification-card">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src="https://metapusher.com/cdn/chrome.png"
                      alt="Chrome"
                      className="browser-icon"
                    />
                    <span className="browser-name">Google Chrome</span>
                  </div>

                  <button
                    type="button"
                    className="btn-close btn-close-white"
                  ></button>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <img
                    src={
                      icon ||
                      "https://metapusher.com/cdn/bell.png"
                    }
                    className="notification-image"
                    alt="Notification"
                  />

                  <div>
                    <div className="notification-title">
                      {title || "New Update Available"}
                    </div>
                    <div className="notification-text">
                      {body ||
                        "Check out the latest features and improvements."}
                    </div>
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
