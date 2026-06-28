import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Row,
  Col,
  Form,
  Button,
  Dropdown,
  Card
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";
import "./Categorias.css";


const CategoriaFront = () => {

  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await authFetch(
          `${API_URL}/api/categorias`
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
        `${API_URL}/api/categorias/delete/${id}`,
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

    <Container fluid className="categoria-page">

      {/* HEADER */}

      <Card className="categoria-header mb-4">

        <div className="pattern"></div>

        <Card.Body>

          <Row className="align-items-center">

            <Col>

              <h2 className="categoria-title">

                Gestión de Categorías

              </h2>

              <p className="categoria-subtitle">

                Administre las categorías registradas en el sistema.

              </p>

            </Col>

            <Col xs="auto">

              <Button

                as={Link}

                to="/categorias/agregar"

                className="categoria-btn-principal"

              >

                Agregar Categoría

              </Button>

            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* BUSCADOR */}

      <Card className="categoria-search-card mb-4">

        <Card.Body>

          <Form>

            <Row className="align-items-center g-3">

              <Col lg={8}>

                <Form.Control

                  type="text"

                  placeholder="Buscar categoría..."

                  value={busqueda}

                  onChange={(e) =>
                    setBusqueda(e.target.value)
                  }

                  className="categoria-input-search"

                />

              </Col>

              <Col lg={4} className="text-lg-end">

                <Button

                  className="categoria-btn-secundario"

                  onClick={() => setBusqueda("")}

                >

                  Mostrar Todos

                </Button>

              </Col>

            </Row>

          </Form>

        </Card.Body>

      </Card>

      {/* CONTADOR */}

      <div className="categoria-contador">

        <span className="categoria-pill">

          {categoriasFiltradas.length} Categorías registradas

        </span>

      </div>

      {/* TABLA */}

      <Card className="categoria-table-card">

        <Card.Body>

          <div className="table-responsive">

            <Table

              hover

              className="categoria-table align-middle mb-0"

            >

              <thead>

                <tr>

                  <th style={{ width: "120px" }}>

                    ID

                  </th>

                  <th>

                    Nombre

                  </th>

                  <th
                    className="text-center"
                    style={{ width: "180px" }}
                  >

                    Acciones

                  </th>

                </tr>

              </thead>

              <tbody>

                {

                  categoriasFiltradas.length === 0 ?

                    (

                      <tr>

                        <td
                          colSpan={3}
                          className="text-center py-5"
                        >

                          No hay categorías registradas.

                        </td>

                      </tr>

                    )

                    :

                    categoriasFiltradas.map(categoria => (

                      <tr
                        key={categoria.categoria_id}
                      >

                        <td>

                          {categoria.categoria_id}

                        </td>

                        <td>

                          {categoria.categoria_nombre}

                        </td>

                        <td className="text-center">

                          <Dropdown align="end">

                            <Dropdown.Toggle
                              variant="light"
                              className="categoria-acciones-btn"
                            >
                              Acciones
                            </Dropdown.Toggle>

                            <Dropdown.Menu>

                              <Dropdown.Item
                                as={Link}
                                to={`/categorias/editar/${categoria.categoria_id}`}
                              >
                                Editar
                              </Dropdown.Item>

                              <Dropdown.Divider />

                              <Dropdown.Item
                                className="text-danger"
                                onClick={() =>
                                  eliminarCategoria(categoria.categoria_id)
                                }
                              >
                                Eliminar
                              </Dropdown.Item>

                            </Dropdown.Menu>

                          </Dropdown>

                        </td>
                      </tr>
                    ))

                }

              </tbody>

            </Table>

          </div>

        </Card.Body>

      </Card>

    </Container>

  );

};

export default CategoriaFront;