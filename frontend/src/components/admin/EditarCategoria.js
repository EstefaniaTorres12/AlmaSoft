import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const EditarCategoria = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setData] = useState({
        nombre: ""
    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    // 🔹 OBTENER CATEGORIA POR ID
    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.backgroundColor = "#D8CFE8";
        
        const fetchCategoria = async () => {
            try {
                const response = await authFetch(
                    `http://localhost:3001/api/categorias/${id}`
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

    // 🔹 MANEJAR CAMBIO
    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 🔹 ACTUALIZAR
    const actualizarCategoria = async (e) => {
        e.preventDefault();

        const categoria = {
            categoria_id: id,
            categoria_nombre: formData.nombre
        };

        try {
            const response = await authFetch(
                `http://localhost:3001/api/categorias/update/${id}`,
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
        <Container className="mt-5" style={{ maxWidth: "500px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Editar Categoría</h3>

                    {mostrarAlerta && (
                        <Alert
                            variant="success"
                            onClose={() => setMostrarAlerta(false)}
                            dismissible
                        >
                            Categoría actualizada correctamente ✅
                        </Alert>
                    )}
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={actualizarCategoria}>

                        <Form.Group className="mb-3">
                            <Form.Label>NOMBRE</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button
                            style={{ background: "#7856AE", border: "#7856AE" }}
                            type="submit"
                        >
                            Actualizar
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

export default EditarCategoria;