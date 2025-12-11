import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container, Table, Row, Col, Button, Form, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const Cliente = () => {

    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await fetch(("http://localhost:3001/api/clientes/clientesAll"));
                const data = await response.json();

                if (response.ok){
                    setClientes(data.data);
                } else {
                    alert ( data.message || "Error al obtener los Clientes");
                }
            } catch (err) {
                console.log(err);
                alert("Error al conectar con el backend");                
            }
        };

        fetchClientes();
    }, []);



    return (
        <Container className="my-5">
            <Row className="mb-4">
                <Col>
                    <h2>Lista de clientes</h2>
                </Col>
                <Col className="text-end" >
                    <Button as={Link} to="/clientes/AgregarCliente" style={{ background: "#7856AE", border: "#7856AE" }}>
                        Agregar Cliente
                    </Button>
                </Col>
            </Row>
            <Form className="mb-3">
                <Row>
                    <Col md={8}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por documento de indentidad......"
                        />
                    </Col>
                    <Col md={4} >
                        <Button type="submit" className="me-4" variant="outline-dark" >Buscar</Button>
                        <Button type="button" variant="outline-dark" onClick={() => setBusqueda("")}>Mostrar Todos</Button>
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover >
                <thead className="table-secondary">
                    <tr >
                        <td scope="col">Documento</td>
                        <td scope="col">Primer Nombre</td>
                        <td scope="col">Segundo Nombre</td>
                        <td scope="col">Primer Apellido</td>
                        <td scope="col">Segundo Apellido</td>
                        <td scope="col">Email</td>
                        <td scope="col">Direccion</td>
                        <td scope="col">Telefono</td>
                        <td scope="col">Fecha de Nacimiento</td>
                        <td scope="col">Edad</td>
                        <td scope="col">Acciones</td>
                    </tr>
                </thead>

                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.documento}</td>
                            <td>{cliente.primer_nombre}</td>
                            <td>{cliente.segundo_nombre}</td>
                            <td>{cliente.primer_apellido}</td>
                            <td>{cliente.segundo_apellido}</td>
                            <td>{cliente.correo}</td>
                            <td>{cliente.direccion}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.fecha_nacimiento}</td>
                            <td>{cliente.edad}</td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                                        Acciones
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to={`/clientes/editar/${cliente.id}`}>
                                            Editar
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to={`/clientes/detalles/${cliente.id}`}>
                                            Detalles
                                        </Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Habilitar</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>


            </Table>

            <nav aria-label="page navigation">
                <ul class=" pagination justify-content-center">
                    <li class="page-item disabled">
                        <a class="page-link">ATRAS</a>
                    </li>
                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item">
                        <a class="page-link" href="#">SIGUIENTE</a>
                    </li>
                </ul>
            </nav>



        </Container>
    );

}

export default Cliente;