import { useEffect, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import "../styles/clientPages.css";
import "../styles/servicios.css";
import "../styles/tienda.css";

const API = "http://localhost:3001";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(null);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [procesando, setProcesando] = useState(false);
  const [msg, setMsg]             = useState({ text: "", type: "" });

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 4000);
  };

  useEffect(() => {
    authFetch(`${API}/api/client/store/servicios`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setServicios(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const abrirModal = (servicio) => {
    setModal(servicio);
    setMetodoPago("Efectivo");
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
      flash(data.message || (data.success ? "Servicio solicitado." : "Error."), data.success ? "success" : "error");
    } catch (_) {
      setModal(null);
      flash("Error de conexion.", "error");
    } finally {
      setProcesando(false);
    }
  };

  return (
    <ClientLayout>
      <section className="client-page-shell">

        <div className="client-page-header">
          <p className="client-kicker">Acompanamiento</p>
          <h1>Servicios</h1>
          <p>
            Solicita servicios adicionales directamente desde tu panel. Cada solicitud
            queda registrada en tu historial de pagos.
          </p>
        </div>

        {msg.text && <div className={`tienda-msg ${msg.type}`}>{msg.text}</div>}

        {loading && <div className="client-empty-state">Cargando servicios...</div>}

        {!loading && servicios.length === 0 && (
          <div className="client-empty-state">No hay servicios disponibles en este momento.</div>
        )}

        {!loading && servicios.length > 0 && (
          <div className="servicios-grid">
            {servicios.map((s) => (
              <article key={s.servicio_id} className="servicio-card">
                <h3>{s.servicio_nombre}</h3>
                <p>{s.servicio_descripcion || "Servicio disponible para tu plan."}</p>
                <div className="servicio-card-footer">
                  <span>
                    {Number(s.servicio_precio) > 0
                      ? `$${Number(s.servicio_precio).toLocaleString("es-CO")}`
                      : "Incluido en plan"}
                  </span>
                  <button className="tienda-add-btn" onClick={() => abrirModal(s)}>
                    Solicitar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Modal de solicitud */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Solicitar: {modal.servicio_nombre}</h3>
            <p>
              Valor:{" "}
              {Number(modal.servicio_precio) > 0
                ? `$${Number(modal.servicio_precio).toLocaleString("es-CO")}`
                : "Incluido en tu plan"}
            </p>

            <label className="modal-label">
              Metodo de pago
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                <option>Efectivo</option>
                <option>Tarjeta debito</option>
                <option>Tarjeta credito</option>
                <option>PSE</option>
              </select>
            </label>

            <div className="modal-actions">
              <button className="tienda-pay-btn" onClick={solicitar} disabled={procesando}>
                {procesando ? "Procesando..." : "Confirmar solicitud"}
              </button>
              <button className="tienda-cancel-btn" onClick={() => setModal(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
