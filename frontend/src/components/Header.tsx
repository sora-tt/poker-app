import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import title_logo from '../assets/title-logo.png'

const Header: React.FC = () => {
    return (
        <Navbar fixed='top' bg="light" expand="lg">
            <Container className='justify-content-center'>
                <Navbar.Brand as={Link} to="/" className='mx-auto'>
                    <img
                        src={title_logo}
                        alt="Logo"
                        height="40"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/create">
                            Create New League
                        </Nav.Link>
                        <Nav.Link as={Link} to="/players/new">
                            Create New Player
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
