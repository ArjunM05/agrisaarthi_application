import Registration from "../Components/Registration";
import LoginHeader from "../Components/LoginHeader";
const RegistrationPage = () => {
  return (
    <div className="min-vh-100">
      <LoginHeader />

      <main className="container py-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "calc(100vh - 200px)" }}
        >
          <Registration />
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

export default RegistrationPage;
