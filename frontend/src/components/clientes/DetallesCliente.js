import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import { API_URL } from "../../config/api";
import "./DetallesCliente.css";

const DetallesCliente = () => {

    const { id } = useParams();

    const [cliente, setCliente] = useState(null);

    useEffect(() => {

        const fetchCliente = async () => {

            try {

                const response = await fetch(

                    `${API_URL}/api/clientes/id/${id}`,

                    {

                        headers: {

                            Authorization:
                                "Bearer " +
                                localStorage.getItem("token")

                        }

                    }

                );

                const data = await response.json();

                if (response.ok) {

                    setCliente(data.data);

                } else {

                    alert(data.message);

                }

            } catch (error) {

                console.log(error);

                alert("Error cargando datos del cliente");

            }

        };

        fetchCliente();

    }, [id]);

    if (!cliente) {

        return (

            <div className="detalle-cliente-loading">

                <h3>

                    Cargando cliente...

                </h3>

            </div>

        );

    }

    return (

        <Container
            fluid
            className="detalle-cliente-page"
        >

            {/* HEADER */}

            <Card className="detalle-cliente-header mb-4">

                <div className="pattern"></div>

                <Card.Body>

                    <h2 className="detalle-cliente-title">

                        Detalles del Cliente

                    </h2>

                    <p className="detalle-cliente-subtitle">

                        Consulte la información completa del cliente.

                    </p>

                </Card.Body>

            </Card>

            <Row className="g-4">

                {/* INFORMACIÓN */}

                <Col lg={8}>

                    <Card className="detalle-cliente-card">

                        <Card.Body>

                            <h5 className="detalle-section-title">

                                Información Personal

                            </h5>

                            <Row>

                                <Col md={6} className="mb-4">

                                    <div className="detalle-item">

                                        <span>

                                            ID

                                        </span>

                                        <h6>

                                            {cliente.id}

                                        </h6>

                                    </div>

                                </Col>

                                <Col md={6} className="mb-4">

                                    <div className="detalle-item">

                                        <span>

                                            Documento

                                        </span>

                                        <h6>

                                            {cliente.documento}

                                        </h6>

                                    </div>

                                </Col>

                                <Col md={6} className="mb-4">

                                    <div className="detalle-item">

                                        <span>

                                            Primer Nombre

                                        </span>

                                        <h6>

                                            {cliente.primer_nombre}

                                        </h6>

                                    </div>

                                </Col>

                                <Col md={6} className="mb-4">

                                    <div className="detalle-item">

                                        <span>

                                            Segundo Nombre

                                        </span>

                                        <h6>

                                            {cliente.segundo_nombre || "---"}

                                        </h6>

                                    </div>

                                </Col>

                                <Col md={6} className="mb-4">

                                    <div className="detalle-item">

                                        <span>

                                            Primer Apellido

                                        </span>

                                        <h6>

                                            {cliente.primer_apellido}

                                        </h6>

                                    </div>

                                </Col>

                                <Col md={6} className="mb-4">

                                    <div className="detalle-item">

                                        <span>

                                            Segundo Apellido

                                        </span>

                                        <h6>

                                            {cliente.segundo_apellido || "---"}

                                        </h6>

                                    </div>

                                </Col>

                            </Row>

                            <h5 className="detalle-section-title mt-3">

                                Información de Contacto

                            </h5>

                            <Row>

                                <Col md={6} className="mb-4">

                                    <div className="detalle-item">

                                        <span>

                                            Correo

                                        </span>

                                        <h6>

                                            {cliente.correo}

                                        </h6>

                                    </div>

                                </Col>

                                <Col md={6} className="mb-4">

                                    <div className="detalle-item">

                                        <span>

                                            Teléfono

                                        </span>

                                        <h6>

                                            {cliente.telefono}

                                        </h6>

                                    </div>

                                </Col>

                                <Col md={12} className="mb-4">

                                    <div className="detalle-item">

                                        <span>

                                            Dirección

                                        </span>

                                        <h6>

                                            {cliente.direccion}

                                        </h6>

                                    </div>

                                </Col>

                            </Row>

                            <h5 className="detalle-section-title mt-3">

                                Información del Cliente

                            </h5>

                            <Row>

                                <Col md={6}>

                                    <div className="detalle-item">

                                        <span>

                                            Fecha de Nacimiento

                                        </span>

                                        <h6>

                                            {cliente.fecha_nacimiento}

                                        </h6>

                                    </div>

                                </Col>

                                <Col md={6}>

                                    <div className="detalle-item">

                                        <span>

                                            Edad

                                        </span>

                                        <h6>

                                            {cliente.edad} años

                                        </h6>

                                    </div>

                                </Col>

                            </Row>
                            {/* TARJETA LATERAL */}

                        </Card.Body>

                    </Card>

                </Col>

                <Col lg={4}>

                    <Card className="detalle-cliente-card text-center">

                        <Card.Body>

                            <img
                                src="/img/usuario.png"
                                alt="Cliente"
                                className="detalle-cliente-img"
                            />

                            <h4 className="mt-3">

                                {cliente.primer_nombre} {cliente.primer_apellido}

                            </h4>

                            <span className="detalle-cliente-badge">

                                Cliente

                            </span>

                            <div className="mt-4">

                                <Link
                                    to="/clientes/Cliente"
                                    className="btn detalle-cliente-btn"
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

};

export default DetallesCliente;