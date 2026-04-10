import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";

const DetallesCliente = () => {

    const { id } = useParams();
    const [cliente, setCliente] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/clientes/id/${id}`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token") 
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setCliente(data.data);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error cargando cliente", error);
                alert("Error cargando datos del cliente");
            }
        };

        fetchCliente();
    }, [id]);

    if (!cliente) {
        return <h2 className="text-center mt-5">Cargando cliente...</h2>;
    }

    return (
        <Container className="my-5">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3 className="text-center">Detalles del Cliente</h3>
                        </Card.Header>
                        <Card.Body>
                            <h4>ID: {cliente.id}</h4>
                            <h4>Documento: {cliente.documento}</h4>
                            <h4>Nombres: {cliente.primer_nombre} {cliente.segundo_nombre}</h4>
                            <h4>Apellidos: {cliente.primer_apellido} {cliente.segundo_apellido}</h4>
                            <h4>Email: {cliente.correo}</h4>
                            <h4>Dirección: {cliente.direccion}</h4>
                            <h4>Teléfono: {cliente.telefono}</h4>
                            <h4>Fecha Nacimiento: {cliente.fecha_nacimiento}</h4>
                            <h4>Edad: {cliente.edad}</h4>
                        </Card.Body>
                    </Card>
                </Col>

                <Col>
                    <Card style={{ width: '30rem' }}>
                        <Card.Header>
                            <h3 className="text-center">Cliente</h3>
                        </Card.Header>
                        <Card.Img variant="top" src="/img/usuario.png" />
                        <Card.Body>
                            <Card.Text>
                                Información detallada del cliente
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default DetallesCliente;