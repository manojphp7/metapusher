import { useState } from "react";
import { useAuth } from "./context/AuthContext";

export default function DomainIntegration() {
  const { token, user } = useAuth();
  const [downloading, setDownloading] = useState(false)

 const scriptCode = [
  '<script>',
  '  const METAPUSHER_CONFIG = {',
  '    siteUrl: window.location.origin,',
  `    userKey: "${user?.public_key}",`,
  '    swUrl: "/sw.js"',
  '  };',
  '  window.MetaPusher = METAPUSHER_CONFIG;',
  '</script>',
  '<script src="https://metapusher.com/cdn/pushnotification-min.js"></script>'
].join('\n');
  const [copied, setCopied] = useState(false);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    // 2 sec baad normal state
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSW = async () => {
 try {
    setDownloading(true);
    
    const response = await fetch('https://metapusher.com/cdn/sw.js');
    
    if (!response.ok) {
      throw new Error('Download failed');
    }
    
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sw.js';
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download file. Please try again.');
  } finally {
    setDownloading(false);
  }

};

  return (
    <div className="content-area p-4">
      <div className="card p-4">
        <h5 className="mb-3 fw-bold">Domain Integration</h5>

        <div className="accordion" id="integrationAccordion">
          {/* ================= WordPress Plugin ================= */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#wpPlugin"
              >
              Option 1 &nbsp;&nbsp;&nbsp;<strong>Setup with WordPress Plugin</strong> 
              </button>
            </h2>

            <div
              id="wpPlugin"
              className="accordion-collapse collapse show"
              data-bs-parent="#integrationAccordion"
            >
              <div className="accordion-body">
                {/* Step 1 */}
                <p className="fw-semibold mb-1">Step 1: Domain Key</p>
                <div className="d-flex justify-content-between align-items-center border rounded p-2 mb-3">
                  <code>{user.public_key}</code>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => copyText(user.public_key)}
                    disabled={copied}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                {/* Step 2 */}
                <p className="fw-semibold mb-1">Step 2: Download the Plugin</p>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <a
                    href="https://metapusher.com/cdn/plugin/MetaPusher.zip"
                    className="btn btn-sm btn-purple"
                    download
                  >
                    Download Plugin
                  </a>

                  {/* <a href="#" className="text-decoration-none fw-semibold">
                    Verify Site
                  </a> */}
                </div>

                <div className="text-muted small mt-2">
                  💡 Note: We dont support gambling and fake websites.
                </div>
              </div>
            </div>
          </div>

          {/* ================= Manual Setup ================= */}
          <div className="accordion-item mt-3">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#manualSetup"
              >
               Option 2 <strong>&nbsp;&nbsp;&nbsp;Setup Manually</strong>  
              </button>
            </h2>

            <div
              id="manualSetup"
              className="accordion-collapse collapse"
              data-bs-parent="#integrationAccordion"
            >
              <div className="accordion-body">
                {/* Step 1 */}
                <p className="fw-semibold mb-4">
                  Step 1: Download the file and upload it to the root of your
                  website. Please rename it to <strong>sw.js</strong>
                </p>
                <div className="d-flex justify-content-between align-items-center mb-2">
     <button
  onClick={downloadSW}
  className="btn btn-sm btn-purple mb-4"
  disabled={downloading}
>
  {downloading ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Downloading...
    </>
  ) : (
    <>
      <i className="bi bi-download me-2"></i>
      Download sw.js
    </>
  )}
</button>
                 

                
                </div>
               

                {/* Step 2 */}
                <p className="fw-semibold mb-1">
                  Step 2: Copy this code and place it before the
                  <code> &lt;/head&gt; </code> tag
                </p>
                 <div className="d-flex justify-content-between align-items-center border rounded p-2 mb-3">
                  <code>{scriptCode}</code>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => copyText(scriptCode)}
                    disabled={copied}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  
                </div>
                {/* <div className="d-flex justify-content-end mt-2">
                  <a href="#" className="text-decoration-none fw-semibold">
                    Verify Site
                  </a>
                </div> */}

                <div className="text-muted small mt-2">
                  💡 Note: We dont support gambling and fake websites.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
