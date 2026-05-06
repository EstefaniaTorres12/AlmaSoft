import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";

const ProductosFront = () => {

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // OBTENER PRODUCTOS
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await authFetch("http://localhost:3001/api/productos/productosAll");
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

  //  FILTRO
  const productosFiltrados = productos.filter(p =>
    p.producto_nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Container className="my-0">

      <Row className="mb-4">
        <Col>
          <h2 className="mt-5 mx-5">Lista de Productos</h2>
        </Col>

        <Col className="text-end">
          <Button
            className="mt-5 mx-5"
            as={Link}
            to="/asesor/agregar-producto"
            style={{ background: "#7856AE", border: "#7856AE" }}
          >
            Agregar Producto
          </Button>
        </Col>
      </Row>

      {/*  BUSQUEDA */}
      <Form className="mb-3">
        <Row>
          <Col md={8}>
            <Form.Control
              placeholder="Buscar producto"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Col>

          <Col md={4}>
            <Button variant="outline-dark" onClick={() => setBusqueda("")}>
              Limpiar
            </Button>
          </Col>
        </Row>
      </Form>

      {/*  TABLA */}
      <Table striped bordered hover>
        <thead className="table-secondary">
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Categoría</th>
            <th>Subcategoría</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productosFiltrados.map(p => (
            <tr key={p.producto_id}>

              {/* IMAGEN */}
              <td>
                <img
                  src={`/${p.producto_imagen}`}
                  alt="producto"
                  width="150"
                />
              </td>

              <td>{p.producto_nombre}</td>
              <td>${p.producto_precio}</td>
              <td>{p.producto_stock}</td>

              <td>
                {p.producto_estado === 1 ? "Activo" : "Inactivo"}
              </td>

              <td>{p.categoria_nombre}</td>
              <td>{p.subcategoria_nombre}</td>

              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-dark">
                    Acciones
                  </Dropdown.Toggle>

                  <Dropdown.Menu>

                    <Dropdown.Item
                      as={Link}
                      to={`/asesor/editar-producto/${p.producto_id}`}
                    >
                      Editar
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

export default ProductosFront;