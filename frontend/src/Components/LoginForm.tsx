import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
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

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
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
      setIsOtpSent(true);
      setIsLoading(false);
      showToast(
        "OTP Sent",
        "Please check your phone for the verification code"
      );
    }, 1500);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      showToast("Invalid OTP", "Please enter the complete OTP", "danger");
      navigate("/");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showToast("Login Successful", "Welcome to AgriSaarthi!");
    }, 1500);
  };

  const handleRegister = (type: "farmer" | "supplier") => {
    if (type === "farmer") {
      navigate("/farmer-registration");
    } else {
      navigate("/supplier-registration");
    }
  };

  return (
    <>
      <div
        className="card shadow-lg"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="h3 fw-bold text-dark mb-0">LOGIN</h2>
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="form-label text-uppercase fw-medium text-muted small"
            >
              PHONE NUMBER
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="form-control form-control-lg"
              disabled={isOtpSent}
            />
          </div>

          {!isOtpSent ? (
            <div className="row justify-content-md-center">
              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="btn btn-success btn-lg w-100 rounded-pill fw-medium col-4"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="form-control form-control-lg"
                  maxLength={6}
                />
              </div>
              <div className="row justify-content-md-center">
                <button
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="btn btn-success btn-lg w-50 rounded-pill fw-medium"
                >
                  {isLoading ? "Verifying..." : "VERIFY"}
                </button>
              </div>
            </div>
          )}

          <div className="row g-2 mt-2 align-items-center">
            <div className="col-5">
              <button
                onClick={() => handleRegister("farmer")}
                className="btn btn-success w-100 rounded-pill fw-medium"
              >
                REGISTER AS FARMER
              </button>
            </div>
            <div className="col-5">
              <button
                onClick={() => handleRegister("supplier")}
                className="btn btn-success w-100 rounded-pill fw-medium"
              >
                REGISTER AS SUPPLIER
              </button>
            </div>
          </div>
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

export default LoginForm;
