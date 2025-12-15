import React from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import usuario1 from '../../img/usuario.png'


const usuarios = [
    {
        idUsuario: "1",
        rolUsuario: "Cliente",
        documento: "1025887459",
        primerNombre: "Anderson",
        segundoNombre: "Giovanny",
        primerApellido: "Montoya",
        segundoApellido: "Rojas",
        email: "anderson@gmail.com",
        direccion: "Calle 133",
        telefono: "3115644111",
        credencial: "anderson123"
    },
    {
        idUsuario: "2",
        rolUsuario: "Administrador",
        documento: "1025887459",
        primerNombre: "Esteban",
        segundoNombre: "",
        primerApellido: "Martinez",
        segundoApellido: "Martinez",
        email: "esteban@gmail.com",
        direccion: "Calle 55",
        telefono: "3115644111",
        credencial: "esteban123"
    },
    {
        idUsuario: "3",
        rolUsuario: "Asesor",
        documento: "1025887459",
        primerNombre: "Sara",
        segundoNombre: "Daniela",
        primerApellido: "Mendoza",
        segundoApellido: "Martinez",
        email: "sara@gmail.com",
        direccion: "carrera 55",
        telefono: "3115644111",
        credencial: "Sdaniela123"
    },
    {
        idUsuario: "4",
        rolUsuario: "Asesor",
        documento: "1025887459",
        primerNombre: "Katherine",
        segundoNombre: "",
        primerApellido: "Gonzales",
        segundoApellido: "Lopez",
        email: "K@gmail.com",
        direccion: "Calle 89",
        telefono: "3115644111",
        credencial: "Katherine123"
    },
    {
        idUsuario: "5",
        rolUsuario: "Cliente",
        documento: "1025887459",
        primerNombre: "Liliana",
        segundoNombre: "",
        primerApellido: "Martinez",
        segundoApellido: "",
        email: "lili@gmail.com",
        direccion: "Calle 74",
        telefono: "3115644111",
        credencial: "liliM123"
    }
];


const DetallesUsuario = () => {

    const { id } = useParams();

    const usuario = usuarios.find(u => u.idUsuario === id);

    if (!usuario) {
        return <h2 className="text-center mt-5">Usuario no encontrado</h2>;
    }

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="text-center">Detalles del Usuario:</h3>
                        </Card.Header>
                        <Card.Body>
                            <h4>Id Usuario :{usuario.idUsuario}</h4>
                            <h4>Documento :{usuario.documento}</h4>
                            <h4>Nombres :{usuario.primerNombre} {usuario.segundoNombre}</h4>
                            <h4>Apellidos :{usuario.primerApellido}{usuario.segundoApellido}</h4>
                            <h4>Email :{usuario.email}</h4>
                            <h4>Direccion :{usuario.direccion}</h4>
                            <h4>Telefono :{usuario.telefono}</h4>
                            <h4>Credencial :{usuario.credencial}</h4>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card style={{ width: '30rem' }}>
                        <Card.Header>
                            <h3 className="text-center">{usuario.rolUsuario}</h3>
                        </Card.Header>
                        <Card.Img variant="top" src={usuario1} />
                        <Card.Body>
                            <Card.Text>
                                descripcion adicional del usuario
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


        </Container>
    );
}

export default DetallesUsuario;