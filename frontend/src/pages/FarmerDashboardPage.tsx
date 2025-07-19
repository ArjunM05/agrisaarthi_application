// src/pages/FarmerDashboardPage.tsx
import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";
import FarmerDashboard from "../Components/FarmerDashboard";

const FarmerDashboardPage = () => {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #f6f2ed 0%, #e8f5e8 100%)",
      }}
    >
      <HomeHeader />
      <main className="container py-4 flex-grow-1">
        <FarmerDashboard />
      </main>
      <HomeFooter />
    </div>
  );
};

export default FarmerDashboardPage;
