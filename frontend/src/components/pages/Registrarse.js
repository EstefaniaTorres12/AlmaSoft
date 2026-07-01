import React, { useState } from "react";
import { Container, Form, Card, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../config/api";

const Registrarse = () => {

    const [formData, setData] = useState({
        DocumentoCliente: '',
        PrimerNombreCliente: '',
        SegundoNombreCliente: '',
        PrimerApellidoCliente: '',
        SegundoApellidoCliente: '',
        DireccionCliente: '',
        TelefonoCliente: '',
        CorreoCliente: '',
        Credencial: '',
        FechaNacimiento: ''
    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const enviarDatos = async (e) => {
        e.preventDefault();

        const usuario = {
            rol_id: 1,
            usuario_documento: formData.DocumentoCliente,
            usuario_primer_nombre: formData.PrimerNombreCliente,
            usuario_segundo_nombre: formData.SegundoNombreCliente,
            usuario_primer_apellido: formData.PrimerApellidoCliente,
            usuario_segundo_apellido: formData.SegundoApellidoCliente,
            usuario_direccion: formData.DireccionCliente,
            usuario_telefono: formData.TelefonoCliente,
            usuario_correo: formData.CorreoCliente.toLowerCase(),
            usuario_credencial: formData.Credencial,
            cliente_fecha_nacimiento: formData.FechaNacimiento
        };

        try {
            const response = await fetch(
                `${API_URL}/api/usuarios/usuarioCreate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(usuario)
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setMostrarAlerta(true);

                setData({
                    DocumentoCliente: '',
                    PrimerNombreCliente: '',
                    SegundoNombreCliente: '',
                    PrimerApellidoCliente: '',
                    SegundoApellidoCliente: '',
                    DireccionCliente: '',
                    TelefonoCliente: '',
                    CorreoCliente: '',
                    Credencial: '',
                    FechaNacimiento: ''
                });
            } else {
                alert("Error: " + (data.message || "No fue posible registrar el usuario"));
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundImage: `url(/img/backgrounds/3302177.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Container style={{ maxWidth: "600px" }}>
                <Card>
                    <Card.Header>
                        <h3 className="text-center">Registrarse</h3>

                        {mostrarAlerta && (
                            <Alert
                                variant="success"
                                onClose={() => setMostrarAlerta(false)}
                                dismissible
                            >
                                Usuario registrado correctamente
                            </Alert>
                        )}
                    </Card.Header>

                    <Card.Body>
                        <Form onSubmit={enviarDatos}>

                            <Form.Group className="mb-3">
                                <Form.Label>DOCUMENTO</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="DocumentoCliente"
                                    value={formData.DocumentoCliente}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>PRIMER NOMBRE</Form.Label>
                                <Form.Control
                                    name="PrimerNombreCliente"
                                    value={formData.PrimerNombreCliente}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>SEGUNDO NOMBRE</Form.Label>
                                <Form.Control
                                    name="SegundoNombreCliente"
                                    value={formData.SegundoNombreCliente}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>PRIMER APELLIDO</Form.Label>
                                <Form.Control
                                    name="PrimerApellidoCliente"
                                    value={formData.PrimerApellidoCliente}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>SEGUNDO APELLIDO</Form.Label>
                                <Form.Control
                                    name="SegundoApellidoCliente"
                                    value={formData.SegundoApellidoCliente}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>DIRECCION</Form.Label>
                                <Form.Control
                                    name="DireccionCliente"
                                    value={formData.DireccionCliente}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>TELEFONO</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="TelefonoCliente"
                                    value={formData.TelefonoCliente}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>CORREO</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="CorreoCliente"
                                    value={formData.CorreoCliente}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>CONTRASEÑA</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="Credencial"
                                    value={formData.Credencial}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>FECHA DE NACIMIENTO</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="FechaNacimiento"
                                    value={formData.FechaNacimiento}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" className="w-100">
                                Guardar
                            </Button>

                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Registrarse;
