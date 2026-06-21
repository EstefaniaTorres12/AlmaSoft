import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";

const EditarSubCategoria = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setData] = useState({
        nombre: "",
        categoria_id: ""
    });

    const [categorias, setCategorias] = useState([]);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    // 🔹 CARGAR SUBCATEGORIA
    useEffect(() => {

        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.backgroundColor = "#D8CFE8";
        
        const fetchSub = async () => {
            try {
                const response = await authFetch(
                    `${API_URL}/api/subcategorias/subCId/${id}`
                );

                const data = await response.json();

                if (response.ok) {
                    const sub = data.data;

                    setData({
                        nombre: sub.subcategoria_nombre,
                        categoria_id: sub.categoria_id
                    });
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchSub();
    }, [id]);

    // 🔹 CARGAR CATEGORIAS
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await authFetch(
                    `${API_URL}/api/categorias`
                );

                const data = await response.json();

                if (response.ok) {
                    setCategorias(data.data || data);
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchCategorias();
    }, []);

    // 🔹 HANDLE
    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 🔹 ACTUALIZAR
    const actualizarSub = async (e) => {
        e.preventDefault();

        const subcategoria = {
            subcategoria_id: id,
            subcategoria_nombre: formData.nombre,
            categoria_id: parseInt(formData.categoria_id)
        };

        try {
            const response = await authFetch(
                `${API_URL}/api/subcategorias/updateSubC/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(subcategoria)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMostrarAlerta(true);

                setTimeout(() => {
                    navigate("/admin/SubCategoriaFront");
                }, 1500);

            } else {
                alert(data.message);
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
                    <h3 className="text-center">Editar Subcategoría</h3>

                    {mostrarAlerta && (
                        <Alert variant="success" dismissible>
                            Subcategoría actualizada ✅
                        </Alert>
                    )}
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={actualizarSub}>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select
                                name="categoria_id"
                                value={formData.categoria_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione</option>

                                {categorias.map(cat => (
                                    <option key={cat.categoria_id} value={cat.categoria_id}>
                                        {cat.categoria_nombre}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Button
                            type="submit"
                            style={{ background: "#7856AE", border: "#7856AE" }}
                        >
                            Actualizar
                        </Button>

                        <Button
                            className="mx-3"
                            variant="secondary"
                            onClick={() => navigate("/admin/SubCategoriaFront")}
                        >
                            Cancelar
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditarSubCategoria;