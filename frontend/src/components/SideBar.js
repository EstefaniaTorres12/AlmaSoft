import React, { useState } from "react";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logout, getSession } from "../utils/auth";

const ADMIN_NAV = [
  { label: "Clientes",       to: "/clientes/Cliente" },
  { label: "Usuarios",       to: "/usuarios" },
  { label: "Categorias",     to: "/admin/CategoriaFront" },
  { label: "Sub Categorias", to: "/admin/SubCategoriaFront" },
  { label: "Productos",      to: "/admin/ProductoFront" },
  { label: "Planes Funebres",to: "/admin/Planes" },
];

const SideBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { rol, usuario } = getSession();

  const nombreCorto =
    [usuario.usuario_primer_nombre, usuario.usuario_primer_apellido]
      .filter(Boolean)
      .join(" ") ||
    usuario.usuario_correo ||
    rol ||
    "Administrador";

  const sidebarContent = (
    <>
      <div className="admin-sidebar-header">
        <h3>ALMASOFT</h3>
        <small>{rol} — {nombreCorto}</small>
      </div>
      <Nav className="flex-column admin-sidebar-nav">
        <Button as={Link} to="/" className="admin-sidebar-link" variant="light">
          Inicio
        </Button>
        {ADMIN_NAV.map(({ label, to }) => (
          <Button key={to} as={Link} to={to} className="admin-sidebar-link" variant="light">
            {label}
          </Button>
        ))}
        <Button
          className="admin-sidebar-link admin-sidebar-logout"
          variant="outline-danger"
          onClick={() => setConfirmLogout(true)}
        >
          Cerrar sesión
        </Button>
      </Nav>
    </>
  );

  return (
    <>
      <Button
        className="admin-sidebar-toggle d-md-none"
        onClick={() => setShowMenu(true)}
        variant="dark"
      >
        ☰ Menú
      </Button>

      <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>ALMASOFT</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {sidebarContent}
        </Offcanvas.Body>
      </Offcanvas>

      <div className="admin-sidebar d-none d-md-flex">
        {sidebarContent}
      </div>

      {confirmLogout && (
        <div
          className="admin-confirm-overlay"
          onClick={() => setConfirmLogout(false)}
        >
          <div className="admin-confirm-box" onClick={(e) => e.stopPropagation()}>
            <p>¿Deseas cerrar sesión?</p>
            <div className="admin-confirm-actions">
              <Button variant="danger" onClick={logout}>
                Sí, salir
              </Button>
              <Button variant="secondary" onClick={() => setConfirmLogout(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
