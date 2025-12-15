import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { usuarioAPI } from "../../services/api";

const AgregarUsuarioConAPI = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        usuario_nombre: "",
        usuario_apellido: "",
        usuario_email: "",
        usuario_documento: "",
        usuario_contrasena: "",
        rol_id: "3", // Por defecto Cliente
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await usuarioAPI.crear(formData);
            
            if (response.success) {
                setSuccess(true);
                alert("Usuario creado exitosamente");
                setTimeout(() => {
                    navigate("/usuarios/Usuario");
                }, 1500);
            } else {
                setError(response.message || "Error al crear el usuario");
            }
        } catch (err) {
            setError("Error al crear el usuario: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col md={8} lg={6} className="mx-auto">
                    <h2>Agregar Nuevo Usuario</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Usuario creado exitosamente</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuario_nombre"
                                value={formData.usuario_nombre}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuario_apellido"
                                value={formData.usuario_apellido}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="usuario_email"
                                value={formData.usuario_email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Documento</Form.Label>
                            <Form.Control
                                type="text"
                                name="usuario_documento"
                                value={formData.usuario_documento}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="usuario_contrasena"
                                value={formData.usuario_contrasena}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="rol_id"
                                value={formData.rol_id}
                                onChange={handleChange}
                            >
                                <option value="1">Administrador</option>
                                <option value="2">Asesor</option>
                                <option value="3">Cliente</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                style={{ background: "#7856AE", border: "#7856AE" }}
                            >
                                {loading ? "Guardando..." : "Guardar Usuario"}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AgregarUsuarioConAPI;
