import React from "react";
import { Container, Card, Row, Col } from "react-bootstrap";

const AcercaDeNosotros = () => {
    return (

        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "white",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <Container className="text-center">
                <Row>
                    <Col style={{ background: '#DAB2FF' }}>
                        <Card className="my-5">
                            <Card.Header>
                                <h2>Quienes Somos</h2>
                            </Card.Header>
                            <Card.Body>
                                <p>Un texto "Quiénes somos" presenta a una marca, empresa o persona,
                                    compartiendo su historia, misión, valores y equipo para generar
                                    confianza y cercanía con los visitantes. Para redactarlo, enfócate
                                    en responder qué hace tu marca y por qué, su historia, su misión y
                                    visión, y los valores que la definen. Un texto personal, auténtico
                                    y bien estructurado que use un lenguaje directo y cercano, e incluya
                                    fotos o videos, es clave para conectar emocionalmente con la
                                    audiencia y humanizar la marca.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col style={{ background: '#C68AFF' }}>
                        <Card className="my-5">
                            <Card.Header>
                                <h2>Que Ofrecemos</h2>
                            </Card.Header>
                            <Card.Body>
                                <p>Un texto "Quiénes somos" presenta a una marca, empresa o persona,
                                    compartiendo su historia, misión, valores y equipo para generar
                                    confianza y cercanía con los visitantes. Para redactarlo, enfócate
                                    en responder qué hace tu marca y por qué, su historia, su misión y
                                    visión, y los valores que la definen. Un texto personal, auténtico
                                    y bien estructurado que use un lenguaje directo y cercano, e incluya
                                    fotos o videos, es clave para conectar emocionalmente con la
                                    audiencia y humanizar la marca.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col style={{ background: '#DAB2FF' }}>
                        <Card className="my-5">
                            <Card.Header>
                                <h2>Mision y Vision</h2>
                            </Card.Header>
                            <Card.Body>
                                <p>Un texto "Quiénes somos" presenta a una marca, empresa o persona,
                                    compartiendo su historia, misión, valores y equipo para generar
                                    confianza y cercanía con los visitantes. Para redactarlo, enfócate
                                    en responder qué hace tu marca y por qué, su historia, su misión y
                                    visión, y los valores que la definen. Un texto personal, auténtico
                                    y bien estructurado que use un lenguaje directo y cercano, e incluya
                                    fotos o videos, es clave para conectar emocionalmente con la
                                    audiencia y humanizar la marca.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </div>
    );
}


export default AcercaDeNosotros;