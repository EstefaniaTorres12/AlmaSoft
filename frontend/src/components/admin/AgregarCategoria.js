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
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";
import "./AgregarCategoria.css";

const AgregarCategoria = () => {

    const navigate = useNavigate();

    const [formData, setData] = useState({
        nombre: ""
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

        const categoria = {

            categoria_nombre: formData.nombre

        };

        try {

            const response = await authFetch(

                `${API_URL}/api/categorias/crear`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(categoria)

                }

            );

            const data = await response.json();

            if (response.ok) {

                setMostrarAlerta(true);

                setData({

                    nombre: ""

                });

                setTimeout(() => {

                    navigate("/admin/CategoriaFront");

                }, 1500);

            } else {

                alert(data.message || "Error al crear categoría");

            }

        } catch (error) {

            console.error(error);

            alert("Error de conexión con el servidor");

        }

    };

    return (

        <Container fluid className="agregar-categoria-page">

            {/* HEADER */}

            <Card className="agregar-categoria-header mb-4">

                <div className="pattern"></div>

                <Card.Body>

                    <Row className="align-items-center">

                        <Col>

                            <h2 className="agregar-categoria-title">

                                Agregar Categoría

                            </h2>

                            <p className="agregar-categoria-subtitle">

                                Registre una nueva categoría para el sistema.

                            </p>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

            {/* FORMULARIO */}

            <Card className="agregar-categoria-form-card">

                <Card.Body>

                    {

                        mostrarAlerta && (

                            <Alert

                                variant="success"

                                dismissible

                                onClose={() => setMostrarAlerta(false)}

                            >

                                Categoría creada correctamente.

                            </Alert>

                        )

                    }

                    <Form onSubmit={enviarDatos}>

                        <h5 className="form-title">

                            Información

                        </h5>

                        <Row>

                            <Col md={12}>

                                <Form.Group className="mb-4">

                                    <Form.Label>

                                        Nombre de la Categoría

                                    </Form.Label>

                                    <Form.Control

                                        type="text"

                                        name="nombre"

                                        value={formData.nombre}

                                        onChange={handleChange}

                                        placeholder="Ej: Ataúdes, Urnas..."

                                        required

                                        className="agregar-categoria-input"

                                    />

                                </Form.Group>

                            </Col>

                        </Row>

                        <div className="d-flex justify-content-end gap-3 mt-4">

                            <Button

                                type="button"

                                className="agregar-categoria-btn-secundario"

                                onClick={() =>
                                    navigate("/admin/CategoriaFront")
                                }

                            >

                                Cancelar

                            </Button>

                            <Button

                                type="submit"

                                className="agregar-categoria-btn-principal"

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

export default AgregarCategoria;