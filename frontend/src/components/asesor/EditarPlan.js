import { API_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const EditarPlan = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setData] = useState({
        plan_nombre: "",
        plan_precio: "",
        plan_estado: ""
    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    // 🔹 OBTENER PLAN POR ID
    useEffect(() => {
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.backgroundColor = "#D8CFE8";
        
        const fetchPlan = async () => {
            try {
                const res = await authFetch(
                    `${API_URL}/api/planes/${id}`
                );

                const data = await res.json();

                if (res.ok) {
                    setData(data.data);
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error(error);
                alert("Error al cargar plan");
            }
        };

        fetchPlan();
    }, [id]);

    // 🔹 HANDLE CHANGE
    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 🔹 ACTUALIZAR PLAN
    const enviarDatos = async (e) => {
        e.preventDefault();

        const plan = {
            plan_nombre: formData.plan_nombre,
            plan_precio: parseFloat(formData.plan_precio),
            plan_estado: parseInt(formData.plan_estado)
        };

        try {
            const res = await authFetch(
                `${API_URL}/api/planes/update/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(plan)
                }
            );

            const data = await res.json();

            if (res.ok) {
                setMostrarAlerta(true);
                setTimeout(() => {
                    navigate("/asesor/PlanesFront");
                }, 1500);
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Error al actualizar plan");
        }
    };

    return (
        <Container style={{ maxWidth: "600px", marginTop: "60px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Editar Plan</h3>

                    {mostrarAlerta && (
                        <Alert
                            variant="success"
                            onClose={() => setMostrarAlerta(false)}
                            dismissible
                        >
                            Plan actualizado correctamente ✅
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
                            Actualizar Plan
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditarPlan;