import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";

// import FarmerRegistrationPage from "./pages/FarmerRegistrationPage";
// import SupplierRegistrationPage from "./pages/SupplierRegistrationPage";
import NotFound from "./pages/NotFound";
import "./App.css";
import ContactUsPage from "./pages/ContactUsPage";
import LandingPage from "./pages/LandingPage";
import LearnMorePage from "./pages/LearnMorePage";
import FarmerLayout from "./layouts/FarmerLayout";
import SupplierLayout from "./layouts/SupplierLayout";
import PestIdentificationPage from "./pages/PestIdentificationPage";
// import AgriBotPage from "./pages/AgriBotPage";
import PesticidesPage from "./pages/PesticidesPage";
import FarmerDashboardPage from "./pages/FarmerDashboardPage";
import SupplierDashboardPage from "./pages/SupplierDashboardPage";
import InventoryPage from "./pages/InventoryPage";
import RoleRedirect from "./Components/RoleRedirect";
import RegistrationPage from "./pages/RegistrationPage";
import ProfilePage from "./pages/ProfileSectionPage";
import SupplierHistoryPage from "./pages/SupplierHistoryPage";
import RequireAuth from "./Components/RequireAuth";
import PestHistoryPage from "./pages/PestHistoryPage";

const App = () => {
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Set initial userType
    setUserType(localStorage.getItem("user_type"));

    // Listen for storage changes
    const handleStorageChange = () => {
      setUserType(localStorage.getItem("user_type"));
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events if you dispatch them on login/logout
    window.addEventListener("userTypeChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userTypeChanged", handleStorageChange);
    };
  }, []);

  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <RoleRedirect />
              </RequireAuth>
            }
          />
          <Route
            path={`/${userType}/profile`}
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/farmer"
            element={
              <RequireAuth>
                <FarmerLayout />
              </RequireAuth>
            }
          >
            <Route index element={<FarmerDashboardPage />} />
            <Route
              path="pest-identification"
              element={<PestIdentificationPage />}
            />
            <Route path="pesticide" element={<PesticidesPage />} />
            <Route path="supplier-history" element={<SupplierHistoryPage />} />
            <Route path="pest-history" element={<PestHistoryPage />} />
          </Route>
          <Route
            path="/supplier"
            element={
              <RequireAuth>
                <SupplierLayout />
              </RequireAuth>
            }
          >
            <Route index element={<SupplierDashboardPage />} />
            <Route path="inventory" element={<InventoryPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    
  );
};

export default App;
