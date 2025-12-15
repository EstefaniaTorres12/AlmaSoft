import React, { useMemo, useState } from "react"; 
import { Container, Table, Row, Col, Button, Form } from "react-bootstrap";

const PRODUCTOS = [
  { id: 1, nombre: "Máquina de embalsamiento", cantidad: 2, estado: "Disponible" },
  { id: 2, nombre: "Instrumental", cantidad: 15, estado: "Disponible" },
  { id: 3, nombre: "EPP (Equipo de protección personal)", cantidad: 8, estado: "Bajo Stock" },
  { id: 4, nombre: "Equipo de higiene y limpieza", cantidad: 20, estado: "Disponible" },
  { id: 5, nombre: "Materiales de cierre y relleno", cantidad: 5, estado: "Bajo Stock" },
  { id: 6, nombre: "Ceras de modelado", cantidad: 0, estado: "Agotado" },
  { id: 7, nombre: "Maquillaje y cosméticos", cantidad: 12, estado: "Disponible" },
  { id: 8, nombre: "Urnas Clásicas", cantidad: 30, estado: "Disponible" },
  { id: 9, nombre: "Flores Blancas", cantidad: 5, estado: "Bajo Stock" },
  { id: 10, nombre: "Velas", cantidad: 0, estado: "Agotado" },
];

const Bodega = () => {

  const [termino, setTermino] = useState("");
  const filtrados = useMemo(() => {
    const t = termino.trim().toLowerCase();
    if (!t) return PRODUCTOS;
    return PRODUCTOS.filter(p => (p.nombre || "").toLowerCase().includes(t));
  }, [termino]);

  return (
<Container fluid style={{ padding: "20px 25px" }}>
        <Row className="mb-4">
        <Col>
          <h2>Lista de Productos de Bodega</h2>
        </Col>
        <Col className="text-end">
          <Button style={{ background: "#7856AE", border: "#7856AE" }}>
            Agregar Producto
          </Button>
        </Col>
      </Row>
      
      <Form className="mb-3" onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre de producto..."
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Button type="submit" className="me-4" variant="outline-dark">Buscar</Button>
            <Button type="button" variant="outline-dark" onClick={() => setTermino("")}>Mostrar Todos</Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover>
        <thead className="table-secondary">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>{prod.cantidad}</td>
              <td
                className={
                  prod.estado === "Agotado"
                    ? "text-danger fw-bold"
                    : prod.estado === "Bajo Stock"
                    ? "text-warning fw-bold"
                    : "text-success fw-bold"
                }
              >
                {prod.estado}
              </td>
              <td>
                <Button variant="outline-dark" size="sm" className="me-2">
                  Editar
                </Button>
                <Button variant="outline-danger" size="sm">
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Bodega;
