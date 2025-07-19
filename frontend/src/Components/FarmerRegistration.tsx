import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router";

const FarmerRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    password: "",
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
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.district ||
      !formData.password
    ) {
      showToast(
        "Incomplete Form",
        "Please fill in all required fields",
        "danger"
      );
      return;
    }

    if (formData.phone.length < 10) {
      showToast(
        "Invalid Phone Number",
        "Please enter a valid 10-digit phone number",
        "danger"
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "farmer",
          district: formData.district,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast(
          "Registration Successful",
          "Welcome to AgriSaarthi! Your farmer account has been created. Please login.",
          "success"
        );
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast(
          "Registration Failed",
          data.error || "An error occurred during registration.",
          "danger"
        );
      }
    } catch (error) {
      showToast(
        "Connection Error",
        "Unable to connect to server. Please try again later.",
        "danger"
      );
    } finally {
      setIsLoading(false);
    }
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
            <h2 className="h3 fw-bold text-dark mb-0">FARMER REGISTRATION</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="name"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                NAME*
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                EMAIL*
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                PASSWORD*
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="phone"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                PHONE NUMBER*
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
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

export default FarmerRegistration;
