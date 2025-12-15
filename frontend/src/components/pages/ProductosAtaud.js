import React from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import Ataud1 from '../../img/Ataud1.jpg';

const ProductosAtaud = () => {
    return (
        <Container>
            <Container fluid className="my-3 d-flex justify-content-center flex-wrap">
                <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Ataud</Button>
                <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Urna </Button>
                <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Lapida</Button>
                <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Arreglos Florales</Button>
            </Container>
            <Row>
                <Col>

                    <Card className="my-5" style={{ width: '18rem' }} >
                        <Card.Img variant="top" src={Ataud1} />
                        <Card.Body>
                            <Card.Title>Ataud Imperium</Card.Title>
                            <Card.Text>
                                Descripcion
                            </Card.Text>
                            <Button style={{ background: "#5660AE", borderColor: "#36264F" }} >Mas Detalles</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="my-5" style={{ width: '18rem' }} >
                        <Card.Img variant="top" src={Ataud1} />
                        <Card.Body>
                            <Card.Title>Titulo</Card.Title>
                            <Card.Text>
                                Descripcion
                            </Card.Text>
                            <Button style={{ background: "#5660AE", borderColor: "#36264F" }} >Mas Detalles</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="my-5" style={{ width: '18rem' }} >
                        <Card.Img variant="top" src={Ataud1} />
                        <Card.Body>
                            <Card.Title>Titulo</Card.Title>
                            <Card.Text>
                                Descripcion
                            </Card.Text>
                            <Button style={{ background: "#5660AE", borderColor: "#36264F" }} >Mas Detalles</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="my-5" style={{ width: '18rem' }} >
                        <Card.Img variant="top" src={Ataud1} />
                        <Card.Body>
                            <Card.Title>Titulo</Card.Title>
                            <Card.Text>
                                Descripcion
                            </Card.Text>
                            <Button style={{ background: "#5660AE", borderColor: "#36264F" }} >Mas Detalles</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col></Col>

            </Row>
        </Container>
    );
}

export default ProductosAtaud;