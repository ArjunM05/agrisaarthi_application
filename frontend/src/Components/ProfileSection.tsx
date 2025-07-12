// components/ProfileSection.tsx
import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  email: string;
  role: string;
  name: string;
  phone: string;
  district: string;
};

type FarmerDetails = {
  farm_size?: number;
  main_crop?: string;
  irrigation_type?: string;
};

type SupplierDetails = {
  shop_name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  approved?: boolean;
  service_areas?: string[];
};

type AdditionalInfo = FarmerDetails | SupplierDetails;

const ProfileSection: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({});
  const [editMode, setEditMode] = useState<{
    basic: boolean;
    additional: boolean;
  }>({ basic: false, additional: false });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editAdditional, setEditAdditional] = useState<AdditionalInfo>({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const userRole = localStorage.getItem("user_type");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  // Type guards
  const isFarmerDetails = (info: AdditionalInfo): info is FarmerDetails => {
    return userRole === "farmer";
  };

  const isSupplierDetails = (info: AdditionalInfo): info is SupplierDetails => {
    return userRole === "supplier";
  };

  // Fetch user data from localStorage and backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Get basic info from localStorage
        console.log("localStorage values:", {
          userId,
          email: localStorage.getItem("user_email"),
          role: localStorage.getItem("user_type"),
          name: localStorage.getItem("user_name"),
          phone: localStorage.getItem("user_phone"),
          district: localStorage.getItem("user_district"),
        });

        // Check if user is logged in
        const userEmail = localStorage.getItem("user_email");
        const userRole = localStorage.getItem("user_type");

        if (!userEmail || !userRole) {
          console.error("User not logged in - missing email or role");
          setLoading(false);
          return;
        }

        const userData: User = {
          id: userId || "",
          email: userEmail,
          role: userRole,
          name: localStorage.getItem("user_name") || "",
          phone: localStorage.getItem("user_phone") || "",
          district: localStorage.getItem("user_district") || "",
        };
        setUser(userData);
        setEditUser(userData);

        // Fetch additional info from backend
        if (userId && userId !== "undefined" && userId !== "null") {
          const response = await fetch(
            `http://localhost:5001/user_info/${userId}`
          );
          if (response.ok) {
            const userInfo = await response.json();
            if (userInfo.details) {
              setAdditionalInfo(userInfo.details);
              setEditAdditional(userInfo.details);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Check for incomplete fields
  useEffect(() => {
    if (additionalInfo) {
      const hasEmpty = Object.values(additionalInfo).some((v) => !v);
      setShowAlert(hasEmpty);
    }
  }, [additionalInfo]);

  const handleViewHistory = () => {
    navigate("/farmer/supplier-history");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/delete_account/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Clear localStorage
        localStorage.clear();
        // Navigate to login page
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(
          `Failed to delete account: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleEdit = (section: "basic" | "additional") => {
    setEditMode({ ...editMode, [section]: true });
  };

  const handleCancel = (section: "basic" | "additional") => {
    setEditMode({ ...editMode, [section]: false });
    if (section === "basic" && user) {
      setEditUser(user);
    } else {
      setEditAdditional(additionalInfo);
    }
  };

  const handleSave = async (section: "basic" | "additional") => {
    if (!user) return;

    setSaveLoading(true);
    try {
      if (section === "basic") {
        // Update basic info
        const response = await fetch(
          `http://localhost:5001/update_profile/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: editUser?.name,
              phone: editUser?.phone,
              district: editUser?.district,
            }),
          }
        );

        if (response.ok) {
          // Update localStorage
          localStorage.setItem("user_name", editUser?.name || "");
          localStorage.setItem("user_phone", editUser?.phone || "");
          localStorage.setItem("user_district", editUser?.district || "");

          setUser(editUser);
          setEditMode({ ...editMode, basic: false });
        } else {
          alert("Failed to update basic info");
        }
      } else {
        // Update additional info based on user type
        if (userRole === "farmer") {
          const farmerDetails = editAdditional as FarmerDetails;
          const response = await fetch(
            `http://localhost:5001/farmer_details/${user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                farmSize: farmerDetails.farm_size,
                main_crop: farmerDetails.main_crop,
                irrigation_type: farmerDetails.irrigation_type,
              }),
            }
          );

          if (response.ok) {
            setAdditionalInfo(editAdditional);
            setEditMode({ ...editMode, additional: false });
          } else {
            alert("Failed to update farmer details");
          }
        } else if (userRole === "supplier") {
          const supplierDetails = editAdditional as SupplierDetails;
          const response = await fetch(
            `http://localhost:5001/supplier_details/${user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                shopName: supplierDetails.shop_name,
                address: supplierDetails.address,
                latitude: supplierDetails.latitude,
                longitude: supplierDetails.longitude,
                approved: supplierDetails.approved,
                service_areas: supplierDetails.service_areas,
              }),
            }
          );

          if (response.ok) {
            setAdditionalInfo(editAdditional);
            setEditMode({ ...editMode, additional: false });
          } else {
            alert("Failed to update supplier details");
          }
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save changes");
    } finally {
      setSaveLoading(false);
    }
  };

  // Handlers for input changes
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editUser) {
      setEditUser({ ...editUser, [e.target.name]: e.target.value });
    }
  };

  const handleAdditionalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === "number") {
      parsedValue = parseFloat(value) || 0;
    } else if (name === "approved") {
      parsedValue = value === "Yes";
    } else if (name === "service_areas") {
      // Convert comma-separated string to array
      parsedValue = value
        .split(",")
        .map((area: string) => area.trim())
        .filter((area: string) => area.length > 0);
    }

    setEditAdditional({ ...editAdditional, [name]: parsedValue });
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

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  const isLoggedIn =
    localStorage.getItem("user_email") && localStorage.getItem("user_type");

  if (!user || !isLoggedIn) {
    return (
      <div className="container">
        <Alert variant="danger">
          User data not found. Please make sure you are logged in.
          <br />
          <small className="text-muted">
            Debug info: Email: {localStorage.getItem("user_email") || "not set"}
            , Role: {localStorage.getItem("user_type") || "not set"}
          </small>
        </Alert>
      </div>
    );
  }

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
                  <strong>Name:</strong>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="name"
                  value={editUser?.name || ""}
                  onChange={handleUserChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label mb-0">
                  <strong>Email:</strong>
                </label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  name="email"
                  value={editUser?.email || ""}
                  disabled
                />
              </div>
              <div className="mb-2">
                <label className="form-label mb-0">
                  <strong>Phone:</strong>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="phone"
                  value={editUser?.phone || ""}
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
                  value={editUser?.role || ""}
                  disabled
                />
              </div>
              <div className="mb-2">
                <label className="form-label mb-0">
                  <strong>District:</strong>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="district"
                  value={editUser?.district || ""}
                  onChange={handleUserChange}
                />
              </div>
              <div className="d-flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleSave("basic")}
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCancel("basic")}
                  disabled={saveLoading}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>District:</strong> {user.district}
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
              {userRole === "farmer" ? (
                <>
                  <div className="mb-2">
                    <label className="form-label mb-0">
                      <strong>Farm Size (acres):</strong>
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      name="farm_size"
                      value={
                        isFarmerDetails(editAdditional)
                          ? editAdditional.farm_size || ""
                          : ""
                      }
                      onChange={handleAdditionalChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label mb-0">
                      <strong>Main Crop:</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="main_crop"
                      value={
                        isFarmerDetails(editAdditional)
                          ? editAdditional.main_crop || ""
                          : ""
                      }
                      onChange={handleAdditionalChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label mb-0">
                      <strong>Irrigation Type:</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="irrigation_type"
                      value={
                        isFarmerDetails(editAdditional)
                          ? editAdditional.irrigation_type || ""
                          : ""
                      }
                      onChange={handleAdditionalChange}
                    />
                  </div>
                </>
              ) : userRole === "supplier" ? (
                <>
                  <div className="mb-2">
                    <label className="form-label mb-0">
                      <strong>Shop Name:</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="shop_name"
                      value={
                        isSupplierDetails(editAdditional)
                          ? editAdditional.shop_name || ""
                          : ""
                      }
                      onChange={handleAdditionalChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label mb-0">
                      <strong>Address:</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="address"
                      value={
                        isSupplierDetails(editAdditional)
                          ? editAdditional.address || ""
                          : ""
                      }
                      onChange={handleAdditionalChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label mb-0">
                      <strong>Latitude:</strong>
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control form-control-sm"
                      name="latitude"
                      value={
                        isSupplierDetails(editAdditional)
                          ? editAdditional.latitude || ""
                          : ""
                      }
                      onChange={handleAdditionalChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label mb-0">
                      <strong>Longitude:</strong>
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="form-control form-control-sm"
                      name="longitude"
                      value={
                        isSupplierDetails(editAdditional)
                          ? editAdditional.longitude || ""
                          : ""
                      }
                      onChange={handleAdditionalChange}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label mb-0">
                      <strong>Approved:</strong>
                    </label>
                    <select
                      className="form-control form-control-sm"
                      name="approved"
                      value={
                        isSupplierDetails(editAdditional)
                          ? editAdditional.approved
                            ? "Yes"
                            : "No"
                          : "No"
                      }
                      onChange={handleAdditionalChange}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label mb-0">
                      <strong>Service Areas:</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="service_areas"
                      value={
                        isSupplierDetails(editAdditional) &&
                        Array.isArray(editAdditional.service_areas)
                          ? editAdditional.service_areas.join(", ")
                          : ""
                      }
                      onChange={handleAdditionalChange}
                      placeholder="Enter areas separated by commas"
                    />
                  </div>
                </>
              ) : null}
              <div className="d-flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleSave("additional")}
                  disabled={saveLoading}
                >
                  {saveLoading ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCancel("additional")}
                  disabled={saveLoading}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              {userRole === "farmer" ? (
                <>
                  <p>
                    <strong>Farm Size:</strong>{" "}
                    {isFarmerDetails(additionalInfo) &&
                    additionalInfo.farm_size ? (
                      `${additionalInfo.farm_size} acres`
                    ) : (
                      <span className="text-muted">Please enter details</span>
                    )}
                  </p>
                  <p>
                    <strong>Main Crop:</strong>{" "}
                    {(isFarmerDetails(additionalInfo) &&
                      additionalInfo.main_crop) || (
                      <span className="text-muted">Please enter details</span>
                    )}
                  </p>
                  <p>
                    <strong>Irrigation Type:</strong>{" "}
                    {(isFarmerDetails(additionalInfo) &&
                      additionalInfo.irrigation_type) || (
                      <span className="text-muted">Please enter details</span>
                    )}
                  </p>
                </>
              ) : userRole === "supplier" ? (
                <>
                  <p>
                    <strong>Shop Name:</strong>{" "}
                    {(isSupplierDetails(additionalInfo) &&
                      additionalInfo.shop_name) || (
                      <span className="text-muted">Please enter details</span>
                    )}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {(isSupplierDetails(additionalInfo) &&
                      additionalInfo.address) || (
                      <span className="text-muted">Please enter details</span>
                    )}
                  </p>
                  <p>
                    <strong>Latitude:</strong>{" "}
                    {(isSupplierDetails(additionalInfo) &&
                      additionalInfo.latitude) || (
                      <span className="text-muted">Please enter details</span>
                    )}
                  </p>
                  <p>
                    <strong>Longitude:</strong>{" "}
                    {(isSupplierDetails(additionalInfo) &&
                      additionalInfo.longitude) || (
                      <span className="text-muted">Please enter details</span>
                    )}
                  </p>
                  <p>
                    <strong>Approved:</strong>{" "}
                    {isSupplierDetails(additionalInfo) &&
                    additionalInfo.approved !== undefined ? (
                      additionalInfo.approved ? (
                        "Yes"
                      ) : (
                        "No"
                      )
                    ) : (
                      <span className="text-muted">Please enter details</span>
                    )}
                  </p>
                  <p>
                    <strong>Service Areas:</strong>{" "}
                    {isSupplierDetails(additionalInfo) &&
                    Array.isArray(additionalInfo.service_areas) &&
                    additionalInfo.service_areas.length > 0 ? (
                      additionalInfo.service_areas.join(", ")
                    ) : (
                      <span className="text-muted">Please enter details</span>
                    )}
                  </p>
                </>
              ) : null}
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

      {/* Delete Account Button */}
      <div className="text-center mt-4">
        <Button
          className="btn-md btn-danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
          <p className="text-muted small">
            This will permanently delete all your data including profile
            information, history, and any associated records.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete Account"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileSection;
