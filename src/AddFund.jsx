import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "./constants/appConstants";

export default function AddFund() {
  const { token } = useAuth();

  const [currentBalance, setCurrentBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");

  const recordsPerPage = 5;

  // Fetch balance and transactions on component mount
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  // Fetch user balance
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

  // Fetch transactions
  const fetchTransactions = async (page = 1) => {
    setTableLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.Transactions}?per_page=${recordsPerPage}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setTransactions(data.data.data); // Paginated data
        setCurrentPage(data.data.current_page);
        setTotalPages(data.data.last_page);
      }
      setTableLoading(false);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setTableLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setAmount(value);
      setError("");
    }
  };

  const handleAddFund = () => {
    const numAmount = parseInt(amount);

    if (!amount || numAmount < 1000) {
      setError("Minimum amount is ₹1000");
      return;
    }

    setError("");
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setScreenshot(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setScreenshotPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please upload a valid image file");
      }
    }
  };

  const handleSubmitPayment = async () => {
    if (!screenshot) {
      setError("Please upload payment screenshot");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const numAmount = parseInt(amount);

      const formData = new FormData();
      formData.append("amount", numAmount);
      formData.append("screenshot", screenshot);

      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AddFund}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(data.message);
        setAmount("");
        setScreenshot(null);
        setScreenshotPreview("");
        setShowModal(false);
        // Refresh balance and transactions
        fetchBalance();
        fetchTransactions();
      } else {
        setError(data.message || "Failed to add funds");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to add funds. Please try again.");
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setScreenshot(null);
    setScreenshotPreview("");
    setError("");
  };

  const getStatusBadge = (status) => {
    const badges = {
      Success: "badge bg-success",
      Pending: "badge bg-warning text-dark",
      Failed: "badge bg-danger",
    };
    return badges[status] || "badge bg-secondary";
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="content-area p-4">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center fw-bold bg-white">
          <span>Add Fund</span>
          <i className="bi bi-wallet2 fs-5 text-success"></i>
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

          {/* Error Message */}
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          {/* First Row - Balance and Add Fund */}
          <div className="row g-3 mb-4">
            {/* Current Balance Box */}
            <div className="col-md-6">
              <div className="card border h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted mb-2">Current Balance</h6>
                    <h2 className="mb-0 fw-bold" style={{ color: "#f96700" }}>
                      <i className="bi bi-currency-rupee"></i>
                      {currentBalance.toLocaleString("en-IN")}
                    </h2>
                  </div>
                  <div className="ms-3">
                    <div
                      className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{
                        backgroundColor: "#f9670010",
                        width: "60px",
                        height: "60px",
                      }}
                    >
                      <i
                        className="bi bi-wallet2 fs-3"
                        style={{ color: "#f96700" }}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Fund Box */}
            <div className="col-md-6">
              <div className="card border-0 bg-light h-100">
                <div className="card-body">
                  <h6 className="text-muted mb-3">Add Funds</h6>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <i className="bi bi-currency-rupee"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${error ? "is-invalid" : ""}`}
                      placeholder="Enter amount (Min: ₹1000)"
                      value={amount}
                      onChange={handleAmountChange}
                      disabled={loading}
                    />
                    <button
                      className="btn btn-success px-4"
                      onClick={handleAddFund}
                      disabled={loading || !amount}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Fund
                    </button>
                  </div>
                  <small className="text-muted mt-2 d-block">
                    <i className="bi bi-info-circle me-1"></i>
                    Minimum amount: ₹1,000 | Only whole numbers allowed
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Transaction History Table */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0">
                <div className="card-header bg-white fw-bold border-bottom">
                  <i className="bi bi-clock-history me-2"></i>
                  Transaction History
                </div>

                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Transaction ID</th>
                        <th>QR ID</th>
                        <th>Amount (₹)</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableLoading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : transactions.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-4 text-muted"
                          >
                            <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        transactions.map((item, index) => (
                          <tr key={item.id}>
                            <td>
                              {(currentPage - 1) * recordsPerPage + index + 1}
                            </td>
                            <td>
                              <span className="font-monospace text-primary">
                                {item.transaction_id}
                              </span>
                            </td>
                            <td>
                              <span className="font-monospace">
                                {item.qr_id}
                              </span>
                            </td>
                            <td>
                              <strong className="text-success">
                                ₹{parseFloat(item.amount).toLocaleString("en-IN")}
                              </strong>
                            </td>
                            <td>
                              <small className="text-muted">
                                <i className="bi bi-calendar3 me-1"></i>
                                {formatDate(item.created_at)}
                              </small>
                            </td>
                            <td>
                              <span className={getStatusBadge(item.status)}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {!tableLoading && transactions.length > 0 && (
                  <div className="card-footer d-flex justify-content-between align-items-center bg-white">
                    <small className="text-muted">
                      Page {currentPage} of {totalPages}
                    </small>

                    <ul className="pagination pagination-sm mb-0">
                      <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => fetchTransactions(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>

                      {[...Array(totalPages)].map((_, i) => (
                        <li
                          key={i}
                          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => fetchTransactions(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}

                      <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => fetchTransactions(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-qr-code me-2"></i>
                  Complete Payment
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body text-center">
                {/* Amount Display */}
                <div className="alert alert-info mb-4">
                  <h4 className="mb-0">
                    <i className="bi bi-currency-rupee"></i>
                    {parseInt(amount).toLocaleString("en-IN")}
                  </h4>
                  <small>Amount to Pay</small>
                </div>

                {/* QR Code */}
                <div className="mb-4">
                  <div
                    className="border rounded p-3 d-inline-block"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    {/* Replace this with your actual QR code image or generator */}
                    <img
                      src="https://metapusher.com/api/public/uploads/qr/QRCFE49928.jpeg"
                      alt="QR Code"
                      style={{ width: "200px", height: "200px" }}
                    />
                  </div>
                  <p className="text-muted mt-2 mb-0">
                    <small>Scan QR code to make payment</small>
                  </p>
                </div>

                {/* Instruction */}
                <div className="alert alert-warning mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  After Payment Kindly upload screenshot
                </div>

                {/* Screenshot Upload */}
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Upload Payment Screenshot
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                  {screenshotPreview && (
                    <div className="mt-3">
                      <img
                        src={screenshotPreview}
                        alt="Screenshot Preview"
                        className="img-thumbnail"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSubmitPayment}
                  disabled={loading || !screenshot}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Submit Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}