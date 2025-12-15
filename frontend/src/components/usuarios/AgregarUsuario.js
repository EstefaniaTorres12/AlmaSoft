import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const AgregarUsuario = () => {
    const [formData, setData] = useState({
        Rol:'',
        Documento :'',
        PrimerNombre:'',
        SegundoNombre:'',
        PrimerApellido:'',
        SegundoApellido:'',
        Direccion:'',
        Telefono:'',
        Correo:'',
        Credencial:'',
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
                 <h3 className="text-center">Agregar Nuevo Usuario</h3>
                 {mostrarAlerta &&(
                    <Alert variant="success" onClose={()=>setMostrarAlerta(false)}dismissible>
                        Datos enviados  correctamente!!!!......
                    </Alert>
                 )}
               </Card.Header>
               <Card.Body>
                <Form onSubmit={enviarDatos}>
                    
                    <Form.Group className="mb-3" controlId="Rol">
                        <Form.Label>ROL</Form.Label>
                        <Form.Control
                            type="text"
                            name="Rol"
                            value={formData.Rol}
                            onChange={handleChange}
                            placeholder="digite el Rol del Usuario "
                        />
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

                    

                    <Button style={{background:"#7856AE" ,border:"#7856AE"}}  type="submit">Guardar</Button>
                    <Button style={{background:"#7856AE" ,border:"#7856AE"}} className="mx-5" type="button">Cancelar</Button>

                </Form>
                </Card.Body>
        </Card>
      </Container>
    )

}

export default AgregarUsuario;