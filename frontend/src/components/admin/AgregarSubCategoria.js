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
import "./AgregarSubCategoria.css";

const AgregarSubCategoria = () => {

    const navigate = useNavigate();

    const [formData, setData] = useState({

        nombre: "",

        categoria_id: ""

    });

    const [categorias, setCategorias] = useState([]);

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    useEffect(() => {

        const fetchCategorias = async () => {

            try {

                const response = await authFetch(
                    `${API_URL}/api/categorias`
                );

                const data = await response.json();

                if(response.ok){

                    setCategorias(data.data || data);

                }

            }catch(error){

                console.error(error);

                alert("Error cargando categorías");

            }

        };

        fetchCategorias();

    },[]);

    const handleChange = (e)=>{

        setData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };

    const enviarDatos = async(e)=>{

        e.preventDefault();

        const subcategoria={

            subcategoria_nombre:formData.nombre,

            categoria_id:parseInt(formData.categoria_id)

        };

        try{

            const response=await authFetch(

                `${API_URL}/api/subcategorias/createSubC`,

                {

                    method:"POST",

                    headers:{

                        "Content-Type":"application/json"

                    },

                    body:JSON.stringify(subcategoria)

                }

            );

            const data=await response.json();

            if(response.ok){

                setMostrarAlerta(true);

                setTimeout(()=>{

                    navigate("/admin/SubCategoriaFront");

                },1500);

            }else{

                alert(data.message);

            }

        }catch(error){

            console.error(error);

            alert("Error de conexión");

        }

    };

    return(

        <Container fluid className="agregar-subcategoria-page">

            {/* HEADER */}

            <Card className="agregar-subcategoria-header mb-4">

                <div className="pattern"></div>

                <Card.Body>

                    <Row className="align-items-center">

                        <Col>

                            <h2 className="agregar-subcategoria-title">

                                🗂 Agregar Subcategoría

                            </h2>

                            <p className="agregar-subcategoria-subtitle">

                                Registre una nueva subcategoría para el sistema.

                            </p>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>

            {/* FORMULARIO */}

            <Card className="agregar-subcategoria-form-card">

                <Card.Body>

                    {

                        mostrarAlerta &&

                        <Alert

                            variant="success"

                            dismissible

                        >

                            Subcategoría creada correctamente.

                        </Alert>

                    }

                    <Form onSubmit={enviarDatos}>

                        <h5 className="form-title">

                            Información

                        </h5>

                        <Row>

                            <Col md={12}>

                                <Form.Group className="mb-4">

                                    <Form.Label>

                                        Nombre de la Subcategoría

                                    </Form.Label>

                                    <Form.Control

                                        className="agregar-subcategoria-input"

                                        type="text"

                                        name="nombre"

                                        value={formData.nombre}

                                        onChange={handleChange}

                                        placeholder="Ej: Ataúdes Premium"

                                        required

                                    />

                                </Form.Group>

                            </Col>

                        </Row>

                        <Row>

                            <Col md={12}>

                                <Form.Group className="mb-4">

                                    <Form.Label>

                                        Categoría

                                    </Form.Label>

                                    <Form.Select

                                        className="agregar-subcategoria-input"

                                        name="categoria_id"

                                        value={formData.categoria_id}

                                        onChange={handleChange}

                                        required

                                    >

                                        <option value="">

                                            Seleccione una categoría

                                        </option>

                                        {

                                            categorias.map(cat=>(

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

                            </Col>

                        </Row>

                        <div className="d-flex justify-content-end gap-3 mt-4">

                            <Button

                                type="button"

                                className="agregar-subcategoria-btn-secundario"

                                onClick={()=>

                                    navigate("/admin/SubCategoriaFront")

                                }

                            >

                                Cancelar

                            </Button>

                            <Button

                                type="submit"

                                className="agregar-subcategoria-btn-principal"

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

export default AgregarSubCategoria;