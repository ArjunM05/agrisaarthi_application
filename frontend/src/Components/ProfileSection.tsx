// components/ProfileSection.tsx
import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type User = {
  email: string;
  role: string;
  name: string;
};

type AdditionalInfo = {
  address?: string;
  phone?: string;
  landSize?: string;
  [key: string]: any;
};

type ProfileSectionProps = {
  user: User;
  additionalInfo: AdditionalInfo;
};

const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  additionalInfo,
}) => {
  const [showAlert, setShowAlert] = useState(false);

  const userRole = localStorage.getItem("user_type");

  const navigate = useNavigate();

  useEffect(() => {
    const hasEmpty = Object.values(additionalInfo).some((v) => !v);
    setShowAlert(hasEmpty);
  }, [additionalInfo]);

  // State for editing
  const [editMode, setEditMode] = useState<{
    basic: boolean;
    additional: boolean;
  }>({ basic: false, additional: false });
  const [editUser, setEditUser] = useState<User>(user);
  const [editAdditional, setEditAdditional] =
    useState<AdditionalInfo>(additionalInfo);

  useEffect(() => {
    setEditUser(user);
    setEditAdditional(additionalInfo);
  }, [user, additionalInfo]);

  const handleViewHistory = () => {
    navigate("/farmer/supplier-history");
  };

  const handleEdit = (section: "basic" | "additional") =>
    setEditMode({ ...editMode, [section]: true });
  const handleCancel = (section: "basic" | "additional") => {
    setEditMode({ ...editMode, [section]: false });
    setEditUser(user);
    setEditAdditional(additionalInfo);
  };
  const handleSave = (section: "basic" | "additional") => {
    if (section === "basic") {
      // Would call parent update here
      setEditMode({ ...editMode, basic: false });
    } else {
      setEditMode({ ...editMode, additional: false });
    }
  };

  // Handlers for input changes
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };
  const handleAdditionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditAdditional({ ...editAdditional, [e.target.name]: e.target.value });
  };

  const renderHistoryCard = (
    title: string,
    items: { name: string; detail: string }[]
  ) => (
    <Card className="mb-3 flex-fill">
      <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
        <span className="fs-5">{title}</span>
        <a
          href="#"
          className="text-decoration-none small"
          onClick={handleViewHistory}
        >
          View full history &rarr;
        </a>
      </Card.Header>
      <Card.Body>
        {items.map((item, index) => (
          <div key={index} className="d-flex justify-content-between mb-2">
            <span>{item.name}</span>
            <span className="text-muted">{item.detail}</span>
          </div>
        ))}
      </Card.Body>
    </Card>
  );

  return (
    <div className="container">
      {showAlert && (
        <Alert
          variant="warning"
          className="position-sticky top-0 z-3"
          dismissible
          onClose={() => setShowAlert(false)}
        >
          Some fields in your profile are incomplete. Please update them.
        </Alert>
      )}

      {/* Basic Info Card */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
          <span className="fs-4">Basic Info</span>
          {!editMode.basic && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEdit("basic")}
            >
              Edit
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {editMode.basic ? (
            <>
              <div className="mb-2">
                <label className="form-label mb-0">
                  <strong>Email:</strong>
                </label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  name="email"
                  value={editUser.email}
                  onChange={handleUserChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label mb-0">
                  <strong>Name:</strong>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="name"
                  value={editUser.name}
                  onChange={handleUserChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label mb-0">
                  <strong>Role:</strong>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="role"
                  value={editUser.role}
                  onChange={handleUserChange}
                  disabled
                />
              </div>
              <div className="d-flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleSave("basic")}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCancel("basic")}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>Email:</strong> {editUser.email}
              </p>
              <p>
                <strong>Name:</strong> {editUser.name}
              </p>
              <p>
                <strong>Role:</strong> {editUser.role}
              </p>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Additional Info */}
      <Card className="mb-4 shadow-sm">
        <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
          <span className="fs-4">Additional Info</span>
          {!editMode.additional && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEdit("additional")}
            >
              Edit
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {editMode.additional ? (
            <>
              {Object.entries(editAdditional).map(([key, value]) => (
                <div className="mb-2" key={key}>
                  <label className="form-label mb-0">
                    <strong>{key}:</strong>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name={key}
                    value={value}
                    onChange={handleAdditionalChange}
                  />
                </div>
              ))}
              <div className="d-flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleSave("additional")}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCancel("additional")}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              {Object.entries(editAdditional).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong>{" "}
                  {value || <span className="text-muted">Not Provided</span>}
                </p>
              ))}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Extra Cards for Farmer */}
      {userRole === "farmer" && (
        <Row className="gy-3">
          <Col md={6}>
            {renderHistoryCard("Pest History", [
              { name: "Rice Leaf Roller", detail: "Chlorpyrifos" },
              { name: "Stem Borer", detail: "Cartap Hydrochloride" },
            ])}
          </Col>
          <Col md={6}>
            {renderHistoryCard("Suppliers Contacted", [
              { name: "Suresh Agro", detail: "1 day ago" },
              { name: "Green Grow", detail: "3 days ago" },
            ])}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ProfileSection;
