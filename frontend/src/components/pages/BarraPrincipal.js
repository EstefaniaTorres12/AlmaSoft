import React from "react";
import { Container, Navbar, Form, Button} from 'react-bootstrap';
import logo from '../../img/logoAS.png';
import { Link } from "react-router-dom";


const BarraPrincipal = () => {
    return (
        <Navbar style={{ backgroundColor: "#4B356E" }} expand="lg" variant="dark" >
            <Container>
                <Navbar.Brand href="#" className="d-flex align-items-center">
                    <img
                        alt="logo"
                        src={logo}
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2"
                    />
                    <span className="fs-4">ALMASOFT</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    
                   
                    <Form className="d-flex ">
                        <Form.Control
                            type="search"
                            placeholder="¿Qué estas buscando?"
                            className="me-2"
                            aria-label="Search"
                            style={{ width: "500px" }}
                        />
                        <Button variant="dark">Search</Button>
                    </Form>
                    <Button as={Link} to="/pages/IniciarSesion" className="ms-auto me-2" variant="dark">Iniciar Secion</Button>
                    <Button as={Link} to="/pages/Registrarse" variant="dark">Registrarse</Button>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}



export default BarraPrincipal;