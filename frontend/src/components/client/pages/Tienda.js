import { useEffect, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import "../styles/clientPages.css";
import "../styles/tienda.css";
import { API_URL } from "../../../config/api";
import { useCart } from '../../../context/CartContext';
import { getProductImageUrl, DEFAULT_IMAGE } from '../../../utils/imageUrl';

const API = API_URL;

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkout, setCheckout]   = useState(false);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [msg, setMsg]             = useState({ text: "", type: "" });
  const [procesando, setProcesando] = useState(false);
  const [detalle, setDetalle]     = useState(null);
  const { items: cartItems, addToCart, removeFromCart, cartTotal, refreshFromServer, clearCart } = useCart();

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3500);
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/client/store/productos`).then((r) => r.json()),
    ])
      .then(([prod]) => {
        if (prod.success)  setProductos(prod.data);
        // sincronizar carrito remoto con contexto si es necesario
        refreshFromServer && refreshFromServer();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const agregarAlCarrito = async (producto) => {
    try {
      addToCart(producto);
      flash(`${producto.producto_nombre} agregado al carrito`);
    } catch (_) {
      flash("Error de conexion", "error");
    }
  };

  const eliminarDelCarrito = async (productoId) => {
    try {
      removeFromCart(productoId);
    } catch (_) {}
  };

  const total = cartTotal;

  const pagar = async () => {
    setProcesando(true);
    try {
      const res  = await authFetch(`${API}/api/client/store/carrito/checkout`, {
        method: "POST",
        body: JSON.stringify({ metodo_pago: metodoPago }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        setDrawerOpen(false);
        setCheckout(false);
        flash("Compra registrada correctamente.");
      } else {
        flash(data.message || "Error al procesar la compra.", "error");
      }
    } catch (_) {
      flash("Error de conexion.", "error");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <ClientLayout>
      <section className="client-page-shell">

        {/* Encabezado */}
        <div className="client-page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <p className="client-kicker">Complementos</p>
            <h1>Tienda</h1>
            <p>Adquiere productos complementarios directamente desde tu panel.</p>
          </div>
          <button className="tienda-carrito-btn" onClick={() => setDrawerOpen(true)}>
            Carrito ({cartItems.length})
          </button>
        </div>

        {msg.text && <div className={`tienda-msg ${msg.type}`}>{msg.text}</div>}

        {loading && <div className="client-empty-state">Cargando productos...</div>}

        {!loading && productos.length === 0 && (
          <div className="client-empty-state">No hay productos disponibles en este momento.</div>
        )}

        {!loading && productos.length > 0 && (
          <div className="tienda-grid">
            {productos.map((p) => (
              <article
                key={p.producto_id}
                className="tienda-card"
                style={{ cursor: "pointer" }}
                onClick={() => setDetalle(p)}
              >
                <div className="tienda-card-img">
                  <img
                    src={getProductImageUrl(p.producto_imagen)}
                    alt={p.producto_nombre}
                    onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                  />
                </div>
                <div className="tienda-card-body">
                  <span className="tienda-categoria">{p.categoria_nombre}</span>
                  <h3>{p.producto_nombre}</h3>
                  <p>{p.producto_descripcion}</p>
                  <div className="tienda-card-footer">
                    <strong>${Number(p.producto_precio).toLocaleString("es-CO")}</strong>
                    <button
                      className="tienda-add-btn"
                      onClick={(e) => { e.stopPropagation(); agregarAlCarrito(p); }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Detalle del producto */}
      {detalle && (
        <div className="tienda-detalle-overlay" onClick={() => setDetalle(null)}>
          <div className="tienda-detalle-box" onClick={(e) => e.stopPropagation()}>
            <button className="tienda-detalle-close" onClick={() => setDetalle(null)}>✕</button>
            <div className="tienda-detalle-img">
              <img
                src={getProductImageUrl(detalle.producto_imagen)}
                alt={detalle.producto_nombre}
                onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
              />
            </div>
            <div className="tienda-detalle-info">
              <span className="tienda-categoria">{detalle.categoria_nombre}</span>
              <h2>{detalle.producto_nombre}</h2>
              <p>{detalle.producto_descripcion || "Sin descripcion disponible."}</p>
              <div className="tienda-detalle-meta">
                <span>Stock: {detalle.producto_stock}</span>
              </div>
              <div className="tienda-detalle-footer">
                <strong>${Number(detalle.producto_precio).toLocaleString("es-CO")}</strong>
                <button
                  className="tienda-add-btn"
                  onClick={() => { agregarAlCarrito(detalle); setDetalle(null); }}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer carrito */}
      {drawerOpen && (
        <div className="tienda-drawer-overlay" onClick={() => { setDrawerOpen(false); setCheckout(false); }}>
          <aside className="tienda-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="tienda-drawer-header">
              <h2>Carrito</h2>
              <button onClick={() => { setDrawerOpen(false); setCheckout(false); }}>✕</button>
            </div>

                  {cartItems.length === 0 ? (
              <p className="tienda-drawer-empty">El carrito esta vacio.</p>
            ) : (
              <>
                <ul className="tienda-drawer-list">
                  {cartItems.map((it) => (
                    <li key={it.carrito_id || it.producto_id} className="tienda-drawer-item">
                      <span>{it.nombre || it.producto_nombre}</span>
                      <span>x{it.cantidad}</span>
                      <span>${Number((it.precio || it.producto_precio) * it.cantidad).toLocaleString("es-CO")}</span>
                      <button onClick={() => eliminarDelCarrito(it.producto_id)}>✕</button>
                    </li>
                  ))}
                </ul>

                <div className="tienda-drawer-total">
                  <strong>Total: ${total.toLocaleString("es-CO")}</strong>
                </div>

                {!checkout ? (
                  <button className="tienda-pay-btn" onClick={() => setCheckout(true)}>
                    Proceder al pago
                  </button>
                ) : (
                  <div className="tienda-checkout-form">
                    <label>
                      Metodo de pago
                      <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                        <option>Efectivo</option>
                        <option>Tarjeta debito</option>
                        <option>Tarjeta credito</option>
                        <option>PSE</option>
                      </select>
                    </label>
                    <button className="tienda-pay-btn" onClick={pagar} disabled={procesando}>
                      {procesando ? "Procesando..." : "Confirmar compra"}
                    </button>
                    <button className="tienda-cancel-btn" onClick={() => setCheckout(false)}>
                      Volver
                    </button>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>
      )}
    </ClientLayout>
  );
}
