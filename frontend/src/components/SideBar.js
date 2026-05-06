import React from "react";
import { Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="admin-sidebar">
      <h3>ALMASOFT</h3>
      <Nav className="flex-column">
        <Button as={Link} to="/"                              className="m-3" variant="light">Inicio</Button>
        <Button as={Link} to="/clientes/Cliente"              className="m-3" variant="light">Clientes</Button>
        <Button as={Link} to="/usuarios"                      className="m-3" variant="light">Usuarios</Button>
        <Button as={Link} to="/admin/CategoriaFront"          className="m-3" variant="light">Categorias</Button>
        <Button as={Link} to="/admin/SubCategoriaFront"       className="m-3" variant="light">Sub Categorias</Button>
        <Button as={Link} to="/admin/ProductoFront"           className="m-3" variant="light">Productos</Button>
        <Button as={Link} to="/admin/Planes"                  className="m-3" variant="light">Planes Funebres</Button>
        <Button as={Link} to="/admin/afiliaciones"            className="m-3" variant="light">Afiliaciones</Button>
      </Nav>
    </div>
  );
};

export default SideBar;
