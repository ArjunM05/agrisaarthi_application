import { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async () => {
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
      // Call Flask backend API
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user type in localStorage
        localStorage.setItem("user_type", data.role);
        localStorage.setItem("user_email", email);

        showToast("Login Successful", data.message);

        // Navigate based on user type
        if (data.role === "farmer") {
          navigate("/farmer");
        } else if (data.role === "supplier") {
          navigate("/supplier");
        } else {
          showToast("Unknown User Type", data.message, "danger");
        }
      } else {
        showToast(
          "Login Failed",
          data.error || "Invalid credentials",
          "danger"
        );
      }
    } catch (error) {
      showToast("Connection Error", "Unable to connect to server", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/registration");
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
              autoComplete="username"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="form-label text-uppercase fw-medium text-muted small"
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-control form-control-lg"
              autoComplete="current-password"
            />
          </div>

          <div className="row justify-content-md-center">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="btn btn-success btn-lg w-100 rounded-pill fw-medium mb-2"
            >
              {isLoading ? "Logging in..." : "LOGIN"}
            </button>
          </div>

          <div className="row justify-content-md-center">
            <button
              onClick={() => handleRegister()}
              className="btn btn-outline-success btn-lg w-100 rounded-pill fw-medium"
            >
              REGISTER
            </button>
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
