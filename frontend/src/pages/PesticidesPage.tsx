// src/pages/PesticidesPage.tsx

import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";
import Pesticides from "../Components/Pesticides";

const PesticidesPage: React.FC = () => {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #f6f2ed 0%, #e8f5e8 100%)",
      }}
    >
      <HomeHeader />
      <main className="flex-grow-1">
        <Pesticides />
      </main>
      <HomeFooter />
    </div>
  );
};

export default PesticidesPage;
