import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/sidebarAsesor.css";

const NAV_ITEMS = [
  { label: "Inicio", path: "/asesor", icon: "Inicio" },
  { label: "Clientes", path: "/asesor/clientes", icon: "Clientes" },
  { label: "Planes", path: "/asesor/planes", icon: "Planes" },
  { label: "Productos", path: "/asesor/productos", icon: "Productos" },
  { label: "Afiliados", path: "/asesor/afiliados", icon: "Afiliados" },
  { label: "Perfil", path: "/asesor/perfil", icon: "Perfil" },
];

export default function SidebarAsesor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario")) || {};
    } catch {
      return {};
    }
  });
  const [profilePhoto, setProfilePhoto] = useState("/img/usuario.png");

  useEffect(() => {
    const syncProfile = () => {
      try {
        const usuarioActual = JSON.parse(localStorage.getItem("usuario")) || {};
        setUsuario(usuarioActual);

        const usuarioId = usuarioActual.usuario_id || localStorage.getItem("usuario_id");
        if (usuarioId) {
          const storedPhoto = localStorage.getItem(`asesor_profile_photo_${usuarioId}`);
          setProfilePhoto(storedPhoto || "/img/usuario.png");
        }
      } catch {
        setUsuario({});
        setProfilePhoto("/img/usuario.png");
      }
    };

    syncProfile();
    window.addEventListener("asesor-profile-updated", syncProfile);
    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener("asesor-profile-updated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const nombreCorto = [
    usuario.usuario_primer_nombre,
    usuario.usuario_primer_apellido,
  ]
    .filter(Boolean)
    .join(" ") || usuario.usuario_correo || "Asesor";

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/img/logoAS.png" alt="AlmaSoft" className="sidebar-brand-logo" />
          <div>
            <p className="sidebar-kicker">Panel asesor</p>
            <h2 className="sidebar-title">AlmaSoft</h2>
          </div>
        </div>

        <div className="sidebar-profile-card">
          <img src={profilePhoto} alt="Perfil" className="sidebar-avatar" />
          <div>
            <strong>{nombreCorto}</strong>
            <p>{usuario.usuario_correo || "Gestiona clientes, planes y productos"}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const active =
              item.path === "/asesor"
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
            onClick={() => setConfirmLogout(true)}
          >
            <span className="sidebar-item-icon">Salir</span>
            <span>Cerrar sesion</span>
          </button>
        </div>
      </aside>

      {confirmLogout && (
        <div className="sidebar-confirm-overlay" onClick={() => setConfirmLogout(false)}>
          <div className="sidebar-confirm-box" onClick={(e) => e.stopPropagation()}>
            <p>¿Deseas cerrar sesion?</p>
            <div className="sidebar-confirm-actions">
              <button className="sidebar-confirm-yes" onClick={cerrarSesion}>Si, salir</button>
              <button className="sidebar-confirm-no" onClick={() => setConfirmLogout(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}