import React, { useEffect, useState } from "react";
import { Container, Table, Row, Col, Card, Button, Form, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api";
import "./Cliente.css";

const Cliente = () => {

    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch(`${API_URL}/api/clientes/clientesAll`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setClientes(data?.data || []);
                } else {
                    alert(data.message || "Error al obtener los clientes");
                }
            } catch (err) {
                console.log(err);
                alert("Error al conectar con el backend");
            }
        };

        fetchClientes();
    }, []);


    const clientesFiltrados = clientes.filter(c =>
        String(c.documento || "").includes(busqueda) ||
        (c.primer_nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.primer_apellido || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <Container fluid className="cliente-page">
            <Card className="cliente-header mb-4">
                <div className="pattern"></div>
                <Card.Body>
                    <Row className="align-items-center">
                        <Col>
                            <h2 className="cliente-title">
                                Gestión de Clientes
                            </h2>
                            <p className="cliente-subtitle">
                                Administre los clientes registrados en el sistema.
                            </p>
                        </Col>
                        <Col xs="auto">
                            <Button
                                as={Link}
                                to="/clientes/AgregarCliente"
                                className="cliente-btn-principal"
                            >
                                Agregar Cliente
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="cliente-search-card mb-4">
                <Card.Body>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Row className="align-items-center g-3">
                            <Col lg={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por documento..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                    className="cliente-input-search"
                                />
                            </Col>
                            <Col lg={4} className="text-lg-end">

                                <Button
                                    className="cliente-btn-secundario me-2"
                                    type="submit"
                                >
                                    Buscar
                                </Button>

                                <Button
                                    className="cliente-btn-secundario"
                                    type="button"
                                    onClick={() => setBusqueda("")}
                                >
                                    Mostrar Todos
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <div className="cliente-contador">
                <span className="cliente-pill">
                    {clientesFiltrados.length} Clientes registrados
                </span>
            </div>
            <Card className="cliente-table-card">
                <Card.Body>
                    <div className="table-responsive">
                        <Table
                            hover
                            className="cliente-table align-middle mb-0"
                        >
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Nombre Completo</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Edad</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesFiltrados.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="text-center py-5"
                                        >
                                            No hay clientes registrados.
                                        </td>
                                    </tr>

                                ) : (clientesFiltrados.map((cliente) => (

                                    <tr key={cliente.id}>
                                        <td>
                                            {cliente.documento}
                                        </td>
                                        <td>
                                            {cliente.primer_nombre}{" "}
                                            {cliente.segundo_nombre || ""}{" "}
                                            {cliente.primer_apellido}{" "}
                                            {cliente.segundo_apellido || ""}
                                        </td>
                                        <td>
                                            {cliente.correo}
                                        </td>
                                        <td>
                                            {cliente.telefono}
                                        </td>
                                        <td>
                                            <span className="cliente-badge-edad">
                                                {cliente.edad || "-"} años
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <Dropdown align="end">
                                                <Dropdown.Toggle
                                                    variant="light"
                                                    className="cliente-acciones-btn"
                                                >
                                                    Acciones
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        as={Link}
                                                        to={`/clientes/EditarCliente/${cliente.id}`}
                                                    >
                                                        Editar
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        as={Link}
                                                        to={`/clientes/DetallesCliente/${cliente.id}`}
                                                    >
                                                        Detalles
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        Habilitar
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
            <nav className="mt-4">
                <ul className="pagination justify-content-center cliente-pagination">
                    <li className="page-item disabled">
                        <span className="page-link">
                            Atrás
                        </span>
                    </li>
                    <li className="page-item active">
                        <span className="page-link">
                            1
                        </span>
                    </li>
                    <li className="page-item">
                        <span className="page-link">
                            2
                        </span>
                    </li>
                    <li className="page-item">
                        <span className="page-link">
                            3
                        </span>
                    </li>
                    <li className="page-item">
                        <span className="page-link">
                            Siguiente
                        </span>
                    </li>
                </ul>
            </nav>
        </Container>

    );
};
export default Cliente;
