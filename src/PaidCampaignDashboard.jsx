import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { API_BASE_URL, API_ENDPOINTS } from "./constants/appConstants";
import ContentLoader from "react-content-loader";

const PaidCampaignDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.PaidCampaignDashboard}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Card Skeleton Loader
  const CardLoader = () => (
    <ContentLoader
      speed={2}
      width="100%"
      height={100}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="20" y="20" rx="4" ry="4" width="35" height="35" />
      <rect x="65" y="25" rx="4" ry="4" width="120" height="12" />
      <rect x="65" y="45" rx="4" ry="4" width="80" height="18" />
    </ContentLoader>
  );

  return (
    <>
      <div className="p-4">
        <div className="d-flex justify-content-between fw-bold title_wihtout_bg">
          <span>Traffic Packages</span>
        </div>
      </div>
      <div className="content-area p-4">
        {/* Clicks Statistics */}
        <div className="mb-4">
          <h5 className="mb-3">
            <i className="bi bi-cursor-fill text-accent me-2"></i>
            Clicks Overview
          </h5>
          <div className="row">
            {loading ? (
              <>
                {[...Array(3)].map((_, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="card mb-3">
                      <CardLoader />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Total Clicks */}
                <div className="col-md-4">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-graph-up-arrow text-primary fs-5 p-1"></i>
                        </div>
                        <div>
                          <small className="text-muted d-block">
                            Total Clicks
                          </small>
                          <h3 className="mb-0 fw-bold">
                            {stats?.clicks?.total?.toLocaleString() || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Clicks */}
                <div className="col-md-4">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-calendar-month text-success fs-5 p-1"></i>
                        </div>
                        <div>
                          <small className="text-muted d-block">
                            Monthly Clicks
                          </small>
                          <h3 className="mb-0 fw-bold">
                            {stats?.clicks?.monthly?.toLocaleString() || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today Clicks */}
                <div className="col-md-4">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-clock text-warning fs-5 p-1"></i>
                        </div>
                        <div>
                          <small className="text-muted d-block">
                            Today's Clicks
                          </small>
                          <h3 className="mb-0 fw-bold">
                            {stats?.clicks?.today?.toLocaleString() || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Campaigns Statistics */}
        <div>
          <h5 className="mb-3">
            <i className="bi bi-megaphone-fill text-accent me-2"></i>
            Campaigns Overview
          </h5>
          <div className="row">
            {loading ? (
              <>
                {[...Array(3)].map((_, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="card mb-3">
                      <CardLoader />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Total Campaigns */}
                <div className="col-md-4">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-collection text-info fs-5 p-1"></i>
                        </div>
                        <div>
                          <small className="text-muted d-block">
                            Total Campaigns
                          </small>
                          <h3 className="mb-0 fw-bold">
                            {stats?.campaigns?.total || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Campaigns */}
                <div className="col-md-4">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-purple bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-calendar3 text-purple fs-5 p-1"></i>
                        </div>
                        <div>
                          <small className="text-muted d-block">
                            Monthly Campaigns
                          </small>
                          <h3 className="mb-0 fw-bold">
                            {stats?.campaigns?.monthly || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today Campaigns */}
                <div className="col-md-4">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                          <i className="bi bi-calendar-day text-danger fs-5 p-1"></i>
                        </div>
                        <div>
                          <small className="text-muted d-block">
                            Today's Campaigns
                          </small>
                          <h3 className="mb-0 fw-bold">
                            {stats?.campaigns?.today || 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaidCampaignDashboard;