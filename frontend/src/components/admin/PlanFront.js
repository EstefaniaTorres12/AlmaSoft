import React, { useEffect, useState } from "react";
import { Container, Table, Row, Col, Form, Button, Dropdown, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";
import "./Producto.css";

const PlanFront = () => {

  const [planes, setPlanes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await authFetch(`${API_URL}/api/planes`);

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
        `${API_URL}/api/planes/delete/${id}`,
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
    <Container fluid className="producto-page">
      <Card className="producto-header mb-4">
        <div className="pattern"></div>
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <h2 className="producto-title">Gestión de Planes Fúnebres</h2>
              <p className="producto-subtitle">
                Administre los planes fúnebres disponibles y mantenga su catálogo actualizado.
              </p>
            </Col>
            <Col xs="auto">
              <Button as={Link} to="/planes/agregar" className="producto-btn-principal">
                Agregar Plan
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="producto-search-card mb-4">
        <Card.Body>
          <Form>
            <Row className="align-items-center g-3">
              <Col lg={8}>
                <Form.Control
                  className="producto-input-search"
                  placeholder="Buscar plan..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </Col>
              <Col lg={4} className="text-lg-end">
                <Button className="producto-btn-secundario" onClick={() => setBusqueda("")}>
                  Limpiar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <div className="producto-contador">
        <span className="producto-pill">{planesFiltrados.length} planes registrados</span>
      </div>

      <Card className="producto-table-card">
        <Card.Body>
          <div className="table-responsive">
            <Table hover className="producto-table align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th className="text-center" style={{ width: "170px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {planesFiltrados.map((plan) => (
                  <tr key={plan.plan_id}>
                    <td>{plan.plan_id}</td>
                    <td>{plan.plan_nombre}</td>
                    <td>{plan.plan_descripcion}</td>
                    <td>${plan.plan_precio}</td>
                    <td>
                      <span
                        className={`estado-badge ${
                          plan.plan_estado === 1 ? "estado-activo" : "estado-inactivo"
                        }`}
                      >
                        {plan.plan_estado === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="text-center">
                      <Dropdown>
                        <Dropdown.Toggle className="producto-acciones-btn" id="dropdown-acciones">
                          Acciones
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item as={Link} to={`/planes/editar/${plan.plan_id}`}>
                            Editar
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => eliminarPlan(plan.plan_id)}>
                            Eliminar
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PlanFront;