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
import "./EditarProducto.css";

const imagenes = {

    Ataud: [
        "/img/Ataud1.jpg",
        "/img/Ataud2.jpg",
        "/img/Ataud3.jpg",
        "/img/Ataud4.jpg",
        "/img/AtaudClasico.jpg",
        "/img/AtaudPremium.jpg"
    ],

    Urna: [
        "/img/Urna1.jpg",
        "/img/Urna2.jpg",
        "/img/Urna3.jpg",
        "/img/Urna4.jpg"
    ],

    "Arreglo Floral": [
        "/img/Arreglo1.jpg",
        "/img/Arreglo2.jpg",
        "/img/Arreglo3.jpg",
        "/img/Arreglo4.jpg",
        "/img/Arreglo5.jpg"
    ],

    Lapidas: [
        "/img/Lapida1.jpeg",
        "/img/Lapida2.png",
        "/img/Lapida3.jpg",
        "/img/Lapida4.jpg"
    ],

    Planes: [
        "/img/plan1.png",
        "/img/plan2.png",
        "/img/plan3.png"
    ]

};

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

    const [subFiltradas, setSubFiltradas] = useState([]);

    const [imagenesFiltradas, setImagenesFiltradas] = useState([]);

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

                    setData(data.data);

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

    /* FILTRAR SUBCATEGORIAS */

    useEffect(() => {

        const filtradas = subcategorias.filter(

            sc => sc.categoria_id === Number(formData.categoria_id)

        );

        setSubFiltradas(filtradas);

    }, [formData.categoria_id, subcategorias]);

    /* FILTRAR IMAGENES */

    useEffect(() => {

        const categoria = categorias.find(

            c => c.categoria_id === Number(formData.categoria_id)

        );

        if (!categoria) {

            setImagenesFiltradas([]);

            return;

        }

        setImagenesFiltradas(

            imagenes[categoria.categoria_nombre] || []

        );

    }, [formData.categoria_id, categorias]);

    /* HANDLE */

    const handleChange = (e) => {

        setData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    /* ACTUALIZAR */

    const enviarDatos = async (e) => {

        e.preventDefault();

        try {

            const res = await authFetch(

                `${API_URL}/api/productos/updateProducto/${id}`,

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
                                                    value={cat.categoria_id}
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
                                                    value={sub.subcategoria_id}
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

                                {

                                    formData.categoria_id === ""

                                        ?

                                        <Alert variant="light">

                                            Seleccione una categoría para visualizar las imágenes.

                                        </Alert>

                                        :

                                        <div className="galeria-imagenes">

                                            {

                                                imagenesFiltradas.map(img => (

                                                    <div

                                                        key={img}

                                                        className={`imagen-card ${formData.producto_imagen === img ? "seleccionada" : ""}`}

                                                        onClick={() =>

                                                            setData({

                                                                ...formData,

                                                                producto_imagen: img

                                                            })

                                                        }

                                                    >

                                                        <img

                                                            src={img}

                                                            alt="Producto"

                                                        />
                                                        {
                                                            formData.producto_imagen === img && (
                                                                <div className="check-imagen">
                                                                    ✓
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                }
                                <Form.Group className="mt-4">
                                    <Form.Label>
                                        Imagen seleccionada
                                    </Form.Label>
                                    <Form.Control
                                        value={formData.producto_imagen}
                                        readOnly
                                    />
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