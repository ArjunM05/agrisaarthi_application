import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaGithub,
  FaLinkedin,
  FaInfoCircle,
  FaCode,
  FaTrophy,
  FaUsers,
  FaDatabase,
  FaEye,
  FaMobile,
  FaRoad,
} from "react-icons/fa";
import { GiWheat } from "react-icons/gi";
import logo from "../assets/logo-1.png";

const LearnMorePage: React.FC = () => {
  const teamMembers = [
    {
      name: "Sushmetha S R (Team Lead)",
      linkedin: "https://www.linkedin.com/in/sushmetha-sr/",
    },
    {
      name: "Abhinav Chaitanya R",
      linkedin: "https://www.linkedin.com/in/abhinav-chaitanya-r-799397286/",
    },
    {
      name: "Arjun M",
      linkedin: "https://www.linkedin.com/in/arjun-m-803677250/",
    },
    {
      name: "Harshavardhan S",
      linkedin: "https://www.linkedin.com/in/harshavardhan-s-b14220221/",
    },
    {
      name: "Kiranchandran H",
      linkedin: "https://www.linkedin.com/in/kiranchandran-h-b701aa251/",
    },
  ];

  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f6f2ed 0%, #e8f5e8 100%)",
      }}
    >
      <Container className="py-5">
        {/* Hero Banner */}
        <Card
          className="text-center mb-4 shadow-sm"
          style={{ borderLeft: "5px solid #198754" }}
        >
          <Card.Body className="p-5">
            <img
              src={logo}
              alt="AgroSaarthi Logo"
              className="mb-4"
              style={{ width: "120px", height: "120px", objectFit: "contain" }}
            />
            <h1 className="display-4 fw-bold text-success mb-3">AgroSaarthi</h1>
            <p className="lead text-muted">
              Empowering Farmers with AI-Powered Solutions
            </p>
          </Card.Body>
        </Card>

        {/* Problem Statement */}
        <Card
          className="mb-4 shadow-sm"
          style={{ borderLeft: "5px solid #198754" }}
        >
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-3">
              <FaInfoCircle
                className="me-3"
                style={{ color: "#198754", fontSize: "1.5rem" }}
              />
              <h3 className="fw-bold mb-0" style={{ color: "#198754" }}>
                The Challenge We're Addressing
              </h3>
            </div>
            <p className="text-muted">
              Day by day, more individuals are entering agriculture without
              formal training. These new-age farmers often struggle with making
              informed decisions about crop management and pest control.
              Traditional farmers face challenges in identifying emerging pests
              and selecting appropriate pesticides from a complex market.
            </p>
            <p className="text-muted">
              AgroSaarthi addresses these challenges through a mobile solution
              that provides AI-based pest diagnosis, pesticide recommendations,
              and connects farmers with nearby suppliers. We also provide
              localized weather updates to ensure farmers don't miss critical
              information.
            </p>
          </Card.Body>
        </Card>

        {/* Tech Stack */}
        <Card
          className="mb-4 shadow-sm"
          style={{ borderLeft: "5px solid #198754" }}
        >
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <FaCode
                className="me-3"
                style={{ color: "#198754", fontSize: "1.5rem" }}
              />
              <h3 className="fw-bold mb-0" style={{ color: "#198754" }}>
                Our Tech Stack
              </h3>
            </div>

            <Row className="g-3">
              <Col md={6}>
                <div
                  className="text-center p-3 rounded"
                  style={{ backgroundColor: "#F8F5FF" }}
                >
                  <FaMobile
                    className="mb-2"
                    style={{ color: "#198754", fontSize: "1.5rem" }}
                  />
                  <h6 className="fw-bold mb-1" style={{ color: "#198754" }}>
                    React Native
                  </h6>
                  <small className="text-muted">+ Expo</small>
                </div>
              </Col>
              <Col md={6}>
                <div
                  className="text-center p-3 rounded"
                  style={{ backgroundColor: "#F8F5FF" }}
                >
                  <FaCode
                    className="mb-2"
                    style={{ color: "#198754", fontSize: "1.5rem" }}
                  />
                  <h6 className="fw-bold mb-1" style={{ color: "#198754" }}>
                    Node.js
                  </h6>
                  <small className="text-muted">(Backend)</small>
                </div>
              </Col>
              <Col md={6}>
                <div
                  className="text-center p-3 rounded"
                  style={{ backgroundColor: "#F8F5FF" }}
                >
                  <FaDatabase
                    className="mb-2"
                    style={{ color: "#198754", fontSize: "1.5rem" }}
                  />
                  <h6 className="fw-bold mb-1" style={{ color: "#198754" }}>
                    Supabase
                  </h6>
                  <small className="text-muted">(Database)</small>
                </div>
              </Col>
              <Col md={6}>
                <div
                  className="text-center p-3 rounded"
                  style={{ backgroundColor: "#F8F5FF" }}
                >
                  <FaCode
                    className="mb-2"
                    style={{ color: "#198754", fontSize: "1.5rem" }}
                  />
                  <h6 className="fw-bold mb-1" style={{ color: "#198754" }}>
                    FastAPI
                  </h6>
                  <small className="text-muted">
                    (Deployed on <strong>TrueFoundry</strong>)
                  </small>
                </div>
              </Col>
              <Col md={12}>
                <div
                  className="text-center p-3 rounded"
                  style={{ backgroundColor: "#F8F5FF" }}
                >
                  <FaEye
                    className="mb-2"
                    style={{ color: "#198754", fontSize: "1.5rem" }}
                  />
                  <h6 className="fw-bold mb-1" style={{ color: "#198754" }}>
                    YOLOv11s
                  </h6>
                  <small className="text-muted">(AI Pest Detection)</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Hackathon Showcase */}
        <Card
          className="mb-4 shadow-sm"
          style={{ borderLeft: "5px solid #198754" }}
        >
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <FaTrophy
                className="me-3"
                style={{ color: "#198754", fontSize: "1.5rem" }}
              />
              <h3 className="fw-bold mb-0" style={{ color: "#198754" }}>
                Team Expendables @ Annam.AI Hackathon 2025
              </h3>
            </div>

            <div className="mb-3">
              <p className="text-muted mb-2">
                🚀 Built in 8 weeks as part of a full-time hackathon internship
              </p>
              <p className="text-muted mb-2">
                🏛️ Organized by IIT Ropar's Centre of Excellence in AI for
                Agriculture
              </p>
              <p className="text-muted mb-2">
                💡 Focus Areas: Pest Diagnosis, Crop Management, Market Access
              </p>
            </div>

            <div
              className="text-center p-4 rounded"
              style={{
                backgroundColor: "#F8F4FF",
                border: "1px solid #E9E0FF",
              }}
            >
              <div className="mb-3">
                <GiWheat style={{ color: "#198754", fontSize: "4rem" }} />
              </div>
              <h5 className="fw-bold" style={{ color: "#198754" }}>
                Transforming Indian Farming with AI
              </h5>
            </div>
          </Card.Body>
        </Card>

        {/* Future Works */}
        <Card
          className="mb-4 shadow-sm"
          style={{ borderLeft: "5px solid #198754" }}
        >
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <FaRoad
                className="me-3"
                style={{ color: "#198754", fontSize: "1.5rem" }}
              />
              <h3 className="fw-bold mb-0" style={{ color: "#198754" }}>
                Future Roadmap
              </h3>
            </div>

            <div className="mb-3">
              <p className="text-muted mb-2">
                • Integration of government agricultural schemes and subsidies
              </p>
              <p className="text-muted mb-2">
                • Development of supplier portal for complete marketplace
                functionality
              </p>
              <p className="text-muted mb-2">
                • SMS/MMS service for farmers without smartphones to access pest
                and pesticide information
              </p>
              <p className="text-muted mb-2">
                • E-commerce features including shopping cart and order
                management
              </p>
            </div>

            <p className="text-muted fst-italic">
              Our ultimate goal is to empower farmers with technology and
              knowledge to improve their livelihoods.
            </p>
          </Card.Body>
        </Card>

        {/* Team */}
        <Card
          className="mb-4 shadow-sm"
          style={{ borderLeft: "5px solid #198754" }}
        >
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <FaUsers
                className="me-3"
                style={{ color: "#198754", fontSize: "1.5rem" }}
              />
              <h3 className="fw-bold mb-0" style={{ color: "#198754" }}>
                Our Team
              </h3>
            </div>

            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="d-flex align-items-center p-2 rounded mb-2"
                style={{ cursor: "pointer", backgroundColor: "#F8F5FF" }}
                onClick={() => openLink(member.linkedin)}
              >
                <FaUsers className="me-3" style={{ color: "#198754" }} />
                <span
                  className="text-primary flex-grow-1"
                  style={{ color: "#198754" }}
                >
                  {member.name}
                </span>
                <FaLinkedin style={{ color: "#198754" }} />
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* Contact */}
        <Card
          className="mb-4 shadow-sm"
          style={{ borderLeft: "5px solid #198754" }}
        >
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-4">
              <FaCode
                className="me-3"
                style={{ color: "#198754", fontSize: "1.5rem" }}
              />
              <h3 className="fw-bold mb-0" style={{ color: "#198754" }}>
                Get the Code
              </h3>
            </div>

            <p className="text-muted mb-3">
              Note: The GitHub repository is private and accessible only to IIT
              Ropar and Expendables team members as per the NDA.
            </p>

            <Button
              variant="outline-primary"
              className="d-flex align-items-center justify-content-center mx-auto"
              style={{
                backgroundColor: "#F0E6FF",
                borderColor: "#198754",
                color: "#198754",
                maxWidth: "300px",
              }}
              onClick={() =>
                openLink(
                  "https://github.com/annam-ai-iitropar/team_18/tree/main"
                )
              }
            >
              <FaGithub className="me-2" />
              View on GitHub (Private)
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default LearnMorePage;
