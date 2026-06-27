import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col, Row, Card, ListGroup, Button } from "react-bootstrap";
import { API_URL } from "../../config/api";

const URNAS_ESTATICAS = [
  { producto_id: 's1', producto_nombre: 'Urna de Mármol',   producto_descripcion: 'Urna tallada en mármol blanco con grabado personalizado.',   producto_precio: 350000, producto_imagen: 'img/Urna1.jpg' },
  { producto_id: 's2', producto_nombre: 'Urna de Madera',   producto_descripcion: 'Urna artesanal de madera con cierre hermético y barniz.',     producto_precio: 280000, producto_imagen: 'img/Urna2.jpg' },
  { producto_id: 's3', producto_nombre: 'Urna de Cerámica', producto_descripcion: 'Urna de cerámica decorada con motivos florales sutiles.',     producto_precio: 320000, producto_imagen: 'img/Urna3.jpg' },
  { producto_id: 's4', producto_nombre: 'Urna Premium',     producto_descripcion: 'Urna premium de acero inoxidable con acabado pulido.',        producto_precio: 500000, producto_imagen: 'img/Urna4.jpg' },
];

const Urna = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarUrnas = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos/filtrar?nombre=urna`);
        const data = res.data?.data || [];
        setProductos(data.length > 0 ? data : URNAS_ESTATICAS);
      } catch {
        setProductos(URNAS_ESTATICAS);
      }
    };
    cargarUrnas();
  }, []);

  return (
    <Container>
      <Row>
        <h2 className="text-center my-4">URNAS</h2>
        {productos.map(p => (
          <Col key={p.producto_id}>
            <Card className="my-5" style={{ width: '18rem' }}>
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
                  <ListGroup.Item>
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

export default Urna;
