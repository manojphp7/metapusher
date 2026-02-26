import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import AddDomainModal from "./AddDomainModal";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { API_BASE_URL, API_ENDPOINTS } from "./constants/appConstants";
import usePageTitle from "./hooks/usePageTitle";

export default function Domains() {
  usePageTitle("Domains");
  const navigate = useNavigate();

  const { token, user } = useAuth();
  const [domains, setDomains] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const recordsPerPage = 5;

  // 🔥 FETCH DOMAINS (LIVE)
  const fetchDomains = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  // ❌ DELETE DOMAIN (trash icon)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this domain?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.Domains}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const updated = domains.filter((d) => d.id !== id);
        setDomains(updated);

        // pagination safety
        const totalPagesAfter = Math.ceil(updated.length / recordsPerPage);
        if (currentPage > totalPagesAfter) {
          setCurrentPage(totalPagesAfter || 1);
        }
      } else {
        alert("Delete failed");
      }
    } catch {
      alert("Server error");
    } finally {
      setDeletingId(null);
    }
  };

  // 📄 PAGINATION (same logic)
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = domains.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(domains.length / recordsPerPage);

  return (
    <>
      <div className="content-area p-4">
        <div className="card p-4">
          <div className="card-header d-flex justify-content-between align-items-center fw-bold bg-white">
            <span>Domains</span>

            <button
              className="btn btn-sm btn-purple"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-lg me-1 "></i>
              Add Domain
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Domain</th>
                  <th>Created Date</th>
                  <th className="text-center">Integrate</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {/* # column */}
                        <td style={{ padding: "8px" }}>
                          <ContentLoader
                            speed={2}
                            width={30}
                            height={20}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                          >
                            <rect
                              x="0"
                              y="0"
                              rx="4"
                              ry="4"
                              width="30"
                              height="15"
                            />
                          </ContentLoader>
                        </td>

                        {/* Domain column */}
                        <td style={{ padding: "8px" }}>
                          <ContentLoader
                            speed={2}
                            width={200}
                            height={20}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                          >
                            <rect
                              x="0"
                              y="0"
                              rx="4"
                              ry="4"
                              width="200"
                              height="15"
                            />
                          </ContentLoader>
                        </td>

                        {/* Created Date column */}
                        <td style={{ padding: "8px" }}>
                          <ContentLoader
                            speed={2}
                            width={100}
                            height={20}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                          >
                            <rect
                              x="0"
                              y="0"
                              rx="4"
                              ry="4"
                              width="100"
                              height="15"
                            />
                          </ContentLoader>
                        </td>

                        {/* Integrate button */}
                        <td className="text-center" style={{ padding: "8px" }}>
                          <ContentLoader
                            speed={2}
                            width={40}
                            height={32}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                          >
                            <circle cx="20" cy="16" r="16" />
                          </ContentLoader>
                        </td>

                        {/* Action button */}
                        <td className="text-center" style={{ padding: "8px" }}>
                          <ContentLoader
                            speed={2}
                            width={40}
                            height={32}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                          >
                            <circle cx="20" cy="16" r="16" />
                          </ContentLoader>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No domains found
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{item.domain_name}</td>
                      <td>{item.created_at.slice(0, 10)}</td>

                      {/* Integrate button */}
                      <td className="text-center">
                        <button
                          className="btn integrate-btn"
                          onClick={() =>
                            navigate(`/domains/${item.id}/integration`)
                          }
                        >
                          <i className="bi bi-arrow-right"></i>
                        </button>
                      </td>

                      {/* Action */}
                      <td className="text-center">
                        <button
                          className="btn btn-icon-danger"
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="card-footer d-flex justify-content-between align-items-center  bg-white">
            <small className="text-muted">
              Showing {indexOfFirst + 1} to{" "}
              {Math.min(indexOfLast, domains.length)} of {domains.length}{" "}
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

        <AddDomainModal show={showModal} onClose={() =>{
          fetchDomains()
          setShowModal(false)
        } } />
      </div>
    </>
  );
}
