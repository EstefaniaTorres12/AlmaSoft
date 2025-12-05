import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import usuario1 from '../../img/usuario.png';

const DetallesUsuario = () => {

    const { id } = useParams();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/usuarios/id/${id}`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token") 
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setUsuario(data.data);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error cargando usuario", error);
                alert("Error cargando datos del usuario");
            }
        };

        fetchUsuario();
    }, [id]);

    if (!usuario) {
        return <h2 className="text-center mt-5">Cargando usuario...</h2>;
    }

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="text-center">Detalles del Usuario</h3>
                        </Card.Header>
                        <Card.Body>
                            <h4>ID Usuario: {usuario.usuario_id}</h4>
                            <h4>Documento: {usuario.usuario_documento}</h4>
                            <h4>Nombres: {usuario.usuario_primer_nombre} {usuario.usuario_segundo_nombre}</h4>
                            <h4>Apellidos: {usuario.usuario_primer_apellido} {usuario.usuario_segundo_apellido}</h4>
                            <h4>Email: {usuario.usuario_correo}</h4>
                            <h4>Dirección: {usuario.usuario_direccion}</h4>
                            <h4>Teléfono: {usuario.usuario_telefono}</h4>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card style={{ width: '30rem' }}>
                        <Card.Header>
                            <h3 className="text-center">{usuario.rol_nombre}</h3>
                        </Card.Header>
                        <Card.Img variant="top" src={usuario1} />
                        <Card.Body>
                            <Card.Text>
                                Información adicional del usuario
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default DetallesUsuario;