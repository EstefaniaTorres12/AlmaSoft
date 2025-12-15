import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../App";

export default function Carrito() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { info, warning, success } = useToast();

  useEffect(() => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    setItems(carrito);
  }, []);

  const actualizar = (id, delta) => {
    const next = items.map((x) =>
      x.id === id ? { ...x, cantidad: Math.max(1, (x.cantidad || 1) + delta) } : x
    );
    setItems(next);
    localStorage.setItem("carrito", JSON.stringify(next));
    info("Cantidad actualizada");
  };

  const eliminar = (id) => {
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    localStorage.setItem("carrito", JSON.stringify(next));
    warning("Producto eliminado del carrito");
  };

  const vaciar = () => {
    localStorage.removeItem("carrito");
    setItems([]);
    info("Carrito vaciado");
  };

  const total = items.reduce((acc, x) => acc + x.precio * (x.cantidad || 1), 0);

  return (
    <div style={{ background: "#F1F4F8", minHeight: "100vh" }}>
      <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Carrito</h2>
        <div>
          <Button as={Link} to="/ecommerce" variant="outline-dark" className="me-2">
            Seguir comprando
          </Button>
          <Button style={{ background: "#7856AE", border: "#7856AE" }} onClick={() => navigate("/login")}>
            Ir al Login
          </Button>
        </div>
      </div>

      <Table striped bordered hover>
        <thead className="table-secondary">
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x) => (
            <tr key={x.id}>
              <td>{x.nombre}</td>
              <td>{x.categoria}</td>
              <td>${x.precio.toLocaleString("es-CO")}</td>
              <td>
                <Button size="sm" variant="outline-dark" className="me-2" onClick={() => actualizar(x.id, -1)}>
                  -
                </Button>
                {x.cantidad || 1}
                <Button size="sm" variant="outline-dark" className="ms-2" onClick={() => actualizar(x.id, 1)}>
                  +
                </Button>
              </td>
              <td>${(x.precio * (x.cantidad || 1)).toLocaleString("es-CO")}</td>
              <td>
                <Button size="sm" variant="outline-danger" onClick={() => eliminar(x.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center text-muted">
                No hay productos en el carrito.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <h4>Total: ${total.toLocaleString("es-CO")}</h4>
        <div>
          <Button variant="outline-danger" className="me-2" onClick={vaciar}>
            Vaciar carrito
          </Button>
          <Button style={{ background: "#7856AE", border: "#7856AE" }} onClick={() => success("Compra simulada")}> 
            Pagar
          </Button>
        </div>
      </div>
      </Container>
    </div>
  );
}
