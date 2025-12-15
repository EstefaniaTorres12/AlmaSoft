import React from "react";
import { Container, Table, Row, Col, Button, Form, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

const clientes = [
    {
        id: 1,
        documento: "1025887459",
        primerNombre: "Anderson",
        segundoNombre: "Giovanny",
        primerApellido: "Montoya",
        segundoApellido: "Rojas",
        email: "anderson@gmail.com",
        direccion: "Calle 133",
        telefono: "3115644111",
        fechaNacimiento: "12-05-2005",
        edad: 20
    },
    {
        id: 2,
        documento: "1025887458",
        primerNombre: "Gisel",
        segundoNombre: "Estefania",
        primerApellido: "Torres",
        segundoApellido: "Corredor",
        email: "estefaniatorres1216@gmail.com",
        direccion: "Tv 70 # 67b sur 80",
        telefono: "3115644133",
        fechaNacimiento: "12-05-2005",
        edad: 20
    }
];



const Cliente = () => {
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
                        <Button type="button" variant="outline-dark">Mostrar Todos</Button>
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover >
                <thead className="table-secondary">
                    <tr >
                        <th scope="col">Documento</th>
                        <th scope="col">Primer Nombre</th>
                        <th scope="col">Segundo Nombre</th>
                        <th scope="col">Primer Apellido</th>
                        <th scope="col">Segundo Apellido</th>
                        <th scope="col">Email</th>
                        <th scope="col">Direccion</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Fecha de Nacimiento</th>
                        <th scope="col">Edad</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {clientes.map((cliente) => (
                        <tr key={cliente.id}>
                            <td>{cliente.documento}</td>
                            <td>{cliente.primerNombre}</td>
                            <td>{cliente.segundoNombre}</td>
                            <td>{cliente.primerApellido}</td>
                            <td>{cliente.segundoApellido}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.direccion}</td>
                            <td>{cliente.telefono}</td>
                            <td>{cliente.fechaNacimiento}</td>
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
                                        <Dropdown.Item>Habilitar</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>


            </Table>

            <nav aria-label="page navigation">
                <ul className="pagination justify-content-center">
                    <li className="page-item disabled">
                        <a href="#/" className="page-link">ATRAS</a>
                    </li>
                    <li className="page-item"><a href="#/" className="page-link">1</a></li>
                    <li className="page-item"><a href="#/" className="page-link">2</a></li>
                    <li className="page-item"><a href="#/" className="page-link">3</a></li>
                    <li className="page-item">
                        <a href="#/" className="page-link">SIGUIENTE</a>
                    </li>
                </ul>
            </nav>



        </Container>
    );

}

export default Cliente;