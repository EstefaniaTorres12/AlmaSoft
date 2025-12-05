import React from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const EditarUsuario = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        rol_id: "",
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
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/usuarios/id/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setUsuario({
                        rol_id: data.data.rol_id,
                        primerNombre: data.data.usuario_primer_nombre || "",
                        segundoNombre: data.data.usuario_segundo_nombre || "",
                        primerApellido: data.data.usuario_primer_apellido || "",
                        segundoApellido: data.data.usuario_segundo_apellido || "",
                        direccion: data.data.usuario_direccion || "",
                        telefono: data.data.usuario_telefono || "",
                        email: data.data.usuario_correo || "",
                        credencial: ""
                    });
                } else {
                    alert(data.message);
                }
            } catch (err) {
                alert("Error al cargar el usuario");
            }
        };

        fetchUsuario();
    }, [id]);

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuarioActualizado = {
            rol_id: usuario.rol_id,
            usuario_primer_nombre: usuario.primerNombre,
            usuario_segundo_nombre: usuario.segundoNombre,
            usuario_primer_apellido: usuario.primerApellido,
            usuario_segundo_apellido: usuario.segundoApellido,
            usuario_direccion: usuario.direccion,
            usuario_correo: usuario.email.toLowerCase(),
            usuario_telefono: usuario.telefono,
            usuario_credencial: usuario.credencial || undefined
        };

        try {
            const response = await fetch(`http://localhost:3001/api/usuarios/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuarioActualizado)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Usuario actualizado correctamente");
                navigate("/usuarios/UsuarioFront");
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Error al conectarse con el servidor");
        }
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
                            <Form.Label>Primer Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="primerNombre"
                                value={usuario.primerNombre}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Segundo Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="segundoNombre"
                                value={usuario.segundoNombre}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Primer Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="primerApellido"
                                value={usuario.primerApellido}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Segundo Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="segundoApellido"
                                value={usuario.segundoApellido}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                value={usuario.telefono}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="direccion"
                                value={usuario.direccion}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={usuario.email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button type="submit" style={{ background: "#7856AE", border: "#7856AE" }}>
                            Guardar
                        </Button>

                        <Link to="/usuarios/UsuarioFront">
                            <Button className="mx-3" style={{ background: "#7856AE", border: "#7856AE" }}>
                                Cancelar
                            </Button>
                        </Link>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditarUsuario;