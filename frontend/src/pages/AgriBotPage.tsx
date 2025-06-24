import HomeHeader from "../Components/HomeHeader";
import AgriBot from "../Components/AgriBot";
import HomeFooter from "../Components/HomeFooter";

const AgriBotPage = () => {
  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)",
      }}
    >
      <HomeHeader />

      <AgriBot />

      <HomeFooter />
    </div>
  );
};

export default AgriBotPage;
