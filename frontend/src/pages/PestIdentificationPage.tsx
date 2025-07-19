// src/pages/PestIdentificationPage.tsx

import HomeHeader from "../Components/HomeHeader";
import HomeFooter from "../Components/HomeFooter";
import PestIdentification from "../Components/PestIdentification";

const PestIdentificationPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <HomeHeader />
      <main className="flex-grow-1">
        <PestIdentification />
      </main>
      <HomeFooter />
    </div>
  );
};

export default PestIdentificationPage;
