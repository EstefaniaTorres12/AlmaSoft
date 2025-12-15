import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const AgregarCliente = () => {
    const [formData, setData] = useState({
        DocumentoCliente :'',
        PrimerNombreCliente:'',
        SegundoNombreCliente:'',
        PrimerApellidoCliente:'',
        SegundoApellidoCliente:'',
        DireccionCliente:'',
        TelefonoCliente:'',
        CorreoCliente:'',
        FechaNacimiento:'',
        EdadCliente:''
    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const handleChange = (e) =>{
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }



    const enviarDatos= async (e) => {
        e.preventDefault();
        setMostrarAlerta(true);
        console.log('datos enviados: ',formData);
    }

    return(
      <Container className="mt-5" style={{maxWidth: "600px"}}>
        <Card>
               <Card.Header>
                 <h3 className="text-center">Agregar Nuevo Cliente</h3>
                 {mostrarAlerta &&(
                    <Alert variant="success" onClose={()=>setMostrarAlerta(false)}dismissible>
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
                        <Form.Label>APELLIDO</Form.Label>
                        <Form.Control
                            type="text"
                            name="PrimerApellidoCliente"
                            value={formData.PrimerApellidoCliente}
                            onChange={handleChange}
                            placeholder="digite el apellido del cliente"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="SegundoApellidoCliente">
                        <Form.Label>APELLIDO</Form.Label>
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

                    <Button style={{background:"#7856AE" ,border:"#7856AE"}}  type="submit">Guardar</Button>
                    <Button style={{background:"#7856AE" ,border:"#7856AE"}} className="mx-5" type="button">Cancelar</Button>

                </Form>
                </Card.Body>
        </Card>
      </Container>
    )

}

export default AgregarCliente;