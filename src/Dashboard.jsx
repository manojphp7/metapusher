import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "./constants/appConstants";
import usePageTitle from "./hooks/usePageTitle";
import { useNavigate, useLocation } from "react-router-dom";
import { useGeneral } from "./context/GeneralContext";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  usePageTitle("Dashboard");
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { maintenanceMode } = useGeneral();

  const [stats, setStats] = useState({
    totalSubscriber: 0,
    todaySubscriber: 0,
    monthlySubscriber: 0,
    last7DaysTotal: 0,
  });

  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("all_domains");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch domains for dropdown
  const fetchDomains = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.Domains}?user_key=${user.public_key}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const json = await res.json();
      if (res.ok && json.success) {
        setDomains(json.data);
      }
    } catch (e) {
      console.error("Failed to load domains");
    }
  };

  // Fetch all stats and chart data in single API call
  const fetchDashboardData = async (domain = "all_domains") => {
    setLoading(true);
    try {
      const url =
        domain === "all_domains"
          ? `https://projects.bigsmart.in/Pusher/user.php?user_key=${user.public_key}`
          : `https://projects.bigsmart.in/Pusher/user.php?user_key=${user.public_key}&domain=${domain}`;

      const res = await fetch(url);
      const json = await res.json();

      // Set stats for cards
      setStats({
        totalSubscriber: json.totalSubscriber || 0,
        todaySubscriber: json.todaySubscriber || 0,
        monthlySubscriber: json.monthlySubscriber || 0,
        last7DaysTotal: json.last7DaysTotal || 0,
      });

      // Format chart data
      const formattedChartData = json.last7Days.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        dailyCount: item.dailyCount || 0,
        totalSubscribers: item.totalSubscribers || 0,
        fullDate: item.date,
      }));

      setChartData(formattedChartData);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (maintenanceMode) return;
    fetchDomains();
    fetchDashboardData();
  }, []);

  // Handle domain change
  const handleDomainChange = (e) => {
    const domain = e.target.value;
    setSelectedDomain(domain);
    fetchDashboardData(domain);
  };

  return (
    <div className="content-area py-2 px-2 p-md-4">
      {maintenanceMode ? (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "70vh" }}
        >
          <div className="text-center">
            <div style={{ fontSize: "80px" }}>🔧</div>
            <h2 className="fw-bold mt-3">We're Tuning Things Up!</h2>
            <p className="text-muted mt-2" style={{ maxWidth: "400px" }}>
              Our team is working hard behind the scenes to make your experience
              even better. Dashboard will be back shortly — grab a ☕ and relax!
            </p>
            <div
              className="badge bg-warning text-dark px-3 py-2 mt-2"
              style={{ fontSize: "13px" }}
            >
              🚧 Maintenance in Progress
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-4">
          {/* Header */}
          <div className="card-header d-flex justify-content-between align-items-center fw-bold bg-white mb-4 px-0 pb-2">
            <span>Dashboard</span>

            <select
              className="form-select"
              value={selectedDomain}
              onChange={handleDomainChange}
              style={{ maxWidth: "200px" }}
            >
              <option value="all_domains">All Domains</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.domain_name}>
                  {domain.domain_name}
                </option>
              ))}
            </select>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            {/* Total Subscribers */}
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div
                        className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          minWidth: "50px",
                        }}
                      >
                        <i className="bi bi-people fs-4 text-primary"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="text-muted mb-1 small">Total Subscribers</p>
                      <h3 className="mb-0 fw-bold">
                        {stats.totalSubscriber.toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Subscribers */}
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div
                        className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          minWidth: "50px",
                        }}
                      >
                        <i className="bi bi-graph-up-arrow fs-4 text-success"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="text-muted mb-1 small">
                        Today's Subscribers
                      </p>
                      <h3 className="mb-0 fw-bold">
                        {stats.todaySubscriber.toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Subscribers */}
            <div className="col-12 col-sm-6 col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div
                        className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          minWidth: "50px",
                        }}
                      >
                        <i className="bi bi-calendar-month fs-4 text-warning"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <p className="text-muted mb-1 small">
                        Monthly Subscribers
                      </p>
                      <h3 className="mb-0 fw-bold">
                        {stats.monthlySubscriber.toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Chart (Bar + Line) */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">
                {stats.totalSubscriber === 0
                  ? "Get Started"
                  : "Subscriber Growth (Last 7 Days)"}
              </h5>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : stats.totalSubscriber === 0 ? (
                <div className="text-center py-5">
                  <i
                    className="bi bi-bar-chart-line text-muted"
                    style={{ fontSize: "64px" }}
                  ></i>
                  <h5 className="mt-3 text-muted">No subscribers yet</h5>
                  <p className="text-muted small">
                    Add the push notification script to your website to start
                    collecting subscribers.
                  </p>
                  <button
                    onClick={() => navigate("/domains")}
                    className="btn btn-primary mt-2"
                  >
                    <i className="bi bi-code-slash me-2"></i>Add Your Website
                  </button>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                      allowDecimals={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />

                    {/* Bar: Daily Count */}
                    <Bar
                      yAxisId="left"
                      dataKey="dailyCount"
                      fill="#0d6efd"
                      name="Daily New Subscribers"
                      barSize={40}
                      radius={[8, 8, 0, 0]}
                    />

                    {/* Line: Total Subscribers */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="totalSubscribers"
                      stroke="#198754"
                      strokeWidth={3}
                      name="Total Subscribers (Cumulative)"
                      dot={{ r: 5, fill: "#198754" }}
                      activeDot={{ r: 7 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
