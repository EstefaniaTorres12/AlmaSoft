import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import { API_URL } from "../../config/api";

const DetallesUsuario = () => {

    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`${API_URL}/api/usuarios/id/${id}`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token") 
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setUsuario(data.data);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error cargando usuario", error);
                alert("Error cargando datos del usuario");
            }
        };

        fetchUsuario();
    }, [id]);

    if (!usuario) {
        return <h2 className="text-center mt-5">Cargando usuario...</h2>;
    }

    return (
    <Container fluid className="usuarios-page">

        {/* HEADER */}

        <Card className="header-card mb-4">

            <div className="pattern"></div>

            <Card.Body>

                <h2 className="titulo">
                    Detalles del Usuario
                </h2>

                <p className="subtitulo">
                    Consulte la información del usuario seleccionado.
                </p>

            </Card.Body>
        </Card>
        <Row className="g-4">
            <Col lg={8}>
                <Card className="form-card">
                    <Card.Body>
                        <h5 className="form-title">
                            Información General
                        </h5>

                        <Row>

                            <Col md={6} className="mb-4">

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        ID
                                    </span>

                                    <h6>{usuario.usuario_id}</h6>

                                </div>

                            </Col>

                            <Col md={6} className="mb-4">

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        Documento
                                    </span>

                                    <h6>{usuario.usuario_documento}</h6>

                                </div>

                            </Col>

                            <Col md={6} className="mb-4">

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        Rol
                                    </span>

                                    <h6>{usuario.rol_nombre}</h6>

                                </div>

                            </Col>

                            <Col md={6} className="mb-4">

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        Teléfono
                                    </span>

                                    <h6>{usuario.usuario_telefono}</h6>

                                </div>

                            </Col>

                            <Col md={6} className="mb-4">

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        Primer Nombre
                                    </span>

                                    <h6>{usuario.usuario_primer_nombre}</h6>

                                </div>

                            </Col>

                            <Col md={6} className="mb-4">

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        Segundo Nombre
                                    </span>

                                    <h6>{usuario.usuario_segundo_nombre || "---"}</h6>

                                </div>

                            </Col>

                            <Col md={6} className="mb-4">

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        Primer Apellido
                                    </span>

                                    <h6>{usuario.usuario_primer_apellido}</h6>

                                </div>

                            </Col>

                            <Col md={6} className="mb-4">

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        Segundo Apellido
                                    </span>

                                    <h6>{usuario.usuario_segundo_apellido || "---"}</h6>

                                </div>

                            </Col>

                            <Col md={12} className="mb-4">

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        Correo
                                    </span>

                                    <h6>{usuario.usuario_correo}</h6>

                                </div>

                            </Col>

                            <Col md={12}>

                                <div className="detalle-item">

                                    <span className="detalle-label">
                                        Dirección
                                    </span>

                                    <h6>{usuario.usuario_direccion}</h6>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>

            {/* PERFIL */}

            <Col lg={4}>
                <Card className="form-card text-center">
                    <Card.Body>
                        <img
                            src="/img/usuario.png"
                            alt="Usuario"
                            className="img-usuario"
                        />

                        <h4 className="mt-3">

                            {usuario.usuario_primer_nombre} {usuario.usuario_primer_apellido}

                        </h4>

                        <span className="badge-rol">

                            {usuario.rol_nombre}

                        </span>

                        <div className="mt-4">

                            <Link
                                to="/usuarios"
                                className="btn btn-secundario"
                            >
                                Volver
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
);
}

export default DetallesUsuario;