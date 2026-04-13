import { useNavigate } from "react-router-dom";
import "../styles/sidebarClient.css";

export default function SidebarClient() {

  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">

      <h2 className="sidebar-title">ALMASOFT</h2>

      <div className="sidebar-item" onClick={() => navigate("/client")}>
        🏠 Inicio
      </div>

      <div className="sidebar-item" onClick={() => navigate("/client/plan")}>
        📦 Tu Plan
      </div>

      <div className="sidebar-item" onClick={() => navigate("/client/afiliados")}>
        👨‍👩‍👧 Afiliados
      </div>

      <div className="sidebar-item" onClick={() => navigate("/client/contrato")}>
        📄 Contrato
      </div>

      <div className="sidebar-item" onClick={() => navigate("/client/pagos")}>
        💳 Pagos
      </div>

      <div className="sidebar-item" onClick={() => navigate("/client/sedes")}>
        📍 Sedes
      </div>

      <div className="sidebar-item" onClick={() => navigate("/client/contacto")}>
        📞 Contáctanos
      </div>

      <div className="sidebar-item" onClick={() => navigate("/client/tienda")}>
        🛒 Tienda
      </div>

      <hr />

      <div className="sidebar-item" onClick={() => navigate("/client/perfil")}>
        👤 Perfil
      </div>

      <div
        className="sidebar-item sidebar-logout"
        onClick={cerrarSesion}
      >
        🚪 Cerrar sesión
      </div>

    </div>
  );
}