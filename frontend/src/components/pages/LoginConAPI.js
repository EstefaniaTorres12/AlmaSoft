import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { usuarioAPI, guardarToken } from "../../services/api";

const LoginConAPI = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await usuarioAPI.login(credentials.email, credentials.password);
            
            if (response.success) {
                // Guardar token si se proporciona
                if (response.data && response.data.token) {
                    guardarToken(response.data.token);
                }
                alert("Login exitoso");
                navigate("/usuarios/Usuario");
            } else {
                setError(response.message || "Error al iniciar sesión");
            }
        } catch (err) {
            setError("Error al iniciar sesión: " + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row>
                <Col md={6} lg={4} className="mx-auto">
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
                    
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="Tu contraseña"
                                required
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                style={{ background: "#7856AE", border: "#7856AE" }}
                            >
                                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </Button>
                        </div>
                    </Form>

                    <p className="text-center mt-3">
                        ¿No tienes cuenta? <a href="/registrarse">Regístrate aquí</a>
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginConAPI;
