import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Form, Card, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const UsuarioFront = () => {

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // 🔹 OBTENER USUARIOS (CON TOKEN)
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await authFetch(
          "http://localhost:3001/api/usuarios/usuariosAll"
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

  // 🔹 ELIMINAR USUARIO (CON TOKEN)
  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      const response = await authFetch(
        `http://localhost:3001/api/usuarios/deleteU/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Usuario eliminado correctamente");
        setUsuarios(usuarios.filter(u => u.usuario_id !== id));
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.usuario_documento?.toString().includes(busqueda)
  );

  return (
    <Container className="my-0">
      <Row className="mb-4">
        <Col>
          <h2 className="mt-5 mx-5">Lista de Usuarios</h2>
        </Col>
        <Col className="text-end">
          <Button className="mt-5 mx-5"
            as={Link}
            to="/usuarios/AgregarUsuario"
            style={{ background: "#7856AE", border: "#7856AE" }}
          >
            Agregar Usuario
          </Button>
        </Col>
      </Row>

      {/* BÚSQUEDA */}
      <Form className="mb-3">
        <Row>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Buscar por documento"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Button variant="outline-dark" className="me-2">
              Buscar
            </Button>
            <Button variant="outline-dark" onClick={() => setBusqueda("")}>
              Mostrar todos
            </Button>
          </Col>
        </Row>
      </Form>

      {/* TABLA */}
      <Table striped bordered hover>
        <thead className="table-secondary">
          <tr>
            <th>Rol</th>
            <th>Documento</th>
            <th>Primer Nombre</th>
            <th>Segundo Nombre</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuariosFiltrados.map(usuario => (
            <tr key={usuario.usuario_id}>
              <td>{usuario.rol_nombre}</td>
              <td>{usuario.usuario_documento}</td>
              <td>{usuario.usuario_primer_nombre}</td>
              <td>{usuario.usuario_segundo_nombre}</td>
              <td>{usuario.usuario_primer_apellido}</td>
              <td>{usuario.usuario_segundo_apellido}</td>
              <td>{usuario.usuario_correo}</td>
              <td>{usuario.usuario_direccion}</td>
              <td>{usuario.telefono || "---" }</td>

              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-dark">
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
                      onClick={() => eliminarUsuario(usuario.usuario_id)}
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

export default UsuarioFront;
