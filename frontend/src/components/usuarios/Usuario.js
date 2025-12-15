import React from "react";
import { Container, Table, Row, Col, Form, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";


const usuarios = [
    {
        idUsuario:"1",
        rolUsuario:"Cliente",
        documento: "1025887459",
        primerNombre: "Anderson",
        segundoNombre: "Giovanny",
        primerApellido: "Montoya",
        segundoApellido: "Rojas",
        email: "anderson@gmail.com",
        direccion: "Calle 133",
        telefono: "3115644111",
        credencial:"anderson123"
    },
    {
        idUsuario:"2",
        rolUsuario:"Administrador",
        documento: "1025887459",
        primerNombre: "Esteban",
        segundoNombre: "",
        primerApellido: "Martinez",
        segundoApellido: "Martinez",
        email: "esteban@gmail.com",
        direccion: "Calle 55",
        telefono: "3115644111",
        credencial:"esteban123"
    },
    {
        idUsuario:"3",
        rolUsuario:"Asesor",
        documento: "1025887459",
        primerNombre: "Sara",
        segundoNombre: "Daniela",
        primerApellido: "Mendoza",
        segundoApellido: "Martinez",
        email: "sara@gmail.com",
        direccion: "carrera 55",
        telefono: "3115644111",
        credencial:"Sdaniela123"
    },
    {
        idUsuario:"4",
        rolUsuario:"Asesor",
        documento: "1025887459",
        primerNombre: "Katherine",
        segundoNombre: "",
        primerApellido: "Gonzales",
        segundoApellido: "Lopez",
        email: "K@gmail.com",
        direccion: "Calle 89",
        telefono: "3115644111",
        credencial:"Katherine123"
    },
    {
        idUsuario:"5",
        rolUsuario:"Cliente",
        documento: "1025887459",
        primerNombre: "Liliana",
        segundoNombre: "",
        primerApellido: "Martinez",
        segundoApellido: "",
        email: "lili@gmail.com",
        direccion: "Calle 74",
        telefono: "3115644111",
        credencial:"liliM123"
    }
];


const Usuario = () => {

    return (
        <Container className="my-5">
            <Row className="mb-4">
                <Col>
                    <h2>Lista de Usuarios</h2>
                </Col>
                <Col className="text-end" >
                    <Button as={Link} to="/usuarios/AgregarUsuario" style={{ background: "#7856AE", border: "#7856AE" }}>
                        Agregar Usuario
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
                        <th scope="col">Rol</th>
                        <th scope="col">Documento</th>
                        <th scope="col">Primer Nombre</th>
                        <th scope="col">Segundo Nombre</th>
                        <th scope="col">Primer Apellido</th>
                        <th scope="col">Segundo Apellido</th>
                        <th scope="col">Email</th>
                        <th scope="col">Direccion</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Credencial</th>
                        <th scope="col">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.rolUsuario}</td>
                            <td>{usuario.documento}</td>
                            <td>{usuario.primerNombre}</td>
                            <td>{usuario.segundoNombre}</td>
                            <td>{usuario.primerApellido}</td>
                            <td>{usuario.segundoApellido}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.direccion}</td>
                            <td>{usuario.telefono}</td>
                            <td>{usuario.credencial}</td>

                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                                        Acciones
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to={`/usuarios/EditarUsuario/${usuario.idUsuario}`}>
                                            Editar
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to={`/usuarios/detalles/${usuario.idUsuario}`}>
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

export default Usuario;