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

import "./SubcategoriaFront.css";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";

const SubCategoriaFront = () => {

  const [subcategorias, setSubcategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // 🔹 OBTENER SUBCATEGORIAS
  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const response = await authFetch(
          `${API_URL}/api/subcategorias/subCAll`
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
        `${API_URL}/api/subcategorias/deleteSubC/${id}`,
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

    <Container fluid className="subcategoria-page">

      {/* HEADER */}

      <Card className="subcategoria-header mb-4">

        <div className="pattern"></div>

        <Card.Body>

          <Row className="align-items-center">

            <Col>

              <h2 className="subcategoria-title">

                🗂 Gestión de Subcategorías

              </h2>

              <p className="subcategoria-subtitle">

                Administre las subcategorías asociadas a cada categoría.

              </p>

            </Col>

            <Col xs="auto">

              <Button

                as={Link}

                to="/subcategorias/agregar"

                className="subcategoria-btn-principal"

              >

                Agregar Subcategoría

              </Button>

            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* BUSCADOR */}

      <Card className="subcategoria-search-card mb-4">

        <Card.Body>

          <Form>

            <Row className="align-items-center g-3">

              <Col lg={8}>

                <Form.Control

                  className="subcategoria-input-search"

                  type="text"

                  placeholder="Buscar subcategoría..."

                  value={busqueda}

                  onChange={(e) => setBusqueda(e.target.value)}

                />

              </Col>

              <Col lg={4} className="text-lg-end">

                <Button

                  className="subcategoria-btn-secundario"

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

      <div className="subcategoria-contador">

        <span className="subcategoria-pill">

          {subcategoriasFiltradas.length} Subcategorías registradas

        </span>

      </div>

      {/* TABLA */}

      <Card className="subcategoria-table-card">

        <Card.Body>

          <div className="table-responsive">

            <Table

              hover

              className="subcategoria-table align-middle mb-0"

            >

              <thead>

                <tr>

                  <th style={{ width: "90px" }}>

                    ID

                  </th>

                  <th>

                    Subcategoría

                  </th>

                  <th>

                    Categoría

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

                  subcategoriasFiltradas.length === 0 ?

                    (

                      <tr>

                        <td
                          colSpan={4}
                          className="text-center py-5"
                        >

                          No hay subcategorías registradas.

                        </td>

                      </tr>

                    )

                    :

                    subcategoriasFiltradas.map(sub => (

                      <tr
                        key={sub.subcategoria_id}
                      >

                        <td>

                          {sub.subcategoria_id}

                        </td>

                        <td>

                          {sub.subcategoria_nombre}

                        </td>

                        <td>

                          <span className="categoria-badge">

                            {sub.categoria_nombre || sub.categoria_id}

                          </span>

                        </td>

                        <td className="text-center"><Dropdown align="end">

                          <Dropdown.Toggle

                            variant="light"

                            className="subcategoria-acciones-btn"

                          >

                            Acciones

                          </Dropdown.Toggle>

                          <Dropdown.Menu>

                            <Dropdown.Item

                              as={Link}

                              to={`/subcategorias/editar/${sub.subcategoria_id}`}

                            >

                              Editar

                            </Dropdown.Item>

                            <Dropdown.Divider />

                            <Dropdown.Item

                              className="text-danger"

                              onClick={() =>
                                eliminarSubcategoria(sub.subcategoria_id)
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
export default SubCategoriaFront;
