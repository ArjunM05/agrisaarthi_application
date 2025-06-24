import { useState } from "react";
import logo from "../assets/logo-1.png";
import { Dropdown } from "react-bootstrap";

const LoginHeader = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English | A");
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };
  return (
    <header className="w-100 bg-white shadow-sticky-top">
      <div className="container-fluid">
        <div className="row align-items-center py-3 px-4">
          <div className="col">
            <h1 className="h2 h1-md fw-bold text-dark mb-0">
              WELCOME TO AGRISAARTHI!
            </h1>
          </div>

          <div className="dropdown ms-auto col-auto">
            <Dropdown className="ms-auto">
              <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
                {selectedLanguage}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                <Dropdown.Item
                  onClick={() => handleLanguageSelect("English | A")}
                >
                  English | A
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleLanguageSelect("हिंदी | अ")}
                >
                  हिंदी | अ
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleLanguageSelect("தமிழ் | அ")}
                >
                  தமிழ் | அ
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
                <div className="fs-5 fw-semibold text-success">Agri</div>
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
