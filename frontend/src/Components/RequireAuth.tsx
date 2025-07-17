import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      navigate("/login");
    }
  }, [navigate]);
  return <>{children}</>;
};

export default RequireAuth; 