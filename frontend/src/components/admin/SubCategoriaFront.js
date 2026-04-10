import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const SubCategoriaFront = () => {

  const [subcategorias, setSubcategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // 🔹 OBTENER SUBCATEGORIAS
  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const response = await authFetch(
          "http://localhost:3001/api/subcategorias/subCAll"
        );

        const data = await response.json();
        console.log("SUBCATEGORIAS:", data);

        if (response.ok) {
          setSubcategorias(data.data || []);
        } else {
          alert(data.message || "Error al obtener subcategorías");
        }

      } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor");
      }
    };

    fetchSubcategorias();
  }, []);

  // 🔹 ELIMINAR
  const eliminarSubcategoria = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta subcategoría?")) return;

    try {
      const response = await authFetch(
        `http://localhost:3001/api/subcategorias/deleteSubC/${id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Subcategoría eliminada correctamente");
        setSubcategorias(subcategorias.filter(s => s.subcategoria_id !== id));
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Error al eliminar subcategoría");
    }
  };

  // 🔹 FILTRO
  const subcategoriasFiltradas = subcategorias.filter(s =>
    s.subcategoria_nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2 className="mt-5 mx-5">Lista de Subcategorías</h2>
        </Col>
        <Col className="text-end">
          <Button
            as={Link}
            to="/subcategorias/agregar"
            className="mt-5 mx-5"
            style={{ background: "#7856AE", border: "#7856AE" }}
          >
            Agregar Subcategoría
          </Button>
        </Col>
      </Row>

      {/* 🔍 BUSQUEDA */}
      <Form className="mb-3">
        <Row>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Button variant="outline-dark" onClick={() => setBusqueda("")}>
              Mostrar todos
            </Button>
          </Col>
        </Row>
      </Form>

      {/* 📋 TABLA */}
      <Table striped bordered hover>
        <thead className="table-secondary">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {subcategoriasFiltradas.map(sub => (
            <tr key={sub.subcategoria_id}>
              <td>{sub.subcategoria_id}</td>
              <td>{sub.subcategoria_nombre}</td>

              {/* 🔥 SI HICISTE JOIN → muestra nombre, si no → ID */}
              <td>{sub.categoria_nombre || sub.categoria_id}</td>

              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-dark">
                    Acciones
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to={`/subcategorias/editar/${sub.subcategoria_id}`}
                    >
                      Editar
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => eliminarSubcategoria(sub.subcategoria_id)}
                    >
                      Eliminar
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default SubCategoriaFront;