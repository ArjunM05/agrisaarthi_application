import LoginHeader from "../Components/LoginHeader";
import FarmerRegistration from "../Components/FarmerRegistration";

const FarmerRegistrationPage = () => {
  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #f6f2ed 0%, #e8f5e8 100%)",
      }}
    >
      <LoginHeader />

      <main className="container py-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 200px)" }}
        >
          <FarmerRegistration />
        </div>
      </main>

      <footer className="text-center py-4 text-muted">
        <p className="mb-0">
          &copy; 2025 AgriSaarthi. Connecting farmers and suppliers for a better
          tomorrow.
        </p>
      </footer>
    </div>
  );
};

export default FarmerRegistrationPage;
