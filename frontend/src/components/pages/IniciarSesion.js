import React from "react";
import { useState } from "react";
import { Container, Card, Form, Alert, Button } from "react-bootstrap";
import Fondo from '../../img/3302177.jpg';


const InisiarSesion = () => {

    const [formData, setData] = useState({
        UsuarioId: '',
        UsuarioContraseña: ''

    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }


    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundImage: `url(${Fondo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",              
                justifyContent: "center",     
                alignItems: "center"          
            }}
        >
            <Container style={{ maxWidth: "600px" }}>
                <Card>
                    <Card.Header>
                        <h1 className="text-center" style={{ color: "#60448D" }}>Iniciar Sesion</h1>
                        {mostrarAlerta && (
                            <Alert variant="success" onClose={() => setMostrarAlerta(false)} dismissible>
                                Inicio de Sesion Exitoso
                            </Alert>
                        )}
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="UsuarioId">
                                <Form.Label>Ingrese su Usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="UsuarioId"
                                    value={formData.UsuarioId}
                                    onChange={handleChange}
                                    placeholder="digite su id de Usuario"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="UsuarioContraseña">
                                <Form.Label>Ingrese su Contraseña</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="UsuarioContraseña"
                                    value={formData.UsuarioContraseña}
                                    onChange={handleChange}
                                    placeholder="digite su contraseña"
                                />
                            </Form.Group>
                        </Form>
                        <Button style={{ background: "#5660AE", borderColor: "#36264F" }} type="submit">Inisiar Sesion</Button>

                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default InisiarSesion;