import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col, Row, Card, ListGroup, Button } from "react-bootstrap";
import { API_URL } from "../../config/api";

const ARREGLOS_ESTATICOS = [
  { producto_id: 's1', producto_nombre: 'Arreglo Clásico',   producto_descripcion: 'Arreglo floral clásico con flores blancas y verdes.',          producto_precio: 180000, producto_imagen: 'img/Arreglo1.jpg' },
  { producto_id: 's2', producto_nombre: 'Arreglo Elegante',  producto_descripcion: 'Arreglo elegante con rosas y liliums en tonos suaves.',         producto_precio: 220000, producto_imagen: 'img/Arreglo2.jpg' },
  { producto_id: 's3', producto_nombre: 'Arreglo Blanco',    producto_descripcion: 'Arreglo en tonos blancos, símbolo de paz y pureza.',            producto_precio: 200000, producto_imagen: 'img/Arreglo3.jpg' },
  { producto_id: 's4', producto_nombre: 'Corona Fúnebre',    producto_descripcion: 'Corona fúnebre de flores naturales con cinta personalizada.',   producto_precio: 350000, producto_imagen: 'img/Arreglo4.jpg' },
  { producto_id: 's5', producto_nombre: 'Arreglo Especial',  producto_descripcion: 'Arreglo especial con flores importadas y follaje decorativo.',  producto_precio: 280000, producto_imagen: 'img/Arreglo5.jpg' },
];

const ArreglosFloral = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarArreglos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos/filtrar?nombre=arreglo`);
        const data = res.data?.data || [];
        setProductos(data.length > 0 ? data : ARREGLOS_ESTATICOS);
      } catch {
        setProductos(ARREGLOS_ESTATICOS);
      }
    };
    cargarArreglos();
  }, []);

  return (
    <Container>
      <h2 className="text-center my-4">ARREGLOS FLORALES</h2>
      <Row className="justify-content-center">
        {productos.map(p => (
          <Col md={4} sm={6} xs={12} key={p.producto_id}>
            <Card className="my-4 shadow" style={{ width: '18rem' }}>
              <Card.Img
                src={`/${p.producto_imagen}`}
                alt={p.producto_nombre}
                style={{ height: "250px", objectFit: "cover" }}
                onError={(e) => { e.target.src = '/img/default.png'; }}
              />
              <Card.Body>
                <Card.Title>{p.producto_nombre}</Card.Title>
                <Card.Text>{p.producto_descripcion}</Card.Text>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>$ {Number(p.producto_precio).toLocaleString('es-CO')}</ListGroup.Item>
                  <ListGroup.Item className="text-center">
                    <Button style={{ background: "#5660AE", borderColor: "#36264F" }}>Más Detalles</Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ArreglosFloral;
