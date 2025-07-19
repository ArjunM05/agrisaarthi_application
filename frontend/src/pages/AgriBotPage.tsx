import HomeHeader from "../Components/HomeHeader";
import Chatbot from "../Components/ChatBot";
import HomeFooter from "../Components/HomeFooter";

const AgriBotPage = () => {
  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f6f2ed 0%, #e8f5e8 100%)",
      }}
    >
      <HomeHeader />

      <Chatbot />

      <HomeFooter />
    </div>
  );
};

export default AgriBotPage;
