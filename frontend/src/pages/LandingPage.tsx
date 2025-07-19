import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/thug_logo.png";
import { Alert } from "react-bootstrap";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleLearnMore = () => {
    navigate("/learn-more");
  };

  const [showInstallPopup, setShowInstallPopup] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      setShowInstallPopup(true);
    }, 2000);

    // Auto-dismiss after 10 seconds
    const dismissTimer = setTimeout(() => {
      setShowInstallPopup(false);
    }, 12000); // 2 seconds + 10 seconds = 12 seconds total

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleInstall = () => {
    // Create a link element to download the file
    const link = document.createElement("a");
    link.href =
      "https://raw.githubusercontent.com/sushniaa/expendables/main/Week_1_Deliverables/Week-1_REPORT_Team-18.pdf";
    link.download = "agrisaarthi-app.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #f6f2ed 0%, #e8f5e8 100%)",
      }}
    >
      {showInstallPopup && (
        <div
          className="position-fixed top-0 start-0 w-100 d-flex justify-content-center"
          style={{ zIndex: 10000 }}
        >
          <Alert
            variant="success"
            className="mt-4 d-flex align-items-center justify-content-between p-3"
            style={{
              backgroundColor: "#d4edda",
              borderColor: "#c3e6cb",
              color: "#155724",
            }}
            onClose={() => setShowInstallPopup(false)}
          >
            <div className="text-center w-100 ">
              <span className="small d-block mb-2">
                <strong>Try our mobile app.</strong>
              </span>
              <div className="d-flex justify-content-center gap-2">
                <a
                  href="#"
                  className="text-decoration-none fw-bold "
                  onClick={(e) => {
                    e.preventDefault();
                    handleInstall();
                  }}
                >
                  Install ↓
                </a>
                <span className="text-muted">|</span>
                <a
                  href="#"
                  className="text-decoration-none text-muted"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowInstallPopup(false);
                  }}
                >
                  Maybe Later
                </a>
              </div>
            </div>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-12 text-center">
              {/* Logo */}
              <div className="mb-6">
                <img
                  src={logo}
                  alt="Welcome Logo"
                  className="img-fluid"
                  style={{
                    maxWidth: "300px",
                    height: "auto",
                    marginBottom: "30px",
                  }}
                />
              </div>

              {/* Title */}
              <h1
                className="display-4 fw-bold text-primary mb-3"
                style={{ color: "#800080" }}
              >
                Welcome to{"\n"}AgroSaarthi
              </h1>

              {/* Tagline */}
              <p
                className="lead text-muted mb-5"
                style={{ fontSize: "1.25rem" }}
              >
                Empowering Farmers with Tech
              </p>

              {/* Buttons */}
              <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mb-5">
                <button
                  className="btn btn-lg px-5 py-3 rounded-pill fw-medium"
                  style={{
                    backgroundColor: "#CDCAF7",
                    color: "#800080",
                    border: "none",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    minWidth: "200px",
                  }}
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
                <button
                  className="btn btn-lg px-5 py-3 rounded-pill fw-medium"
                  style={{
                    backgroundColor: "#CDCAF7",
                    color: "#800080",
                    border: "none",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    minWidth: "200px",
                  }}
                  onClick={handleLearnMore}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-muted">
        <p className="mb-0">
          &copy; 2025 AgriSaarthi. Connecting farmers and suppliers for a better
          tomorrow.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
