import { API_URL } from "../../config/api";
import React, { useState } from "react";
import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const AgregarPlan = () => {

    const navigate = useNavigate();

    const [formData, setData] = useState({
        plan_nombre: "",
        plan_precio: "",
        plan_estado: "1"
    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const enviarDatos = async (e) => {
        e.preventDefault();

        const plan = {
            plan_nombre: formData.plan_nombre,
            plan_precio: parseFloat(formData.plan_precio),
            plan_estado: parseInt(formData.plan_estado)
        };

        try {
            const response = await authFetch(
                `${API_URL}/api/planes/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(plan)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMostrarAlerta(true);

                // limpiar form
                setData({ plan_nombre: "", plan_precio: "", plan_estado: "1" });

                // redirigir después de 1.5s
                setTimeout(() => {
                    navigate("/asesor/PlanesFront");
                }, 1500);

            } else {
                alert(data.message || "Error al crear plan");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "600px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Agregar Plan</h3>

                    {mostrarAlerta && (
                        <Alert
                            variant="success"
                            onClose={() => setMostrarAlerta(false)}
                            dismissible
                        >
                            Plan creado correctamente ✅
                        </Alert>
                    )}
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={enviarDatos}>

                        <Form.Group className="mb-3">
                            <Form.Label>NOMBRE DEL PLAN</Form.Label>
                            <Form.Control
                                type="text"
                                name="plan_nombre"
                                value={formData.plan_nombre}
                                onChange={handleChange}
                                placeholder="Ej: Plan Básico, Plan Premium..."
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>PRECIO</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="plan_precio"
                                value={formData.plan_precio}
                                onChange={handleChange}
                                placeholder="Precio del plan"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>ESTADO</Form.Label>
                            <Form.Select
                                name="plan_estado"
                                value={formData.plan_estado}
                                onChange={handleChange}
                                required
                            >
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </Form.Select>
                        </Form.Group>

                        <Button
                            style={{ background: "#7856AE", border: "#7856AE" }}
                            type="submit"
                            className="w-100"
                        >
                            Agregar Plan
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AgregarPlan;