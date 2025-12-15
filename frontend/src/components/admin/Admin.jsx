import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <Container fluid style={{ padding: 20 }}>
      <Row className="mb-4">
        <Col>
          <h2>Panel de Administración</h2>
          <p className="text-muted">Accesos rápidos y gestión global del sistema.</p>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Usuarios</Card.Title>
              <Card.Text>Gestionar usuarios, roles y credenciales.</Card.Text>
              <Button as={Link} to="/usuarios/Usuario" variant="primary">Ir a Usuarios</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Categorías</Card.Title>
              <Card.Text>Administrar categorías de productos y servicios.</Card.Text>
              <Button as={Link} to="/categorias" variant="primary">Ir a Categorías</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Reportes</Card.Title>
              <Card.Text>Acceder a reportes y estadísticas.</Card.Text>
              <Button as={Link} to="/reportes" variant="primary">Ver Reportes</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
