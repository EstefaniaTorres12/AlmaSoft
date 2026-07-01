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

import "./Producto.css";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { API_URL } from "../../config/api";
import { getProductImageUrl, DEFAULT_IMAGE } from "../../utils/imageUrl";

const ProductoFront = () => {

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // OBTENER PRODUCTOS
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/productos/productosAll`);
        const data = await res.json();

        if (res.ok) {
          setProductos(data.data);
        } else {
          alert("Error al obtener productos");
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchProductos();
  }, []);

  //  ELIMINAR
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;

    try {
      const res = await authFetch(
        `${API_URL}/api/productos/deleteProducto/${id}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Producto eliminado");
        setProductos(productos.filter(p => p.producto_id !== id));
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
    }
  };

  //  FILTRO
  const productosFiltrados = productos.filter(p =>
    p.producto_nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (

    <Container fluid className="producto-page">

      {/* HEADER */}

      <Card className="producto-header mb-4">

        <div className="pattern"></div>

        <Card.Body>

          <Row className="align-items-center">

            <Col>

              <h2 className="producto-title">

                📦 Gestión de Productos

              </h2>

              <p className="producto-subtitle">

                Administre el catálogo de productos del sistema.

              </p>

            </Col>

            <Col xs="auto">

              <Button

                as={Link}

                to="/productos/agregar"

                className="producto-btn-principal"

              >

                Agregar Producto

              </Button>

            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* BUSCADOR */}

      <Card className="producto-search-card mb-4">

        <Card.Body>

          <Form>

            <Row className="align-items-center g-3">

              <Col lg={8}>

                <Form.Control

                  className="producto-input-search"

                  placeholder="Buscar producto..."

                  value={busqueda}

                  onChange={(e) => setBusqueda(e.target.value)}

                />

              </Col>

              <Col lg={4} className="text-lg-end">

                <Button

                  className="producto-btn-secundario"

                  onClick={() => setBusqueda("")}

                >

                  Limpiar

                </Button>

              </Col>

            </Row>

          </Form>

        </Card.Body>

      </Card>

      {/* CONTADOR */}

      <div className="producto-contador">

        <span className="producto-pill">

          {productosFiltrados.length} productos registrados

        </span>

      </div>

      {/* TABLA */}

      <Card className="producto-table-card">

        <Card.Body>

          <div className="table-responsive">

            <Table

              hover

              className="producto-table align-middle mb-0"

            >

              <thead>

                <tr>

                  <th style={{ width: "110px" }}>

                    Imagen

                  </th>

                  <th>

                    Producto

                  </th>

                  <th>

                    Precio

                  </th>

                  <th>

                    Stock

                  </th>

                  <th>

                    Estado

                  </th>

                  <th>

                    Categoría

                  </th>

                  <th>

                    Subcategoría

                  </th>

                  <th
                    className="text-center"
                    style={{ width: "170px" }}
                  >

                    Acciones

                  </th>

                </tr>

              </thead>

              <tbody>

                {

                  productosFiltrados.length === 0 ?

                    (

                      <tr>

                        <td
                          colSpan={8}
                          className="text-center py-5"
                        >

                          No hay productos registrados.

                        </td>

                      </tr>

                    )

                    :

                    productosFiltrados.map(p => (

                      <tr key={p.producto_id}>

                        {/* IMAGEN */}

                        <td>

                          <img

                            src={getProductImageUrl(p.producto_imagen)}

                            alt="producto"

                            className="producto-img"

                            onError={(e) => {

                              e.target.onerror = null;

                              e.target.src = DEFAULT_IMAGE;

                            }}

                          />

                        </td>

                        {/* NOMBRE */}

                        <td>

                          <strong>

                            {p.producto_nombre}

                          </strong>

                        </td>

                        {/* PRECIO */}

                        <td>

                          <span className="precio-producto">

                            $

                            {Number(

                              p.producto_precio

                            ).toLocaleString("es-CO")}

                          </span>

                        </td>

                        {/* STOCK */}

                        <td>

                          {

                            p.producto_stock > 10 ?

                              (

                                <span className="stock-badge stock-alto">

                                  🟢 {p.producto_stock}

                                </span>

                              )

                              :

                              p.producto_stock > 0 ?

                                (

                                  <span className="stock-badge stock-medio">

                                    🟡 {p.producto_stock}

                                  </span>

                                )

                                :

                                (

                                  <span className="stock-badge stock-bajo">

                                    🔴 0

                                  </span>

                                )

                          }

                        </td>

                        {/* ESTADO */}

                        <td>

                          {

                            Number(p.producto_estado) === 1 ?

                              (

                                <span className="estado-badge estado-activo">

                                  Activo

                                </span>

                              )

                              :

                              (

                                <span className="estado-badge estado-inactivo">

                                  Inactivo

                                </span>

                              )

                          }

                        </td>

                        {/* CATEGORIA */}

                        <td>

                          <span className="categoria-badge">

                            {p.categoria_nombre}

                          </span>

                        </td>

                        {/* SUBCATEGORIA */}

                        <td>

                          <span className="subcategoria-badge">

                            {p.subcategoria_nombre}

                          </span>

                        </td>

                        {/* ACCIONES */}

                        <td className="text-center">

                          <Dropdown align="end">

                            <Dropdown.Toggle

                              variant="light"

                              className="producto-acciones-btn"

                            >

                              Acciones

                            </Dropdown.Toggle>

                            <Dropdown.Menu>

                              <Dropdown.Item

                                as={Link}

                                to={`/productos/editar/${p.producto_id}`}

                              >

                                Editar

                              </Dropdown.Item>

                              <Dropdown.Divider />

                              <Dropdown.Item

                                className="text-danger"

                                onClick={() =>
                                  eliminarProducto(p.producto_id)
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

export default ProductoFront;