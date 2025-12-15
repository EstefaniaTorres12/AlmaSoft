import React from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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


const EditarUsuario = () => {

    const { id } = useParams();

    const [usuario, setUsuario] = useState({
        rolUsuario: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        email: "",
        direccion: "",
        telefono: "",
        credencial: ""
    });

    useEffect(() => {
        const usuarioEncontrado = usuarios.find(u => u.idUsuario === id);
        if (usuarioEncontrado) {
            setUsuario(usuarioEncontrado);
        }
    }, [id]);

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Usuario actualizado:", usuario);
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "600px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Editar Usuario</h3>

                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Control
                                type="text"
                                name="rolUsuario"
                                value={usuario.rolUsuario}
                                onChange={handleChange}
                                placeholder="Digite el primer nombre"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Primer Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="primerNombre"
                                value={usuario.primerNombre}
                                onChange={handleChange}
                                placeholder="Digite el primer nombre"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Segundo Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="segundoNombre"
                                value={usuario.segundoNombre}
                                onChange={handleChange}
                                placeholder="Digite el segundo nombre"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Primer Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="primerApellido"
                                value={usuario.primerApellido}
                                onChange={handleChange}
                                placeholder="Digite el primer apellido"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Segundo Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="segundoApellido"
                                value={usuario.segundoApellido}
                                onChange={handleChange}
                                placeholder="Digite el segundo apellido"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                value={usuario.telefono}
                                onChange={handleChange}
                                placeholder="Digite el teléfono"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="direccion"
                                value={usuario.direccion}
                                onChange={handleChange}
                                placeholder="Digite la dirección"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={usuario.email}
                                onChange={handleChange}
                                placeholder="Digite el correo"
                            />
                        </Form.Group>

                        <Button style={{ background: "#7856AE", border: "#7856AE" }} type="submit">
                            Guardar
                        </Button>
                        <Button style={{ background: "#7856AE", border: "#7856AE" }} className="mx-5" type="button">
                            Cancelar
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default EditarUsuario;