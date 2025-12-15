import React from "react";
import { Card, Col, Container, Row, Table, Dropdown } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";


const clientes = [
    {
        id: "1",
        documento: "1025887459",
        nombres: "Anderson Giovanny",
        apellidos: "Montoya Rojas",
        email: "anderson@gmail.com",
        direccion: "Calle 133",
        telefono: "3115644111",
        nacimiento: "12-05-2005",
        edad: 20,
        contrato: "C-002",
        plan: "Plan Clasic",
        tiempo: "3 años",
    },
    {
        id: "2",
        documento: "1025887458",
        nombres: "Gisel Estefania",
        apellidos: "Torres Corredor",
        email: "estefaniatorres1216@gamail.com",
        direccion: "Tv 70 # 67b sur 80",
        telefono: "3115644133",
        nacimiento: "12-05-2005",
        edad: 20,
        contrato: "C-001",
        plan: "Plan Premium",
        tiempo: "2 años",
    }
];


const afiliados = [
    {
        id: "3",
        documento:"1214558968",
        primerNombre: "Michael",
        segundoNombre: "Ferney",
        primerApellido: "Fonseca",
        segundoApellido: "Mendoza",
        email: "maicol@gmail.com",
        direccion: "Calle 44",
        telefono: "3115877499"
    },
    {
        id: "4",
        documento: "1214558968",
        primerNombre: "Daniel",
        segundoNombre: "",
        primerApellido: "Ramirez",
        segundoApellido: "",
        email: "Daniel12@gmail.com",
        direccion: "Calle 55",
        telefono: "3558896647"
    },
    {
        id: "5",
        documento: "1214558968",
        primerNombre: "Maria",
        segundoNombre: "Daniela",
        primerApellido: "Blanco",
        segundoApellido: "Lopez",
        email: "Maria55@gmail.com",
        direccion: "Calle 1 sur",
        telefono: "3333333333"
    }
];

const DetallesCliente = () => {

    const { id } = useParams();


    const cliente = clientes.find(c => c.id === id);

    if (!cliente) {
        return <h2 className="text-center mt-5">Cliente no encontrado</h2>;
    }


    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="text-center">Detalles del cliente:</h3>
                        </Card.Header>
                        <Card.Body>
                            <h6>Documento: {cliente.documento}</h6>
                            <h6>Nombres: {cliente.nombres}</h6>
                            <h6>Apellidos: {cliente.apellidos}</h6>
                            <h6>Teléfono: {cliente.telefono}</h6>
                            <h6>Dirección: {cliente.direccion}</h6>
                            <h6>Email: {cliente.email}</h6>
                            <h6>Fecha de Nacimiento: {cliente.nacimiento}</h6>
                            <h6>Edad: {cliente.edad}</h6>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="text-center">Contrato</h3>
                        </Card.Header>
                        <Card.Body>
                            <h6>Contrato: {cliente.contrato}</h6>
                            <h6>Tipo de Plan: {cliente.plan}</h6>
                            <h6>Tiempo de Afiliación: {cliente.tiempo}</h6>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Table className="my-5" striped bordered hover>
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
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {afiliados.map((afiliado) => (
                        <tr key={afiliado.id}>
                            <td>{afiliado.documento}</td>
                            <td>{afiliado.primerNombre}</td>
                            <td>{afiliado.segundoNombre}</td>
                            <td>{afiliado.primerApellido}</td>
                            <td>{afiliado.segundoApellido}</td>
                            <td>{afiliado.email}</td>
                            <td>{afiliado.direccion}</td>
                            <td>{afiliado.telefono}</td>
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
        </Container>
    );
}

export default DetallesCliente;