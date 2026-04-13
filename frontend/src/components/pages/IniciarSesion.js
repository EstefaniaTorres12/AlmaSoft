import React, { useState } from "react";
import { Container, Card, Form, Alert, Button } from "react-bootstrap";

const InisiarSesion = () => {

  const [formData, setFormData] = useState({
    usuario_correo: "",
    usuario_credencial: ""
  });

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeError, setMensajeError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    setMensajeError("");

    try {
      const response = await fetch("http://localhost:3001/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log("RESPUESTA BACKEND ", data);

      if (!data.success) {
        setMensajeError(data.message || "Credenciales incorrectas");
        return;
      }

      // guardar token y rol
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);

      setMostrarAlerta(true);

      // redirigir según rol (con delay para que se vea el alert)
      setTimeout(() => {
        if (data.rol === "Administrador") {
          window.location.href = "/usuarios";
        } else if (data.rol === "Cliente") {
          window.location.href = "/cliente";
        }else if (data.rol === "Asesor") {
          window.location.href = "/usuarios";
        } else {
          window.location.href = "/";
        }
      }, 1000);

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensajeError("Error de conexión con el servidor");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(/img/3302177.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Container style={{ maxWidth: "600px" }}>
        <Card>
          <Card.Header>
            <h1 className="text-center" style={{ color: "#60448D" }}>
              Iniciar Sesión
            </h1>

            {mostrarAlerta && (
              <Alert
                variant="success"
                onClose={() => setMostrarAlerta(false)}
                dismissible
              >
                Inicio de sesión exitoso
              </Alert>
            )}

            {mensajeError && (
              <Alert variant="danger">
                {mensajeError}
              </Alert>
            )}
          </Card.Header>

          <Card.Body>
            <Form onSubmit={enviarDatos}>
              <Form.Group className="mb-3" controlId="usuario_correo">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="usuario_correo"
                  value={formData.usuario_correo}
                  onChange={handleChange}
                  placeholder="Digite su correo"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="usuario_credencial">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="usuario_credencial"
                  value={formData.usuario_credencial}
                  onChange={handleChange}
                  placeholder="Digite su contraseña"
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                style={{ background: "#5660AE", borderColor: "#36264F" }}
                className="w-100"
              >
                Iniciar Sesión
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default InisiarSesion;
