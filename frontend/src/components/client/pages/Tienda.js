import { useEffect, useState, useCallback } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import "../styles/clientPages.css";
import "../styles/tienda.css";

const API = "http://localhost:3001";

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkout, setCheckout]   = useState(false);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [msg, setMsg]             = useState({ text: "", type: "" });
  const [procesando, setProcesando] = useState(false);
  const [detalle, setDetalle]     = useState(null);

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 3500);
  };

  const cargarCarrito = useCallback(async () => {
    try {
      const res  = await authFetch(`${API}/api/client/store/carrito`);
      const data = await res.json();
      if (data.success) setCarrito(data.data);
    } catch (_) {}
  }, []);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/client/store/productos`).then((r) => r.json()),
      authFetch(`${API}/api/client/store/carrito`).then((r) => r.json()),
    ])
      .then(([prod, cart]) => {
        if (prod.success)  setProductos(prod.data);
        if (cart.success)  setCarrito(cart.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const agregarAlCarrito = async (producto) => {
    try {
      const res  = await authFetch(`${API}/api/client/store/carrito`, {
        method: "POST",
        body: JSON.stringify({ producto_id: producto.producto_id, cantidad: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        await cargarCarrito();
        flash(`${producto.producto_nombre} agregado al carrito`);
      } else {
        flash(data.message || "Error al agregar", "error");
      }
    } catch (_) {
      flash("Error de conexion", "error");
    }
  };

  const eliminarDelCarrito = async (carritoId) => {
    try {
      const res  = await authFetch(`${API}/api/client/store/carrito/${carritoId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setCarrito((prev) => prev.filter((it) => it.carrito_id !== carritoId));
    } catch (_) {}
  };

  const total = carrito.reduce((sum, it) => sum + it.producto_precio * it.cantidad, 0);

  const pagar = async () => {
    setProcesando(true);
    try {
      const res  = await authFetch(`${API}/api/client/store/carrito/checkout`, {
        method: "POST",
        body: JSON.stringify({ metodo_pago: metodoPago }),
      });
      const data = await res.json();
      if (data.success) {
        setCarrito([]);
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
            Carrito ({carrito.length})
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
                    src={p.producto_imagen ? `${API}${p.producto_imagen}` : `${process.env.PUBLIC_URL}/img/img_default.png`}
                    alt={p.producto_nombre}
                    onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/img/img_default.png`; }}
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
                src={detalle.producto_imagen ? `${API}${detalle.producto_imagen}` : `${process.env.PUBLIC_URL}/img/img_default.png`}
                alt={detalle.producto_nombre}
                onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/img/img_default.png`; }}
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

            {carrito.length === 0 ? (
              <p className="tienda-drawer-empty">El carrito esta vacio.</p>
            ) : (
              <>
                <ul className="tienda-drawer-list">
                  {carrito.map((it) => (
                    <li key={it.carrito_id} className="tienda-drawer-item">
                      <span>{it.producto_nombre}</span>
                      <span>x{it.cantidad}</span>
                      <span>${Number(it.producto_precio * it.cantidad).toLocaleString("es-CO")}</span>
                      <button onClick={() => eliminarDelCarrito(it.carrito_id)}>✕</button>
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
