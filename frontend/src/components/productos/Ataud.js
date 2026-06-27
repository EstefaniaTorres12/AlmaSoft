import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col, Row, Card, ListGroup, Button } from "react-bootstrap";
import { API_URL } from "../../config/api";

const ATAUDES_ESTATICOS = [
  { producto_id: 's1', producto_nombre: 'Ataúd Clásico',     producto_descripcion: 'Ataúd de madera con acabado clásico y herrajes dorados.',        producto_precio: 2500000, producto_imagen: 'img/AtaudClasico.jpg' },
  { producto_id: 's2', producto_nombre: 'Ataúd Premium',     producto_descripcion: 'Ataúd premium con tapizado interior en seda y detalles finos.',    producto_precio: 4500000, producto_imagen: 'img/AtaudPremiun.jpg' },
  { producto_id: 's3', producto_nombre: 'Ataúd Estándar I',  producto_descripcion: 'Ataúd de madera sólida con acabado natural.',                      producto_precio: 1800000, producto_imagen: 'img/Ataud1.jpg' },
  { producto_id: 's4', producto_nombre: 'Ataúd Estándar II', producto_descripcion: 'Ataúd con herrajes plateados y tapizado en tela.',                  producto_precio: 2200000, producto_imagen: 'img/Ataud2.jpg' },
  { producto_id: 's5', producto_nombre: 'Ataúd Laqueado',    producto_descripcion: 'Ataúd laqueado blanco con detalles elegantes.',                    producto_precio: 2000000, producto_imagen: 'img/Ataud3.jpg' },
  { producto_id: 's6', producto_nombre: 'Ataúd Nogal',       producto_descripcion: 'Ataúd de madera oscura de nogal con acabado satinado.',            producto_precio: 2800000, producto_imagen: 'img/Ataud4.jpg' },
];

const Ataud = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const cargarAtaudes = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/productos/filtrar?nombre=ataud`);
        const data = res.data?.data || [];
        setProductos(data.length > 0 ? data : ATAUDES_ESTATICOS);
      } catch {
        setProductos(ATAUDES_ESTATICOS);
      }
    };
    cargarAtaudes();
  }, []);

  return (
    <Container>
      <Row>
        <h2 className="text-center">ATAUDES</h2>
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

export default Ataud;
