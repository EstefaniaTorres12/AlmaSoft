import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const AgregarUsuario = () => {
    const [formData, setData] = useState({
        Rol: '',
        Documento: '',
        PrimerNombre: '',
        SegundoNombre: '',
        PrimerApellido: '',
        SegundoApellido: '',
        Direccion: '',
        Telefono: '',
        Correo: '',
        Credencial: '',
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
            rol_id: parseInt(formData.Rol),
            usuario_documento: formData.Documento,
            usuario_primer_nombre: formData.PrimerNombre,
            usuario_segundo_nombre: formData.SegundoNombre,
            usuario_primer_apellido: formData.PrimerApellido,
            usuario_segundo_apellido: formData.SegundoApellido,
            usuario_direccion: formData.Direccion,
            usuario_correo: formData.Correo.toLowerCase(),
            usuario_credencial: formData.Credencial,
            cliente_fecha_nacimiento: formData.FechaNacimiento || null // solo si rol_id = 3
        };

        try {
            const response = await fetch("http://localhost:3001/api/usuarios/usuarioCreate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            const data = await response.json();

            if (response.ok) {
                setMostrarAlerta(true);
                console.log("Usuario creado:", data);
                // Limpiar formulario opcional
                setData({
                    Rol: '',
                    Documento: '',
                    PrimerNombre: '',
                    SegundoNombre: '',
                    PrimerApellido: '',
                    SegundoApellido: '',
                    Direccion: '',
                    Telefono: '',
                    Correo: '',
                    Credencial: '',
                });
            } else {
                alert("Error: " + data.message);
            }

        } catch (error) {
            console.error("Error al enviar datos:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: "600px" }}>
            <Card>
                <Card.Header>
                    <h3 className="text-center">Agregar Nuevo Usuario</h3>
                    {mostrarAlerta && (
                        <Alert variant="success" onClose={() => setMostrarAlerta(false)} dismissible>
                            Datos enviados  correctamente!!!!......
                        </Alert>
                    )}
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={enviarDatos}>

                        <Form.Group className="mb-3" controlId="Rol">
                            <Form.Label>ROL</Form.Label>
                            <Form.Select
                                name="Rol"
                                value={formData.Rol}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione un rol</option>
                                <option value="1">Administrador</option>
                                <option value="2">Asesor</option>
                                <option value="3">Cliente</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Documento">
                            <Form.Label>DOCUMENTO</Form.Label>
                            <Form.Control
                                type="text"
                                name="Documento"
                                value={formData.Documento}
                                onChange={handleChange}
                                placeholder="digite el documento del Usuario "
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="PrimerNombre">
                            <Form.Label>PRIMER NOMBRE</Form.Label>
                            <Form.Control
                                type="text"
                                name="PrimerNombre"
                                value={formData.PrimerNombre}
                                onChange={handleChange}
                                placeholder="digite el nombre del Usuario "
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="SegundoNombre">
                            <Form.Label>SEGUNDO NOMBRE</Form.Label>
                            <Form.Control
                                type="text"
                                name="SegundoNombre"
                                value={formData.SegundoNombre}
                                onChange={handleChange}
                                placeholder="digite el nombre del Usuario "
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="PrimerApellido">
                            <Form.Label>APELLIDO</Form.Label>
                            <Form.Control
                                type="text"
                                name="PrimerApellido"
                                value={formData.PrimerApellido}
                                onChange={handleChange}
                                placeholder="digite el apellido del Usuario "
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="SegundoApellido">
                            <Form.Label>APELLIDO</Form.Label>
                            <Form.Control
                                type="text"
                                name="SegundoApellido"
                                value={formData.SegundoApellido}
                                onChange={handleChange}
                                placeholder="digite el apellido Usuario "
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Direccion">
                            <Form.Label>DIRECCION</Form.Label>
                            <Form.Control
                                type="text"
                                name="Direccion"
                                value={formData.Direccion}
                                onChange={handleChange}
                                placeholder="digite la direccion del  Usuario"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Telefono">
                            <Form.Label>TELEFONO</Form.Label>
                            <Form.Control
                                type="text"
                                name="Telefono"
                                value={formData.Telefono}
                                onChange={handleChange}
                                placeholder="digite el telefono del Usuario "
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Correo">
                            <Form.Label>CORREO</Form.Label>
                            <Form.Control
                                type="text"
                                name="Correo"
                                value={formData.Correo}
                                onChange={handleChange}
                                placeholder="digite el Correo del Usuario "
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="Credencial">
                            <Form.Label>CONTRASEÑA</Form.Label>
                            <Form.Control
                                type="password" // importante para ocultar la contraseña
                                name="Credencial"
                                value={formData.Credencial}
                                onChange={handleChange}
                                placeholder="Digite la contraseña del usuario"
                                required
                            />
                        </Form.Group>



                        <Button style={{ background: "#7856AE", border: "#7856AE" }} type="submit">Guardar</Button>
                        <Button style={{ background: "#7856AE", border: "#7856AE" }} className="mx-5" type="button">Cancelar</Button>

                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )

}

export default AgregarUsuario;