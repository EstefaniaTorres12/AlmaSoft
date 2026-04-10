import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col, Row, Card, ListGroup, Button } from "react-bootstrap";

const ArreglosFloral = () => {

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const cargarArreglos = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:3001/api/productos/filtrar?nombre=arreglo"
                );
                setProductos(res.data?.data || []);
            } catch (error) {
                console.error(error);
            }
        };

        cargarArreglos();
    }, []);

    return (
        <Container>
            <h2 className="text-center my-4">ARREGLOS FLORALES</h2>

            <Row className="justify-content-center">
                {productos.length === 0 ? (
                    <p className="text-center">No hay arreglos disponibles</p>
                ) : (
                    productos.map(p => (
                        <Col md={4} sm={6} xs={12} key={p.producto_id}>
                            <Card className="my-4 shadow" style={{ width: '18rem' }}>
                                <Card.Img
                                    src={`http://localhost:3001/${p.producto_imagen}`}
                                    alt={p.producto_nombre}
                                    style={{ height: "250px", objectFit: "cover" }}
                                />
                                <Card.Body>
                                    <Card.Title>{p.producto_nombre}</Card.Title>
                                    <Card.Text>{p.producto_descripcion}</Card.Text>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>$ {p.producto_precio}</ListGroup.Item>
                                        <ListGroup.Item className="text-center">
                                            <Button style={{ background: "#5660AE", borderColor: "#36264F" }}>
                                                Más Detalles
                                            </Button>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default ArreglosFloral;