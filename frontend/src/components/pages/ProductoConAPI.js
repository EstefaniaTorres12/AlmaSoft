import React, { useState, useEffect } from "react";
import { Container, Table, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { productoAPI } from "../../services/api";

const ProductoConAPI = () => {
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar productos al montar el componente
    useEffect(() => {
        cargarProductos();
    }, []);

    // Cargar productos desde la API
    const cargarProductos = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await productoAPI.obtenerTodos();
            
            if (response.success) {
                setProductos(response.data);
                setProductosFiltrados(response.data);
            } else {
                setError(response.message || "Error al cargar productos");
            }
        } catch (err) {
            setError("Error al cargar los productos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar productos por búsqueda
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = productos.filter((producto) =>
            producto.producto_nombre.toLowerCase().includes(value) ||
            (producto.producto_descripcion && producto.producto_descripcion.toLowerCase().includes(value))
        );

        setProductosFiltrados(filtered);
    };

    // Eliminar producto
    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
            try {
                const response = await productoAPI.eliminar(id);
                if (response.success) {
                    setProductos(productos.filter((p) => p.producto_id !== id));
                    setProductosFiltrados(productosFiltrados.filter((p) => p.producto_id !== id));
                    alert("Producto eliminado exitosamente");
                } else {
                    alert("Error al eliminar: " + response.message);
                }
            } catch (err) {
                alert("Error al eliminar el producto");
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" />
                <p>Cargando productos...</p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-4">
                <Col>
                    <h2>Catálogo de Productos</h2>
                </Col>
                <Col className="text-end">
                    <Link to="/productos/AgregarProducto" className="btn btn-primary" style={{ background: "#7856AE", border: "#7856AE" }}>
                        Agregar Producto
                    </Link>
                </Col>
            </Row>

            <Form className="mb-3">
                <Form.Group>
                    <Form.Label>Buscar por nombre o descripción</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa el producto a buscar..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Form.Group>
            </Form>

            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead style={{ background: "#7856AE", color: "white" }}>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.length > 0 ? (
                            productosFiltrados.map((producto) => (
                                <tr key={producto.producto_id}>
                                    <td>{producto.producto_id}</td>
                                    <td>{producto.producto_nombre}</td>
                                    <td>{producto.producto_descripcion || "-"}</td>
                                    <td>${producto.producto_precio}</td>
                                    <td>{producto.producto_stock || 0}</td>
                                    <td>
                                        <Link
                                            to={`/productos/detalles/${producto.producto_id}`}
                                            className="btn btn-sm btn-info me-2"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            to={`/productos/editar/${producto.producto_id}`}
                                            className="btn btn-sm btn-warning me-2"
                                        >
                                            Editar
                                        </Link>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleEliminar(producto.producto_id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No se encontraron productos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default ProductoConAPI;
