import React from "react";
import { Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const SideBar =()=>{
    return(
        <div
      style={{
        width: "200px",
        height: "100vh",
        backgroundColor: "#211730",
        color: "white",
        position: "fixed",
        top: 0,
        left: 0,
        paddingTop: "20px",
      }}
    >
      <h3 className="text-center mb-4">ALMASOFT</h3>
      <Nav className="flex-column">
        <Button as={Link} to="/"  className=" m-3" variant="light">
          Inicio
        </Button>
        <Button as={Link} to="/clientes/Cliente" className=" m-3" variant="light">
          Clientes
        </Button>
        <Button as={Link} to="/usuarios/Usuario" className=" m-3" variant="light">
          Usuarios
        </Button>
        <Button as={Link} to="/categorias" className=" m-3" variant="light">
          Categorias
        </Button>
        <Button as={Link} to="/planes" className=" m-3" variant="light">
          Planes
        </Button>
        <Button as={Link} to="/compras" className=" m-3" variant="light">
          Compras
        </Button>
        <Button as={Link} to="/tramites" className=" m-3" variant="light">
          Tramites
        </Button>
        <Button as={Link} to="/cronograma" className=" m-3" variant="light">
          Cronograma
        </Button>
      </Nav>
    </div>
  );

}

export default SideBar;