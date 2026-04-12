import React from "react";
import { Button, Container, Nav } from "react-bootstrap";
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
        <Button as={Link} to="/usuarios" className=" m-3" variant="light">
          Usuarios
        </Button>
        <Button as={Link} to="/admin/CategoriaFront" className=" m-3" variant="light">
          Categorias
        </Button>
        <Button as={Link} to="/admin/SubCategoriaFront" className=" m-3" variant="light">
          Sub Categorias
        </Button>
        <Button as={Link} to="/admin/ProductoFront" className=" m-3" variant="light">
          Productos
        </Button>
        <Button as={Link} to="/admin/Planes" className=" m-3" variant="light">
          Planes Funebres
        </Button>
        <Button as={Link} to="/Compras" className=" m-3" variant="light">
          Compras
        </Button>
        <Button as={Link} to="/Tramites" className=" m-3" variant="light">
          Tramites
        </Button>
        <Button as={Link} to="/Cronograma" className=" m-3" variant="light">
          Cronograma
        </Button>
      </Nav>
    </div>
  );

}

export default SideBar;