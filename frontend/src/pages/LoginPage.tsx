import LoginHeader from "../Components/LoginHeader";
import LoginForm from "../Components/LoginForm";
import { useState, useEffect } from "react";
import { Alert, Button } from "react-bootstrap";
import { FaDownload, FaTimes } from "react-icons/fa";

const LoginPage = () => {
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
    const link = document.createElement('a');
    link.href = 'https://raw.githubusercontent.com/sushniaa/expendables/main/Week_1_Deliverables/Week-1_REPORT_Team-18.pdf';
    link.download = 'agrisaarthi-app.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)",
      }}
    >
      <LoginHeader />

      {/* Install App Popup */}
      {showInstallPopup && (
        <div
          className="position-fixed top-0 start-0 w-100 d-flex justify-content-center"
          style={{ zIndex: 10000 }}
        >
          <Alert 
            variant="success" 
            className="mt-4 d-flex align-items-center justify-content-between p-3"
            style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' }}
           
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

      <main className="container py-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 200px)" }}
        >
          <LoginForm />
        </div>
      </main>

      <footer className="text-center py-4 text-muted">
        <p className="mb-0">
          &copy; 2025 AgriSaarthi. Connecting farmers and suppliers for a better
          tomorrow.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
