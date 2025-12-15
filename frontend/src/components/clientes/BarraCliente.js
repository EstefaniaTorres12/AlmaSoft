import React from "react";
import { Container, Navbar, Form, Button } from "react-bootstrap";

const BarraCliente=()=>{
    return(
         <Navbar style={{ backgroundColor: "#4B356E" }} expand="lg" variant="dark" >
            <Container fluid>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    
                   
                    <Form className="d-flex mx-auto">
                        <Form.Control
                            type="search"
                            placeholder="¿Qué estas buscando?"
                            className="me-2"
                            aria-label="Search"
                            style={{ width: "500px" }}
                        />
                        <Button variant="dark">Search</Button>
                    </Form>
                    <Button  className="mx-2" variant="dark">ADMIN</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default BarraCliente;