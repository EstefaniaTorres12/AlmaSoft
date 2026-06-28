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
import "./AgregarProducto.css";
import ArreglosFloral from "../productos/ArregloFloral";

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

    Lapida: [
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

const AgregarProducto = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        nombre: "",

        descripcion: "",

        precio: "",

        stock: "",

        estado: "1",

        imagen: "",

        categoria_id: "",

        subcategoria_id: ""

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

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    /* GUARDAR */

    const enviarDatos = async (e) => {

        e.preventDefault();

        const producto = {

            producto_nombre: formData.nombre,

            producto_descripcion: formData.descripcion,

            producto_precio: parseFloat(formData.precio),

            producto_stock: parseInt(formData.stock),

            producto_estado: parseInt(formData.estado),

            producto_imagen: formData.imagen,

            subcategoria_id: parseInt(formData.subcategoria_id)

        };

        try {

            const res = await authFetch(

                `${API_URL}/api/productos/createProducto`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify(producto)

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

                            {

                                formData.categoria_id === ""

                                ?

                                <Alert variant="light">

                                    Seleccione primero una categoría.

                                </Alert>

                                :

                                <div className="galeria-imagenes">

                                    {

                                        imagenesFiltradas.map((img)=>(

                                            <div

                                                key={img}

                                                className={`imagen-card ${formData.imagen===img ? "seleccionada" : ""}`}

                                                onClick={()=>{

                                                    setFormData({

                                                        ...formData,

                                                        imagen:img

                                                    });

                                                }}

                                            >

                                                <img

                                                    src={img}

                                                    alt="Producto"

                                                />

                                                {

                                                    formData.imagen===img &&

                                                    <div className="check-imagen">

                                                        ✓

                                                    </div>

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

                                    value={formData.imagen}

                                    readOnly

                                />

                            </Form.Group>

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