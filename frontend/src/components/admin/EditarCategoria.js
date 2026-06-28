import React, { useState, useEffect } from "react";
import {
    Container,
    Card,
    Form,
    Button,
    Alert,
    Row,
    Col
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";
import "./EditarCategoria.css";

const EditarCategoria = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setData] = useState({
        nombre: ""
    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    useEffect(() => {

        const fetchCategoria = async () => {

            try {

                const response = await authFetch(
                    `${API_URL}/api/categorias/${id}`
                );

                const data = await response.json();

                if (response.ok) {

                    setData({
                        nombre: data.categoria_nombre || ""
                    });

                } else {

                    alert("Error al cargar categoría");

                }

            } catch (error) {

                console.error(error);
                alert("Error de conexión");

            }

        };

        fetchCategoria();

    }, [id]);

    const handleChange = (e) => {

        setData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const actualizarCategoria = async (e) => {

        e.preventDefault();

        const categoria = {

            categoria_id: id,

            categoria_nombre: formData.nombre

        };

        try {

            const response = await authFetch(

                `${API_URL}/api/categorias/update/${id}`,

                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(categoria)

                }

            );

            const data = await response.json();

            if (response.ok) {

                setMostrarAlerta(true);

                setTimeout(() => {

                    navigate("/admin/CategoriaFront");

                }, 1500);

            } else {

                alert(data.message || "Error al actualizar");

            }

        } catch (error) {

            console.error(error);

            alert("Error de conexión");

        }

    };

    return (
        <Container fluid className="editar-categoria-page">
            <Card className="editar-categoria-header mb-4">
                <div className="pattern"></div>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h2 className="editar-categoria-title">
                                Editar Categoría
                            </h2>
                            <p className="editar-categoria-subtitle">
                                Actualice la información de la categoría.
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="editar-categoria-form-card">
                <Card.Body>
                    {mostrarAlerta && (
                        <Alert
                            variant="success"
                            dismissible
                            onClose={() => setMostrarAlerta(false)}
                        >
                            Categoría actualizada correctamente.
                        </Alert>
                    )}
                    <Form onSubmit={actualizarCategoria}>
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
                                        required
                                        className="editar-categoria-input"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <Button
                                type="button"
                                className="editar-categoria-btn-secundario"
                                onClick={() =>
                                    navigate("/admin/CategoriaFront")
                                }
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="editar-categoria-btn-principal"
                            >
                                Actualizar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>

    );

};

export default EditarCategoria;