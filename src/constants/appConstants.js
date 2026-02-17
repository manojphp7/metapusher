export const API_BASE_URL = "https://metapusher.com/api/";
export const SITE_URL = "https://metapusher.com/";
export const APP_NAME = "Meta Pusher";
export const MAX_FILE_SIZE = 5242880; // 5MB

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  GUEST: "guest",
};

export const API_ENDPOINTS = {
  Register: "register",
  VerifyEmail: 'verify-email', // Naya
  ResendVerification: 'resend-verification',

  ForgotPassword: "forgot-password",
  VerifyResetPassword: "verify-forgot-password",
  ResetPassword: "reset-password",
  
  
  Login: "login",
  Domains: "domains",
  FetchMeta: "fetch-meta",
  SendNotification: "send-notification",
  Campaigns: "campaigns",
  ChangePassword: "change-password",
  Balance: "balance",
  Transactions: "transactions",
  PaidCampaignDashboard: "paid-campaign-dashboard",
  AddFund: "add-fund",
  TrafficPackages: "traffic-packages",
  SendPaidNotification: "send-paid-notification",
};
