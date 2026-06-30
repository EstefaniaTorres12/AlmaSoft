import { useEffect, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import { formatPrice } from "../../../utils/formatters";
import "../styles/clientPages.css";
import "../styles/servicios.css";
import { API_URL } from "../../../config/api";

const API = API_URL;

const PAYMENT_METHODS = [
  { value: "Efectivo",        label: "Efectivo",         sub: "Pago en sede" },
  { value: "Tarjeta debito",  label: "Tarjeta debito",   sub: "Pago electronico" },
  { value: "Tarjeta credito", label: "Tarjeta credito",  sub: "Cuotas disponibles" },
  { value: "PSE",             label: "PSE",              sub: "Transferencia online" },
];

function isIncluded(precio) {
  return !Number(precio);
}

function SkeletonCard() {
  return <div className="sv-skeleton-card" aria-hidden="true" />;
}

export default function Servicios() {
  const [servicios, setServicios]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [modal, setModal]             = useState(null);
  const [metodoPago, setMetodoPago]   = useState("Efectivo");
  const [procesando, setProcesando]   = useState(false);
  const [msg, setMsg]                 = useState({ text: "", type: "" });

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 5000);
  };

  useEffect(() => {
    authFetch(`${API}/api/client/store/servicios`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setServicios(data.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const abrirModal = (servicio) => {
    setModal(servicio);
    setMetodoPago("Efectivo");
  };

  const cerrarModal = () => {
    if (!procesando) setModal(null);
  };

  const solicitar = async () => {
    if (!modal) return;
    setProcesando(true);
    try {
      const res  = await authFetch(`${API}/api/client/store/servicios/solicitar`, {
        method: "POST",
        body: JSON.stringify({ servicio_id: modal.servicio_id, metodo_pago: metodoPago }),
      });
      const data = await res.json();
      setModal(null);
      flash(
        data.message || (data.success ? "Solicitud registrada correctamente." : "No se pudo procesar la solicitud."),
        data.success ? "success" : "error"
      );
    } catch {
      setModal(null);
      flash("Error de conexion. Intenta nuevamente.", "error");
    } finally {
      setProcesando(false);
    }
  };

  const totalIncluidos = servicios.filter((s) => isIncluded(s.servicio_precio)).length;
  const totalAdicionales = servicios.length - totalIncluidos;
  const modalPrecio = modal ? formatPrice(modal.servicio_precio) : null;

  return (
    <ClientLayout>
      <section className="client-page-shell sv-shell">

        {/* ── Cabecera ──────────────────────────────────────────────── */}
        <div className="sv-page-header">
          <div className="sv-header-text">
            <p className="client-kicker">Acompanamiento integral</p>
            <h1>Servicios</h1>
            <p>
              Solicita servicios adicionales directamente desde tu panel.
              Cada solicitud queda registrada en tu historial de pagos.
            </p>
          </div>

          {!loading && servicios.length > 0 && (
            <div className="sv-header-stats">
              <div className="sv-stat">
                <strong>{servicios.length}</strong>
                <span>disponibles</span>
              </div>
              {totalIncluidos > 0 && (
                <div className="sv-stat sv-stat-green">
                  <strong>{totalIncluidos}</strong>
                  <span>en tu plan</span>
                </div>
              )}
              {totalAdicionales > 0 && (
                <div className="sv-stat sv-stat-purple">
                  <strong>{totalAdicionales}</strong>
                  <span>adicionales</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Feedback ──────────────────────────────────────────────── */}
        {msg.text && (
          <div className={`sv-feedback ${msg.type}`} role="alert">
            <span className="sv-feedback-icon">{msg.type === "success" ? "✓" : "!"}</span>
            {msg.text}
          </div>
        )}

        {/* ── Skeleton ──────────────────────────────────────────────── */}
        {loading && (
          <div className="sv-skeleton-list">
            {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
          </div>
        )}

        {/* ── Estado vacío ──────────────────────────────────────────── */}
        {!loading && servicios.length === 0 && (
          <div className="sv-empty">
            <div className="sv-empty-icon">🕊</div>
            <h3>Sin servicios disponibles</h3>
            <p>En este momento no hay servicios configurados. Vuelve pronto.</p>
          </div>
        )}

        {/* ── Lista de servicios ────────────────────────────────────── */}
        {!loading && servicios.length > 0 && (
          <div className="sv-list">
            {servicios.map((s, i) => {
              const incluido = isIncluded(s.servicio_precio);
              const precio   = formatPrice(s.servicio_precio);
              return (
                <article
                  key={s.servicio_id}
                  className={`sv-card ${incluido ? "sv-card-included" : "sv-card-paid"}`}
                >
                  <div className="sv-card-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="sv-card-body">
                    <div className="sv-card-title-row">
                      <h3 className="sv-card-name">{s.servicio_nombre}</h3>
                      {incluido ? (
                        <span className="sv-badge sv-badge-included">Incluido en plan</span>
                      ) : (
                        <span className="sv-badge sv-badge-paid">{precio}</span>
                      )}
                    </div>
                    {s.servicio_descripcion && (
                      <p className="sv-card-desc">{s.servicio_descripcion}</p>
                    )}
                  </div>

                  <div className="sv-card-action">
                    <button
                      className={`sv-btn ${incluido ? "sv-btn-ghost" : "sv-btn-solid"}`}
                      onClick={() => abrirModal(s)}
                    >
                      Solicitar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Modal de solicitud ────────────────────────────────────── */}
      {modal && (
        <div className="sv-modal-overlay" onClick={cerrarModal}>
          <div className="sv-modal" onClick={(e) => e.stopPropagation()} role="dialog">

            <button className="sv-modal-close" onClick={cerrarModal} disabled={procesando}>
              ✕
            </button>

            <div className="sv-modal-hero">
              <div className={`sv-modal-index ${modalPrecio ? "paid" : "included"}`}>
                {String(servicios.findIndex((s) => s.servicio_id === modal.servicio_id) + 1).padStart(2, "0")}
              </div>
              <div>
                <h2 className="sv-modal-title">{modal.servicio_nombre}</h2>
                {modalPrecio ? (
                  <p className="sv-modal-price">{modalPrecio}</p>
                ) : (
                  <p className="sv-modal-price sv-modal-price-free">Incluido en tu plan</p>
                )}
              </div>
            </div>

            {modal.servicio_descripcion && (
              <p className="sv-modal-desc">{modal.servicio_descripcion}</p>
            )}

            <div className="sv-modal-section">
              <p className="sv-modal-label">Metodo de pago</p>
              <div className="sv-payment-grid">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    className={`sv-payment-card ${metodoPago === method.value ? "is-selected" : ""}`}
                    onClick={() => setMetodoPago(method.value)}
                  >
                    <strong>{method.label}</strong>
                    <span>{method.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sv-modal-actions">
              <button
                className="sv-modal-confirm"
                onClick={solicitar}
                disabled={procesando}
              >
                {procesando ? (
                  <><span className="sv-spinner" />Procesando...</>
                ) : (
                  "Confirmar solicitud"
                )}
              </button>
              <button
                className="sv-modal-cancel"
                onClick={cerrarModal}
                disabled={procesando}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
