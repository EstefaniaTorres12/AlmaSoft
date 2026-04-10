import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const EditarProducto = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setData] = useState({
        producto_nombre: "",
        producto_descripcion: "",
        producto_precio: "",
        producto_stock: "",
        producto_estado: "",
        subcategoria_id: "",
        producto_imagen: ""
    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    // 🔹 OBTENER PRODUCTO POR ID
    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.backgroundColor = "#D8CFE8";
        
        const fetchProducto = async () => {
            try {
                const res = await authFetch(
                    `http://localhost:3001/api/productos/producto/${id}`
                );

                const data = await res.json();

                if (res.ok) {
                    setData(data.data);
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error(error);
                alert("Error al cargar producto");
            }
        };

        fetchProducto();
    }, [id]);

    // 🔹 HANDLE CHANGE
    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 🔹 ACTUALIZAR PRODUCTO
    const enviarDatos = async (e) => {
        e.preventDefault();

        try {
            const res = await authFetch(
                `http://localhost:3001/api/productos/updateProducto/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...formData,
                        producto_id: id
                    })
                }
            );

            const data = await res.json();

            if (res.ok) {
                setMostrarAlerta(true);
                setTimeout(() => {
                    navigate("/admin/ProductoFront");
                }, 1500);
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Error al actualizar producto");
        }
    };

    return (
        <Container style={{ maxWidth: "600px", marginTop: "60px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Editar Producto</h3>

                    {mostrarAlerta && (
                        <Alert variant="success" dismissible>
                            Producto actualizado correctamente ✅
                        </Alert>
                    )}
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={enviarDatos}>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="producto_nombre"
                                value={formData.producto_nombre}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                name="producto_descripcion"
                                value={formData.producto_descripcion}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                name="producto_precio"
                                value={formData.producto_precio}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                name="producto_stock"
                                value={formData.producto_stock}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                                name="producto_estado"
                                value={formData.producto_estado}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Subcategoría ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="subcategoria_id"
                                value={formData.subcategoria_id}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ruta Imagen</Form.Label>
                            <Form.Control
                                type="text"
                                name="producto_imagen"
                                value={formData.producto_imagen}
                                onChange={handleChange}
                                placeholder="/images/ataud.jpg"
                            />
                        </Form.Group>

                        {/* 🔥 PREVIEW */}
                        {formData.producto_imagen && (
                            <div className="text-center mb-3">
                                <img
                                    src={formData.producto_imagen}
                                    alt="preview"
                                    style={{ width: "150px", borderRadius: "10px" }}
                                />
                            </div>
                        )}

                        <Button style={{ background: "#7856AE", border: "#7856AE" }} type="submit">
                            Guardar Cambios
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditarProducto;