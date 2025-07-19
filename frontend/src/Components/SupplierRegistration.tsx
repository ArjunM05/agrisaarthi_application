import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SupplierRegistration = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    phoneNumber: "",
    district: "",
    address: "",
    purpose: "",
    inventoryDetails: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    description: "",
    variant: "success",
  });
  const navigate = useNavigate();

  const showToast = (
    title: string,
    description: string,
    variant: "success" | "danger" = "success"
  ) => {
    setToastMessage({ title, description, variant });
    setToastShow(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.shopName ||
      !formData.phoneNumber ||
      !formData.district ||
      !formData.address ||
      !formData.purpose ||
      !formData.inventoryDetails
    ) {
      showToast(
        "Incomplete Form",
        "Please fill in all required fields",
        "danger"
      );
      return;
    }

    if (formData.phoneNumber.length < 10) {
      showToast(
        "Invalid Phone Number",
        "Please enter a valid 10-digit phone number",
        "danger"
      );
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showToast(
        "Registration Successful",
        "Welcome to AgriSaarthi! Your supplier account has been created."
      );
    }, 1500);
    navigate("/dashboard");
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <>
      <div
        className="card shadow-lg"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="h3 fw-bold text-dark mb-0">SUPPLIER REGISTRATION</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="name"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                SHOP NAME*
              </label>
              <input
                id="shopName"
                type="text"
                value={formData.shopName}
                onChange={(e) => handleInputChange("shopName", e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="phoneNumber"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                PHONE NUMBER*
              </label>
              <input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="district"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                DISTRICT*
              </label>
              <input
                id="district"
                type="text"
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="address"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                ADDRESS*
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="form-control"
                rows={3}
                placeholder="No. 1/234, Nehru Street,......."
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="purpose"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                PURPOSE*
              </label>
              <textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                className="form-control"
                rows={2}
                placeholder="Describe your supplier purpose and goals"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="inventoryDetails"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                INVENTORY DETAILS*
              </label>
              <textarea
                id="inventoryDetails"
                value={formData.inventoryDetails}
                onChange={(e) =>
                  handleInputChange("inventoryDetails", e.target.value)
                }
                className="form-control"
                rows={3}
                placeholder="Enter your inventory"
                required
              />
            </div>
            <div className="row justify-content-md-center">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success btn-lg w-100 rounded-pill fw-medium"
              >
                {isLoading ? "Registering..." : "REGISTER"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm col-3 rounded-pill"
                onClick={() => handleBack()}
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toastShow}
          onClose={() => setToastShow(false)}
          delay={3000}
          autohide
          bg={toastMessage.variant}
        >
          <Toast.Header>
            <strong className="me-auto">{toastMessage.title}</strong>
          </Toast.Header>
          <Toast.Body
            className={toastMessage.variant === "danger" ? "text-white" : ""}
          >
            {toastMessage.description}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default SupplierRegistration;
