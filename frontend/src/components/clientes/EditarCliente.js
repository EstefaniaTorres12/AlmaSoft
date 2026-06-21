import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

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
                const response = await fetch(`${API_URL}/api/clientes/id/${id}`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });

                const data = await response.json();

                if (response.ok && data?.data) {
                    setCliente(data.data);
                } else {
                    alert(data.message || "Error al obtener el cliente");
                }

            } catch (err) {
                console.log(err);
                alert("Error al conectar con el backend");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCliente();

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
            const response = await fetch(`${API_URL}/api/clientes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify(cliente)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Cliente actualizado correctamente");

                setTimeout(() => {
                    navigate("/clientes", { replace: true });
                }, 200);

            } else {
                alert(data.message || "Error al actualizar cliente");
            }

        } catch (error) {
            console.error(error);
            alert("Error al actualizar cliente");
        }
    };


    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Cargando cliente...</p>
            </div>
        );
    }

    return (
        <Container className="mt-5" style={{ maxWidth: "600px" }}>
            <Card className="shadow">
                <Card.Header>
                    <h3 className="text-center">Editar Cliente</h3>
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>Primer Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="primer_nombre"
                                value={cliente.primer_nombre || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Segundo Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="segundo_nombre"
                                value={cliente.segundo_nombre || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Primer Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="primer_apellido"
                                value={cliente.primer_apellido || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Segundo Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="segundo_apellido"
                                value={cliente.segundo_apellido || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                value={cliente.telefono || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="direccion"
                                value={cliente.direccion || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="correo"
                                value={cliente.correo || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button
                                style={{ background: "#7856AE", border: "#7856AE" }}
                                type="submit"
                            >
                                Guardar
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() => navigate("/clientes")}
                            >
                                Cancelar
                            </Button>
                        </div>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditarCliente;