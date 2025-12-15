import React, { useRef, useState } from "react";
import { Container, Table, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { useToast } from "../../App";

const Compras = () => {
  const [compras, setCompras] = useState([
    {
      id: 1,
      fecha: "29.06.2022",
      nombre: "Juan Pérez",
      formaPago: "Efectivo",
      estado: "Pendiente",
    },
  ]);

  const [nuevaCompra, setNuevaCompra] = useState({
    fecha: "",
    nombre: "",
    formaPago: "",
    estado: "Pendiente",
  });

  const [mostrar, setMostrar] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [edicion, setEdicion] = useState(null);
  const formRef = useRef(null);
  const { success, info } = useToast();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaCompra({ ...nuevaCompra, [name]: value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    const nueva = {
      ...nuevaCompra,
      id: compras.length + 1,
    };
    setCompras([...compras, nueva]);
    setNuevaCompra({
      fecha: "",
      nombre: "",
      formaPago: "",
      estado: "Pendiente",
    });
  };

  const exportarCSV = () => {
    const encabezado = ["id","fecha","nombre","formaPago","estado"].join(",");
    const filas = compras.map(c => [c.id,c.fecha,c.nombre,c.formaPago,c.estado].join(",")).join("\n");
    const csv = encabezado + "\n" + filas;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compras.csv";
    a.click();
    URL.revokeObjectURL(url);
    success("CSV exportado");
  };

  const eliminar = (id) => { setCompras(compras.filter(c => c.id !== id)); info(`Registro ${id} eliminado`); };
  const deshabilitar = (id) => { setCompras(compras.map(c => c.id === id ? { ...c, estado: c.estado === "Pendiente" ? "Completado" : "Pendiente" } : c)); info(`Estado actualizado para registro ${id}`); };
  const consultar = (c) => { setDetalle(c); setMostrar(true); info(`Mostrando detalle de ${c.id}`); };
  const editar = (c) => { setEdicion(c); setMostrar(true); };

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <h2>Lista de Compras</h2>
        </Col>
        <Col className="text-end">
          <Button variant="outline-dark" className="me-2" onClick={exportarCSV}>Exportar CSV ⬇</Button>
          <Button style={{ background: "#7856AE", border: "#7856AE" }} onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}>
            Agregar Compra
          </Button>
        </Col>
      </Row>

      {/* Formulario */}
      <Form className="mb-3" onSubmit={manejarEnvio} ref={formRef}>
        <Row>
          <Col md={2}>
            <Form.Control
              type="date"
              name="fecha"
              value={nuevaCompra.fecha}
              onChange={manejarCambio}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Nombre y Apellido"
              value={nuevaCompra.nombre}
              onChange={manejarCambio}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Select
              name="formaPago"
              value={nuevaCompra.formaPago}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccione forma de pago</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              name="estado"
              value={nuevaCompra.estado}
              onChange={manejarCambio}
              required
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Completado">Completado</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button type="submit" style={{ background: "#7856AE", border: "#7856AE" }}>
              Agregar Registro
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Tabla */}
      <Table striped bordered hover>
        <thead className="table-secondary">
          <tr>
            <th>Registro</th>
            <th>Fecha</th>
            <th>Nombre y Apellido</th>
            <th>Forma de Pago</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.fecha}</td>
              <td>{c.nombre}</td>
              <td>{c.formaPago}</td>
              <td className={c.estado === "Pendiente" ? "text-danger fw-bold" : "text-success fw-bold"}>
                {c.estado}
              </td>
              <td>
                <Button variant="outline-dark" size="sm" className="me-2" onClick={() => editar(c)}>
                  Editar
                </Button>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => deshabilitar(c.id)}>
                  Deshabilitar
                </Button>
                <Button variant="outline-info" size="sm" className="me-2" onClick={() => consultar(c)}>
                  Consultar
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => eliminar(c.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={mostrar} onHide={() => { setMostrar(false); setDetalle(null); setEdicion(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{edicion ? "Editar Compra" : "Detalle de Compra"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {edicion ? (
            <Form onSubmit={(e) => {
              e.preventDefault();
              setCompras(compras.map(c => c.id === edicion.id ? edicion : c));
              setMostrar(false);
              setEdicion(null);
              success("Compra actualizada");
            }}>
              <Form.Group className="mb-2">
                <Form.Label>Fecha</Form.Label>
                <Form.Control type="date" value={edicion.fecha} onChange={(e) => setEdicion({ ...edicion, fecha: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control value={edicion.nombre} onChange={(e) => setEdicion({ ...edicion, nombre: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Forma de Pago</Form.Label>
                <Form.Select value={edicion.formaPago} onChange={(e) => setEdicion({ ...edicion, formaPago: e.target.value })}>
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>Transferencia</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select value={edicion.estado} onChange={(e) => setEdicion({ ...edicion, estado: e.target.value })}>
                  <option>Pendiente</option>
                  <option>Completado</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" style={{ background: "#7856AE", border: "#7856AE" }}>Guardar</Button>
            </Form>
          ) : detalle ? (
            <div>
              <p><b>ID:</b> {detalle.id}</p>
              <p><b>Fecha:</b> {detalle.fecha}</p>
              <p><b>Nombre:</b> {detalle.nombre}</p>
              <p><b>Forma de Pago:</b> {detalle.formaPago}</p>
              <p><b>Estado:</b> {detalle.estado}</p>
            </div>
          ) : null}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Compras;
