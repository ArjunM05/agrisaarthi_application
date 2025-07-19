import { useState } from "react";
import { Toast, ToastContainer, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    description: "",
    variant: "success",
  });

  // Forgot password modal states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showForgotPasswords, setShowForgotPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [otpSent, setOtpSent] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const navigate = useNavigate();

  const showToast = (
    title: string,
    description: string,
    variant: "success" | "danger" = "success"
  ) => {
    setToastMessage({ title, description, variant });
    setToastShow(true);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      showToast(
        "Missing Fields",
        "Please enter both email and password",
        "danger"
      );
      return;
    }
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast(
        "Invalid Email",
        "Please enter a valid email address",
        "danger"
      );
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        // Store all user data in localStorage
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_type", data.role);
        localStorage.setItem("user_district", data.district);
        localStorage.setItem("user_phone", data.phone);
        
        
        // Store additional info if available
        
        // Store login status
        localStorage.setItem("isLoggedIn", "true");
        
        showToast("Login Successful", data.message || "Welcome back!");

        // Store user data in localStorage
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_type", data.role);
        localStorage.setItem("user_district", data.district);
        localStorage.setItem("user_phone", data.phone);

        // Dispatch custom event to notify App component
        window.dispatchEvent(new Event("userTypeChanged"));

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        showToast(
          "Login Failed",
          data.message || "Invalid credentials",
          "danger"
        );
      }
    } catch (error: any) {
      showToast(
        "Login Failed",
        error.message || "Invalid credentials",
        "danger"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/registration");
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
    setOtpSent(false);
    setForgotPasswordEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSendOtp = async () => {
    if (!forgotPasswordEmail) {
      showToast("Error", "Please enter your email address", "danger");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      showToast("Error", "Please enter a valid email address", "danger");
      return;
    }

    setForgotPasswordLoading(true);
    try {
      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/forgot_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        showToast(
          "Success",
          data.message + ". Kindly check Spam Folder.",
          "success"
        );
        setOtpSent(true);
      } else {
        showToast("Error", data.message || "Failed to send OTP", "danger");
      }
    } catch (error) {
      showToast("Error", "Failed to send OTP. Please try again.", "danger");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      showToast("Error", "Please fill in all fields", "danger");
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast("Error", "New passwords do not match", "danger");
      return;
    }

    setResetPasswordLoading(true);
    try {
      const response = await fetch("https://agrosaarthi-api.ml.iit-ropar.truefoundry.cloud/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotPasswordEmail,
          otp: otp,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        showToast("Success", data.message, "success");
        setShowForgotPasswordModal(false);
        setOtpSent(false);
        setForgotPasswordEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setShowForgotPasswords({
          newPassword: false,
          confirmPassword: false,
        });
        setShowForgotPasswords({
          newPassword: false,
          confirmPassword: false,
        });
      } else {
        showToast(
          "Error",
          data.message || "Failed to reset password",
          "danger"
        );
      }
    } catch (error) {
      showToast(
        "Error",
        "Failed to reset password. Please try again.",
        "danger"
      );
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowForgotPasswordModal(false);
    setOtpSent(false);
    setForgotPasswordEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
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
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-control form-control-lg"
                // autoComplete="username"
              />
            </div>

            <div className="mb-4 position-relative">
              <label
                htmlFor="password"
                className="form-label text-uppercase fw-medium text-muted small"
              >
                PASSWORD
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-control form-control-lg"
                // autoComplete="current-password"
              />
              <span
                className="position-absolute top-50 end-0 me-3"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="col-10">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-success btn-md w-100 rounded-pill fw-medium mb-2"
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </button>
            </div>
          </form>

          {/* <div className="row justify-content-md-center"> */}
          <div className="row">
            <div className="col-5">
              <button
                onClick={() => handleRegister()}
                className="btn btn-outline-success btn-sm w-100 rounded-pill"
                // style={{ height: "48px" }}
              >
                REGISTER
              </button>
            </div>
            <div className="col-5">
              <button
                onClick={handleForgotPassword}
                className="btn btn-outline-success btn-sm w-100 rounded-pill"
                // style={{ height: "48px" }}
              >
                FORGOT PASSWORD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal show={showForgotPasswordModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!otpSent ? (
            <div>
              <p className="text-muted mb-3">
                Enter your email address to receive a one-time password (OTP).
              </p>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-muted mb-3">
                Enter the OTP sent to your email and your new password. If not
                in Inbox, kindly check Spam Folder.
              </p>
              <div className="mb-3">
                <label className="form-label">OTP</label>
                <input
                  type="text"
                  className="form-control"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
              </div>
              <div className="mb-3 position-relative">
                <label className="form-label">New Password</label>
                <input
                  type={showForgotPasswords.newPassword ? "text" : "password"}
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <span
                  className="position-absolute top-50 end-0 me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setShowForgotPasswords((prev) => ({
                      ...prev,
                      newPassword: !prev.newPassword,
                    }))
                  }
                >
                  {showForgotPasswords.newPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="mb-3 position-relative">
                <label className="form-label">Confirm New Password</label>
                <input
                  type={
                    showForgotPasswords.confirmPassword ? "text" : "password"
                  }
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <span
                  className="position-absolute top-50 end-0 me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setShowForgotPasswords((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
                    }))
                  }
                >
                  {showForgotPasswords.confirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          {!otpSent ? (
            <Button
              variant="success"
              onClick={handleSendOtp}
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? "Sending..." : "Send OTP"}
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleResetPassword}
              disabled={resetPasswordLoading}
            >
              {resetPasswordLoading ? "Resetting..." : "Reset Password"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

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
