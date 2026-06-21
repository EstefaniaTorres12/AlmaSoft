import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col, Row, Card, ListGroup, Button } from "react-bootstrap";
import { API_URL } from "../../config/api";


const Ataud = () => {

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const cargarAtaudes = async () => {
            try {
                const res = await axios.get(
                    `${API_URL}/api/productos/filtrar?nombre=ataud`
                );
                setProductos(res.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        cargarAtaudes();
    }, []);

    return (
        <Container>
            <Row>
                <h2 className="text-center" >ATAUDES</h2>

                {productos.map(p => (
                    <Col key={p.producto_id}>
                        <Card className="my-5" style={{ width: '18rem' }}>
                            <Card.Img
                                src={`/${p.producto_imagen}`}
                                alt={p.producto_nombre}
                                style={{
                                    height: "250px",
                                    objectFit: "cover"
                                }}
                            />
                            <Card.Body>
                                <Card.Title>{p.producto_nombre}</Card.Title>
                                <Card.Text>{p.producto_descripcion}</Card.Text>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item>$ {p.producto_precio}</ListGroup.Item>
                                    <ListGroup.Item><Button style={{ background: "#5660AE", borderColor: "#36264F" }} >Mas Detalles</Button></ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Ataud;