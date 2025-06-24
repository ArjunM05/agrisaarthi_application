import HomeFooter from "../Components/HomeFooter";
import HomeHeader from "../Components/HomeHeader";
import PestIdentification from "../Components/PestIdentification";

const PestIdentificationPage = () => {
  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)",
      }}
    >
      <HomeHeader />

      <PestIdentification />

      <HomeFooter />
    </div>
  );
};

export default PestIdentificationPage;
