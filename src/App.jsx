import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import { useNavigate } from 'react-router-dom';

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

function App() {
  return (
    <AuthProvider>
      <Router basename="/app">
        <Routes>
          {/* Public Route - Login/Register */}
          <Route path="/login" element={<AuthPages />} />
          <Route path="/register" element={<AuthPages />} />
          <Route path="/auth" element={<AuthPages />} />
          <Route path="/forgot-password" element={<AuthPages />} />
          <Route path="/verify-email" element={<AuthPages />} />

          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Protected Routes - Dashboard & Other Pages */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="d-flex">
                  <LeftBar />
                  <div className="flex-grow-1">
                    <TopBar />
                    <Routes>
                      
                      <Route path="/" element={<Dashboard />} />
                                           
                      <Route path="/domains" element={<Domains />} />                      
                      <Route path="/domains/:id/integration" element={<DomainIntegration />} />
                      <Route path="/send-notification" element={<SendNotification />} />
                      <Route path="/campaigns" element={<Campaign />} /> 
                      <Route path="/settings" element={<Settings />} /> 
                      {/* Add more protected routes here */}


                      <Route path="/paid-dashboard" element={<PaidCampaignDashboard />} /> 
                      <Route path="/addFund" element={<AddFund />} /> 
                      <Route path="/paid-campaigns" element={<PaidCampaign />} /> 
                      <Route path="/traffic-packages" element={<TrafficPackages />} /> 
                      <Route path="/terms-conditions" element={<TermConditions />} /> 
                      <Route path="/send-paid-notification" element={<SendPaidNotification />} /> 

                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;