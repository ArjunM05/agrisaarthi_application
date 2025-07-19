import logo from "../assets/logo-1.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

const SupplierHeader = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_district");
    localStorage.removeItem("user_phone");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_email");
    navigate("/login");
  };

  const userRole = localStorage.getItem("user_type");

  return (
    <Navbar
      expand="lg"
      className="sticky-top bg-white shadow-sm"
      style={{ zIndex: 1030 }}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/supplier">
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
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="w-100">
          <div className="d-flex justify-content-between align-items-center w-100">
            <Nav className="nav-fill nav-tabs flex-grow-1 d-flex justify-content-evenly">
              <Nav.Link as={NavLink} to={`/${userRole}/inventory`}>
                Inventory
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact">
                Contact Us
              </Nav.Link>
            </Nav>

            <Nav className="ms-3">
              <NavDropdown
                title={<PersonCircle size={24} />}
                id="profile-dropdown"
                align="end"
              >
                <NavDropdown.Item as={NavLink} to={`/${userRole}/profile`}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SupplierHeader;
