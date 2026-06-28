import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Row,
  Col,
  Form,
  Card,
  Button,
  Dropdown
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";
import "./UsuarioFront.css";

const UsuarioFront = () => {

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {

    const fetchUsuarios = async () => {

      try {

        const response = await authFetch(
          `${API_URL}/api/usuarios/usuariosAll`
        );

        const data = await response.json();

        if (response.ok) {
          setUsuarios(data.data);
        } else {
          alert(data.message || "Error al obtener usuarios");
        }

      } catch (err) {

        console.error(err);
        alert("Error conectando con el backend");

      }

    };

    fetchUsuarios();

  }, []);

  const eliminarUsuario = async (id) => {

    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {

      const response = await authFetch(
        `${API_URL}/api/usuarios/deleteU/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Usuario eliminado correctamente");

        setUsuarios(
          usuarios.filter(
            (u) => u.usuario_id !== id
          )
        );

      } else {

        alert(data.message);

      }

    } catch (err) {

      console.error(err);
      alert("Error al eliminar usuario");

    }

  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.usuario_documento?.toString().includes(busqueda)
  );

  return (

    <Container fluid className="usuarios-page">

      {/* HEADER */}

      <Card className="header-card">

        <Card.Body>

          <Row className="align-items-center">

            <Col>

              <h2 className="titulo">
                Gestión de Usuarios
              </h2>

              <p className="subtitulo">
                Administra los usuarios registrados en el sistema.
              </p>

            </Col>

            <Col xs="auto">

              <Button
                as={Link}
                to="/usuarios/AgregarUsuario"
                className="btn-principal"
              >
                Agregar Usuario
              </Button>

            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* BUSCADOR */}

      <Card className="search-card">

        <Card.Body>

          <Row className="align-items-center g-3">

            <Col lg={8}>

              <Form.Control

                type="text"
                placeholder="Buscar por documento"
                value={busqueda}
                onChange={(e) =>
                  setBusqueda(e.target.value)
                }
                className="input-search"

              />

            </Col>
            <Col lg={4} className="text-lg-end">
              <Button
                variant="outline-dark"
                className="me-2"
              >
                Buscar
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => setBusqueda("")}
              >
                Mostrar todos
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <div className="contador">
        <span className="contador-pill">
          {usuariosFiltrados.length} Usuarios registrados
        </span>
      </div>

      <Card className="tabla-card">
        <Card.Body>
          <div className="table-responsive">
            <Table
              hover
              className="align-middle mb-0 tabla-usuarios"
            >
              <thead>
                <tr>
                  <th>Rol</th>
                  <th>Documento</th>
                  <th>Primer Nombre</th>
                  <th>Primer Apellido</th>
                  <th>Email</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {
                  usuariosFiltrados.length === 0 ?
                    <tr>

                      <td
                        colSpan={10}
                        className="text-center py-5"
                      >
                        No se encontraron usuarios.
                      </td>
                    </tr>
                    :usuariosFiltrados.map((usuario) => (

                      <tr key={usuario.usuario_id}>
                        <td>{usuario.rol_nombre}</td>
                        <td>{usuario.usuario_documento}</td>
                        <td>{usuario.usuario_primer_nombre}</td>
                        <td>{usuario.usuario_primer_apellido}</td>
                        <td>{usuario.usuario_correo}</td>
                        <td>{usuario.usuario_direccion}</td>
                        <td>{usuario.telefono || "---"}</td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="light"
                              className="acciones-btn"
                            >
                              Acciones
                            </Dropdown.Toggle>
                            <Dropdown.Menu>

                              <Dropdown.Item
                                as={Link}
                                to={`/usuarios/EditarUsuario/${usuario.usuario_id}`}
                              >
                                Editar
                              </Dropdown.Item>

                              <Dropdown.Item
                                as={Link}
                                to={`/usuarios/DetallesUsuario/${usuario.usuario_id}`}
                              >
                                Detalles
                              </Dropdown.Item>

                              <Dropdown.Item
                                onClick={() =>
                                  eliminarUsuario(usuario.usuario_id)
                                }
                              >
                                Eliminar
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );

};

export default UsuarioFront;