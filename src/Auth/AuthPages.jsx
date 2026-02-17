import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";  // ✅ useLocation add kiya
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL, API_ENDPOINTS,SITE_URL } from "../constants/appConstants";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import EmailVerification from "./EmailVerification";
import usePageTitle from "../hooks/usePageTitle";
import "./AuthPages.css";


const AuthPages = () => {
  const navigate = useNavigate();
  const location = useLocation();  // ✅ current route milega
  const { login } = useAuth();

  // ✅ Route ke hisaab se initial state set ho rahi hai
  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");
  const [isForgot, setIsForgot] = useState(location.pathname === "/forgot-password");
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(location.pathname === "/verify-email");


  const getPageTitle = () => {
    if (showEmailSent && !isForgot) return "Verify Email";
    if (isForgot && !isResetEmailSent) return "Forgot Password";
    if (isForgot && isResetEmailSent) return "Reset Email Sent";
    if (isLogin) return "Login";
    return "Register";
  };

  usePageTitle(getPageTitle()); 


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    countryCode: "+91",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Popular country codes with flags
  const countryCodes = [
    { code: "+91", country: "in", name: "India" },
    { code: "+1", country: "us", name: "USA" },
    { code: "+44", country: "gb", name: "UK" },
    { code: "+971", country: "ae", name: "UAE" },
    { code: "+61", country: "au", name: "Australia" },
    { code: "+81", country: "jp", name: "Japan" },
    { code: "+86", country: "cn", name: "China" },
    { code: "+49", country: "de", name: "Germany" },
    { code: "+33", country: "fr", name: "France" },
    { code: "+7", country: "ru", name: "Russia" },
    { code: "+55", country: "br", name: "Brazil" },
    { code: "+27", country: "za", name: "South Africa" },
    { code: "+82", country: "kr", name: "South Korea" },
    { code: "+65", country: "sg", name: "Singapore" },
    { code: "+60", country: "my", name: "Malaysia" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill all required fields");
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Please enter your name");
        return;
      }
      if (!formData.mobile) {
        setError("Please enter your mobile number");
        return;
      }
      if (formData.mobile.length < 10) {
        setError("Please enter a valid mobile number");
        return;
      }
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const endpoint = isLogin
      ? `${API_BASE_URL}${API_ENDPOINTS.Login}`
      : `${API_BASE_URL}${API_ENDPOINTS.Register}`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.countryCode + formData.mobile,
        };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status === "success") {
        if (isLogin) {
          setSuccess("Login successful! Redirecting...");

          const userData = result.data.user;
          const authToken = result.data.token;

          login(userData, authToken);

          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          // Registration successful - show email verification screen
          setShowEmailSent(true);
        }
      } else {
        setError(result.message || "Something went wrong!");
      }
    } catch (err) {
      setError("Network error. Please check if backend is running.");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      countryCode: "+91",
      mobile: "",
    });
    setError("");
    setSuccess("");
    setIsForgot(false);
    setIsResetEmailSent(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {!showEmailSent && !isForgot ? (
          <>
            <div className="auth-header">
              <div className="brand-logo">
                <a href={`${SITE_URL}`}><img src={`${process.env.PUBLIC_URL}/logo.jpg`} className="login-logo" alt="Logo" /></a>
              </div>
              <p className="auth-subtitle">
                {isLogin
                  ? "Welcome back! Please login to continue."
                  : "Create your account to get started."}
              </p>
            </div>

            <div>
              {isLogin ? (
                <Login
                  formData={formData}
                  handleChange={handleChange}
                  handleKeyPress={handleKeyPress}
                  error={error}
                  success={success}
                  loading={loading}
                  handleSubmit={handleSubmit}
                  setIsForgot={setIsForgot}
                  setError={setError}
                  setSuccess={setSuccess}
                />
              ) : (
                <Register
                  formData={formData}
                  handleChange={handleChange}
                  handleKeyPress={handleKeyPress}
                  error={error}
                  success={success}
                  loading={loading}
                  handleSubmit={handleSubmit}
                  countryCodes={countryCodes}
                />
              )}
            </div>

            <div className="auth-footer">
              <p>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <span
                  className="toggle-link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    // ✅ URL bhi update hogi jab toggle karo
                    navigate(isLogin ? "/register" : "/login");
                    resetForm();
                  }}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </span>
              </p>
            </div>
          </>
        ) : isForgot && !isResetEmailSent ? (
          <ForgotPassword
            formData={formData}
            handleChange={handleChange}
            error={error}
            success={success}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            setSuccess={setSuccess}
            setIsResetEmailSent={setIsResetEmailSent}
            setIsForgot={setIsForgot}
            setFormData={setFormData}
          />
        ) : (
          <EmailVerification
            formData={formData}
            isForgot={isForgot}
            error={error}
            success={success}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            setSuccess={setSuccess}
            setShowEmailSent={setShowEmailSent}
            setIsForgot={setIsForgot}
            setIsResetEmailSent={setIsResetEmailSent}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPages;