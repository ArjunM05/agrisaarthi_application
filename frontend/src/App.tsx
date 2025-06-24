import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import FarmerRegistrationPage from "./pages/FarmerRegistrationPage";
import SupplierRegistrationPage from "./pages/SupplierRegistrationPage";
import NotFound from "./pages/NotFound";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import PestIdentificationPage from "./pages/PestIdentificationPage";
import AgriBotPage from "./pages/AgriBotPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/farmer-registration"
          element={<FarmerRegistrationPage />}
        />
        <Route
          path="/supplier-registration"
          element={<SupplierRegistrationPage />}
        />
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/pest-identification"
          element={<PestIdentificationPage />}
        />
        <Route path="/agribot" element={<AgriBotPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
