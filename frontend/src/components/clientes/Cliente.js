import React, { useEffect, useState } from "react";
import { Container, Table, Row, Col, Button, Form, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API_URL } from "../../config/api";

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
        <Container className="my-5">

            {/* HEADER */}
            <Row className="mb-4">
                <Col>
                    <h2>Lista de clientes</h2>
                </Col>
                <Col className="text-end">
                    <Button
                        as={Link}
                        to="/clientes/AgregarCliente"
                        style={{ background: "#7856AE", border: "#7856AE" }}
                    >
                        Agregar Cliente
                    </Button>
                </Col>
            </Row>

            {/* BUSCADOR */}
            <Form className="mb-3" onSubmit={(e) => e.preventDefault()}>
                <Row>
                    <Col md={8}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por documento..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </Col>
                    <Col md={4}>
                        <Button className="me-2" variant="outline-dark">
                            Buscar
                        </Button>
                        <Button
                            type="button"
                            variant="outline-dark"
                            onClick={() => setBusqueda("")}
                        >
                            Mostrar Todos
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* TABLA */}
            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead className="table-secondary text-center">
                        <tr>
                            <th>Documento</th>
                            <th>Primer Nombre</th>
                            <th>Segundo Nombre</th>
                            <th>Primer Apellido</th>
                            <th>Segundo Apellido</th>
                            <th>Email</th>
                            <th>Dirección</th>
                            <th>Teléfono</th>
                            <th>Fecha Nacimiento</th>
                            <th>Edad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clientesFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="11" className="text-center">
                                    No hay clientes
                                </td>
                            </tr>
                        ) : (
                            clientesFiltrados.map((cliente) => (
                                <tr key={cliente.id}>
                                    <td>{cliente.documento}</td>
                                    <td>{cliente.primer_nombre}</td>
                                    <td>{cliente.segundo_nombre || "-"}</td>
                                    <td>{cliente.primer_apellido}</td>
                                    <td>{cliente.segundo_apellido || "-"}</td>
                                    <td>{cliente.correo}</td>
                                    <td>{cliente.direccion}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>{cliente.fecha_nacimiento || "-"}</td>
                                    <td>{cliente.edad || "-"}</td>

                                    <td className="text-center">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-dark">
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
                                                    to={`/usuarios/DetallesCliente/${cliente.id}`}
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

            {/* PAGINACIÓN (corregido className) */}
            <nav>
                <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                        <span className="page-link">ATRÁS</span>
                    </li>
                    <li className="page-item"><span className="page-link">1</span></li>
                    <li className="page-item"><span className="page-link">2</span></li>
                    <li className="page-item"><span className="page-link">3</span></li>
                    <li className="page-item">
                        <span className="page-link">SIGUIENTE</span>
                    </li>
                </ul>
            </nav>

        </Container>
    );
};

export default Cliente;