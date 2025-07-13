import logo from "../assets/logo-1.png";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";

const HomeHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_email");
    navigate("/login");
  };

  const userRole = localStorage.getItem("user_type") || "farmer"; // fallback
  const homeLink = `/${userRole}`;

  return (
    <div>
      <header className=" w-100 bg-white shadow-sm fixed-top"></header>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to={homeLink}>
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
              <Nav className="flex-grow-1 d-flex justify-content-evenly">
                <Nav.Link as={NavLink} to={`/${userRole}/pest-identification`}>
                  Pest Identification
                </Nav.Link>
                <Nav.Link as={NavLink} to={`/${userRole}/pesticide`}>
                  Pesticide
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
    </div>
  );
};

export default HomeHeader;
