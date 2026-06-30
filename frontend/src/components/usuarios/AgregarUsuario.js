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
// eslint-disable-next-line no-unused-vars
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api";
import "./AgregarUsuario.css";

const AgregarUsuario = () => {

    const [formData, setData] = useState({
        Rol: '',
        Documento: '',
        PrimerNombre: '',
        SegundoNombre: '',
        PrimerApellido: '',
        SegundoApellido: '',
        Direccion: '',
        Telefono: '',
        Correo: '',
        Credencial: '',
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
            rol_id: parseInt(formData.Rol),
            usuario_documento: formData.Documento,
            usuario_primer_nombre: formData.PrimerNombre,
            usuario_segundo_nombre: formData.SegundoNombre,
            usuario_primer_apellido: formData.PrimerApellido,
            usuario_segundo_apellido: formData.SegundoApellido,
            usuario_direccion: formData.Direccion,
            usuario_telefono: formData.Telefono,
            usuario_correo: formData.Correo.toLowerCase(),
            usuario_credencial: formData.Credencial,
            cliente_fecha_nacimiento: formData.FechaNacimiento || null
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

            if (response.ok) {

                setMostrarAlerta(true);

                setData({
                    Rol: '',
                    Documento: '',
                    PrimerNombre: '',
                    SegundoNombre: '',
                    PrimerApellido: '',
                    SegundoApellido: '',
                    Direccion: '',
                    Telefono: '',
                    Correo: '',
                    Credencial: '',
                });

            } else {

                alert("Error: " + data.message);

            }

        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor");
        }
    };

    return (

        <Container fluid className="usuarios-page">

            {/* HEADER */}

            <Card className="header-card mb-4">

                <div className="pattern"></div>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h2 className="titulo">
                                Agregar Usuario
                            </h2>
                            <p className="subtitulo">
                                Complete la información del nuevo usuario.
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {/* FORMULARIO */}
            <Card className="form-card">
                <Card.Body>
                    {mostrarAlerta && (

                        <Alert
                            variant="success"
                            dismissible
                            onClose={() => setMostrarAlerta(false)}
                            className="mb-4"
                        >

                            Usuario creado correctamente.

                        </Alert>

                    )}

                    <Form onSubmit={enviarDatos}>

                        <h5 className="form-title mb-4">
                            Información General
                        </h5>

                        <Row>

                            <Col md={6}>

                                <Form.Group
                                    className="mb-4"
                                    controlId="Rol"
                                >

                                    <Form.Label>
                                        Rol
                                    </Form.Label>

                                    <Form.Select
                                        name="Rol"
                                        value={formData.Rol}
                                        onChange={handleChange}
                                        className="input-form"
                                    >

                                        <option value="">
                                            Seleccione un rol
                                        </option>

                                        <option value="3">
                                            Administrador
                                        </option>

                                        <option value="2">
                                            Asesor
                                        </option>

                                        <option value="1">
                                            Cliente
                                        </option>

                                    </Form.Select>

                                </Form.Group>

                            </Col>

                            <Col md={6}>

                                <Form.Group
                                    className="mb-4"
                                    controlId="Documento"
                                >

                                    <Form.Label>
                                        Documento
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="Documento"
                                        value={formData.Documento}
                                        onChange={handleChange}
                                        placeholder="Digite el documento del usuario"
                                        className="input-form"
                                    />

                                </Form.Group>

                            </Col>

                        </Row>
                                                {/* NOMBRES */}

                        <Row>

                            <Col md={6}>

                                <Form.Group
                                    className="mb-4"
                                    controlId="PrimerNombre"
                                >

                                    <Form.Label>
                                        Primer Nombre
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="PrimerNombre"
                                        value={formData.PrimerNombre}
                                        onChange={handleChange}
                                        placeholder="Digite el primer nombre"
                                        className="input-form"
                                    />

                                </Form.Group>

                            </Col>

                            <Col md={6}>

                                <Form.Group
                                    className="mb-4"
                                    controlId="SegundoNombre"
                                >

                                    <Form.Label>
                                        Segundo Nombre
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="SegundoNombre"
                                        value={formData.SegundoNombre}
                                        onChange={handleChange}
                                        placeholder="Digite el segundo nombre"
                                        className="input-form"
                                    />

                                </Form.Group>

                            </Col>

                        </Row>

                        {/* APELLIDOS */}

                        <Row>
                            <Col md={6}>

                                <Form.Group
                                    className="mb-4"
                                    controlId="PrimerApellido"
                                >

                                    <Form.Label>
                                        Primer Apellido
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="PrimerApellido"
                                        value={formData.PrimerApellido}
                                        onChange={handleChange}
                                        placeholder="Digite el primer apellido"
                                        className="input-form"
                                    />

                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group
                                    className="mb-4"
                                    controlId="SegundoApellido"
                                >
                                    <Form.Label>
                                        Segundo Apellido
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="SegundoApellido"
                                        value={formData.SegundoApellido}
                                        onChange={handleChange}
                                        placeholder="Digite el segundo apellido"
                                        className="input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* DIRECCIÓN */}
                        <Form.Group
                            className="mb-4"
                            controlId="Direccion"
                        >
                            <Form.Label>
                                Dirección
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="Direccion"
                                value={formData.Direccion}
                                onChange={handleChange}
                                placeholder="Digite la dirección"
                                className="input-form"
                            />
                        </Form.Group>
                        {/* TELÉFONO Y CORREO */}
                        <Row>
                            <Col md={6}>
                                <Form.Group
                                    className="mb-4"
                                    controlId="Telefono"
                                >
                                    <Form.Label>
                                        Teléfono
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Telefono"
                                        value={formData.Telefono}
                                        onChange={handleChange}
                                        placeholder="Digite el teléfono"
                                        className="input-form"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group
                                    className="mb-4"
                                    controlId="Correo"
                                >
                                    <Form.Label>
                                        Correo
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="Correo"
                                        value={formData.Correo}
                                        onChange={handleChange}
                                        placeholder="Digite el correo"
                                        className="input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* CONTRASEÑA */}
                        <Form.Group
                            className="mb-4"
                            controlId="Credencial"
                        >
                            <Form.Label>
                                Contraseña
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="Credencial"
                                value={formData.Credencial}
                                onChange={handleChange}
                                placeholder="Digite la contraseña del usuario"
                                className="input-form"
                                required
                            />
                        </Form.Group>

                        {/* BOTONES */}
                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button
                                className="btn-secundario"
                                type="button"
                                as={Link}
                                to="/usuarios"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="btn-principal"
                                type="submit"
                            >
                                Guardar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
};
export default AgregarUsuario;