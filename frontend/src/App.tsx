import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// import FarmerRegistrationPage from "./pages/FarmerRegistrationPage";
// import SupplierRegistrationPage from "./pages/SupplierRegistrationPage";
import NotFound from "./pages/NotFound";
import "./App.css";
// import LandingPage from "./pages/LandingPage";
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

const App = () => {
  const userType = localStorage.getItem("user_type");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path={`/${userType}/profile`} element={<ProfilePage />} />
        {/* <Route
          path="/supplier-registration"
          element={<SupplierRegistrationPage />}
        /> */}
        <Route path="/farmer" element={<FarmerLayout />}>
          <Route index element={<FarmerDashboardPage />} />
          <Route
            path="pest-identification"
            element={<PestIdentificationPage />}
          />
          {/* <Route path="agribot" element={<AgriBotPage />} /> */}
          <Route path="pesticide" element={<PesticidesPage />} />
          <Route path="supplier-history" element={<SupplierHistoryPage />} />
        </Route>
        {/* <Route path="/home" element={<FarmerDashboardPage />} />
        <Route
          path="/pest-identification"
          element={<PestIdentificationPage />}
        />
        <Route path="/agribot" element={<AgriBotPage />} />
        <Route path="/pesticide" element={<PesticidesPage />} /> */}
        <Route path="/supplier" element={<SupplierLayout />}>
          <Route index element={<SupplierDashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
