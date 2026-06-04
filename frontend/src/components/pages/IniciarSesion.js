import React, { useState } from "react";
import { Container, Card, Form, Alert, Button } from "react-bootstrap";
import { DESTINO_POR_ROL } from "../../utils/auth";

const IniciarSesion = () => {
  const [formData, setFormData] = useState({
    usuario_correo:    "",
    usuario_credencial: "",
  });
  const [mensajeError, setMensajeError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setCargando(true);

    try {
      const response = await fetch("http://localhost:3001/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setMensajeError(data.message || "Credenciales incorrectas");
        return;
      }

      const usuario_id =
        data.usuario?.usuario_id ||
        data.data?.usuario_id ||
        data.usuario_id;

      if (!usuario_id) {
        setMensajeError("Error interno: el servidor no devolvió el ID de usuario.");
        return;
      }

      // Persistir sesión
      localStorage.setItem("token",      data.token);
      localStorage.setItem("usuario_id", String(usuario_id));
      localStorage.setItem("rol",        data.rol);
      localStorage.setItem("usuario",    JSON.stringify(data.usuario || {}));

      // Redirigir según rol — cada rol tiene un destino definido en DESTINO_POR_ROL
      const destino = DESTINO_POR_ROL[data.rol];
      if (!destino) {
        setMensajeError(`Rol desconocido (${data.rol}). Contacta al administrador.`);
        return;
      }

      window.location.href = destino;

    } catch {
      setMensajeError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(/img/3302177.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container style={{ maxWidth: "600px" }}>
        <Card>
          <Card.Header>
            <h1 className="text-center" style={{ color: "#60448D" }}>
              Iniciar Sesión
            </h1>

            {mensajeError && (
              <Alert variant="danger">{mensajeError}</Alert>
            )}
          </Card.Header>

          <Card.Body>
            <Form onSubmit={enviarDatos}>
              <Form.Group className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="usuario_correo"
                  value={formData.usuario_correo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="usuario_credencial"
                  value={formData.usuario_credencial}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                style={{ background: "#5660AE", borderColor: "#36264F" }}
                className="w-100"
                disabled={cargando}
              >
                {cargando ? "Verificando..." : "Iniciar Sesión"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default IniciarSesion;
