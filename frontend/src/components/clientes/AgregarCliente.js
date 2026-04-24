import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

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
            const response = await fetch("http://localhost:3001/api/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
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
            console.error("Error:", error);
            alert("Error al crear cliente");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "600px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Agregar Nuevo Cliente</h3>

                    {mostrarAlerta && (
                        <Alert variant="success" onClose={() => setMostrarAlerta(false)} dismissible>
                            Datos enviados correctamente
                        </Alert>
                    )}

                </Card.Header>

                <Card.Body>
                    <Form onSubmit={enviarDatos}>

                        <Form.Group className="mb-3">
                            <Form.Label>DOCUMENTO</Form.Label>
                            <Form.Control
                                type="text"
                                name="DocumentoCliente"
                                value={formData.DocumentoCliente}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>PRIMER NOMBRE</Form.Label>
                            <Form.Control
                                type="text"
                                name="PrimerNombreCliente"
                                value={formData.PrimerNombreCliente}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>SEGUNDO NOMBRE</Form.Label>
                            <Form.Control
                                type="text"
                                name="SegundoNombreCliente"
                                value={formData.SegundoNombreCliente}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>PRIMER APELLIDO</Form.Label>
                            <Form.Control
                                type="text"
                                name="PrimerApellidoCliente"
                                value={formData.PrimerApellidoCliente}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>SEGUNDO APELLIDO</Form.Label>
                            <Form.Control
                                type="text"
                                name="SegundoApellidoCliente"
                                value={formData.SegundoApellidoCliente}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>DIRECCION</Form.Label>
                            <Form.Control
                                type="text"
                                name="DireccionCliente"
                                value={formData.DireccionCliente}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>TELEFONO</Form.Label>
                            <Form.Control
                                type="text"
                                name="TelefonoCliente"
                                value={formData.TelefonoCliente}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>CORREO</Form.Label>
                            <Form.Control
                                type="text"
                                name="CorreoCliente"
                                value={formData.CorreoCliente}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>FECHA DE NACIMIENTO</Form.Label>
                            <Form.Control
                                type="date"
                                name="FechaNacimiento"
                                value={formData.FechaNacimiento}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>EDAD</Form.Label>
                            <Form.Control
                                type="text"
                                name="EdadCliente"
                                value={formData.EdadCliente}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CONTRASEÑA</Form.Label>
                            <Form.Control
                                type="password"
                                name="CredencialCliente"
                                value={formData.CredencialCliente}
                                onChange={handleChange}
                                placeholder="Digite la contraseña"
                            />
                        </Form.Group>

                        <Button type="submit" style={{ background: "#7856AE", border: "#7856AE" }}>
                            Guardar
                        </Button>

                        <Button
                            style={{ background: "#7856AE", border: "#7856AE" }}
                            className="mx-5"
                            as={Link}
                            to="/clientes"
                        >
                            Cancelar
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AgregarCliente;