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
import "./EditarSubCategoria.css";

const EditarSubCategoria = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [formData, setData] = useState({

        nombre: "",

        categoria_id: ""

    });

    const [categorias, setCategorias] = useState([]);

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    /* CARGAR SUBCATEGORIA */

    useEffect(() => {

        const fetchSub = async () => {

            try{

                const response = await authFetch(

                    `${API_URL}/api/subcategorias/subCId/${id}`

                );

                const data = await response.json();

                if(response.ok){

                    const sub = data.data;

                    setData({

                        nombre:sub.subcategoria_nombre,

                        categoria_id:sub.categoria_id

                    });

                }

            }catch(error){

                console.error(error);

            }

        };

        fetchSub();

    },[id]);

    /* CARGAR CATEGORIAS */

    useEffect(()=>{

        const fetchCategorias = async()=>{

            try{

                const response = await authFetch(

                    `${API_URL}/api/categorias`

                );

                const data = await response.json();

                if(response.ok){

                    setCategorias(data.data || data);

                }

            }catch(error){

                console.error(error);

            }

        };

        fetchCategorias();

    },[]);

    const handleChange=(e)=>{

        setData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };

    const actualizarSub = async(e)=>{

        e.preventDefault();

        const subcategoria={

            subcategoria_id:id,

            subcategoria_nombre:formData.nombre,

            categoria_id:parseInt(formData.categoria_id)

        };

        try{

            const response = await authFetch(

                `${API_URL}/api/subcategorias/updateSubC/${id}`,

                {

                    method:"PUT",

                    headers:{

                        "Content-Type":"application/json"

                    },

                    body:JSON.stringify(subcategoria)

                }

            );

            const data = await response.json();

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
        <Container fluid className="editar-subcategoria-page">
            <Card className="editar-subcategoria-header mb-4">
                <div className="pattern"></div>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h2 className="editar-subcategoria-title">
                                🗂 Editar Subcategoría
                            </h2>
                            <p className="editar-subcategoria-subtitle">
                                Actualice la información de la subcategoría.
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Card className="editar-subcategoria-form-card">
                <Card.Body>
                    {
                        mostrarAlerta &&
                        <Alert
                            variant="success"
                            dismissible
                        >
                            Subcategoría actualizada correctamente.
                        </Alert>
                    }
                    <Form onSubmit={actualizarSub}>
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
                                        className="editar-subcategoria-input"
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
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
                                        className="editar-subcategoria-input"
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
                                className="editar-subcategoria-btn-secundario"
                                onClick={()=>
                                    navigate("/admin/SubCategoriaFront")
                                }
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="editar-subcategoria-btn-principal"
                            >
                                Actualizar
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditarSubCategoria;