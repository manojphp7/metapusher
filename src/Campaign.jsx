import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { API_BASE_URL, API_ENDPOINTS } from './constants/appConstants';
import usePageTitle from "./hooks/usePageTitle";

export default function Campaign() {
  usePageTitle("Campaign");
  const navigate = useNavigate();

  const { token, user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const recordsPerPage = 5;

  
  // 🔥 FETCH CAMPAIGNS (LIVE)
  const fetchCampaigns = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.Campaigns}?user_key=${user.public_key}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCampaigns(json.data);
      }
    } catch (e) {
      console.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // 🔄 SORT CAMPAIGNS BY CLICKS
  const handleSortByClicks = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);

    const sorted = [...campaigns].sort((a, b) => {
      if (newOrder === 'asc') {
        return a.clicks - b.clicks; // Ascending
      } else {
        return b.clicks - a.clicks; // Descending
      }
    });

    setCampaigns(sorted);
    setCurrentPage(1); // Reset to first page after sorting
  };

  // 📄 PAGINATION
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = campaigns.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(campaigns.length / recordsPerPage);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge bg-warning text-dark',
      sent: 'badge bg-success',
      failed: 'badge bg-danger'
    };
    return badges[status] || 'badge bg-secondary';
  };

  return (
    <>
      <div className="content-area p-4">
        <div className="card p-4">
          <div className="card-header d-flex justify-content-between align-items-center fw-bold bg-white">
            <span>Campaigns</span>

            <button
              className="btn btn-sm btn-purple"
              onClick={() => navigate('/send-notification')}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Add Campaign
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Campaign Name</th>
                  <th>Status</th>
                  <th>Sent Time</th>
                  <th 
                    className="text-center" 
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={handleSortByClicks}
                  >
                    Clicks {' '}
                    <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i}>
        {/* # column */}
        <td style={{padding: '8px'}}>
          <ContentLoader 
            speed={2}
            width={30}
            height={20}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="4" ry="4" width="30" height="15" />
          </ContentLoader>
        </td>
        
        {/* Campaign Name column */}
        <td style={{padding: '8px'}}>
          <ContentLoader 
            speed={2}
            width={180}
            height={20}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="4" ry="4" width="180" height="15" />
          </ContentLoader>
        </td>
        
        {/* Status column */}
        <td style={{padding: '8px'}}>
          <ContentLoader 
            speed={2}
            width={70}
            height={24}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="12" ry="12" width="70" height="24" />
          </ContentLoader>
        </td>
        
        {/* Sent Time column */}
        <td style={{padding: '8px'}}>
          <ContentLoader 
            speed={2}
            width={140}
            height={20}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="4" ry="4" width="140" height="15" />
          </ContentLoader>
        </td>
        
        {/* Clicks column */}
        <td className="text-center" style={{padding: '8px'}}>
          <ContentLoader 
            speed={2}
            width={50}
            height={24}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="10" y="0" rx="12" ry="12" width="30" height="24" />
          </ContentLoader>
        </td>
        
        {/* Actions column */}
        <td className="text-center" style={{padding: '8px'}}>
          <ContentLoader 
            speed={2}
            width={80}
            height={32}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <rect x="5" y="4" rx="4" ry="4" width="70" height="24" />
          </ContentLoader>
        </td>
      </tr>
    ))}
  </>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No campaigns found
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{item.campaign_name}</td>
                      <td>
                        <span className={getStatusBadge(item.status)}>
                          {item.status}
                        </span>
                      </td>
                      <td>{formatDate(item.sent_time)}</td>
                      <td className="text-center">
                        <span className="badge bg-primary">{item.clicks}</span>
                      </td>

                      {/* Actions - Clone */}
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate(`/send-notification/${item.encoded_id}`)}
                          title="Clone Campaign"
                        >
                          <i className="bi bi-files me-1"></i>
                          Clone
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="card-footer d-flex justify-content-between align-items-center bg-white">
            <small className="text-muted">
              Showing {indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, campaigns.length)} of {campaigns.length}{" "}
              entries
            </small>

            <ul className="pagination custom-pagination mb-0">
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}