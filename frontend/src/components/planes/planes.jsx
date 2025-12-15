import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useToast } from "../../App";
import { useNavigate } from "react-router-dom";

const Planes = () => {
  const navigate = useNavigate();
  const { success, info } = useToast();

  const planes = [
    { id: 1, nombre: "Plan Básico", precio: "$50.000", beneficios: ["Atención básica", "Ceremonia sencilla", "Asesoría familiar"] },
    { id: 2, nombre: "Plan Familiar", precio: "$120.000", beneficios: ["Cobertura para 4 personas", "Ceremonia personalizada", "Atención psicológica"] },
    { id: 3, nombre: "Plan Premium", precio: "$250.000", beneficios: ["Cobertura total", "Ceremonia premium", "Asistencia legal y psicológica"] },
  ];

  const seleccionarPlan = (plan) => {
    success(`${plan.nombre} seleccionado`);
    navigate("/compras"); // redirige a compras
  };

  return (
<Container fluid style={{ padding: "20px 25px" }}>
        <Row className="mb-4">
        <Col>
          <h2>Lista de Planes</h2>
        </Col>
        <Col className="text-end">
          <Button style={{ background: "#7856AE", border: "#7856AE" }} onClick={() => info("Acción Agregar Plan") }>
            Agregar Plan
          </Button>
        </Col>
      </Row>

      <Row>
        {planes.map((plan) => (
          <Col md={4} key={plan.id} className="mb-4">
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-center">{plan.nombre}</Card.Title>
                <Card.Text className="text-center fs-4 fw-bold text-primary">{plan.precio}</Card.Text>
                <ul className="flex-grow-1">
                  {plan.beneficios.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <Button 
                  style={{ background: "#7856AE", border: "#7856AE" }} 
                  onClick={() => seleccionarPlan(plan)}
                  className="w-100 mt-auto"
                >
                  Seleccionar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Planes;
