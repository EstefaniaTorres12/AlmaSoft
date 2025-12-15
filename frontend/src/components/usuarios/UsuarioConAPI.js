import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Form, Button, Dropdown, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { usuarioAPI } from "../../services/api";

const UsuarioConAPI = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroRol, setFiltroRol] = useState("Todos");

    // Cargar usuarios al montar el componente
    useEffect(() => {
        cargarUsuarios();
    }, []);

    // Cargar usuarios desde la API
    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Nota: La API actual no tiene un endpoint para obtener todos los usuarios
            // Este es un ejemplo de cómo se haría si existiera
            // Por ahora, usaremos datos de ejemplo
            const datos = [
                {
                    usuario_id: 1,
                    usuario_nombre: "Anderson",
                    usuario_apellido: "Montoya",
                    usuario_email: "anderson@gmail.com",
                    usuario_documento: "1025887459",
                    rol_id: 3,
                },
                {
                    usuario_id: 2,
                    usuario_nombre: "Esteban",
                    usuario_apellido: "Martinez",
                    usuario_email: "esteban@gmail.com",
                    usuario_documento: "1025887458",
                    rol_id: 1,
                },
                {
                    usuario_id: 3,
                    usuario_nombre: "Sara",
                    usuario_apellido: "Mendoza",
                    usuario_email: "sara@gmail.com",
                    usuario_documento: "1025887457",
                    rol_id: 2,
                },
            ];
            
            setUsuarios(datos);
            setUsuariosFiltrados(datos);
        } catch (err) {
            setError("Error al cargar los usuarios");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar usuarios por búsqueda
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = usuarios.filter((usuario) =>
            usuario.usuario_nombre.toLowerCase().includes(value) ||
            usuario.usuario_email.toLowerCase().includes(value) ||
            usuario.usuario_documento.includes(value)
        );

        setUsuariosFiltrados(filtered);
    };

    // Filtrar por rol
    const handleFiltroRol = (rol) => {
        setFiltroRol(rol);
        if (rol === "Todos") {
            setUsuariosFiltrados(usuarios);
        } else {
            const filtered = usuarios.filter((u) => u.rol_id.toString() === rol);
            setUsuariosFiltrados(filtered);
        }
    };

    // Eliminar usuario
    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            try {
                const response = await usuarioAPI.eliminar(id);
                if (response.success) {
                    setUsuarios(usuarios.filter((u) => u.usuario_id !== id));
                    setUsuariosFiltrados(usuariosFiltrados.filter((u) => u.usuario_id !== id));
                    alert("Usuario eliminado exitosamente");
                } else {
                    alert("Error al eliminar: " + response.message);
                }
            } catch (err) {
                alert("Error al eliminar el usuario");
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" />
                <p>Cargando usuarios...</p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4">
                <Col>
                    <h2>Lista de Usuarios</h2>
                </Col>
                <Col className="text-end">
                    <Link to="/usuarios/AgregarUsuario" className="btn btn-primary" style={{ background: "#7856AE", border: "#7856AE" }}>
                        Agregar Usuario
                    </Link>
                </Col>
            </Row>

            <Form className="mb-3">
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Buscar por nombre, email o documento</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingresa el dato a buscar..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Filtrar por rol</Form.Label>
                            <Form.Select
                                value={filtroRol}
                                onChange={(e) => handleFiltroRol(e.target.value)}
                            >
                                <option value="Todos">Todos</option>
                                <option value="1">Administrador</option>
                                <option value="2">Asesor</option>
                                <option value="3">Cliente</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead style={{ background: "#7856AE", color: "white" }}>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Documento</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.length > 0 ? (
                            usuariosFiltrados.map((usuario) => (
                                <tr key={usuario.usuario_id}>
                                    <td>{usuario.usuario_id}</td>
                                    <td>{usuario.usuario_nombre} {usuario.usuario_apellido}</td>
                                    <td>{usuario.usuario_email}</td>
                                    <td>{usuario.usuario_documento}</td>
                                    <td>
                                        {usuario.rol_id === 1 && "Administrador"}
                                        {usuario.rol_id === 2 && "Asesor"}
                                        {usuario.rol_id === 3 && "Cliente"}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/usuarios/detalles/${usuario.usuario_id}`}
                                            className="btn btn-sm btn-info me-2"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            to={`/usuarios/EditarUsuario/${usuario.usuario_id}`}
                                            className="btn btn-sm btn-warning me-2"
                                        >
                                            Editar
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleEliminar(usuario.usuario_id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No se encontraron usuarios
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default UsuarioConAPI;
