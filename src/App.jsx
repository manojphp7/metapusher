import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GeneralProvider } from "./context/GeneralContext";
import ProtectedRoute from "./ProtectedRoute";

import LeftBar from "./LeftBar";
import TopBar from "./TopBar";
import Dashboard from "./Dashboard";
import Domains from "./Domains";
import { AuthPages } from "./Auth";
import DomainIntegration from "./DomainIntegration";
import SendNotification from "./SendNotification";
import Campaign from "./Campaign";
import PaidCampaign from "./PaidCampaign";
import Settings from "./Settings";
import AddFund from "./AddFund";
import TrafficPackages from "./TrafficPackages";
import TermConditions from "./TermConditions";
import SendPaidNotification from "./SendPaidNotification";
import PaidCampaignDashboard from "./PaidCampaignDashboard";
import ResetPassword from "./ResetPassword";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <LeftBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-grow-1" style={{ minWidth: 0, width: '100%' }}>
        <TopBar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <GeneralProvider>
    <AuthProvider>
      <Router basename="/app">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<AuthPages />} />
          <Route path="/register" element={<AuthPages />} />
          <Route path="/auth" element={<AuthPages />} />
          <Route path="/forgot-password" element={<AuthPages />} />
          <Route path="/verify-email" element={<AuthPages />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/domains" element={<Domains />} />
                    <Route path="/domains/:id/integration" element={<DomainIntegration />} />
                    <Route path="/send-notification" element={<SendNotification />} />
                    <Route path="/campaigns" element={<Campaign />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/paid-dashboard" element={<PaidCampaignDashboard />} />
                    <Route path="/addFund" element={<AddFund />} />
                    <Route path="/paid-campaigns" element={<PaidCampaign />} />
                    <Route path="/traffic-packages" element={<TrafficPackages />} />
                    <Route path="/terms-conditions" element={<TermConditions />} />
                    <Route path="/send-paid-notification" element={<SendPaidNotification />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </GeneralProvider>
  );
}

export default App;