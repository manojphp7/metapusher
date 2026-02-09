import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS } from "./constants/appConstants";
import ContentLoader from "react-content-loader";

const TrafficPackages = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

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

  // Card Skeleton Loader
  const CardLoader = () => (
    <ContentLoader
      speed={2}
      width="100%"
      height={320}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      {/* Header */}
      <rect x="0" y="0" rx="8" ry="8" width="100%" height="50" />
      
      {/* Body - Line 1 */}
      <rect x="20" y="70" rx="4" ry="4" width="30" height="30" />
      <rect x="60" y="75" rx="4" ry="4" width="60%" height="20" />
      
      {/* Body - Line 2 */}
      <rect x="20" y="120" rx="4" ry="4" width="30" height="30" />
      <rect x="60" y="125" rx="4" ry="4" width="70%" height="20" />
      
      {/* Body - Line 3 */}
      <rect x="20" y="170" rx="4" ry="4" width="30" height="30" />
      <rect x="60" y="175" rx="4" ry="4" width="50%" height="20" />
      
      {/* Body - Line 4 */}
      <rect x="20" y="220" rx="4" ry="4" width="30" height="30" />
      <rect x="60" y="225" rx="4" ry="4" width="55%" height="20" />
      
      {/* Button */}
      <rect x="30%" y="265" rx="20" ry="20" width="40%" height="35" />
    </ContentLoader>
  );

  return (
    <>
      <div className="p-4">
              <div class="d-flex justify-content-between fw-bold title_wihtout_bg" ><span>Traffic Packages</span></div>
            </div>
       <div className="content-area p-4">
            
            

        <div className="row traffic-packages">
          {loading ? (
            // Show 5 skeleton loaders
            <>
              {[...Array(5)].map((_, index) => (
                <div className="col-md-4" key={index}>
                  <div className="card mb-4">
                    <CardLoader />
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Show actual data
            packages.map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className="card mb-4">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span>{item.country}</span>

                    <span className="text-white fw-semibold">
                      <i className="bi bi-lightning-fill me-1"></i>
                      Fast
                    </span>
                  </div>
                  <div className="card-body">
                    <p>
                      <i className="bi bi-globe text-accent me-2"></i> Country:{" "}
                      {item.country}
                    </p>
                    <p>
                      <i className="bi bi-cursor-fill text-accent me-2"></i>{" "}
                      Available Clicks: {item.available_clicks}
                    </p>
                    <p>
                      <i className="bi bi-currency-rupee text-accent me-2"></i>{" "}
                      Price: ₹{item.price}
                    </p>
                    <p>
                      <i className="bi bi-bar-chart-fill text-accent me-2"></i>{" "}
                      Min. Clicks: {item.min_clicks}
                    </p>
                    <button className="btn btn-sm btn-success d-block mx-auto">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TrafficPackages;