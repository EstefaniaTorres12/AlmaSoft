import React from "react";
import { Container, Card, Button, Row, Col,Image } from 'react-bootstrap';
import Carrusel from "./Carrusel";
import ContactenosFooter from '../pages/ContactenosFooter';
import { Link } from "react-router-dom";


const PaginaInicio = () => {
    return (

        <Container className=" align-items-center" >
            <Carrusel/>

            <h1 className="text-center">Productos Destacados</h1>
            <Row className="justify-content-center g-4">
                <Col>
                    <Card className="my-5" style={{ width: '18rem' }} >
                        <Card.Img variant="top" src="/img/Ataud1.jpg" />
                        <Card.Body>
                            <Card.Title>Ataud Imperium</Card.Title>
                            <Card.Text>
                                Descripcion
                            </Card.Text>
                            <Button as={Link} to="/pages/Ataud" style={{ background: "#5660AE", borderColor: "#36264F" }} >Mas Detalles</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card className="my-5" style={{ width: '18rem' }}>
                        <Card.Img variant="card-img-top" src="/img/Urna1.jpg" />
                        <Card.Body>
                            <Card.Title>Urna Classic</Card.Title>
                            <Card.Text>
                                Descripcion
                            </Card.Text>
                            <Button style={{ background: "#5660AE", borderColor: "#36264F" }} >Mas Detalles</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card className="my-5" style={{ width: '18rem' }}>
                        <Card.Img variant="card-img-top" src="/img/Lapida2.png" />
                        <Card.Body>
                            <Card.Title>Lapida</Card.Title>
                            <Card.Text>
                                Descripcion
                            </Card.Text>
                            <Button style={{ background: "#5660AE", borderColor: "#36264F" }} >Mas Detalles</Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card className="my-5" style={{ width: '18rem' }}>
                        <Card.Img variant="card-img-top" src="/img/Arreglo3.jpg" />
                        <Card.Body>
                            <Card.Title>Arreglo Corona Funeraria</Card.Title>
                            <Card.Text>
                                Descripcion
                            </Card.Text>
                            <Button style={{ background: "#5660AE", borderColor: "#36264F" }} >Mas Detalles</Button>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
            <Container  fluid className="my-5 d-flex justify-content-center flex-wrap">
               <Button as={Link} to="/productos/Ataud" className="me-3 px-4 py-3 fs-6" variant="outline-dark">Ataud</Button>    
               <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Urna </Button>
               <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Lapida</Button>
               <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Arreglos Florales</Button>
               <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Combos</Button>
               <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Planes Funebres</Button>
               <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Servicios</Button>
               <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Lo Nuevo!</Button>
            </Container>

        </Container>
    );
}

export default PaginaInicio;