import React, { useState } from "react";
import { Container, Button, Table, Modal, Row, Col, Form } from "react-bootstrap";
import { useToast } from "../../App";

const Categorias = () => {
  const { info, warning } = useToast();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // 🔹 Datos iniciales
  const dataInicial = {
    Ataúdes: [
      { id: 1, material: "Madera", tamaño: "Grande", cantidadDisponible: 5 },
      { id: 2, material: "Hierro", tamaño: "Mediano", cantidadDisponible: 8 },
      { id: 3, material: "Fibra de vidrio", tamaño: "Pequeño", cantidadDisponible: 0 },
    ],
    Urnas: [
      { id: 1, tipo: "Cerámica", color: "Blanco", capacidad: "3L" },
      { id: 2, tipo: "Mármol", color: "Gris", capacidad: "4L" },
      { id: 3, tipo: "Madera", color: "Caoba", capacidad: "0L" },
    ],
    Planes: [
      { id: 1, nombre: "Plan Básico", precio: "$500.000", beneficios: "Ataúd sencillo, velación" },
      { id: 2, nombre: "Plan Premium", precio: "$1.500.000", beneficios: "Ataúd lujo, sala VIP, urna" },
      { id: 3, nombre: "Plan Familiar", precio: "$0", beneficios: "Cobertura 4 personas" },
    ],
    Arreglos: [
      { id: 1, nombre: "Arreglo Floral Blanco", tamaño: "Grande", precio: "$200.000" },
      { id: 2, nombre: "Corona Fúnebre", tamaño: "Mediana", precio: "$150.000" },
      { id: 3, nombre: "Ramo Rosas", tamaño: "Pequeño", precio: "$0" },
    ],
    Lápidas: [
      { id: 1, material: "Mármol", diseño: "Clásico", precio: "$500.000" },
      { id: 2, material: "Granito", diseño: "Personalizado", precio: "$800.000" },
      { id: 3, material: "Concreto", diseño: "Económico", precio: "$0" },
    ],
    Boveda: [
      { id: 1, numeroDisponible: 5, lugar: "San Francisco", precio: "$1.000.000" },
      { id: 2, numeroDisponible: 0, lugar: "Santa Rosalia", precio: "$1.200.000" },
      { id: 3, numeroDisponible: 2, lugar: "Trinidad", precio: "$900.000" },
    ],
  };

  const [data, setData] = useState(dataInicial);
  const [showModal, setShowModal] = useState(false);
  const [registroActivo, setRegistroActivo] = useState(null);

  const [nuevoRegistro, setNuevoRegistro] = useState({});

  // navegar no se usa actualmente
  // const navegar = useNavigate();

  // 🔹 Manejo del formulario de agregar
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoRegistro({ ...nuevoRegistro, [name]: value });
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!categoriaSeleccionada) return;

    const nuevo = { id: Date.now(), ...nuevoRegistro };
    setData({
      ...data,
      [categoriaSeleccionada]: [...data[categoriaSeleccionada], nuevo],
    });
    setNuevoRegistro({});
  };

  // 🔹 Acciones de fila
  const editar = (registro) => {
    if ("cantidadDisponible" in registro) {
      const nuevoValor = prompt("Ingrese nueva cantidad disponible:", registro.cantidadDisponible);
      if (nuevoValor !== null) {
        setData({
          ...data,
          [categoriaSeleccionada]: data[categoriaSeleccionada].map((r) =>
            r.id === registro.id ? { ...r, cantidadDisponible: Number(nuevoValor) } : r
          ),
        });
      }
    } else {
      warning("No hay campo editable para este registro");
    }
  };

  const deshabilitar = (registro) => {
    info(`Registro ${registro.id} deshabilitado`);
  };

  const consultar = (registro) => {
    setRegistroActivo(registro);
    setShowModal(true);
  };

  const eliminar = (id) => {
    setData({
      ...data,
      [categoriaSeleccionada]: data[categoriaSeleccionada].filter((r) => r.id !== id),
    });
  };

  const mostrarValor = (valor) => {
    if ((typeof valor === "number" && valor === 0) || valor === "$0") return "Sin disponibilidad";
    return valor;
  };

  const renderTabla = () => {
    if (!categoriaSeleccionada) return <p className="text-muted">Selecciona una categoría para ver los detalles</p>;
    const registros = data[categoriaSeleccionada];

    return (
      <Table striped bordered hover>
        <thead className="table-secondary">
          <tr>
            {Object.keys(registros[0]).map((col) => (
              <th key={col}>{col.toUpperCase()}</th>
            ))}
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((r) => (
            <tr key={r.id}>
              {Object.entries(r).map(([k, v]) => (
                <td key={k}>{mostrarValor(v)}</td>
              ))}
              <td>
                <Button variant="outline-dark" size="sm" className="me-2" onClick={() => editar(r)}>
                  Editar
                </Button>
                <Button variant="outline-warning" size="sm" className="me-2" onClick={() => deshabilitar(r)}>
                  Deshabilitar
                </Button>
                <Button variant="outline-info" size="sm" className="me-2" onClick={() => consultar(r)}>
                  Consultar
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => eliminar(r.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderConsulta = () => {
    if (!registroActivo) return null;
    return (
      <div>
        {Object.entries(registroActivo).map(([k, v]) => (
          <p key={k}>
            <b>{k.toUpperCase()}:</b> {mostrarValor(v)}
          </p>
        ))}
      </div>
    );
  };

  return (
<Container fluid style={{ padding: "20px 25px" }}>
        <Row className="mb-4">
        <Col>
          <h2>Lista de Categorías</h2>
        </Col>
        <Col className="text-end">
          <Button style={{ background: "#7856AE", border: "#7856AE" }} onClick={() => info("Acción Agregar Categoría")}>
            Agregar Categoría
          </Button>
        </Col>
      </Row>

      {/* Botones de selección de categoría */}
      <Row className="mb-3">
        <Col>
          {Object.keys(data).map((cat) => (
            <Button
              key={cat}
              variant="outline-dark"
              onClick={() => setCategoriaSeleccionada(cat)}
              className="me-2 mb-2"
            >
              {cat}
            </Button>
          ))}
        </Col>
      </Row>

      {/* Formulario de agregar registro */}
      {categoriaSeleccionada && (
        <Form className="mb-3" onSubmit={(e) => { manejarEnvio(e); info("Registro agregado"); }}>
          <Row>
            {Object.keys(data[categoriaSeleccionada][0])
              .filter((k) => k !== "id")
              .map((campo, index) => (
                <Col md={3} key={campo}>
                  <Form.Control
                    type="text"
                    name={campo}
                    placeholder={campo.toUpperCase()}
                    value={nuevoRegistro[campo] || ""}
                    onChange={manejarCambio}
                    required
                    className="mb-2"
                  />
                </Col>
              ))}
            <Col md={2}>
              <Button type="submit" style={{ background: "#7856AE", border: "#7856AE" }}>
                Agregar Registro
              </Button>
            </Col>
          </Row>
        </Form>
      )}

      <div className="tabla-categorias">{renderTabla()}</div>

      {/* Modal de consulta */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Consulta</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderConsulta()}</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Categorias;
