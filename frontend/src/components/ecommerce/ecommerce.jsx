import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useToast } from "../../App";
import logo from "../../img/1.png";

const imagenesCategorias = {
  "Ataúd": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Coffin_with_viewing_window.jpg/640px-Coffin_with_viewing_window.jpg",
  "Urna": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Urn.JPG/640px-Urn.JPG",
  "Arreglo": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Wreath.jpg/640px-Wreath.jpg",
  "Lápida": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Gravestone_in_cemetery.jpg/640px-Gravestone_in_cemetery.jpg"
};

const imagenesCategoria = {
  "Ataúd": "https://imgs.search.brave.com/s7nKcUtref-u7cQVtkuy6gRWSIotmX1BiO-5gglQbJw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI4/MDQ5NTc1My9lcy9m/b3RvL2Z1bmVyYWwt/aG9tZS5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9aDNJZ2Qw/aG9IdU1wUWhVcGNZ/VEoweWVydGJLUDJW/ZGpOanhZN2ZaTFJF/QT0",
  "Urna": "https://imgs.search.brave.com/zWNlIECv5W5Hv7QzFfkuPwlL6qVL4PpX4d57nVg-hmU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/Xzg2OTU4MC1NTE05/MjMzMzI5OTE2N18w/OTIwMjUtRS53ZWJw",
  "Arreglo": "https://imgs.search.brave.com/1FL1PgcMuWZ0XaoAo0kj2-urAmtdZphWaJ6epr1MOow/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzUxTkVnOFJDSndM/LmpwZw",
  "Lápida": "https://imgs.search.brave.com/qON11GPaY08dSmmFn2FaqoG3VexJSJCkz9BJrei21BI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9vbmly/aWFsYXBpZGFzLmVz/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIw/LzA3L21hdGVfYXJl/bmFkYXNfMzEuanBn"
};
const productosDemo = [
  { id: 1, nombre: "Ataúd Roble Premium", categoria: "Ataúd", precio: 550000 },
  { id: 2, nombre: "Urna de Mármol Italiano", categoria: "Urna", precio: 220000 },
  { id: 3, nombre: "Arreglo Floral Premium", categoria: "Arreglo", precio: 180000 },
  { id: 4, nombre: "Lápida de Granito Negro", categoria: "Lápida", precio: 800000 },
  { id: 5, nombre: "Ataúd Caoba Clásico", categoria: "Ataúd", precio: 480000 },
  { id: 6, nombre: "Urna Acero Inoxidable", categoria: "Urna", precio: 250000 },
  { id: 7, nombre: "Arreglo Rosas Rojas", categoria: "Arreglo", precio: 210000 },
  { id: 8, nombre: "Lápida Mármol Blanco", categoria: "Lápida", precio: 650000 },
  { id: 9, nombre: "Ataúd Pino Económico", categoria: "Ataúd", precio: 300000 },
  { id: 10, nombre: "Urna Cerámica Decorada", categoria: "Urna", precio: 150000 },
  { id: 11, nombre: "Arreglo Corazón", categoria: "Arreglo", precio: 200000 },
  { id: 12, nombre: "Lápida Granito Gris", categoria: "Lápida", precio: 720000 },
  { id: 13, nombre: "Ataúd Nogal Deluxe", categoria: "Ataúd", precio: 900000 },
  { id: 14, nombre: "Urna Madera Tallada", categoria: "Urna", precio: 320000 }
].map(prod => ({
  ...prod,
  img: imagenesCategoria[prod.categoria]  
}));



export default function Ecommerce() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [orden, setOrden] = useState("");
  const [vistaProducto, setVistaProducto] = useState(null);
  const { success } = useToast();

  const comprar = (p) => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existente = carrito.find((x) => x.id === p.id);
    if (existente) {
      existente.cantidad = (existente.cantidad || 1) + 1;
    } else {
      carrito.push({ ...p, cantidad: 1 });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    success(`Agregado al carrito: ${p.nombre}`);
  };

  const productosFiltrados = productosDemo
    .filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter((p) => (categoria ? p.categoria === categoria : true))
    .sort((a, b) => {
      if (orden === "asc") return a.precio - b.precio;
      if (orden === "desc") return b.precio - a.precio;
      return 0;
    });

  return (
    <div style={{ background: "#F1F4F8", minHeight: "100vh", paddingBottom: "90px" }}>
      
      {/* 🔵 BANNER */}
      <div
        style={{
          background: "linear-gradient(90deg, #7A5AF8, #5B42C7)",
          padding: "24px 0",
          color: "white",
          marginBottom: "40px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.25)"
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col xs="auto">
              <img
                src={logo}
                alt="AlmaSoft"
                style={{ height: 80, width: 80, objectFit: "cover", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
              />
            </Col>
            <Col>
              <h1 className="fw-bold" style={{ margin: 0 }}>Tienda Funeraria AlmaSoft</h1>
              <p className="mb-0">Dignidad, respeto y calidad en cada detalle.</p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          {/* 🟤 SIDEBAR DE FILTROS */}
          <Col md={3} className="mb-4">
            <div
              style={{
                background: "#F5EFE6",
                padding: "22px",
                borderRadius: "18px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
              }}
            >
              <h5 className="fw-bold mb-3" style={{ color: "#5B42C7" }}>Filtros</h5>

              <Form.Group className="mb-3">
                <Form.Label>Buscar</Form.Label>
                <Form.Control
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar producto..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="">Todas</option>
                  <option value="Ataúd">Ataúd</option>
                  <option value="Urna">Urna</option>
                  <option value="Arreglo">Arreglo</option>
                  <option value="Lápida">Lápida</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ordenar por</Form.Label>
                <Form.Select value={orden} onChange={(e) => setOrden(e.target.value)}>
                  <option value="">Sin orden</option>
                  <option value="asc">Precio ascendente</option>
                  <option value="desc">Precio descendente</option>
                </Form.Select>
              </Form.Group>

              <Button className="w-100 mt-2" style={{ background: "#7A5AF8", border: "none" }}>
                Aplicar filtros
              </Button>
            </div>
          </Col>

          {/* 💜 LISTADO DE PRODUCTOS */}
          <Col md={9}>
            <Row>
              {productosFiltrados.map((p) => (
                <Col key={p.id} md={4} className="mb-4">
                  <Card
                    className="shadow-sm h-100"
                    style={{
                      borderRadius: "18px",
                      overflow: "hidden",
                      transition: "transform 0.25s ease, box-shadow 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.04)";
                      e.currentTarget.style.boxShadow = "0 8px 22px rgba(0,0,0,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                  >

                    {/* 🌄 IMAGEN */}
                    <div style={{ height: "180px", overflow: "hidden" }}>
                      <img
                        src={p.img || imagenesCategorias[p.categoria]}
                        alt={p.nombre}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => { e.currentTarget.src = imagenesCategorias[p.categoria]; }}
                      />
                    </div>

                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fw-bold">{p.nombre}</Card.Title>

                      <Badge bg="secondary" className="mb-2">
                        {p.categoria}
                      </Badge>

                      <h4 className="fw-bold" style={{ color: "#7A5AF8" }}>
                        ${p.precio.toLocaleString("es-CO")}
                      </h4>

                      <Button
                        style={{
                          background: "#7A5AF8",
                          border: "none",
                          marginTop: "auto",
                          borderRadius: "8px"
                        }}
                        onClick={() => comprar(p)}
                      >
                        Comprar
                      </Button>

                      {/* 👁️ QUICK VIEW */}
                      <Button
                        variant="outline-secondary"
                        className="mt-2"
                        style={{
                          borderRadius: "8px",
                          fontSize: "0.85rem"
                        }}
                        onClick={() => setVistaProducto(p)}
                      >
                        👁️ Ver detalles
                      </Button>

                    </Card.Body>
                  </Card>
                </Col>
              ))}

              {productosFiltrados.length === 0 && (
                <p className="text-muted text-center mt-4">No se encontraron productos.</p>
              )}
            </Row>
          </Col>
        </Row>
      </Container>

      {/* 🛒 CARRITO FLOTANTE */}
      <Button
        as={Link}
        to="/carrito"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#D4AF37",
          border: "none",
          padding: "15px 25px",
          borderRadius: "50px",
          fontWeight: "bold",
          color: "black",
          boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
          fontSize: "1.1rem"
        }}
      >
        🛒 Carrito
      </Button>

      {vistaProducto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050
          }}
          onClick={() => setVistaProducto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "white", borderRadius: 16, padding: 24, width: 420 }}
          >
            <h4 className="fw-bold mb-2">{vistaProducto.nombre}</h4>
            <p className="text-muted mb-1">{vistaProducto.categoria}</p>
            <p className="fw-bold" style={{ color: "#7A5AF8" }}>
              ${vistaProducto.precio.toLocaleString("es-CO")}
            </p>
            <div className="d-flex gap-2 mt-3">
              <Button style={{ background: "#7A5AF8", border: "none" }} onClick={() => comprar(vistaProducto)}>
                Añadir al carrito
              </Button>
              <Button variant="outline-secondary" onClick={() => setVistaProducto(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
