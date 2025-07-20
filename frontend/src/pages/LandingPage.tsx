import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  Leaf,
  CloudSun,
  People,
  ShieldCheck,
  ArrowRight,
  Download,
  X,
} from "react-bootstrap-icons";
import logo from "../assets/thug_logo.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate content on load
    setIsVisible(true);

    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setShowInstallPopup(true);
    }, 3000);

    // Auto-dismiss after 15 seconds
    const dismissTimer = setTimeout(() => {
      setShowInstallPopup(false);
    }, 18000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleLearnMore = () => {
    navigate("/learn-more");
  };

  const handleInstall = () => {
    // Convert Google Drive sharing link to direct download link
    const driveId = "1TRSKaq04Xw9fRy9nxZbbXcWvkWUxk2_p";
    const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;

    const link = document.createElement("a");
    link.href = directDownloadUrl;
    link.download = "Agrosaarthi.apk";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const features = [
    {
      icon: <Leaf className="text-success" size={40} />,
      title: "Smart Pest Detection",
      description: "AI-powered pest identification for better crop management",
    },
    {
      icon: <CloudSun className="text-info" size={40} />,
      title: "Weather Insights",
      description: "Real-time weather data and forecasts for your location",
    },
    {
      icon: <People className="text-primary" size={40} />,
      title: "Connect with Suppliers",
      description: "Direct access to verified pesticide suppliers",
    },
    {
      icon: <ShieldCheck className="text-warning" size={40} />,
      title: "Expert Guidance",
      description: "Professional advice and best practices for farming",
    },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column position-relative">
      {/* Dynamic Background */}
      <div
        className="position-absolute w-100 h-100"
        style={{
          background:
            "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 20s ease infinite",
        }}
      />

      {/* Install Popup - Fixed positioning at top right */}
      {showInstallPopup && (
        <div
          className="position-fixed top-20 end-0 translate-middle-x mb-4"
          style={{ zIndex: 1050 }}
        >
          <Alert
            variant="success"
            className="shadow-lg border-0 rounded-3"
            style={{
              backgroundColor: "rgba(212, 237, 218, 0.95)",
              backdropFilter: "blur(10px)",
              minWidth: "300px",
              maxWidth: "400px",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <Download className="text-success" size={24} />
                <div>
                  <div className="fw-bold text-success mb-1">
                    Try our mobile app
                  </div>
                  <div className="small text-muted">
                    Enhanced experience on mobile
                  </div>
                </div>
              </div>
              <Button
                variant="link"
                className="text-muted p-0"
                onClick={() => setShowInstallPopup(false)}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="d-flex gap-2 mt-3">
              <Button
                variant="success"
                size="sm"
                className="flex-fill"
                onClick={handleInstall}
              >
                Install App
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowInstallPopup(false)}
              >
                Later
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow-1 d-flex align-items-center position-relative">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={10} md={12}>
              {/* Hero Section */}
              <div
                className={`text-center mb-5 ${
                  isVisible ? "animate__animated animate__fadeIn" : "opacity-0"
                }`}
              >
                {/* Logo with animation */}
                <div className="mb-4">
                  <img
                    src={logo}
                    alt="AgroSaarthi Logo"
                    className="img-fluid"
                    style={{
                      maxWidth: "280px",
                      height: "auto",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                </div>

                {/* Main Title */}
                <h1 className="display-3 fw-bold text-primary mb-3">
                  Welcome to <span className="text-success">AgroSaarthi</span>
                </h1>

                {/* Subtitle */}
                <p className="lead text-muted mb-4 fs-4">
                  Empowering Farmers with{" "}
                  <span className="text-primary fw-semibold">
                    Smart Technology
                  </span>
                </p>

                {/* Description */}
                <p className="text-muted mb-5 fs-5">
                  Connect with suppliers, detect pests with AI, and get
                  real-time weather insights to optimize your farming practices.
                </p>

                {/* CTA Buttons */}
                <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mb-5">
                  <Button
                    variant="success"
                    size="lg"
                    className="px-5 py-3 rounded-pill fw-semibold shadow-sm"
                    onClick={handleGetStarted}
                    style={{ minWidth: "200px" }}
                  >
                    Get Started <ArrowRight className="ms-2" />
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="px-5 py-3 rounded-pill fw-semibold"
                    onClick={handleLearnMore}
                    style={{ minWidth: "200px" }}
                  >
                    Learn More
                  </Button>
                </div>
              </div>

              {/* Features Section */}
              <div
                className={`mt-5 ${
                  isVisible ? "animate__animated animate__fadeIn" : "opacity-0"
                }`}
              >
                <Row className="g-4">
                  {features.map((feature, index) => (
                    <Col lg={3} md={6} key={index}>
                      <Card
                        className="h-100 border-0 shadow-sm text-center"
                        style={{
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 12px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 4px rgba(0,0,0,0.05)";
                        }}
                      >
                        <Card.Body className="p-4">
                          <div className="mb-3">{feature.icon}</div>
                          <Card.Title className="h5 fw-bold mb-2">
                            {feature.title}
                          </Card.Title>
                          <Card.Text className="text-muted small">
                            {feature.description}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-muted position-relative">
        <Container>
          <p className="mb-0">
            &copy; 2025 AgriSaarthi. Connecting farmers and suppliers for a
            better tomorrow.
          </p>
        </Container>
      </footer>

      {/* Custom CSS for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `,
        }}
      />
    </div>
  );
};

export default LandingPage;
