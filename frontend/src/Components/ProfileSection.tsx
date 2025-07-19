// components/ProfileSection.tsx
import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Row,
  Col,
  Modal,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  soil_type?: string;
};

type SupplierDetails = {
  shop_name?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  approved?: boolean;
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
  const [supplierHistory, setSupplierHistory] = useState<any[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  // Alert states for cards
  const [basicInfoAlert, setBasicInfoAlert] = useState<{
    message: string;
    variant: "success" | "danger" | "warning" | "info";
  } | null>(null);
  const [additionalInfoAlert, setAdditionalInfoAlert] = useState<{
    message: string;
    variant: "success" | "danger" | "warning" | "info";
  } | null>(null);
  const [pestHistory, setPestHistory] = useState<any[]>([]);

  // Auto-dismiss alerts after 1.5 seconds
  useEffect(() => {
    if (basicInfoAlert) {
      const timer = setTimeout(() => setBasicInfoAlert(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [basicInfoAlert]);

  useEffect(() => {
    if (additionalInfoAlert) {
      const timer = setTimeout(() => setAdditionalInfoAlert(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [additionalInfoAlert]);

  const userRole = localStorage.getItem("user_type");
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  // Toast helper
  const showToast = (
    title: string,
    message: string,
    variant: "success" | "danger" | "info" = "success"
  ) => {
    setToast({ show: true, message: `${title}: ${message}`, variant });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
  };

  // Type guards
  const isFarmerDetails = (
    details: AdditionalInfo
  ): details is FarmerDetails => {
    return (details as FarmerDetails).farm_size !== undefined;
  };

  const isSupplierDetails = (
    details: AdditionalInfo
  ): details is SupplierDetails => {
    return (details as SupplierDetails).shop_name !== undefined;
  };

  // Fetch user data from localStorage and backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Get basic info from localStorage

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
            `https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/user_info/${userId}`
          );
          if (response.ok) {
            const userInfo = await response.json();
            if (userInfo.details) {
              setAdditionalInfo(userInfo.details);
              setEditAdditional(userInfo.details);
            }
          }

          // Fetch supplier history for farmers
          if (userRole === "farmer") {
            try {
              const historyResponse = await fetch(
                `https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/last_contacted_suppliers/${userId}`
              );
              if (historyResponse.ok) {
                const historyData = await historyResponse.json();
                if (historyData.contacts && historyData.contacts.length > 0) {
                  // Take only the last 2 contacts
                  const lastTwoContacts = historyData.contacts.slice(0, 2);
                  setSupplierHistory(lastTwoContacts);
                }
              }
            } catch (error) {
              console.error("Error fetching supplier history:", error);
            }
          }

          // Fetch pest history for farmers
          if (
            userRole === "farmer" &&
            userId &&
            userId !== "undefined" &&
            userId !== "null"
          ) {
            try {
              const pestResponse = await fetch(
                `https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/pest_history/${userId}`
              );
              if (pestResponse.ok) {
                const pestData = await pestResponse.json();
                if (pestData.history && pestData.history.length > 0) {
                  setPestHistory(pestData.history.slice(0, 2));
                }
              }
            } catch (error) {
              console.error("Error fetching pest history:", error);
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
      const hasEmpty = Object.values(additionalInfo).some(
        (v) =>
          v === null ||
          v === undefined ||
          (typeof v === "string" && v.trim() === "")
      );
      setShowAlert(hasEmpty);
    }
  }, [additionalInfo]);

  const handleViewHistory = () => {
    navigate("/farmer/supplier-history");
  };

  const handleViewPestHistory = () => {
    navigate("/farmer/pest-history");
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    // Validation
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      showToast("Error", "Please fill in all password fields", "danger");

      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Error", "New passwords do not match", "danger");
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch(`https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/update_password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          old_password: passwordData.oldPassword,
          new_password: passwordData.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        showToast(
          "Success",
          "Password updated successfully! You will be logged out.",
          "success"
        );
        setShowPasswordModal(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswords({
          oldPassword: false,
          newPassword: false,
          confirmPassword: false,
        });
        // Logout after successful password change
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 2000);
      } else {
        showToast(
          "Error",
          data.message || "Failed to update password",
          "danger"
        );
      }
    } catch (error) {
      console.error("Error updating password:", error);
      showToast(
        "Error",
        "Failed to update password. Please try again.",
        "danger"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(
        `https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/delete_account/${user.id}`,
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
        setAdditionalInfoAlert({
          message: `Failed to delete account: ${
            errorData.error || "Unknown error"
          }`,
          variant: "danger",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setAdditionalInfoAlert({
        message: "Failed to delete account. Please try again.",
        variant: "danger",
      });
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
          `https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/update_profile/${user.id}`,
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

        const data = await response.json();
        if (response.ok && data.message === "No changes made") {
          setBasicInfoAlert({
            message: "No changes were made to your details.",
            variant: "info",
          });
        } else if (response.ok) {
          // Update localStorage
          localStorage.setItem("user_name", editUser?.name || "");
          localStorage.setItem("user_phone", editUser?.phone || "");
          localStorage.setItem("user_district", editUser?.district || "");

          setUser(editUser);
          setEditMode({ ...editMode, basic: false });
          setBasicInfoAlert({
            message: "Basic info updated successfully!",
            variant: "success",
          });
        } else {
          setBasicInfoAlert({
            message: "Failed to update basic info",
            variant: "danger",
          });
        }
      } else {
        // Update additional info based on user type
        if (userRole === "farmer") {
          const farmerDetails = editAdditional as FarmerDetails;
          const response = await fetch(
            `https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/farmer_details/${user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                farm_size: farmerDetails.farm_size,
                main_crop: farmerDetails.main_crop,
                irrigation_type: farmerDetails.irrigation_type,
                soil_type: farmerDetails.soil_type,
              }),
            }
          );

          const data = await response.json();
          if (response.ok && data.message === "No changes made") {
            setAdditionalInfoAlert({
              message: "No changes were made to your details.",
              variant: "info",
            });
          } else if (response.ok) {
            setAdditionalInfo(editAdditional);
            setEditMode({ ...editMode, additional: false });
            setAdditionalInfoAlert({
              message: "Farmer details updated successfully!",
              variant: "success",
            });
          } else {
            setAdditionalInfoAlert({
              message: "Failed to update farmer details",
              variant: "danger",
            });
          }
        } else if (userRole === "supplier") {
          const supplierDetails = editAdditional as SupplierDetails;
          const response = await fetch(
            `https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/supplier_details/${user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                shop_name: supplierDetails.shop_name,
                address: supplierDetails.address,
                latitude: supplierDetails.latitude,
                longitude: supplierDetails.longitude,
                approved: supplierDetails.approved,
              }),
            }
          );

          const data = await response.json();
          if (response.ok && data.message === "No changes made") {
            setAdditionalInfoAlert({
              message: "No changes were made to your details.",
              variant: "info",
            });
          } else if (response.ok) {
            setAdditionalInfo(editAdditional);
            setEditMode({ ...editMode, additional: false });
            setAdditionalInfoAlert({
              message: "Supplier details updated successfully!",
              variant: "success",
            });
          } else {
            setAdditionalInfoAlert({
              message: "Failed to update supplier details",
              variant: "danger",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error saving data:", error);
      if (section === "basic") {
        setBasicInfoAlert({
          message: "Failed to save changes",
          variant: "danger",
        });
      } else {
        setAdditionalInfoAlert({
          message: "Failed to save changes",
          variant: "danger",
        });
      }
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
    }

    setEditAdditional({ ...editAdditional, [name]: parsedValue });
  };

  const formatContactDate = (contactTime: string) => {
    const contactDate = new Date(contactTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time to compare only dates
    const contactDateOnly = new Date(
      contactDate.getFullYear(),
      contactDate.getMonth(),
      contactDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (contactDateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (contactDateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      const diffTime = Math.abs(
        todayOnly.getTime() - contactDateOnly.getTime()
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days ago`;
    }
  };

  // Add a helper to format the date difference for pest history
  const formatPestDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );
    if (dateOnly.getTime() === todayOnly.getTime()) return "Today";
    if (dateOnly.getTime() === yesterdayOnly.getTime()) return "Yesterday";
    const diffTime = Math.abs(todayOnly.getTime() - dateOnly.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
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
    <>
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
          {basicInfoAlert && (
            <Alert
              variant={basicInfoAlert.variant}
              onClose={() => setBasicInfoAlert(null)}
              dismissible
              className="mb-0"
            >
              {basicInfoAlert.message}
            </Alert>
          )}
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
          {additionalInfoAlert && (
            <Alert
              variant={additionalInfoAlert.variant}
              onClose={() => setAdditionalInfoAlert(null)}
              dismissible
              className="mb-0"
            >
              {additionalInfoAlert.message}
            </Alert>
          )}
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
                    <div className="mb-2">
                      <label className="form-label mb-0">
                        <strong>Soil Type:</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="soil_type"
                        value={
                          isFarmerDetails(editAdditional)
                            ? editAdditional.soil_type || ""
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
                        className="form-select form-select-sm"
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
                    <p>
                      <strong>Soil Type:</strong>{" "}
                      {(isFarmerDetails(additionalInfo) &&
                        additionalInfo.soil_type) || (
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
              <Card className="mb-3 flex-fill">
                <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
                  <span className="fs-5">Pest History</span>
                  <a
                    href="#"
                    className="text-decoration-none small"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewPestHistory();
                    }}
                  >
                    View full history &rarr;
                  </a>
                </Card.Header>
                <Card.Body>
                  {pestHistory.length > 0 ? (
                    pestHistory.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between mb-2"
                      >
                        <span>
                          {item.pest_name
                            ? item.pest_name.charAt(0).toUpperCase() +
                              item.pest_name.slice(1)
                            : ""}
                        </span>
                        <span className="text-muted">
                          {formatPestDate(item.prediction_time)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">No pest detections yet</span>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              {renderHistoryCard(
                "Suppliers Contacted",
                supplierHistory.length > 0
                  ? supplierHistory.map((contact) => ({
                      name: contact.shop_name,
                      detail: formatContactDate(contact.contact_time),
                    }))
                  : [
                      {
                        name: "No contacts yet",
                        detail: "Start calling suppliers",
                      },
                    ]
              )}
            </Col>
          </Row>
        )}

        {/* Account Actions */}
        <div className="text-center mt-4">
          <Button
            className="btn-md btn-primary me-3"
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>
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
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <p className="text-muted small">
              This will permanently delete all your data including profile
              information, history, and any associated records.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
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

        {/* Password Change Modal */}
        <Modal
          show={showPasswordModal}
          onHide={() => setShowPasswordModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3 position-relative">
              <label className="form-label">Current Password</label>
              <input
                type={showPasswords.oldPassword ? "text" : "password"}
                className="form-control"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                placeholder="Enter current password"
              />
              <span
                className="position-absolute top-50 end-0 me-3"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    oldPassword: !showPasswords.oldPassword,
                  })
                }
              >
                {showPasswords.oldPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="mb-3 position-relative">
              <label className="form-label">New Password</label>
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                className="form-control"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Enter new password"
              />
              <span
                className="position-absolute top-50 end-0 me-3"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    newPassword: !showPasswords.newPassword,
                  })
                }
              >
                {showPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="mb-3 position-relative">
              <label className="form-label">Confirm New Password</label>
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                className="form-control"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Confirm new password"
              />
              <span
                className="position-absolute top-50 end-0 me-3"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirmPassword: !showPasswords.confirmPassword,
                  })
                }
              >
                {showPasswords.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePasswordChange}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </Modal.Footer>

          {/* ToastContainer INSIDE the modal */}
          <ToastContainer position="top-center" className="p-3">
            <Toast
              show={toast.show}
              onClose={() => setToast((t) => ({ ...t, show: false }))}
              delay={2000}
              autohide
              bg={toast.variant}
            >
              <Toast.Body
                className={toast.variant === "danger" ? "text-white" : ""}
              >
                {toast.message}
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </Modal>
      </div>
    </>
  );
};

export default ProfileSection;
