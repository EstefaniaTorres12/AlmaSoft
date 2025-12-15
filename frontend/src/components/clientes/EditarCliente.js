import React from "react";
import { useState, useEffect } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

const clientes = [
    {
        id: "1",
        documento: "1025887459",
        primerNombre: "Anderson",
        segundoNombre: "Giovanny",
        primerApellido: "Montoya",
        segundoApellido: "Rojas",
        correo: "anderson@gmail.com",
        direccion: "Calle 133",
        telefono: "3115644111",
        fechaNacimiento: "12-05-2005",
        edad: 20
    },
    {
        id: "2",
        documento: "1025887458",
        primerNombre: "Gisel",
        segundoNombre: "Estefania",
        primerApellido: "Torres",
        segundoApellido: "Corredor",
        correo: "estefaniatorres1216@gmail.com",
        direccion: "Tv 70 # 67b sur 80",
        telefono: "3115644133",
        fechaNacimiento: "12-05-2005",
        edad: 20
    }
];

const EditarCliente = () => {

    const { id } = useParams();
    const [cliente, setCliente] = useState({
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        email: "",
        direccion: "",
        telefono: ""
    });

    useEffect(() => {
        const clienteEncontrado = clientes.find(c => c.id === id);
        if (clienteEncontrado) {
            setCliente(clienteEncontrado);
        }
    }, [id]);

    const handleChange = (e) => {
        setCliente({
            ...cliente,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Cliente actualizado:", cliente);
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "600px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Editar Cliente</h3>
                    
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Primer Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="primerNombre"
                                value={cliente.primerNombre}
                                onChange={handleChange}
                                placeholder="Digite el primer nombre"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Segundo Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="segundoNombre"
                                value={cliente.segundoNombre}
                                onChange={handleChange}
                                placeholder="Digite el segundo nombre"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Primer Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="primerApellido"
                                value={cliente.primerApellido}
                                onChange={handleChange}
                                placeholder="Digite el primer apellido"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Segundo Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="segundoApellido"
                                value={cliente.segundoApellido}
                                onChange={handleChange}
                                placeholder="Digite el segundo apellido"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                value={cliente.telefono}
                                onChange={handleChange}
                                placeholder="Digite el teléfono"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="direccion"
                                value={cliente.direccion}
                                onChange={handleChange}
                                placeholder="Digite la dirección"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="correo"
                                value={cliente.correo}
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

export default EditarCliente;