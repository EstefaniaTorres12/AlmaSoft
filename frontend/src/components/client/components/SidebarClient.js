import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/sidebarClient.css";

const NAV_ITEMS = [
  { label: "Inicio", path: "/client", icon: "Inicio" },
  { label: "Tu plan", path: "/client/plan", icon: "Plan" },
  { label: "Afiliados", path: "/client/afiliados", icon: "Grupo" },
  { label: "Contrato", path: "/client/contrato", icon: "Doc" },
  { label: "Pagos", path: "/client/pagos", icon: "Pago" },
  { label: "Sedes", path: "/client/sedes", icon: "Sede" },
  { label: "Servicios", path: "/client/contacto", icon: "Ayuda" },
  { label: "Tienda", path: "/client/tienda", icon: "Shop" },
  { label: "Perfil", path: "/client/perfil", icon: "Perfil" },
];

export default function SidebarClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario")) || {};
    } catch {
      return {};
    }
  });
  const [profilePhoto, setProfilePhoto] = useState("/img/usuario.png");
  const rol = localStorage.getItem("rol");

  useEffect(() => {
    const syncProfile = () => {
      try {
        const usuarioActual = JSON.parse(localStorage.getItem("usuario")) || {};
        setUsuario(usuarioActual);

        const usuarioId = usuarioActual.usuario_id || localStorage.getItem("usuario_id");
        if (usuarioId) {
          const storedPhoto = localStorage.getItem(`client_profile_photo_${usuarioId}`);
          setProfilePhoto(storedPhoto || "/img/usuario.png");
        }
      } catch {
        setUsuario({});
        setProfilePhoto("/img/usuario.png");
      }
    };

    syncProfile();
    window.addEventListener("client-profile-updated", syncProfile);
    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener("client-profile-updated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const nombreCorto = [
    usuario.usuario_primer_nombre,
    usuario.usuario_primer_apellido,
  ]
    .filter(Boolean)
    .join(" ") || usuario.usuario_correo || "Cliente";

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const items = rol === "Afiliado"
    ? NAV_ITEMS.filter((item) => ["/client/afiliados", "/client/perfil"].includes(item.path))
    : NAV_ITEMS;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/img/logoAS.png" alt="AlmaSoft" className="sidebar-brand-logo" />
        <div>
          <p className="sidebar-kicker">Panel cliente</p>
          <h2 className="sidebar-title">AlmaSoft</h2>
        </div>
      </div>

      <div className="sidebar-profile-card">
        <img src={profilePhoto} alt="Perfil" className="sidebar-avatar" />
        <div>
          <strong>{nombreCorto}</strong>
          <p>{usuario.usuario_correo || "Gestiona tus planes, pagos y acompanamiento"}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const active =
            item.path === "/client"
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              type="button"
              className={`sidebar-item ${active ? "is-active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-item sidebar-logout"
          onClick={cerrarSesion}
        >
          <span className="sidebar-item-icon">Salir</span>
          <span>Cerrar sesion</span>
        </button>
      </div>
    </aside>
  );
}
