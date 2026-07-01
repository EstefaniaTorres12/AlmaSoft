import { API_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const PlanesFront = () => {

  const [planes, setPlanes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // OBTENER PLANES
  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/planes/all`);
        const data = await res.json();

        if (res.ok) {
          setPlanes(data.data);
        } else {
          alert("Error al obtener planes");
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchPlanes();
  }, []);

  //  FILTRO
  const planesFiltrados = planes.filter(p =>
    p.plan_nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className="my-0">

      <Row className="mb-4">
        <Col>
          <h2 className="mt-5 mx-5">Lista de Planes</h2>
        </Col>

        <Col className="text-end">
          <Button
            className="mt-5 mx-5"
            as={Link}
            to="/asesor/agregar-plan"
            style={{ background: "#7856AE", border: "#7856AE" }}
          >
            Agregar Plan
          </Button>
        </Col>
      </Row>

      {/*  BUSQUEDA */}
      <Form className="mb-3">
        <Row>
          <Col md={8}>
            <Form.Control
              placeholder="Buscar plan"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Col>

          <Col md={4}>
            <Button variant="outline-dark" onClick={() => setBusqueda("")}>
              Limpiar
            </Button>
          </Col>
        </Row>
      </Form>

      {/*  TABLA */}
      <Table striped bordered hover>
        <thead className="table-secondary">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {planesFiltrados.map(p => (
            <tr key={p.plan_id}>

              <td>{p.plan_nombre}</td>
              <td>${p.plan_precio}</td>

              <td>
                {p.plan_estado === 1 ? "Activo" : "Inactivo"}
              </td>

              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-dark">
                    Acciones
                  </Dropdown.Toggle>

                  <Dropdown.Menu>

                    <Dropdown.Item
                      as={Link}
                      to={`/asesor/editar-plan/${p.plan_id}`}
                    >
                      Editar
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

export default PlanesFront;