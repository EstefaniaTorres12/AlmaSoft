import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { API_URL } from "../../config/api";

const AgregarPlan = () => {

    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        plan_nombre: "",
        plan_descripcion: "",
        plan_precio: "",
        plan_estado: ""
    });

    const [alerta, setAlerta] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const enviarDatos = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/planes/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setAlerta(true);
                setFormData({
                    plan_nombre: "",
                    plan_descripcion: "",
                    plan_precio: "",
                    plan_estado: ""
                });
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container style={{ maxWidth: "600px", marginTop: "60px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Agregar Plan</h3>
                    {alerta && <Alert variant="success">Plan creado ✅</Alert>}
                </Card.Header>

                <Card.Body>
                    <Form onSubmit={enviarDatos}>

                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control name="plan_nombre" value={formData.plan_nombre} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control name="plan_descripcion" value={formData.plan_descripcion} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="number" name="plan_precio" value={formData.plan_precio} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select name="plan_estado" value={formData.plan_estado} onChange={handleChange}>
                                <option value="">Seleccione</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
                            </Form.Select>
                        </Form.Group>

                        <Button style={{ background: "#7856AE" }} type="submit">
                            Guardar
                        </Button>

                        <Button
                            className="mx-3"
                            variant="secondary"
                            onClick={() => navigate("/admin/Planes")}
                        >
                            Cancelar
                        </Button>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AgregarPlan;