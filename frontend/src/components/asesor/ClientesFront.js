import { API_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const ClientesFront = () => {

  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // OBTENER CLIENTES
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/clientes/clientesAll`);
        const data = await res.json();

        if (res.ok) {
          setClientes(data.data);
        } else {
          alert("Error al obtener clientes");
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchClientes();
  }, []);

  //  FILTRO
  const clientesFiltrados = clientes.filter(c =>
    c.usuario_primer_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.usuario_correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.usuario_documento?.toString().includes(busqueda)
  );

  return (
    <Container className="my-0">

      <Row className="mb-4">
        <Col>
          <h2 className="mt-5 mx-5">Lista de Clientes</h2>
        </Col>

        <Col className="text-end">
          <Button
            className="mt-5 mx-5"
            as={Link}
            to="/asesor/agregar-cliente"
            style={{ background: "#7856AE", border: "#7856AE" }}
          >
            Agregar Cliente
          </Button>
        </Col>
      </Row>

      {/*  BUSQUEDA */}
      <Form className="mb-3">
        <Row>
          <Col md={8}>
            <Form.Control
              placeholder="Buscar cliente por nombre, correo o documento"
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
            <th>Documento</th>
            <th>Nombre Completo</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {clientesFiltrados.map(c => (
            <tr key={c.usuario_id}>

              <td>{c.usuario_documento}</td>

              <td>{`${c.usuario_primer_nombre} ${c.usuario_segundo_nombre || ''} ${c.usuario_primer_apellido} ${c.usuario_segundo_apellido || ''}`.trim()}</td>

              <td>{c.usuario_correo}</td>

              <td>{c.usuario_direccion}</td>

              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-dark">
                    Acciones
                  </Dropdown.Toggle>

                  <Dropdown.Menu>

                    <Dropdown.Item
                      as={Link}
                      to={`/asesor/editar-cliente/${c.usuario_id}`}
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

export default ClientesFront;