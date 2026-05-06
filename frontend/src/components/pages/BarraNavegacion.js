import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";

const BarraNavegacion = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const handleStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <Navbar style={{ backgroundColor: "#211730" }} expand="lg" variant="dark">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link href="#link">Promociones</Nav.Link>
                        <NavDropdown title="Productos" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/productos/ProductosAtaud">Todos los productos</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/productos/Ataud">Ataud</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/productos/Urna">Urna</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/productos/arreglos-florales">Arreglos Florales</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/productos/lapida">Lapida</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#link">Contactenos</Nav.Link>
                        <Nav.Link href="#link">Planes funerarios</Nav.Link>
                        <Nav.Link href="#link">Servicios</Nav.Link>
                        <Nav.Link as={Link} to="/pages/AcercaDeNosotros">Acerca de Nosotros</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {isLoggedIn ? (
                            <Nav.Link as={Link} to="/client/tienda" style={{ fontWeight: 600 }}>
                                Carrito
                            </Nav.Link>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/pages/IniciarSesion">Iniciar sesion</Nav.Link>
                                <Nav.Link as={Link} to="/pages/Registrarse">Registrarse</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default BarraNavegacion;
