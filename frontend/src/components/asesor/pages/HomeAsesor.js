import { useEffect, useState } from "react";
import AsesorLayout from "../layout/AsesorLayout";
import { authFetch } from "../../../utils/authFetch";
import { useNavigate } from "react-router-dom";
import "../styles/homeAsesor.css";
import "../styles/asesorPages.css";

function readAsesorSession() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
    const nombre =
      [usuario.usuario_primer_nombre, usuario.usuario_primer_apellido]
        .filter(Boolean)
        .join(" ") || usuario.usuario_correo || "Asesor";

    return {
      nombre,
      correo: usuario.usuario_correo || "Correo no disponible",
    };
  } catch {
    return {
      nombre: "Asesor",
      correo: "Correo no disponible",
    };
  }
}

export default function HomeAsesor() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    clientes: 0,
    planes: 0,
    productos: 0,
    afiliados: 0
  });
  const [randomProduct, setRandomProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [asesorSession, setAsesorSession] = useState(() => readAsesorSession());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resClientes, resPlanes, resProductos, resAfiliados] = await Promise.all([
          authFetch("http://localhost:3001/api/clientes/clientesAll"),
          authFetch("http://localhost:3001/api/planes/all"),
          authFetch("http://localhost:3001/api/productos/productosAll"),
          authFetch("http://localhost:3001/api/client/affiliates/review")
        ]);

        const dataClientes = await resClientes.json();
        const dataPlanes = await resPlanes.json();
        const dataProductos = await resProductos.json();
        const dataAfiliados = await resAfiliados.json();

        setStats({
          clientes: dataClientes.success ? dataClientes.data.length : 0,
          planes: dataPlanes.success ? dataPlanes.data.length : 0,
          productos: dataProductos.success ? dataProductos.data.length : 0,
          afiliados: dataAfiliados.success ? dataAfiliados.data.length : 0
        });

        if (dataProductos.success && dataProductos.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * dataProductos.data.length);
          setRandomProduct(dataProductos.data[randomIndex]);
        }

        setError("");
      } catch (err) {
        console.error(err);
        setError("No fue posible cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AsesorLayout>
      <div className="asesor-page-shell">
        <div className="asesor-page-header">
          <h1>Bienvenido, {asesorSession.nombre}</h1>
          <p>Gestiona clientes, planes y productos desde tu panel de asesor.</p>
        </div>

        {loading ? (
          <p>Cargando estadísticas...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <div className="asesor-info-grid">
            <div className="asesor-info-card">
              <h3>{stats.clientes}</h3>
              <p>Clientes</p>
            </div>
            <div className="asesor-info-card">
              <h3>{stats.planes}</h3>
              <p>Planes</p>
            </div>
            <div className="asesor-info-card">
              <h3>{stats.productos}</h3>
              <p>Productos</p>
            </div>
            <div className="asesor-info-card">
              <h3>{stats.afiliados}</h3>
              <p>Afiliados</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: '40px' }} className="asesor-info-grid">
          <div className="asesor-info-card">
            <h3>Gestión de Clientes</h3>
            <p>Registra nuevos clientes y gestiona sus perfiles.</p>
            <button 
              className="asesor-btn"
              onClick={() => navigate("/asesor/clientes")}
              style={{ marginTop: '15px' }}
            >
              Ir a Clientes
            </button>
          </div>
          <div className="asesor-info-card">
            <h3>Gestión de Planes</h3>
            <p>Administra los planes fúnebres disponibles.</p>
            <button 
              className="asesor-btn"
              onClick={() => navigate("/asesor/planes")}
              style={{ marginTop: '15px' }}
            >
              Ir a Planes
            </button>
          </div>

          {randomProduct && (
            <div className="asesor-info-card">
              <h3>Producto Destacado</h3>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                <img 
                  src={`/${randomProduct.producto_imagen}`} 
                  alt={randomProduct.producto_nombre} 
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/img/default.png'; }}
                />
                <div>
                  <strong style={{ display: 'block', color: '#301f57' }}>{randomProduct.producto_nombre}</strong>
                  <span style={{ color: '#5636a5', fontWeight: 'bold' }}>${randomProduct.producto_precio}</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6f6789' }}>Stock: {randomProduct.producto_stock}</p>
                </div>
              </div>
              <button 
                className="asesor-btn asesor-btn-secondary"
                onClick={() => navigate("/asesor/productos")}
                style={{ marginTop: '15px', width: '100%' }}
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </div>
      </div>
    </AsesorLayout>
  );
}