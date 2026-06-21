import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";

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

                // limpiar form
                setData({ nombre: "" });

                // redirigir después de 1.5s
                setTimeout(() => {
                    navigate("/admin/CategoriaFront");
                }, 1500);

            } else {
                alert(data.message || "Error al crear categoría");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "500px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Agregar Categoría</h3>

                    {mostrarAlerta && (
                        <Alert
                            variant="success"
                            onClose={() => setMostrarAlerta(false)}
                            dismissible
                        >
                            Categoría creada correctamente 
                        </Alert>
                    )}
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={enviarDatos}>

                        <Form.Group className="mb-3">
                            <Form.Label>NOMBRE DE LA CATEGORÍA</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Ataúdes, Urnas..."
                                required
                            />
                        </Form.Group>

                        <Button
                            style={{ background: "#7856AE", border: "#7856AE" }}
                            type="submit"
                        >
                            Guardar
                        </Button>

                        <Button
                            className="mx-3"
                            variant="secondary"
                            onClick={() => navigate("/admin/CategoriaFront")}
                        >
                            Cancelar
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AgregarCategoria;