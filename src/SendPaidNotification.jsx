import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from "./constants/appConstants";

export default function SendPaidNotification() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [requestedClicks, setRequestedClicks] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);

  const [campaignName, setCampaignName] = useState("");
  const [landingUrl, setLandingUrl] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [icon, setIcon] = useState("https://metapusher.com/cdn/bell.png");
  const [scheduledDateTime, setScheduledDateTime] = useState("");

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [balanceError, setBalanceError] = useState("");
  const [dateTimeError, setDateTimeError] = useState("");

  // Get selected plan details
  const selectedPlanData = packages.find(
    (pkg) => pkg.id === parseInt(selectedPlan)
  );

  // Calculate total cost
  const totalCost =
    selectedPlanData && requestedClicks
      ? (
          parseFloat(selectedPlanData.price) * parseInt(requestedClicks)
        ).toFixed(2)
      : 0;

  // Get minimum datetime (30 minutes from now)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  // Get default datetime (30 minutes from now)
  const getDefaultDateTime = () => {
    return getMinDateTime();
  };

  // Initialize scheduled datetime
  useEffect(() => {
    setScheduledDateTime(getDefaultDateTime());
  }, []);

  // Check if form is valid
  const isFormValid = () => {
    if (
      !selectedPlan ||
      !requestedClicks ||
      !campaignName ||
      !landingUrl ||
      !title ||
      !body ||
      !scheduledDateTime
    ) {
      return false;
    }

    const numClicks = parseInt(requestedClicks);
    if (!selectedPlanData) return false;

    if (
      numClicks < selectedPlanData.min_clicks ||
      numClicks > selectedPlanData.available_clicks
    ) {
      return false;
    }

    // Check balance
    if (parseFloat(totalCost) > parseFloat(currentBalance)) {
      return false;
    }

    // Check datetime is at least 30 mins from now
    if (dateTimeError) {
      return false;
    }

    return true;
  };

  // Validate scheduled datetime
  const validateDateTime = (dateTimeValue) => {
    const selectedDate = new Date(dateTimeValue);
    const minDate = new Date();
    minDate.setMinutes(minDate.getMinutes() + 30);

    if (selectedDate < minDate) {
      setDateTimeError("Schedule time must be at least 30 minutes from now");
      return false;
    } else {
      setDateTimeError("");
      return true;
    }
  };

  // Handle datetime change
  const handleDateTimeChange = (value) => {
    setScheduledDateTime(value);
    validateDateTime(value);
  };

  // 🔥 Fetch Balance
  const fetchBalance = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.Balance}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        setCurrentBalance(data.balance);
      }
    } catch (error) {
      console.error("Failed to fetch balance", error);
    }
  };

  // 🔥 Fetch Packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.TrafficPackages}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data);
      setPackages(data);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchBalance();
  }, []);

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

  // 🔥 Validate clicks and check balance
  const handleClicksChange = (value) => {
    const numValue = parseInt(value);

    if (!selectedPlanData) {
      setError("Please select a plan first");
      setBalanceError("");
      setRequestedClicks(value);
      return;
    }

    if (numValue < selectedPlanData.min_clicks) {
      setError(`Minimum ${selectedPlanData.min_clicks} clicks required`);
      setBalanceError("");
    } else if (numValue > selectedPlanData.available_clicks) {
      setError(`Maximum ${selectedPlanData.available_clicks} clicks available`);
      setBalanceError("");
    } else {
      setError("");

      // Check balance
      const cost = (parseFloat(selectedPlanData.price) * numValue).toFixed(2);
      if (parseFloat(cost) > parseFloat(currentBalance)) {
        setBalanceError(
          `Insufficient balance! Required: ₹${cost}, Available: ₹${currentBalance}`
        );
      } else {
        setBalanceError("");
      }
    }

    setRequestedClicks(value);
  };

  // 🔥 Check balance on blur
  const handleClicksBlur = () => {
    if (!requestedClicks || !selectedPlanData) return;

    const numValue = parseInt(requestedClicks);
    const cost = (parseFloat(selectedPlanData.price) * numValue).toFixed(2);

    if (parseFloat(cost) > parseFloat(currentBalance)) {
      setBalanceError(
        `Insufficient balance! Required: ₹${cost}, Available: ₹${currentBalance}`
      );
    } else {
      setBalanceError("");
    }
  };

  // 🔥 Submit notification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlan) {
      setError("Please select a plan");
      return;
    }

    if (!requestedClicks) {
      setError("Please enter number of clicks");
      return;
    }

    const numClicks = parseInt(requestedClicks);
    if (
      numClicks < selectedPlanData.min_clicks ||
      numClicks > selectedPlanData.available_clicks
    ) {
      setError(
        `Clicks must be between ${selectedPlanData.min_clicks} and ${selectedPlanData.available_clicks}`
      );
      return;
    }

    if (parseInt(totalCost) > parseInt(currentBalance)) {
      setBalanceError("Insufficient balance!");
      return;
    }

    if (!validateDateTime(scheduledDateTime)) {
      return;
    }

    setLoading(true);
    setError("");
    setBalanceError("");
    setDateTimeError("");

    const payload = {
      user_key: user?.public_key,
      domains: "https://eipreschool.com/",
      campaignName,
      landingUrl,
      title,
      body,
      image,
      scheduled_at: scheduledDateTime,
      plan_id: selectedPlan,
      total_cost: parseInt(totalCost),
      required_clicks: numClicks,
    };

    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SendPaidNotification}`,
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
      alert("Notification scheduled successfully 🚀");

      // Reset form
      setSelectedPlan("");
      setRequestedClicks("");
      setCampaignName("");
      setLandingUrl("");
      setTitle("");
      setBody("");
      setImage("");
      setScheduledDateTime(getDefaultDateTime());

      navigate('/paid-campaigns');
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold mb-0">Send Paid Notification</h5>
                  <div className="badge bg-success fs-6">
                    Balance: ₹{currentBalance}
                  </div>
                </div>

                {/* Select Plan Dropdown */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Select Plan <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={selectedPlan}
                    onChange={(e) => {
                      setSelectedPlan(e.target.value);
                      setRequestedClicks("");
                      setError("");
                      setBalanceError("");
                    }}
                    required
                  >
                    <option value="">Choose a plan...</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.country} - ₹{pkg.price} (Min. {pkg.min_clicks}{" "}
                        clicks)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Show Plan Details 
                {selectedPlanData && (
                  <div className="alert alert-info mb-3">
                    <div className="row">
                      <div className="col-6 col-md-3">
                        <small className="text-muted d-block">Country</small>
                        <strong>{selectedPlanData.country}</strong>
                      </div>
                      <div className="col-6 col-md-3">
                        <small className="text-muted d-block">Available Clicks</small>
                        <strong>{selectedPlanData.available_clicks}</strong>
                      </div>
                      <div className="col-6 col-md-3">
                        <small className="text-muted d-block">Price</small>
                        <strong>₹{selectedPlanData.price}</strong>
                      </div>
                      <div className="col-6 col-md-3">
                        <small className="text-muted d-block">Min. Clicks</small>
                        <strong>{selectedPlanData.min_clicks}</strong>
                      </div>
                    </div>
                  </div>
                )}*/}

                {/* Number of Clicks */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Number of Clicks <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={requestedClicks}
                    onChange={(e) => handleClicksChange(e.target.value)}
                    onBlur={handleClicksBlur}
                    min={selectedPlanData?.min_clicks || 0}
                    max={selectedPlanData?.available_clicks || 0}
                    disabled={!selectedPlan}
                    placeholder={
                      selectedPlanData
                        ? `Min: ${selectedPlanData.min_clicks}, Max: ${selectedPlanData.available_clicks}`
                        : "Select a plan first"
                    }
                    required
                  />
                  {selectedPlanData && (
                    <small className="text-muted d-block">
                      Enter between {selectedPlanData.min_clicks} and{" "}
                      {selectedPlanData.available_clicks} clicks
                    </small>
                  )}
                  {totalCost > 0 && (
                    <div className="mt-2">
                      <strong className="text-primary">
                        Total Cost: ₹{totalCost}
                      </strong>
                    </div>
                  )}
                </div>

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

                {/* Schedule Date & Time */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Schedule Date & Time <span className="text-danger">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    className={`form-control ${dateTimeError ? "is-invalid" : ""}`}
                    value={scheduledDateTime}
                    onChange={(e) => handleDateTimeChange(e.target.value)}
                    min={getMinDateTime()}
                    required
                  />
                  <small className="text-muted d-block mt-1">
                    Schedule time must be at least 30 minutes from now
                  </small>
                  {dateTimeError && (
                    <div className="invalid-feedback d-block">
                      {dateTimeError}
                    </div>
                  )}
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

                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}

                {balanceError && (
                  <div className="alert alert-warning py-2">{balanceError}</div>
                )}

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-purple"
                    disabled={!isFormValid() || loading}
                  >
                    {loading ? "Submiting..." : "Submit"}
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
                <div className="notification_view">
                  <img src={image || ""} alt="" className="feat_img" />
                </div>
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
                    src={icon || "https://metapusher.com/cdn/bell.png"}
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
