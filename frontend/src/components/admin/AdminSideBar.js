import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../../hooks/useSession";
import "../../styles/admin.css";

const NAV_ADMIN = [
  { label: "Inicio",        path: "/admin/home",               icon: "Inicio"   },
  { label: "Clientes",      path: "/clientes/Cliente",         icon: "Client"   },
  { label: "Usuarios",      path: "/usuarios",                 icon: "Users"    },
  { label: "Categorías",    path: "/admin/CategoriaFront",     icon: "Categ"    },
  { label: "Subcategorías", path: "/admin/SubCategoriaFront",  icon: "SubCat"   },
  { label: "Productos",     path: "/admin/ProductoFront",      icon: "Prod"     },
  { label: "Planes",        path: "/admin/Planes",             icon: "Planes"   },
];

export default function AdminSideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { usuario, nombreCorto, profilePhoto } = useSession("admin_profile_photo");

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <aside className="admin-sidebar-modern">
        <div className="admin-sidebar-brand">
          <img src="/img/logoAS.png" alt="AlmaSoft" className="admin-sidebar-logo" />
          <div>
            <p className="admin-sidebar-kicker">Panel administrador</p>
            <h2 className="admin-sidebar-title">AlmaSoft</h2>
          </div>
        </div>

        <div className="admin-sidebar-profile">
          <img src={profilePhoto} alt="Perfil" className="admin-sidebar-avatar" />
          <div className="admin-sidebar-profile-info">
            <strong>{nombreCorto}</strong>
            <span>{usuario.usuario_correo || "administrador@almasoft.co"}</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ADMIN.map((item) => {
            const active =
              item.path === "/admin/home"
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                type="button"
                className={`admin-nav-item ${active ? "is-active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-nav-item admin-nav-logout"
            onClick={() => setConfirmLogout(true)}
          >
            <span className="admin-nav-icon">Salir</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {confirmLogout && (
        <div className="admin-confirm-overlay" onClick={() => setConfirmLogout(false)}>
          <div className="admin-confirm-box" onClick={(e) => e.stopPropagation()}>
            <p>¿Deseas cerrar sesión?</p>
            <div className="admin-confirm-actions">
              <button className="admin-confirm-yes" onClick={cerrarSesion}>
                Sí, salir
              </button>
              <button className="admin-confirm-no" onClick={() => setConfirmLogout(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
