import logo from "../assets/logo-1.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

const SupplierHeader = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_email");
    navigate("/login");
  };

  const userRole = localStorage.getItem("user_type");

  return (
    <div>
      <header className=" w-100 bg-white shadow-sm fixed-top "></header>
      <Navbar expand="lg">
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
          <Navbar.Collapse
            id="navbar-nav"
            className="d-flex justify-content-center"
          >
            <Nav className="w-100 nav nav-tabs nav-fill d-flex justify-content-evenly ">
              <Nav.Link as={NavLink} to="/supplier/inventory">
                Inventory
              </Nav.Link>
              {/* <Nav.Link as={NavLink} to="/weather">
                Weather
              </Nav.Link> */}
              {/* <Nav.Link as={NavLink} to="/farmer/agribot">
                AgriBot
              </Nav.Link> */}
              {/* <Nav.Link as={NavLink} to="/pesticide">
                Pesticide
              </Nav.Link> */}
              {/* <Nav.Link as={NavLink} to="/about">
                About Us
              </Nav.Link> */}
              <Nav.Link as={NavLink} to="/contact">
                Contact Us
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default SupplierHeader;
