import React, { useState } from "react";
import {
    Container,
    Card,
    Form,
    Button,
    Alert,
    Row,
    Col
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import "./AgregarCliente.css";

const AgregarCliente = () => {

    const navigate = useNavigate();

    const [formData, setData] = useState({
        DocumentoCliente: '',
        PrimerNombreCliente: '',
        SegundoNombreCliente: '',
        PrimerApellidoCliente: '',
        SegundoApellidoCliente: '',
        DireccionCliente: '',
        TelefonoCliente: '',
        CorreoCliente: '',
        FechaNacimiento: '',
        EdadCliente: '',
        CredencialCliente: ''
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

        try {

            const response = await fetch(`${API_URL}/api/clientes`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization":
                        "Bearer " + localStorage.getItem("token")

                },

                body: JSON.stringify({

                    usuario_documento: formData.DocumentoCliente,

                    usuario_primer_nombre: formData.PrimerNombreCliente,

                    usuario_segundo_nombre: formData.SegundoNombreCliente,

                    usuario_primer_apellido: formData.PrimerApellidoCliente,

                    usuario_segundo_apellido: formData.SegundoApellidoCliente,

                    usuario_direccion: formData.DireccionCliente,

                    usuario_telefono: formData.TelefonoCliente,

                    usuario_correo: formData.CorreoCliente,

                    cliente_fecha_nacimiento: formData.FechaNacimiento,

                    cliente_edad: formData.EdadCliente,

                    usuario_credencial: formData.CredencialCliente

                })

            });

            const data = await response.json();

            if (data.success) {

                setMostrarAlerta(true);

                setTimeout(() => {

                    navigate("/clientes");

                }, 1500);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.error(error);

            alert("Error al crear cliente");

        }

    };

    return (

        <Container fluid className="agregar-cliente-page">

            <Card className="agregar-cliente-header mb-4">
                <div className="pattern"></div>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h2 className="agregar-cliente-title">
                                Agregar Cliente
                            </h2>
                            <p className="agregar-cliente-subtitle">
                                Complete la información del nuevo cliente.
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="agregar-cliente-form-card">
                <Card.Body>
                    {mostrarAlerta && (
                        <Alert
                            variant="success"
                            dismissible
                            onClose={() => setMostrarAlerta(false)}
                        >
                            Cliente creado correctamente.
                        </Alert>
                    )}
                    <Form onSubmit={enviarDatos}>
                        <h5 className="form-title mb-4">
                            Información Personal
                        </h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Documento
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="DocumentoCliente"
                                        value={formData.DocumentoCliente}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Primer Nombre
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="PrimerNombreCliente"
                                        value={formData.PrimerNombreCliente}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Segundo Nombre
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="SegundoNombreCliente"
                                        value={formData.SegundoNombreCliente}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Primer Apellido
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="PrimerApellidoCliente"
                                        value={formData.PrimerApellidoCliente}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Segundo Apellido
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="SegundoApellidoCliente"
                                        value={formData.SegundoApellidoCliente}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                
                        <h5 className="form-title mb-4 mt-2">
                            Información de Contacto
                        </h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Dirección
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="DireccionCliente"
                                        value={formData.DireccionCliente}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Teléfono
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="TelefonoCliente"
                                        value={formData.TelefonoCliente}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Correo
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="CorreoCliente"
                                        value={formData.CorreoCliente}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Fecha de Nacimiento
                                    </Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="FechaNacimiento"
                                        value={formData.FechaNacimiento}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Edad
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="EdadCliente"
                                        value={formData.EdadCliente}
                                        onChange={handleChange}
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <h5 className="form-title mb-4 mt-2">
                            Credenciales
                        </h5>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Contraseña
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="CredencialCliente"
                                        value={formData.CredencialCliente}
                                        onChange={handleChange}
                                        placeholder="Digite la contraseña"
                                        className="cliente-input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button
                                className="cliente-btn-secundario"
                                as={Link}
                                to="/clientes"
                                type="button"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="cliente-btn-principal"
                                type="submit"
                            >
                                Guardar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AgregarCliente;