import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
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

    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [subFiltradas, setSubFiltradas] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

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
                    // Set categoria for filtering
                    const catId = subcategorias.find(sc => sc.subcategoria_id === data.data.subcategoria_id)?.categoria_id;
                    setCategoriaSeleccionada(catId || "");
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error(error);
                alert("Error al cargar producto");
            }
        };

        fetchProducto();
    }, [id, subcategorias]);

    // 🔹 CARGAR CATEGORIAS
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await authFetch("http://localhost:3001/api/categorias");
                const data = await res.json();

                if (res.ok) {
                    setCategorias(data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategorias();
    }, []);

    // 🔹 CARGAR SUBCATEGORIAS
    useEffect(() => {
        const fetchSub = async () => {
            try {
                const res = await authFetch("http://localhost:3001/api/subcategorias/subCAll");
                const data = await res.json();

                if (res.ok) {
                    setSubcategorias(data.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchSub();
    }, []);

    // 🔥 FILTRAR SUBCATEGORIAS SEGÚN CATEGORIA
    useEffect(() => {
        const filtradas = subcategorias.filter(
            sc => sc.categoria_id === parseInt(categoriaSeleccionada)
        );
        setSubFiltradas(filtradas);
    }, [categoriaSeleccionada, subcategorias]);

    // 🔹 HANDLE CHANGE
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...formData,
            [name]: value
        });

        if (name === "subcategoria_id") {
            const catId = subcategorias.find(sc => sc.subcategoria_id === parseInt(value))?.categoria_id;
            setCategoriaSeleccionada(catId || "");
        }
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
                    navigate("/asesor/ProductosFront");
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
        <Container style={{ maxWidth: "800px", marginTop: "60px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Editar Producto</h3>

                    {mostrarAlerta && (
                        <Alert
                            variant="success"
                            onClose={() => setMostrarAlerta(false)}
                            dismissible
                        >
                            Producto actualizado correctamente ✅
                        </Alert>
                    )}
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={enviarDatos}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>NOMBRE DEL PRODUCTO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="producto_nombre"
                                        value={formData.producto_nombre}
                                        onChange={handleChange}
                                        placeholder="Nombre del producto"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>PRECIO</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="producto_precio"
                                        value={formData.producto_precio}
                                        onChange={handleChange}
                                        placeholder="Precio"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>DESCRIPCIÓN</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="producto_descripcion"
                                value={formData.producto_descripcion}
                                onChange={handleChange}
                                placeholder="Descripción del producto"
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>STOCK</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="producto_stock"
                                        value={formData.producto_stock}
                                        onChange={handleChange}
                                        placeholder="Cantidad en stock"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>ESTADO</Form.Label>
                                    <Form.Select
                                        name="producto_estado"
                                        value={formData.producto_estado}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="1">Activo</option>
                                        <option value="0">Inactivo</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>IMAGEN (URL)</Form.Label>
                            <Form.Control
                                type="text"
                                name="producto_imagen"
                                value={formData.producto_imagen}
                                onChange={handleChange}
                                placeholder="URL de la imagen"
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CATEGORÍA</Form.Label>
                                    <Form.Select
                                        name="categoria_id"
                                        value={categoriaSeleccionada}
                                        onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categorias.map(c => (
                                            <option key={c.categoria_id} value={c.categoria_id}>
                                                {c.categoria_nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>SUBCATEGORÍA</Form.Label>
                                    <Form.Select
                                        name="subcategoria_id"
                                        value={formData.subcategoria_id}
                                        onChange={handleChange}
                                        required
                                        disabled={!categoriaSeleccionada}
                                    >
                                        <option value="">Seleccionar subcategoría</option>
                                        {subFiltradas.map(sc => (
                                            <option key={sc.subcategoria_id} value={sc.subcategoria_id}>
                                                {sc.subcategoria_nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button
                            style={{ background: "#7856AE", border: "#7856AE" }}
                            type="submit"
                            className="w-100"
                        >
                            Actualizar Producto
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditarProducto;