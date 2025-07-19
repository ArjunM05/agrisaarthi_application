// src/pages/PesticidesPage.tsx

import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";
import Pesticides from "../Components/Pesticides";

const PesticidesPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <HomeHeader />
      <main className="flex-grow-1">
        <Pesticides />
      </main>
      <HomeFooter />
    </div>
  );
};

export default PesticidesPage;
