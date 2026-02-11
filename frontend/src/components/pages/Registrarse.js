import React from "react";
import { Container, Form, Card, Button, Alert, } from "react-bootstrap";
import { useState } from "react";

const Registrarse = () => {

    const [formData, setData] = useState({
        DocumentoCliente: '',
        PrimerNombreCliente: '',
        SegundoNombreCliente: '',
        PrimerApellidoCliente: '',
        SegundoApellidoCliente: '',
        DireccionCliente: '',
        TelefonoCliente: '',
        CorreoCliente: '',
        Credencial: '',
        FechaNacimiento: '',
        EdadCliente: ''
    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const enviarDatos = async (e) => {
        e.preventDefault();

        const usuario = {
            rol_id: 3, // cliente
            usuario_documento: formData.DocumentoCliente,
            usuario_primer_nombre: formData.PrimerNombreCliente,
            usuario_segundo_nombre: formData.SegundoNombreCliente,
            usuario_primer_apellido: formData.PrimerApellidoCliente,
            usuario_segundo_apellido: formData.SegundoApellidoCliente,
            usuario_direccion: formData.DireccionCliente,
            usuario_telefono: formData.TelefonoCliente,
            usuario_correo: formData.CorreoCliente.toLowerCase(),
            usuario_credencial: formData.Credencial,
            cliente_fecha_nacimiento: formData.FechaNacimiento || null,
            cliente_edad: formData.EdadCliente
        };

        try {
            const response = await fetch(
                "http://localhost:3001/api/usuarios/usuarioCreate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(usuario)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMostrarAlerta(true);
                console.log("Usuario creado:", data);

                setData({
                    DocumentoCliente: '',
                    PrimerNombreCliente: '',
                    SegundoNombreCliente: '',
                    PrimerApellidoCliente: '',
                    SegundoApellidoCliente: '',
                    DireccionCliente: '',
                    TelefonoCliente: '',
                    CorreoCliente: '',
                    Credencial: '',
                    FechaNacimiento: '',
                    EdadCliente: ''
                });
            } else {
                alert("Error: " + data.message);
            }

        } catch (error) {
            console.error(" Error de conexión:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundImage: `url(/img/3302177.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Container className=" align-items-center" style={{ maxWidth: "600px" }}>
                <Card>
                    <Card.Header>
                        <h3 className="text-center">Registrarse</h3>
                        {mostrarAlerta && (
                            <Alert variant="success" onClose={() => setMostrarAlerta(false)} dismissible>
                                Datos enviados  correctamente!!!!......
                            </Alert>
                        )}
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={enviarDatos}>
                            <Form.Group className="mb-3" controlId="DocumentoCliente">
                                <Form.Label>DOCUMENTO</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="DocumentoCliente"
                                    value={formData.DocumentoCliente}
                                    onChange={handleChange}
                                    placeholder="digite el documento del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="PrimerNombreCliente">
                                <Form.Label>PRIMER NOMBRE</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="PrimerNombreCliente"
                                    value={formData.PrimerNombreCliente}
                                    onChange={handleChange}
                                    placeholder="digite el nombre del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="SegundoNombreCliente">
                                <Form.Label>SEGUNDO NOMBRE</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="SegundoNombreCliente"
                                    value={formData.SegundoNombreCliente}
                                    onChange={handleChange}
                                    placeholder="digite el nombre del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="PrimerApellidoCliente">
                                <Form.Label>PRIMER APELLIDO</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="PrimerApellidoCliente"
                                    value={formData.PrimerApellidoCliente}
                                    onChange={handleChange}
                                    placeholder="digite el apellido del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="SegundoApellidoCliente">
                                <Form.Label>SEGUNDO APELLIDO</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="SegundoApellidoCliente"
                                    value={formData.SegundoApellidoCliente}
                                    onChange={handleChange}
                                    placeholder="digite el apellido del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="DireccionCliente">
                                <Form.Label>DIRECCION</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="DireccionCliente"
                                    value={formData.DireccionCliente}
                                    onChange={handleChange}
                                    placeholder="digite la direccion del cliente del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="TelefonoCliente">
                                <Form.Label>TELEFONO</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="TelefonoCliente"
                                    value={formData.TelefonoCliente}
                                    onChange={handleChange}
                                    placeholder="digite el telefono del cliente del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="CorreoCliente">
                                <Form.Label>CORREO</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="CorreoCliente"
                                    value={formData.CorreoCliente}
                                    onChange={handleChange}
                                    placeholder="digite el Correo del cliente del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="Credencial">
                                <Form.Label>CONTRASEÑA</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Credencial"
                                    value={formData.Credencial}
                                    onChange={handleChange}
                                    placeholder="digite el Correo del cliente del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="FechaNacimiento">
                                <Form.Label>FECHA DE NACIMIENTO</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="FechaNacimiento"
                                    value={formData.FechaNacimiento}
                                    onChange={handleChange}
                                    placeholder="Digite la fecha de nacimiento del cliente del cliente"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="EdadCliente">
                                <Form.Label>EDAD</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="EdadCliente"
                                    value={formData.EdadCliente}
                                    onChange={handleChange}
                                    placeholder="Digite la edad del cliente del cliente"
                                />
                            </Form.Group>

                            <Button style={{ background: "#7856AE", border: "#7856AE" }} type="submit">Guardar</Button>
                            <Button style={{ background: "#7856AE", border: "#7856AE" }} className="mx-5" type="button">Cancelar</Button>

                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Registrarse;