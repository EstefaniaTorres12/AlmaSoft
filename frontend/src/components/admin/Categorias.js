import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const CategoriaFront = () => {

  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await authFetch(
          "http://localhost:3001/api/categorias"
        );

        const data = await response.json();
        console.log("DATA:", data); 

        if (response.ok) {
        
          setCategorias(data.data || data);
        } else {
          alert(data.message || "Error al obtener categorías");
        }

      } catch (err) {
        console.error(err);
        alert("Error conectando con el backend");
      }
    };

    fetchCategorias();
  }, []);


  const eliminarCategoria = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    try {
      const response = await authFetch(
        `http://localhost:3001/api/categorias/delete/${id}`, // 🔥 CORREGIDO
        { method: "DELETE" }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Categoría eliminada correctamente");
        setCategorias(categorias.filter(c => c.categoria_id !== id));
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Error al eliminar categoría");
    }
  };


  const categoriasFiltradas = Array.isArray(categorias)
    ? categorias.filter(c =>
        c.categoria_nombre?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : [];

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2 className="mt-5 mx-5">Lista de Categorías</h2>
        </Col>
        <Col className="text-end">
          <Button className="mt-5 mx-5"
            as={Link}
            to="/categorias/agregar"
            style={{ background: "#7856AE", border: "#7856AE" }}
          >
            Agregar Categoría
          </Button>
        </Col>
      </Row>

      
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

      {/* TABLA */}
      <Table striped bordered hover>
        <thead className="table-secondary">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {categoriasFiltradas.map(categoria => (
            <tr key={categoria.categoria_id}>
              <td>{categoria.categoria_id}</td>
              <td>{categoria.categoria_nombre}</td>

              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-dark">
                    Acciones
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to={`/categorias/editar/${categoria.categoria_id}`}
                    >
                      Editar
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => eliminarCategoria(categoria.categoria_id)}
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

export default CategoriaFront;