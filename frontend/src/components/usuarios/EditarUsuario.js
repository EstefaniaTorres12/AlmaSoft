import React, { useState, useEffect } from "react";
import {
    Container,
    Button,
    Form,
    Card,
    Row,
    Col
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";
import "./AgregarUsuario.css"; // Usa el mismo CSS

const EditarUsuario = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        rol_id: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        email: "",
        direccion: "",
        telefono: "",
        credencial: ""
    });

    useEffect(() => {

        const fetchUsuario = async () => {

            try {

                const response = await authFetch(
                    `${API_URL}/api/usuarios/id/${id}`
                );

                const data = await response.json();

                if (response.ok) {

                    setUsuario({
                        rol_id: data.data.rol_id,
                        primerNombre: data.data.usuario_primer_nombre || "",
                        segundoNombre: data.data.usuario_segundo_nombre || "",
                        primerApellido: data.data.usuario_primer_apellido || "",
                        segundoApellido: data.data.usuario_segundo_apellido || "",
                        direccion: data.data.usuario_direccion || "",
                        telefono: data.data.usuario_telefono || "",
                        email: data.data.usuario_correo || "",
                        credencial: ""
                    });

                } else {

                    alert(data.message);

                }

            } catch (err) {

                alert("Error al cargar el usuario");

            }

        };

        fetchUsuario();

    }, [id]);

    const handleChange = (e) => {

        setUsuario({

            ...usuario,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const usuarioActualizado = {

            rol_id: usuario.rol_id,

            usuario_primer_nombre: usuario.primerNombre,

            usuario_segundo_nombre: usuario.segundoNombre,

            usuario_primer_apellido: usuario.primerApellido,

            usuario_segundo_apellido: usuario.segundoApellido,

            usuario_direccion: usuario.direccion,

            usuario_correo: usuario.email.toLowerCase(),

            usuario_telefono: usuario.telefono,

            usuario_credencial: usuario.credencial || undefined

        };

        try {

            const response = await authFetch(

                `${API_URL}/api/usuarios/update/${id}`,

                {

                    method: "PUT",

                    body: JSON.stringify(usuarioActualizado)

                }

            );

            const data = await response.json();

            if (response.ok) {

                alert("Usuario actualizado correctamente");

                navigate("/usuarios");

            } else {

                alert(data.message);

            }

        } catch (err) {

            alert("Error al conectarse con el servidor");

        }

    };

    return (
        <Container fluid className="usuarios-page">
            <Card className="header-card mb-4">
                <div className="pattern"></div>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h2 className="titulo">
                                Editar Usuario
                            </h2>
                            <p className="subtitulo">
                                Actualice la información del usuario.
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card className="form-card">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <h5 className="form-title mb-4">
                            Información General
                        </h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group
                                    className="mb-4"
                                >
                                    <Form.Label>
                                        Rol
                                    </Form.Label>
                                    <Form.Select
                                        name="rol_id"
                                        value={usuario.rol_id}
                                        onChange={handleChange}
                                        className="input-form"
                                    >
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
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Correo
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={usuario.email}
                                        onChange={handleChange}
                                        className="input-form"
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
                                        name="primerNombre"
                                        value={usuario.primerNombre}
                                        onChange={handleChange}
                                        className="input-form"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Segundo Nombre
                                    </Form.Label>
                                    <Form.Control
                                        name="segundoNombre"
                                        value={usuario.segundoNombre}
                                        onChange={handleChange}
                                        className="input-form"
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
                                        name="primerApellido"
                                        value={usuario.primerApellido}
                                        onChange={handleChange}
                                        className="input-form"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Segundo Apellido
                                    </Form.Label>
                                    <Form.Control
                                        name="segundoApellido"
                                        value={usuario.segundoApellido}
                                        onChange={handleChange}
                                        className="input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Teléfono
                                    </Form.Label>

                                    <Form.Control
                                        name="telefono"
                                        value={usuario.telefono}
                                        onChange={handleChange}
                                        className="input-form"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Dirección
                                    </Form.Label>

                                    <Form.Control
                                        name="direccion"
                                        value={usuario.direccion}
                                        onChange={handleChange}
                                        className="input-form"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-4">
                            <Form.Label>
                                Nueva Contraseña
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="credencial"
                                value={usuario.credencial}
                                onChange={handleChange}
                                className="input-form"
                                placeholder="Dejar vacío para conservar la contraseña"
                            />
                            <Form.Text className="text-muted">
                                Solo diligencie este campo si desea cambiar la contraseña.
                            </Form.Text>

                        </Form.Group>

                        {/* BOTONES */}

                        <div className="d-flex justify-content-end gap-3 mt-4">

                            <Link
                                to="/usuarios"
                                className="text-decoration-none"
                            >

                                <Button
                                    className="btn-secundario"
                                    type="button"
                                >
                                    Cancelar
                                </Button>

                            </Link>

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
    );
};
export default EditarUsuario;