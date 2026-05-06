import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const RegistrarAfiliado = () => {

    const navigate = useNavigate();

    const [formData, setData] = useState({
        cliente_id: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        correo: "",
        documento: "",
        plan_id: ""
    });

    const [clientes, setClientes] = useState([]);
    const [planes, setPlanes] = useState([]);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    // Cargar clientes y planes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resClientes, resPlanes] = await Promise.all([
                    authFetch("http://localhost:3001/api/clientes/clientesAll"),
                    authFetch("http://localhost:3001/api/planes/all")
                ]);

                const dataClientes = await resClientes.json();
                const dataPlanes = await resPlanes.json();

                if (resClientes.ok) setClientes(dataClientes.data);
                if (resPlanes.ok) setPlanes(dataPlanes.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const enviarDatos = async (e) => {
        e.preventDefault();

        // Assume API for registering affiliate
        const afiliado = {
            cliente_id: formData.cliente_id,
            primer_nombre: formData.primer_nombre,
            segundo_nombre: formData.segundo_nombre,
            primer_apellido: formData.primer_apellido,
            segundo_apellido: formData.segundo_apellido,
            correo: formData.correo,
            documento: formData.documento,
            plan_id: formData.plan_id
        };

        try {
            const response = await authFetch(
                "http://localhost:3001/api/client/affiliates/register", // Assume endpoint
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(afiliado)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMostrarAlerta(true);

                // limpiar form
                setData({
                    cliente_id: "",
                    primer_nombre: "",
                    segundo_nombre: "",
                    primer_apellido: "",
                    segundo_apellido: "",
                    correo: "",
                    documento: "",
                    plan_id: ""
                });

                setTimeout(() => {
                    navigate("/asesor/RegistrarAfiliado"); // Or list
                }, 1500);

            } else {
                alert(data.message || "Error al registrar afiliado");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "900px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Registrar Afiliado</h3>

                    {mostrarAlerta && (
                        <Alert
                            variant="success"
                            onClose={() => setMostrarAlerta(false)}
                            dismissible
                        >
                            Afiliado registrado correctamente ✅
                        </Alert>
                    )}
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={enviarDatos}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CLIENTE</Form.Label>
                                    <Form.Select
                                        name="cliente_id"
                                        value={formData.cliente_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar cliente</option>
                                        {clientes.map(c => (
                                            <option key={c.usuario_id} value={c.usuario_id}>
                                                {`${c.usuario_primer_nombre} ${c.usuario_primer_apellido} - ${c.usuario_documento}`}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>PLAN</Form.Label>
                                    <Form.Select
                                        name="plan_id"
                                        value={formData.plan_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccionar plan</option>
                                        {planes.filter(p => p.plan_estado === 1).map(p => (
                                            <option key={p.plan_id} value={p.plan_id}>
                                                {p.plan_nombre} - ${p.plan_precio}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>DOCUMENTO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="documento"
                                        value={formData.documento}
                                        onChange={handleChange}
                                        placeholder="Número de documento"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>PRIMER NOMBRE</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="primer_nombre"
                                        value={formData.primer_nombre}
                                        onChange={handleChange}
                                        placeholder="Primer nombre"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>SEGUNDO NOMBRE</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="segundo_nombre"
                                        value={formData.segundo_nombre}
                                        onChange={handleChange}
                                        placeholder="Segundo nombre"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>PRIMER APELLIDO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="primer_apellido"
                                        value={formData.primer_apellido}
                                        onChange={handleChange}
                                        placeholder="Primer apellido"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>SEGUNDO APELLIDO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="segundo_apellido"
                                        value={formData.segundo_apellido}
                                        onChange={handleChange}
                                        placeholder="Segundo apellido"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CORREO</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleChange}
                                        placeholder="Correo electrónico"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button
                            style={{ background: "#7856AE", border: "#7856AE" }}
                            type="submit"
                            className="w-100"
                        >
                            Registrar Afiliado
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default RegistrarAfiliado;