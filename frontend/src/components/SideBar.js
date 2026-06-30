import React, { useState } from "react";
import { Button, Nav } from "react-bootstrap";
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
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { rol, usuario } = getSession();

  const nombreCorto =
    [usuario.usuario_primer_nombre, usuario.usuario_primer_apellido]
      .filter(Boolean)
      .join(" ") ||
    usuario.usuario_correo ||
    rol ||
    "Administrador";

  return (
    <>
      <div className="admin-sidebar">
        <div style={{ padding: "8px 12px 4px" }}>
          <h3 style={{ margin: 0 }}>ALMASOFT</h3>
          <small style={{ opacity: 0.7 }}>{rol} — {nombreCorto}</small>
        </div>

        <Nav className="flex-column">
          <Button as={Link} to="/" className="m-3" variant="light">
            Inicio
          </Button>

          {ADMIN_NAV.map(({ label, to }) => (
            <Button key={to} as={Link} to={to} className="m-3" variant="light">
              {label}
            </Button>
          ))}

          <Button
            className="m-3"
            variant="outline-danger"
            onClick={() => setConfirmLogout(true)}
          >
            Cerrar sesión
          </Button>
        </Nav>
      </div>

      {confirmLogout && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setConfirmLogout(false)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 8, padding: "24px 32px",
              textAlign: "center", minWidth: 280,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ marginBottom: 16 }}>¿Deseas cerrar sesión?</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
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
