import logo from "../assets/logo-1.png";

const LoginHeader = () => {
  return (
    <header
      className="w-100 bg-white shadow-sm sticky-top"
      style={{ zIndex: 1030 }}
    >
      <div className="container-fluid">
        <div className="row align-items-center py-3 px-4">
          <div className="col">
            <h1 className="h2 h1-md fw-bold text-dark mb-0">
              WELCOME TO AGROSAARTHI!
            </h1>
          </div>

          <div className="col-auto">
            <div className="d-flex align-items-center">
              <img
                src={logo}
                alt="logo"
                className="rounded-circle me-2"
                style={{ width: "48px", height: "48px", objectFit: "cover" }}
              />
              <div className="lh-1">
                <div className="fs-5 fw-semibold text-success">Agro</div>
                <div className="fs-5 fw-semibold text-success">Saarthi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LoginHeader;
