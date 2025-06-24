import logo from "../assets/logo-1.png";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const HomeHeader = () => {
  return (
    <div>
      <header className=" w-100 bg-white shadow-sm fixed-top "></header>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
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
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse
            id="navbar-nav"
            className="d-flex justify-content-center"
          >
            <Nav className="w-100 nav nav-tabs nav-fill d-flex justify-content-evenly ">
              <Nav.Link as={NavLink} to="/pest-identification">
                Pest Identification
              </Nav.Link>
              <Nav.Link as={NavLink} to="/weather">
                Weather
              </Nav.Link>
              <Nav.Link as={NavLink} to="/agribot">
                AgriBot
              </Nav.Link>
              <Nav.Link as={NavLink} to="/pesticide">
                Pesticide
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about">
                About Us
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact">
                Contact Us
              </Nav.Link>
              <Nav.Link as={NavLink} to="/login">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default HomeHeader;
