// src/pages/FarmerDashboardPage.tsx
import SupplierHeader from "../Components/SupplierHeader";
import HomeFooter from "../Components/HomeFooter";
import SupplierDashboard from "../Components/SupplierDashboard";

const SupplierDashboardPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <SupplierHeader />
      <main className="container py-4 flex-grow-1">
        <SupplierDashboard />
      </main>
      <HomeFooter />
    </div>
  );
};

export default SupplierDashboardPage;
