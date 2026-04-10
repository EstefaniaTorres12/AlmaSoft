import React, { useEffect, useState } from "react";
import { Container, Table, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const PlanFront = () => {

  const [planes, setPlanes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await authFetch("http://localhost:3001/api/planes");

        const data = await response.json();

        if (response.ok) {
          setPlanes(data.data);
        } else {
          alert("Error al obtener planes");
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchPlanes();
  }, []);

  const eliminarPlan = async (id) => {
    if (!window.confirm("¿Eliminar este plan?")) return;

    try {
      const response = await authFetch(
        `http://localhost:3001/api/planes/delete/${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setPlanes(planes.filter(p => p.plan_id !== id));
      }

    } catch (error) {
      console.error(error);
    }
  };

  const planesFiltrados = planes.filter(p =>
    p.plan_nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2 className="mt-5 mx-5">Planes Fúnebres</h2>
        </Col>
        <Col className="text-end">
          <Button
            as={Link}
            to="/planes/agregar"
            className="mt-5 mx-5"
            style={{ background: "#7856AE", border: "#7856AE" }}
          >
            Agregar Plan
          </Button>
        </Col>
      </Row>

      <Form className="mb-3">
        <Form.Control
          placeholder="Buscar plan..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {planesFiltrados.map(plan => (
            <tr key={plan.plan_id}>
              <td>{plan.plan_id}</td>
              <td>{plan.plan_nombre}</td>
              <td>{plan.plan_descripcion}</td>
              <td>${plan.plan_precio}</td>
              <td>{plan.plan_estado === 1 ? "Activo" : "Inactivo"}</td>

              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="dark">Acciones</Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to={`/planes/editar/${plan.plan_id}`}
                    >
                      Editar
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => eliminarPlan(plan.plan_id)}
                    >
                      Eliminar
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PlanFront;