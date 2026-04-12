import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const EditarPlan = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    plan_nombre: "",
    plan_descripcion: "",
    plan_precio: "",
    plan_estado: ""
  });

  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  // 🔹 OBTENER PLAN
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await authFetch(
          `http://localhost:3001/api/planes/${id}`
        );

        const data = await response.json();

        if (response.ok) {
          setFormData(data.data);
        } else {
          alert("Error al cargar plan");
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchPlan();
  }, [id]);

  // 🔹 CAMBIOS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔹 ACTUALIZAR
  const enviarDatos = async (e) => {
    e.preventDefault();

    try {
      const response = await authFetch(
        `http://localhost:3001/api/planes/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, plan_id: id })
        }
      );

      if (response.ok) {
        setMostrarAlerta(true);

        setTimeout(() => {
          navigate("/admin/Planes");
        }, 1500);
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container style={{ maxWidth: "600px", marginTop: "60px" }}>
      <Card>
        <Card.Header>
          <h3 className="text-center">Editar Plan</h3>

          {mostrarAlerta && (
            <Alert variant="success" dismissible>
              Plan actualizado correctamente ✅
            </Alert>
          )}
        </Card.Header>

        <Card.Body>
          <Form onSubmit={enviarDatos}>

            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="plan_nombre"
                value={formData.plan_nombre}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                name="plan_descripcion"
                value={formData.plan_descripcion}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="plan_precio"
                value={formData.plan_precio}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="plan_estado"
                value={formData.plan_estado}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </Form.Select>
            </Form.Group>

            {/* BOTONES */}
            <Button
              style={{ background: "#7856AE", border: "#7856AE" }}
              type="submit"
            >
              Guardar Cambios
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

export default EditarPlan;