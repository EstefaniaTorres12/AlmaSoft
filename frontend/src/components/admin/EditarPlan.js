import React, { useEffect, useState } from "react";
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
import "./EditarPlan.css";

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
          `${API_URL}/api/planes/${id}`
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
        `${API_URL}/api/planes/update/${id}`,
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
    <Container fluid className="editar-plan-page">

      {/* HEADER */}

      <Card className="editar-plan-header mb-4">

        <div className="pattern"></div>

        <Card.Body>

          <Row className="align-items-center">

            <Col>

              <h2 className="editar-plan-title">

                📋 Editar Plan Funerario

              </h2>

              <p className="editar-plan-subtitle">

                Actualice la información del plan.

              </p>

            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* FORMULARIO */}

      <Card className="editar-plan-form-card">

        <Card.Body>

          {mostrarAlerta && (
            <Alert variant="success" dismissible>
              Plan actualizado correctamente.
            </Alert>
          )}

          <Form onSubmit={enviarDatos}>

            <Row>

              {/* COLUMNA IZQUIERDA */}

              <Col lg={7}>

                <h5 className="form-title">

                  Información del Plan

                </h5>

                <Form.Group className="mb-4">

                  <Form.Label>Nombre</Form.Label>

                  <Form.Control
                    className="editar-plan-input"
                    name="plan_nombre"
                    value={formData.plan_nombre}
                    onChange={handleChange}
                  />

                </Form.Group>

                <Form.Group className="mb-4">

                  <Form.Label>Descripción</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={5}
                    className="editar-plan-input"
                    name="plan_descripcion"
                    value={formData.plan_descripcion}
                    onChange={handleChange}
                  />

                </Form.Group>

              </Col>

              {/* COLUMNA DERECHA */}

              <Col lg={5}>

                <h5 className="form-title">

                  Configuración

                </h5>

                <Form.Group className="mb-4">

                  <Form.Label>Precio</Form.Label>

                  <Form.Control
                    type="number"
                    className="editar-plan-input"
                    name="plan_precio"
                    value={formData.plan_precio}
                    onChange={handleChange}
                  />

                </Form.Group>

                <Form.Group className="mb-4">

                  <Form.Label>Estado</Form.Label>

                  <Form.Select
                    className="editar-plan-input"
                    name="plan_estado"
                    value={formData.plan_estado}
                    onChange={handleChange}
                  >

                    <option value="">Seleccione</option>

                    <option value="1">Activo</option>

                    <option value="0">Inactivo</option>

                  </Form.Select>

                </Form.Group>

              </Col>

            </Row>

            <div className="d-flex justify-content-end gap-3 mt-5">

              <Button
                type="button"
                className="editar-plan-btn-secundario"
                onClick={() => navigate("/admin/Planes")}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className="editar-plan-btn-principal"
              >
                Guardar Cambios
              </Button>

            </div>

          </Form>

        </Card.Body>

      </Card>

    </Container>
  );
};

export default EditarPlan;
