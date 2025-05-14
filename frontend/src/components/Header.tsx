import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import title_logo2 from "../assets/title-logo2.png";

const Header: React.FC = () => {
  return (
    <Navbar fixed="top" bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="me-auto">
          <img
            src={title_logo2}
            alt="Logo"
            height="40"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/create">
              New League
            </Nav.Link>
            <Nav.Link as={Link} to="/players/new">
              New Player
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
