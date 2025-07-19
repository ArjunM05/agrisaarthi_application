import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RoleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("user_type");
    const userEmail = localStorage.getItem("user_email");

    if (userType && userEmail) {
      // User is logged in, redirect to appropriate dashboard
      if (userType === "farmer" || userType === "admin") {
        navigate("/farmer");
      } else if (userType === "supplier") {
        navigate("/supplier");
      } else {
        // Unknown user type, clear storage and go to login
        localStorage.removeItem("user_type");
        localStorage.removeItem("user_email");
        navigate("/login");
      }
    } else {
      // No user data, go to login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.2rem",
      }}
    >
      Redirecting...
    </div>
  );
};

export default RoleRedirect;
