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
import { DEFAULT_IMAGE } from "../../utils/imageUrl";
import "./EditarProducto.css";

const EditarProducto = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setData] = useState({

        producto_nombre: "",

        producto_descripcion: "",

        producto_precio: "",

        producto_stock: "",

        producto_estado: "1",

        categoria_id: "",

        subcategoria_id: "",

        producto_imagen: ""

    });

    const [categorias, setCategorias] = useState([]);

    const [subcategorias, setSubcategorias] = useState([]);

    const [archivoImagen, setArchivoImagen] = useState(null);

    const [previewUrl, setPreviewUrl] = useState("");

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    /* CARGAR CATEGORIAS */

    useEffect(() => {

        const fetchCategorias = async () => {

            try {

                const res = await authFetch(
                    `${API_URL}/api/categorias`
                );

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

    /* CARGAR SUBCATEGORIAS */

    useEffect(() => {

        const fetchSubcategorias = async () => {

            try {

                const res = await authFetch(
                    `${API_URL}/api/subcategorias/subCAll`
                );

                const data = await res.json();

                if (res.ok) {

                    setSubcategorias(data.data);

                }

            } catch (err) {

                console.error(err);

            }

        };

        fetchSubcategorias();

    }, []);

    /* CARGAR PRODUCTO */

    useEffect(() => {

        const fetchProducto = async () => {

            try {

                const res = await authFetch(
                    `${API_URL}/api/productos/producto/${id}`
                );

                const data = await res.json();

                if (res.ok) {

                    setData({
                        ...data.data,
                        categoria_id:   data.data.categoria_id   != null ? String(data.data.categoria_id)   : "",
                        subcategoria_id: data.data.subcategoria_id != null ? String(data.data.subcategoria_id) : "",
                    });

                    if (data.data.producto_imagen) {

                        setPreviewUrl(data.data.producto_imagen);

                    }

                } else {

                    alert(data.message);

                }

            } catch (error) {

                console.error(error);

                alert("Error al cargar el producto");

            }

        };

        fetchProducto();

    }, [id]);

    /* SUBCATEGORIAS DERIVADAS — calculado en cada render, sin useEffect */

    const subFiltradas = subcategorias.filter(
        sc => String(sc.categoria_id) === String(formData.categoria_id)
    );

    /* HANDLE */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setData({

            ...formData,

            [name]: value,

            ...(name === 'categoria_id' ? { subcategoria_id: "" } : {})

        });

    };

    const handleImagen = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setArchivoImagen(file);

        setPreviewUrl(URL.createObjectURL(file));

    };

    /* ACTUALIZAR */

    const enviarDatos = async (e) => {

        e.preventDefault();

        const fd = new FormData();

        fd.append('producto_nombre', formData.producto_nombre);

        fd.append('producto_descripcion', formData.producto_descripcion);

        fd.append('producto_precio', formData.producto_precio);

        fd.append('producto_stock', formData.producto_stock);

        fd.append('producto_estado', formData.producto_estado);

        fd.append('subcategoria_id', formData.subcategoria_id);

        fd.append('producto_id', id);

        if (archivoImagen) {

            fd.append('imagen', archivoImagen);

        } else if (formData.producto_imagen) {

            fd.append('producto_imagen', formData.producto_imagen);

        }

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(

                `${API_URL}/api/productos/updateProducto/${id}`,

                {

                    method: "PUT",

                    headers: { "Authorization": `Bearer ${token}` },

                    body: fd

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

            alert("Error al actualizar el producto");

        }

    };

    return (
        <Container fluid className="editar-producto-page">

            {/* HEADER */}

            <Card className="editar-producto-header mb-4">

                <div className="pattern"></div>

                <Card.Body>

                    <Row className="align-items-center">

                        <Col>

                            <h2 className="editar-producto-title">

                                📦 Editar Producto

                            </h2>

                            <p className="editar-producto-subtitle">

                                Actualice la información del producto.

                            </p>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

            {/* FORMULARIO */}

            <Card className="editar-producto-form-card">

                <Card.Body>

                    {mostrarAlerta && (

                        <Alert
                            variant="success"
                            dismissible
                        >

                            Producto actualizado correctamente.

                        </Alert>

                    )}

                    <Form onSubmit={enviarDatos}>

                        <Row>

                            {/* INFORMACIÓN */}

                            <Col lg={7}>

                                <h5 className="form-title">

                                    Información General

                                </h5>

                                <Form.Group className="mb-4">

                                    <Form.Label>Nombre</Form.Label>

                                    <Form.Control
                                        className="editar-producto-input"
                                        name="producto_nombre"
                                        value={formData.producto_nombre}
                                        onChange={handleChange}
                                    />

                                </Form.Group>

                                <Form.Group className="mb-4">

                                    <Form.Label>Descripción</Form.Label>

                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        className="editar-producto-input"
                                        name="producto_descripcion"
                                        value={formData.producto_descripcion}
                                        onChange={handleChange}
                                    />

                                </Form.Group>

                                <Row>

                                    <Col md={6}>

                                        <Form.Group className="mb-4">

                                            <Form.Label>

                                                Precio

                                            </Form.Label>

                                            <Form.Control
                                                type="number"
                                                className="editar-producto-input"
                                                name="producto_precio"
                                                value={formData.producto_precio}
                                                onChange={handleChange}
                                            />

                                        </Form.Group>

                                    </Col>

                                    <Col md={6}>

                                        <Form.Group className="mb-4">

                                            <Form.Label>

                                                Stock

                                            </Form.Label>

                                            <Form.Control
                                                type="number"
                                                className="editar-producto-input"
                                                name="producto_stock"
                                                value={formData.producto_stock}
                                                onChange={handleChange}
                                            />

                                        </Form.Group>

                                    </Col>

                                </Row>

                                <Form.Group className="mb-4">

                                    <Form.Label>

                                        Estado

                                    </Form.Label>

                                    <Form.Select
                                        className="editar-producto-input"
                                        name="producto_estado"
                                        value={formData.producto_estado}
                                        onChange={handleChange}
                                    >

                                        <option value="1">

                                            Activo

                                        </option>

                                        <option value="0">

                                            Inactivo

                                        </option>

                                    </Form.Select>

                                </Form.Group>

                            </Col>

                            {/* COLUMNA DERECHA */}

                            <Col lg={5}>

                                <h5 className="form-title">

                                    Clasificación

                                </h5>

                                <Form.Group className="mb-4">

                                    <Form.Label>

                                        Categoría

                                    </Form.Label>

                                    <Form.Select
                                        className="editar-producto-input"
                                        name="categoria_id"
                                        value={formData.categoria_id}
                                        onChange={handleChange}
                                    >

                                        <option value="">

                                            Seleccione

                                        </option>

                                        {

                                            categorias.map(cat => (

                                                <option
                                                    key={cat.categoria_id}
                                                    value={String(cat.categoria_id)}
                                                >

                                                    {cat.categoria_nombre}

                                                </option>

                                            ))

                                        }

                                    </Form.Select>

                                </Form.Group>

                                <Form.Group className="mb-4">

                                    <Form.Label>

                                        Subcategoría

                                    </Form.Label>

                                    <Form.Select
                                        className="editar-producto-input"
                                        name="subcategoria_id"
                                        value={formData.subcategoria_id}
                                        onChange={handleChange}
                                    >

                                        <option value="">

                                            Seleccione

                                        </option>

                                        {

                                            subFiltradas.map(sub => (

                                                <option
                                                    key={sub.subcategoria_id}
                                                    value={String(sub.subcategoria_id)}
                                                >

                                                    {sub.subcategoria_nombre}

                                                </option>

                                            ))

                                        }

                                    </Form.Select>

                                </Form.Group>

                                <h5 className="form-title">

                                    Imagen del Producto

                                </h5>

                                <div className="text-center mb-3">

                                    <img
                                        src={previewUrl || DEFAULT_IMAGE}
                                        alt="Imagen actual"
                                        style={{
                                            width: "100%",
                                            maxHeight: "180px",
                                            objectFit: "contain",
                                            borderRadius: "8px",
                                            border: "1px solid #dee2e6",
                                            padding: "4px"
                                        }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                                    />

                                </div>

                                <Form.Group className="mb-3">

                                    <Form.Label>Reemplazar imagen</Form.Label>

                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        className="editar-producto-input"
                                        onChange={handleImagen}
                                    />

                                    <Form.Text className="text-muted">

                                        Deje vacío para conservar la imagen actual.

                                    </Form.Text>

                                </Form.Group>

                            </Col>

                        </Row>

                        <div className="d-flex justify-content-end gap-3 mt-5">

                            <Button
                                variant="secondary"
                                onClick={() =>
                                    navigate("/admin/ProductoFront")
                                }
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                className="editar-producto-btn"
                            >
                                Guardar Cambios
                            </Button>

                        </div>

                    </Form>

                </Card.Body>

            </Card>

        </Container>
    );

};

export default EditarProducto;
