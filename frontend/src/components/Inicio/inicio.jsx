import React from "react";
import { Card, Row, Col, Container, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./inicio.css";
import { FaUsers, FaShoppingCart, FaWarehouse, FaTags } from "react-icons/fa";

// 📌 Importa el logo principal y de respaldo (guárdalos en src/img)
import logo from "../../img/1.png";
import logoFallback from "../../img/1.png";


const Inicio = () => {
  const navigate = useNavigate();

  const accesosDirectos = [
    { id: 1, titulo: "Clientes", descripcion: "Gestión de clientes y servicios", icono: <FaUsers />, ruta: "/clientes/cliente", color: "#7856AE" },
    { id: 2, titulo: "Compras", descripcion: "Registro y control de compras", icono: <FaShoppingCart />, ruta: "/compras", color: "#7856AE" },
    { id: 3, titulo: "Bodega", descripcion: "Inventario y gestión de productos", icono: <FaWarehouse />, ruta: "/bodega", color: "#7856AE" },
    { id: 4, titulo: "Categorías", descripcion: "Administración de categorías", icono: <FaTags />, ruta: "/categorias", color: "#7856AE" }
  ];

  const navegarA = (ruta) => navigate(ruta);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container fluid style={{ padding: "30px" }}>


      {/* 🟣 Título principal */}
      <Row className="text-center mb-4">
        <Col>
          <h2 style={{ color: "#4B3B75" }}>Bienvenido al Sistema de Gestión Funeraria</h2>
        </Col>
      </Row>

      {/* 🟣 Accesos directos */}
      <Row className="justify-content-center mb-4">
        {accesosDirectos.map((acceso) => (
          <Col key={acceso.id} xs={12} sm={6} md={6} lg={3} className="mb-4">
            <Card
              className="h-100 acceso-card"
              onClick={() => navegarA(acceso.ruta)}
              style={{
                borderColor: acceso.color,
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Card.Body className="text-center d-flex flex-column justify-content-center">
                <div
                  className="icono-container mb-3 mx-auto"
                  style={{
                    backgroundColor: acceso.color,
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "24px",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  {acceso.icono}
                </div>
                <Card.Title className="mt-2">{acceso.titulo}</Card.Title>
                <Card.Text>{acceso.descripcion}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* 🟣 Logo centrado */}
      <Row className="justify-content-center mb-3">
        <Col xs="auto" className="text-center">
          <Image
            src={logo}
            alt="Almasoft"
            rounded
            fluid
            onError={(e) => (e.target.src = logoFallback)} // Imagen de respaldo
            style={{
              width: "150px",
              height: "auto",
              marginBottom: "10px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </Col>
      </Row>
      {/* 🟣 Botón de cerrar sesión */}
      <Row className="justify-content-center">
        <Col xs={12} sm={6} md={4} lg={3} className="text-center">
          <Button
            variant="outline-danger"
            onClick={cerrarSesion}
            style={{
              width: "100%",
              fontWeight: "500",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            Cerrar Sesión
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;
