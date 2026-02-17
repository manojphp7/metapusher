import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import { API_BASE_URL, API_ENDPOINTS } from "./constants/appConstants";
import usePageTitle from "./hooks/usePageTitle";

export default function PaidCampaign() {
  usePageTitle("Paid Campaigns");
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState(0);
  const [agree, setAgree] = useState(false);
  const [checkingBalance, setCheckingBalance] = useState(false);

  const recordsPerPage = 5;

  // ================= BALANCE =================
  const fetchBalance = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.Balance}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
        return Number(data.balance);
      }
      return 0;
    } catch (err) {
      console.error("Balance fetch failed", err);
      return 0;
    }
  };

  const handleAddCampaign = async () => {
    if (checkingBalance) return;

    setCheckingBalance(true);

    const bal = await fetchBalance();
    setBalance(bal);

    setCheckingBalance(false);

    if (bal < 100) {
      navigate("/addFund");
    } else {
      setAgree(false);
      setShowModal(true);
    }
  };

  // ================= CAMPAIGNS =================
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.Campaigns}?user_key=${user.public_key}&isPaid=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const json = await res.json();
      if (res.ok && json.success) {
        setCampaigns(json.data);
      }
    } catch (e) {
      console.error("Failed to load paid campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // ================= SORT =================
  const handleSortByClicks = () => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);

    setCampaigns(
      [...campaigns].sort((a, b) =>
        order === "asc" ? a.clicks - b.clicks : b.clicks - a.clicks
      )
    );
  };

  const handleSortByRequiredClicks = () => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);

    setCampaigns(
      [...campaigns].sort((a, b) =>
        order === "asc"
          ? a.required_clicks - b.required_clicks
          : b.required_clicks - a.required_clicks
      )
    );
  };

  // ================= PAGINATION =================
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = campaigns.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(campaigns.length / recordsPerPage);

  const getProgress = (c, r) =>
    r ? Math.min(100, Math.round((c / r) * 100)) : 0;

  // ================= UI =================
  return (
    <>
      <div className="content-area p-4">
        <div className="card p-4">
          <div className="card-header d-flex justify-content-between bg-white fw-bold">
            <span>Paid Campaigns</span>

            <button
              className="btn btn-sm btn-purple"
              onClick={handleAddCampaign}
              disabled={checkingBalance}
            >
              {checkingBalance ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Loading...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-lg me-1"></i>
                  Add Paid Campaign
                </>
              )}
            </button>
          </div>

          {/* ===== TABLE ===== */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Campaign Name</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th
                    className="text-center"
                    style={{ cursor: "pointer" }}
                    onClick={handleSortByRequiredClicks}
                  >
                    Required Clicks
                  </th>
                  <th
                    className="text-center"
                    style={{ cursor: "pointer" }}
                    onClick={handleSortByClicks}
                  >
                    Current Clicks
                  </th>
                  <th className="text-center">Progress</th>

                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : currentRecords.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      No paid campaigns found
                    </td>
                  </tr>
                ) : (
                  currentRecords.map((item, index) => {
                    const progress = getProgress(
                      item.clicks,
                      item.required_clicks
                    );
                    return (
                      <tr key={item.id}>
                        <td>{indexOfFirst + index + 1}</td>
                        <td>{item.campaign_name}</td>
                        <td>{item.status}</td>
                        <td>{item.created_at}</td>
                        <td className="text-center">{item.required_clicks}</td>
                        <td className="text-center">{item.clicks}</td>
                        <td className="text-center">{progress}%</td>
                        
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,.6)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              {/* ===== HEADER ===== */}
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  पेड पुश कैंपेन के लिए महत्वपूर्ण निर्देश
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* ===== BODY ===== */}
              <div
                className="modal-body hindi-modal"
              >
                <p className="mb-3">
                  पेड पुश कैंपेन शुरू करने से पहले, कुछ बातों का ध्यान रखना बहुत
                  ज़रूरी है। कैंपेन लगाने से पहले इन शर्तों को मानना अनिवार्य
                  है।
                </p>

                <ol className="ps-3">
                  <li className="mb-3">
                    <strong>कंटेंट और इमेजेस</strong>
                    <br />
                    क्लिकबेट टाइटल, इमेज, एडल्ट कंटेंट या फेक कंटेंट का उपयोग
                    करने से आपका कैंपेन तुरंत रिजेक्ट कर दिया जाएगा।
                  </li>

                  <li className="mb-3">
                    <strong>अप्रूवल प्रक्रिया</strong>
                    <br />
                    हर कैंपेन लगाने पर आपको 30 मिनट आगे का टाइम सेलेक्ट करना
                    होता है। कैंपेन तभी लाइव होगा जब हमारी टीम उसे अप्रूव कर
                    देगी। कैंपेन केवल सुबह 9 बजे से शाम 6 बजे तक ही लगाए जा सकते
                    हैं।
                  </li>

                  <li className="mb-3">
                    <strong>Clicks कंप्लीट होने का टाइम</strong>
                    <br />
                    क्लिक्स पूरे होने का समय आपके प्लान पर निर्भर करता है।
                    नॉर्मल स्पीड प्लान में 1–5 घंटे लग सकते हैं। फास्ट क्लिक
                    प्लान में 1–2 घंटे के अंदर सभी क्लिक्स पूरे हो जाते हैं।
                  </li>

                  <li className="mb-3">
                    <strong>क्लिक प्राइज</strong>
                    <br />
                    क्लिक प्राइज फिक्स नहीं होते, ये डिमांड के अनुसार घटते-बढ़ते
                    रहते हैं।
                  </li>

                  <li className="mb-3">
                    <strong>इंस्टेंट क्लिक्स</strong>
                    <br />
                    इंस्टेंट क्लिक्स और नॉर्मल स्पीड क्लिक्स के लिए अलग-अलग
                    प्लान होते हैं। प्रति क्लिक कीमत में अंतर हो सकता है।
                  </li>

                  <li className="mb-3">
                    <strong>व्हाट्सएप रिमाइंडर</strong>
                    <br />
                    कैंपेन ऐड करते ही हमें व्हाट्सएप पर एक रिमाइंडर ज़रूर भेजें।
                  </li>

                  <li className="mb-3">
                    <strong>MetaPusher इंटीग्रेशन</strong>
                    <br />
                    जिस वेबसाइट पर ट्रैफिक लाना चाहते हैं, उसका डोमेन MetaPusher पुश
                    सर्विस के साथ इंटीग्रेटेड होना चाहिए। अगर ऐसा नहीं है, तो
                    नोटिफिकेशन तो जाएंगे लेकिन ट्रैफिक रिडायरेक्ट नहीं होगा और
                    कोई रिफंड नहीं मिलेगा।
                  </li>

                  <li className="mb-3">
                    <strong>क्लिक काउंट</strong>
                    <br />
                    पुश नोटिफिकेशन क्लिक और Google Analytics डेटा में अंतर हो
                    सकता है। हमारा सिस्टम नोटिफिकेशन पर क्लिक होते ही काउंट कर
                    लेता है।
                  </li>

                  <li className="mb-3">
                    <strong>सर्वर लोड</strong>
                    <br />
                    ज्यादा ट्रैफिक आने से सर्वर डाउन हो सकता है। पहले सुनिश्चित
                    करें कि आपका सर्वर लोड संभाल सकता है।
                  </li>

                  <li className="mb-3">
                    <strong>Ads लोडिंग</strong>
                    <br />
                    कैंपेन शुरू होने के बाद किसी भी प्रकार की ऑटो-रीडायरेक्ट या
                    अनऑथराइज़्ड ads स्क्रिप्ट का उपयोग करने पर कैंपेन तुरंत रद्द
                    कर दिया जाएगा और कोई रिफंड नहीं मिलेगा।
                  </li>
                </ol>

                {/* ===== CHECKBOX ===== */}
                <div className="form-check mt-4 p-3 border rounded bg-light ">
                  <input
                    className="form-check-input agreeTerms"
                    type="checkbox"
                    id="agreeTerms"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}

                  />
                  <label
                    className="form-check-label fw-semibold"
                    htmlFor="agreeTerms"
                  >
                    ऊपर दिए गए सभी निर्देश पढ़ लिए हैं और मैं उनसे सहमत हूँ
                  </label>
                </div>
              </div>

              {/* ===== FOOTER ===== */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-accent btn-sm"
                  disabled={!agree}
                  onClick={() => navigate("/send-paid-notification")}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
