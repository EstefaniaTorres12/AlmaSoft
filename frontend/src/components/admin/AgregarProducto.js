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
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";
import { DEFAULT_IMAGE } from "../../utils/imageUrl";
import "./AgregarProducto.css";

const AgregarProducto = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        estado: "1",
        categoria_id: "",
        subcategoria_id: ""
    });

    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [subFiltradas, setSubFiltradas] = useState([]);
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

        const fetchSub = async () => {

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

        fetchSub();

    }, []);

    /* FILTRAR SUBCATEGORIAS */

    useEffect(() => {

        const filtradas = subcategorias.filter(

            sc => sc.categoria_id === Number(formData.categoria_id)

        );

        setSubFiltradas(filtradas);

    }, [formData.categoria_id, subcategorias]);

    /* HANDLE */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleImagen = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setArchivoImagen(file);

        setPreviewUrl(URL.createObjectURL(file));

    };

    /* GUARDAR */

    const enviarDatos = async (e) => {

        e.preventDefault();

        const fd = new FormData();

        fd.append('producto_nombre', formData.nombre);

        fd.append('producto_descripcion', formData.descripcion);

        fd.append('producto_precio', formData.precio);

        fd.append('producto_stock', formData.stock);

        fd.append('producto_estado', formData.estado);

        fd.append('subcategoria_id', formData.subcategoria_id);

        if (archivoImagen) fd.append('imagen', archivoImagen);

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(

                `${API_URL}/api/productos/createProducto`,

                {

                    method: "POST",

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

        } catch (err) {

            console.error(err);

            alert("Error al conectar con el servidor");

        }

    };

  return (

    <Container fluid className="agregar-producto-page">

        {/* HEADER */}

        <Card className="agregar-producto-header mb-4">

            <div className="pattern"></div>

            <Card.Body>

                <Row className="align-items-center">

                    <Col>

                        <h2 className="agregar-producto-title">

                            📦 Agregar Producto

                        </h2>

                        <p className="agregar-producto-subtitle">

                            Registre un nuevo producto para el catálogo.

                        </p>

                    </Col>

                </Row>

            </Card.Body>

        </Card>

        {/* FORMULARIO */}

        <Card className="agregar-producto-form-card">

            <Card.Body>

                {

                    mostrarAlerta &&

                    <Alert

                        variant="success"

                        dismissible

                    >

                        Producto creado correctamente.

                    </Alert>

                }

                <Form onSubmit={enviarDatos}>

                    <Row>

                        {/* COLUMNA IZQUIERDA */}

                        <Col lg={7}>

                            <h5 className="form-title">

                                Información General

                            </h5>

                            <Form.Group className="mb-4">

                                <Form.Label>

                                    Nombre

                                </Form.Label>

                                <Form.Control

                                    className="agregar-producto-input"

                                    name="nombre"

                                    value={formData.nombre}

                                    onChange={handleChange}

                                />

                            </Form.Group>

                            <Form.Group className="mb-4">

                                <Form.Label>

                                    Descripción

                                </Form.Label>

                                <Form.Control

                                    className="agregar-producto-input"

                                    as="textarea"

                                    rows={4}

                                    name="descripcion"

                                    value={formData.descripcion}

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

                                            className="agregar-producto-input"

                                            type="number"

                                            name="precio"

                                            value={formData.precio}

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

                                            className="agregar-producto-input"

                                            type="number"

                                            name="stock"

                                            value={formData.stock}

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

                                    className="agregar-producto-input"

                                    name="estado"

                                    value={formData.estado}

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

                                    className="agregar-producto-input"

                                    name="categoria_id"

                                    value={formData.categoria_id}

                                    onChange={handleChange}

                                >

                                    <option value="">

                                        Seleccione

                                    </option>

                                    {

                                        categorias.map(c => (

                                            <option

                                                key={c.categoria_id}

                                                value={c.categoria_id}

                                            >

                                                {c.categoria_nombre}

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

                                    className="agregar-producto-input"

                                    name="subcategoria_id"

                                    value={formData.subcategoria_id}

                                    onChange={handleChange}

                                >

                                    <option value="">

                                        Seleccione

                                    </option>

                                    {

                                        subFiltradas.map(sc => (

                                            <option

                                                key={sc.subcategoria_id}

                                                value={sc.subcategoria_id}

                                            >

                                                {sc.subcategoria_nombre}

                                            </option>

                                        ))

                                    }

                                </Form.Select>

                            </Form.Group>

                            <h5 className="form-title mt-4">

                                Imagen del Producto

                            </h5>

                            <Form.Group className="mb-3">

                                <Form.Label>

                                    Seleccionar imagen

                                </Form.Label>

                                <Form.Control

                                    type="file"

                                    accept="image/*"

                                    className="agregar-producto-input"

                                    onChange={handleImagen}

                                />

                                <Form.Text className="text-muted">

                                    JPG, PNG, WEBP o GIF — máx. 5 MB

                                </Form.Text>

                            </Form.Group>

                            <div className="text-center mt-2">

                                <img

                                    src={previewUrl || DEFAULT_IMAGE}

                                    alt="Vista previa"

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

                        </Col>

                    </Row>

                    <div className="d-flex justify-content-end gap-3 mt-5">

                        <Button

                            variant="secondary"

                            onClick={()=>

                                navigate("/admin/ProductoFront")

                            }

                        >

                            Cancelar

                        </Button>

                        <Button

                            type="submit"

                            className="agregar-producto-btn"

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

export default AgregarProducto;
