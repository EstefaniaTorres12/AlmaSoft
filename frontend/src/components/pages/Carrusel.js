import React from "react";
import { Container, Carousel } from "react-bootstrap";


const Carrusel = () => {
    return (
        <Container fluid className="my-5"  >
            <Carousel style={{ borderRadius: "15px", overflow: "hidden" }} >
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/img/1.png"
                        alt="First slide"
                        style={{ height: "400px", objectFit: "cover" }}
                    />
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/img/1.png"
                        alt="First slide"
                        style={{ height: "400px", objectFit: "cover" }}
                    />
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/img/1.png"
                        alt="First slide"
                        style={{ height: "400px", objectFit: "cover" }}
                    />
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>
                            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                        </p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
}

export default Carrusel;