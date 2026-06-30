import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import { useSession } from "../../hooks/useSession";
import { API_URL } from "../../config/api";
import "../../styles/admin.css";

export default function HomeAdmin() {
  const navigate = useNavigate();
  const { nombreCorto } = useSession();

  const [stats, setStats] = useState({
    clientes: 0,
    usuarios: 0,
    planes: 0,
    productos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resClientes, resUsuarios, resPlanes, resProductos] = await Promise.all([
          authFetch(`${API_URL}/api/clientes/clientesAll`),
          authFetch(`${API_URL}/api/usuarios/usuariosAll`),
          authFetch(`${API_URL}/api/planes/`),
          authFetch(`${API_URL}/api/productos/productosAll`),
        ]);

        const [dClientes, dUsuarios, dPlanes, dProductos] = await Promise.all([
          resClientes.json(),
          resUsuarios.json(),
          resPlanes.json(),
          resProductos.json(),
        ]);

        setStats({
          clientes:  dClientes.success  ? dClientes.data.length  : 0,
          usuarios:  dUsuarios.success  ? dUsuarios.data.length  : 0,
          planes:    dPlanes.success    ? dPlanes.data.length    : 0,
          productos: dProductos.success ? dProductos.data.length : 0,
        });
        setError("");
      } catch {
        setError("No fue posible cargar las estadísticas del sistema.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const ACCIONES = [
    {
      titulo: "Gestión de Clientes",
      desc: "Registra, edita y consulta la información de los clientes del sistema.",
      ruta: "/clientes/Cliente",
      label: "Ir a Clientes",
    },
    {
      titulo: "Gestión de Usuarios",
      desc: "Administra usuarios del sistema: asesores, administradores y credenciales.",
      ruta: "/usuarios",
      label: "Ir a Usuarios",
    },
    {
      titulo: "Planes Fúnebres",
      desc: "Crea y administra los planes disponibles para los clientes.",
      ruta: "/admin/Planes",
      label: "Ir a Planes",
    },
    {
      titulo: "Catálogo de Productos",
      desc: "Gestiona urnas, ataúdes, lápidas y arreglos florales.",
      ruta: "/admin/ProductoFront",
      label: "Ir a Productos",
    },
    {
      titulo: "Categorías y Subcategorías",
      desc: "Organiza el catálogo definiendo categorías y subcategorías.",
      ruta: "/admin/CategoriaFront",
      label: "Ir a Categorías",
    },

  ];

  return (
    <div className="admin-page-shell">
      <div className="admin-page-header">
        <div>
          <h1>Bienvenido, {nombreCorto}</h1>
          <p>Panel de administración AlmaSoft — gestiona todo el sistema desde aquí.</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#6a618a" }}>Cargando estadísticas...</p>
      ) : error ? (
        <p style={{ color: "#a03e55" }}>{error}</p>
      ) : (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>{stats.clientes}</h3>
            <p>Clientes</p>
          </div>
          <div className="admin-stat-card">
            <h3>{stats.usuarios}</h3>
            <p>Usuarios</p>
          </div>
          <div className="admin-stat-card">
            <h3>{stats.planes}</h3>
            <p>Planes</p>
          </div>
          <div className="admin-stat-card">
            <h3>{stats.productos}</h3>
            <p>Productos</p>
          </div>
        </div>
      )}

      <div className="admin-actions-grid">
        {ACCIONES.map((accion) => (
          <div key={accion.ruta} className="admin-action-card">
            <h4>{accion.titulo}</h4>
            <p>{accion.desc}</p>
            <button
              className="admin-btn"
              style={{ width: "100%" }}
              onClick={() => navigate(accion.ruta)}
            >
              {accion.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
