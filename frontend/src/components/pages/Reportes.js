import React, { useState, useEffect } from "react";
import { Container, Card, Table, Button, Alert, Spinner } from "react-bootstrap";

const Reportes = () => {
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [tipo, setTipo] = useState("usuarios");

    // Datos de ejemplo para tu funeraria
    const datosEjemplo = {
        usuarios: [
            { id: 1, nombre: "Juan Pérez", documento: "12345678", email: "juan@email.com", rol: "Cliente" },
            { id: 2, nombre: "María García", documento: "87654321", email: "maria@email.com", rol: "Afiliado" }
        ],
        productos: [
            { id: 1, nombre: "Ataud Económico", precio: 850000, stock: 25, categoria: "Ataúd" },
            { id: 2, nombre: "Urna Básica", precio: 300000, stock: 42, categoria: "Urna" }
        ],
        contratos: [
            { id: 1, cliente: "Juan Pérez", valor: 3500000, estado: "Activo", fecha: "2024-01-15" },
            { id: 2, cliente: "María García", valor: 5200000, estado: "Activo", fecha: "2024-01-16" }
        ]
    };

    useEffect(() => {
        // Simular carga de datos
        setCargando(true);
        setTimeout(() => {
            setDatos(datosEjemplo[tipo] || []);
            setCargando(false);
        }, 1000);
    }, [tipo, datosEjemplo]);

    const formatoMoneda = (valor) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(valor);
    };

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4" style={{ color: "#4B356E" }}>📊 Reportes AlmaSoft</h1>
            
            {/* Selector de tipo */}
            <div className="mb-4 text-center">
                <Button 
                    variant={tipo === "usuarios" ? "primary" : "outline-primary"} 
                    className="me-2"
                    onClick={() => setTipo("usuarios")}
                >
                    👥 Usuarios
                </Button>
                <Button 
                    variant={tipo === "productos" ? "primary" : "outline-primary"} 
                    className="me-2"
                    onClick={() => setTipo("productos")}
                >
                    📦 Productos
                </Button>
                <Button 
                    variant={tipo === "contratos" ? "primary" : "outline-primary"}
                    onClick={() => setTipo("contratos")}
                >
                    📝 Contratos
                </Button>
            </div>

            {/* Tarjeta de reporte */}
            <Card className="shadow">
                <Card.Header style={{ backgroundColor: "#4B356E", color: "white" }}>
                    <h4 className="mb-0">
                        {tipo === "usuarios" ? "👥 Usuarios/Clientes" : 
                         tipo === "productos" ? "📦 Productos Funerarios" : 
                         "📝 Contratos"}
                    </h4>
                </Card.Header>
                
                <Card.Body>
                    {cargando ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: "#4B356E" }} />
                            <p className="mt-3">Cargando datos...</p>
                        </div>
                    ) : datos.length === 0 ? (
                        <Alert variant="info">No hay datos disponibles</Alert>
                    ) : (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    {Object.keys(datos[0]).map((col, index) => (
                                        <th key={index}>{col.toUpperCase()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {datos.map((item, index) => (
                                    <tr key={index}>
                                        {Object.values(item).map((valor, idx) => (
                                            <td key={idx}>
                                                {typeof valor === 'number' && valor > 10000 
                                                    ? formatoMoneda(valor) 
                                                    : valor}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
                
                <Card.Footer className="text-center">
                    <small>Total registros: {datos.length}</small>
                    <div className="mt-2">
                        <Button variant="success" className="me-2"> Exportar PDF</Button>
                        <Button variant="info"> Exportar Excel</Button>
                    </div>
                </Card.Footer>
            </Card>
        </Container>
    );
};

export default Reportes;