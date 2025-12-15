import React from "react";
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Ataud1 from '../../img/Ataud1.jpg';
import Urna1 from '../../img/Urna1.jpg';
import Lapida2 from '../../img/Lapida2.png';
import Arreglo3 from '../../img/Arreglo3.jpg';


const PaginaInicio = () => {
    return (

        <Container className=" align-items-center" >
            <h1 className="text-center">Productos Destacados</h1>
            <Row className="justify-content-center g-4">
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
                    <Card className="my-5" style={{ width: '18rem' }}>
                        <Card.Img variant="card-img-top" src={Urna1} />
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
                        <Card.Img variant="card-img-top" src={Lapida2} />
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
                        <Card.Img variant="card-img-top" src={Arreglo3} />
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
               <Button className="me-3 px-4 py-3 fs-6" variant="outline-dark">Ataud</Button>    
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