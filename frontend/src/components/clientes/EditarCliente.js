import React, { useState, useEffect } from "react";
import {
    Container,
    Card,
    Form,
    Button,
    Spinner,
    Row,
    Col
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import "./EditarCliente.css";

const EditarCliente = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [cliente, setCliente] = useState({

        primer_nombre: "",

        segundo_nombre: "",

        primer_apellido: "",

        segundo_apellido: "",

        correo: "",

        direccion: "",

        telefono: ""

    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchCliente = async () => {

            try {

                const response = await fetch(

                    `${API_URL}/api/clientes/id/${id}`,

                    {

                        headers: {

                            Authorization:
                                "Bearer " +
                                localStorage.getItem("token")

                        }

                    }

                );

                const data = await response.json();

                if (response.ok && data?.data) {

                    setCliente(data.data);

                } else {

                    alert(data.message);

                }

            } catch (err) {

                console.log(err);

                alert("Error al conectar con el backend");

            } finally {

                setLoading(false);

            }

        };

        if (id) {

            fetchCliente();

        }

    }, [id]);

    const handleChange = (e) => {

        setCliente({

            ...cliente,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(

                `${API_URL}/api/clientes/${id}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization:
                            "Bearer " +
                            localStorage.getItem("token")

                    },

                    body: JSON.stringify(cliente)

                }

            );

            const data = await response.json();

            if (response.ok) {

                alert("Cliente actualizado correctamente");

                setTimeout(() => {

                    navigate("/clientes", { replace: true });

                }, 200);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

            alert("Error al actualizar cliente");

        }

    };

    if (loading) {

        return (

            <div className="editar-cliente-loading">

                <Spinner
                    animation="border"
                    variant="primary"
                />

                <p>

                    Cargando cliente...

                </p>

            </div>

        );

    }

    return (

        <Container
            fluid
            className="editar-cliente-page"
        >

            {/* HEADER */}

            <Card className="editar-cliente-header mb-4">

                <div className="pattern"></div>

                <Card.Body>

                    <Row className="align-items-center">

                        <Col>

                            <h2 className="editar-cliente-title">

                                Editar Cliente

                            </h2>

                            <p className="editar-cliente-subtitle">

                                Actualice la información del cliente.

                            </p>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

            {/* FORMULARIO */}

            <Card className="editar-cliente-form-card">

                <Card.Body>

                    <Form onSubmit={handleSubmit}>

                        <h5 className="form-title mb-4">

                            Información Personal

                        </h5>

                        <Row>

                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Primer Nombre
                                    </Form.Label>
                                    <Form.Control
                                        className="editar-cliente-input"
                                        name="primer_nombre"
                                        value={cliente.primer_nombre || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Segundo Nombre
                                    </Form.Label>
                                    <Form.Control
                                        className="editar-cliente-input"
                                        name="segundo_nombre"
                                        value={cliente.segundo_nombre || ""}
                                        onChange={handleChange}
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
                                        className="editar-cliente-input"
                                        name="primer_apellido"
                                        value={cliente.primer_apellido || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Segundo Apellido
                                    </Form.Label>
                                    <Form.Control
                                        className="editar-cliente-input"
                                        name="segundo_apellido"
                                        value={cliente.segundo_apellido || ""}
                                        onChange={handleChange}
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
                                        className="editar-cliente-input"
                                        name="direccion"
                                        value={cliente.direccion || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Teléfono
                                    </Form.Label>
                                    <Form.Control
                                        className="editar-cliente-input"
                                        name="telefono"
                                        value={cliente.telefono || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-4">
                                    <Form.Label>
                                        Correo
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        className="editar-cliente-input"
                                        name="correo"
                                        value={cliente.correo || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button
                                className="editar-cliente-btn-secundario"
                                type="button"
                                onClick={() => navigate("/clientes")}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="editar-cliente-btn-principal"
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

export default EditarCliente;