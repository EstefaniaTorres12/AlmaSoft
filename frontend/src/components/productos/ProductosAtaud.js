import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";

const ProductosAtaud = () => {

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/productos/productosAll");

                const data = await response.json();

                if (response.ok) {
                    setProductos(data.data);
                } else {
                    alert(data.message || "Error al obtener productos");
                }

            } catch (error) {
                console.log(error);
                alert("Error al conectar con el backend");
            }
        };

        fetchProductos();
    }, []);

    return (
        <Container>

            <Row>
                {productos.map(producto => (
                    <Col key={producto.producto_id}>
                        <Card className="my-5" style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={`/${producto.producto_imagen}`}
                                alt={producto.producto_nombre}
                                style={{
                                    height: "250px",
                                    objectFit: "cover"
                                }} />
                            <Card.Body>
                                <Card.Title>{producto.producto_nombre}</Card.Title>
                                <Card.Text>
                                    {producto.producto_precio}<br></br>
                                    {producto.producto_descripcion}
                                </Card.Text>
                                <Button
                                    style={{ background: "#5660AE", borderColor: "#36264F" }}
                                >
                                    Más Detalles
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

        </Container>
    );
};

export default ProductosAtaud;