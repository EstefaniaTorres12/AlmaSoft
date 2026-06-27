import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col, Row, Card, ListGroup, Button } from "react-bootstrap";
import { API_URL } from "../../config/api";

const LAPIDAS_ESTATICAS = [
  { producto_id: 's1', producto_nombre: 'Lápida Mármol Blanco', producto_descripcion: 'Lápida de mármol blanco con grabado incluido.',          producto_precio: 1200000, producto_imagen: 'img/Lapida1.jpeg' },
  { producto_id: 's2', producto_nombre: 'Lápida Granito Negro',  producto_descripcion: 'Lápida de granito negro pulido con letras doradas.',     producto_precio: 1500000, producto_imagen: 'img/Lapida2.png'  },
  { producto_id: 's3', producto_nombre: 'Lápida Clásica',        producto_descripcion: 'Lápida clásica en piedra gris con acabado mate.',         producto_precio:  900000, producto_imagen: 'img/Lapida3.jpg'  },
  { producto_id: 's4', producto_nombre: 'Lápida Premium',        producto_descripcion: 'Lápida premium con relieve decorativo y grabado láser.',  producto_precio: 2000000, producto_imagen: 'img/Lapida4.jpg'  },
];

const Lapida = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarLapidas = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos/filtrar?nombre=lapida`);
        const data = res.data?.data || [];
        setProductos(data.length > 0 ? data : LAPIDAS_ESTATICAS);
      } catch {
        setProductos(LAPIDAS_ESTATICAS);
      }
    };
    cargarLapidas();
  }, []);

  return (
    <Container>
      <h2 className="text-center my-4">LÁPIDAS</h2>
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

export default Lapida;
