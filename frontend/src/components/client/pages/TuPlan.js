import { useEffect, useState, useCallback } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import { getPlanVisual } from "../data/clientPlanVisuals";
import "../styles/clientPages.css";

const API = "http://localhost:3001";

async function parseJsonSafe(response) {
  const raw = await response.text();
  try {
    return JSON.parse(raw);
  } catch {
    if (raw.trim().startsWith("<!DOCTYPE")) {
      throw new Error("El servidor devolvio HTML en lugar de JSON. Reinicia el backend.");
    }
    throw new Error("Respuesta del servidor con formato invalido.");
  }
}

function formatPrice(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return value || "No disponible";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(number);
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-CO");
}

function formatPaymentLabel(payment) {
  if (!payment) return "Sin informacion";
  if (payment.pago_tipo_tarjeta && payment.pago_entidad) {
    return `${payment.pago_tipo_tarjeta === "credito" ? "Tarjeta credito" : "Tarjeta debito"} - ${payment.pago_entidad}`;
  }
  if (payment.pago_entidad) return `${payment.pago_metodo} - ${payment.pago_entidad}`;
  return payment.pago_metodo;
}

export default function TuPlan() {
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [planData, setPlanData]       = useState(null);
  const [sinPlanActivo, setSinPlanActivo] = useState(false);

  const [planes, setPlanes]           = useState([]);
  const [modalMejora, setModalMejora]       = useState(false);
  const [planSel, setPlanSel]               = useState(null);
  const [metodoPagoMejora, setMetodoPagoMejora] = useState("");
  const [procesando, setProcesando]         = useState(false);

  const [modalCancelar, setModalCancelar]   = useState(false);
  const [cancelando, setCancelando]         = useState(false);
  const [errorCancelar, setErrorCancelar]   = useState("");

  const [msg, setMsg]                 = useState({ text: "", type: "" });

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "" }), 5000);
  };

  const cargarPlan = useCallback(() => {
    setLoading(true);
    setSinPlanActivo(false);
    setError("");
    authFetch(`${API}/api/client/contrato/mine`)
      .then(async (r) => {
        const data = await parseJsonSafe(r);
        if (r.status === 404) {
          setSinPlanActivo(true);
          return null;
        }
        if (!r.ok || !data.success) throw new Error(data.message || "No se pudo cargar el plan");
        return data.data;
      })
      .then((data) => { if (data) setPlanData(data); })
      .catch((err) => { setPlanData(null); setError(err.message || "No fue posible cargar el plan."); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { cargarPlan(); }, [cargarPlan]);

  const abrirModalMejora = async () => {
    try {
      const res  = await authFetch(`${API}/api/client/contrato/planes`);
      const data = await res.json();
      if (data.success) {
        setPlanes(data.data);
        setPlanSel(null);
        setMetodoPagoMejora("");
        setModalMejora(true);
      }
    } catch (_) {
      flash("No se pudo cargar la lista de planes.", "error");
    }
  };

  const confirmarMejora = async () => {
    if (!planSel) return;
    if (!metodoPagoMejora) {
      flash("Selecciona un metodo de pago para continuar.", "error");
      return;
    }
    setProcesando(true);
    try {
      const res  = await authFetch(`${API}/api/client/contrato/mejorar`, {
        method: "PUT",
        body: JSON.stringify({ plan_id: planSel, metodo_pago: metodoPagoMejora }),
      });
      const data = await res.json();
      if (data.success) {
        setModalMejora(false);
        setMetodoPagoMejora("");
        flash(data.message, "success");
        cargarPlan();
      } else {
        flash(data.message || "Error al mejorar el plan.", "error");
      }
    } catch (_) {
      setModalMejora(false);
      flash("Error de conexion.", "error");
    } finally {
      setProcesando(false);
    }
  };

  const confirmarCancelar = async () => {
    setCancelando(true);
    setErrorCancelar("");
    try {
      const res  = await authFetch(`${API}/api/client/contrato/cancelar`, { method: "PATCH" });
      const data = await res.json();
      if (data.success) {
        setModalCancelar(false);
        flash(data.message, "success");
        cargarPlan();
      } else {
        setErrorCancelar(data.message || "No se pudo cancelar el plan.");
      }
    } catch (_) {
      setErrorCancelar("Error de conexion. Intenta nuevamente.");
    } finally {
      setCancelando(false);
    }
  };

  const visual = getPlanVisual(planData);
  const planActivo = planData && Number(planData.contrato_estado) === 1;

  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Resumen personal</p>
          <h1>Tu plan</h1>
          <p>Aqui puedes revisar el plan adquirido, los servicios incluidos y los pagos registrados.</p>
        </div>

        {msg.text && <div className={`plan-msg ${msg.type}`}>{msg.text}</div>}

        {loading ? (
          <div className="client-empty-state">Cargando informacion del plan...</div>
        ) : sinPlanActivo ? (
          <div className="client-empty-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <p style={{ fontSize: "1.1rem", color: "#6f6789" }}>No tienes un plan activo en este momento.</p>
            <a href="/client" className="client-primary-button" style={{ textDecoration: "none", padding: "12px 28px", borderRadius: "14px" }}>
              Volver a adquirir un plan
            </a>
          </div>
        ) : error ? (
          <div className="client-empty-state">{error}</div>
        ) : !planData ? (
          <div className="client-empty-state">No se encontro informacion del plan.</div>
        ) : (
          <div className="plan-detail-layout">
            <section className={`client-plan-card accent-${visual.accent} plan-detail-hero`}>
              <div className="client-plan-media">
                <img src={visual.image} alt={planData.plan_nombre} />
                <span className="client-plan-badge">{visual.badge}</span>
              </div>

              <div className="client-plan-body">
                <div className="client-plan-topline">
                  <h3>{planData.plan_nombre}</h3>
                  <strong>{formatPrice(planData.plan_precio)}</strong>
                </div>

                <p className="client-plan-summary">{visual.summary}</p>
                <p className="client-plan-description">
                  {planData.plan_descripcion || "Sin descripcion registrada."}
                </p>

                <div className="plan-detail-metrics">
                  <article className="client-info-card">
                    <h3>Contrato</h3>
                    <p>ID: {planData.contrato_id}</p>
                    <p>Estado: {planActivo ? "Activo" : "Inactivo"}</p>
                  </article>
                  <article className="client-info-card">
                    <h3>Valor del contrato</h3>
                    <p>{formatPrice(planData.contrato_valor)}</p>
                  </article>
                </div>

                {planActivo && (
                  <div className="plan-actions">
                    <button className="plan-btn-upgrade" onClick={abrirModalMejora}>
                      Mejorar plan
                    </button>
                    <button className="plan-btn-cancel" onClick={() => setModalCancelar(true)}>
                      Cancelar plan
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="plan-detail-grid">
              <article className="client-info-card">
                <h3>Servicios incluidos</h3>
                {planData.servicios?.length ? (
                  <ul className="plan-detail-list">
                    {planData.servicios.map((s) => (
                      <li key={s.servicio_id}>{s.servicio_nombre}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay servicios asociados a este plan.</p>
                )}
              </article>

              <article className="client-info-card">
                <h3>Productos del plan</h3>
                {planData.productos?.length ? (
                  <ul className="plan-detail-list">
                    {planData.productos.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay productos configurados para este plan.</p>
                )}
              </article>
            </section>

            <section className="client-info-card">
              <h3>Pagos registrados</h3>
              {planData.pagos?.length ? (
                <div className="plan-payments-list">
                  {planData.pagos.map((pago) => (
                    <article className="plan-payment-item" key={pago.pago_id}>
                      <div className="plan-payment-copy">
                        <strong>{formatPaymentLabel(pago)}</strong>
                        <span>Referencia: {pago.pago_referencia || "No disponible"}</span>
                        <span>Estado: {pago.pago_estado || "Registrado"}</span>
                        {pago.pago_fecha_limite && (
                          <span>Fecha limite: {formatDate(pago.pago_fecha_limite)}</span>
                        )}
                      </div>
                      <span>{formatDate(pago.pago_fecha)}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <p>No hay pagos registrados para este contrato.</p>
              )}
            </section>
          </div>
        )}
      </section>

      {/* Modal mejorar plan */}
      {modalMejora && (
        <div className="plan-modal-overlay" onClick={() => setModalMejora(false)}>
          <div className="plan-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Mejorar plan</h3>
            <p>Selecciona el nuevo plan y registra el pago correspondiente.</p>
            <div className="plan-modal-plans">
              {planes.filter((p) => p.plan_id !== planData?.plan_id && p.plan_precio > (planData?.plan_precio || 0)).map((p) => (
                <button
                  key={p.plan_id}
                  className={`plan-modal-option ${planSel === p.plan_id ? "selected" : ""}`}
                  onClick={() => setPlanSel(p.plan_id)}
                >
                  <strong>{p.plan_nombre}</strong>
                  <span>{formatPrice(p.plan_precio)}</span>
                  {p.plan_descripcion && <small>{p.plan_descripcion}</small>}
                </button>
              ))}
              {planes.filter((p) => p.plan_id !== planData?.plan_id && p.plan_precio > (planData?.plan_precio || 0)).length === 0 && (
                <p style={{ color: "#6f6789", fontSize: "0.9rem" }}>No hay planes de mayor valor disponibles.</p>
              )}
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600 }}>
                Metodo de pago
              </label>
              <select
                value={metodoPagoMejora}
                onChange={(e) => setMetodoPagoMejora(e.target.value)}
                className="plan-select"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
              >
                <option value="">Selecciona un metodo</option>
                <option value="pse">PSE</option>
                <option value="debito">Tarjeta debito</option>
                <option value="credito">Tarjeta credito</option>
                <option value="efectivo">Efectivo en sede</option>
              </select>
            </div>

            <div className="plan-modal-actions">
              <button className="client-secondary-button" onClick={() => setModalMejora(false)}>
                Cancelar
              </button>
              <button
                className="client-primary-button"
                onClick={confirmarMejora}
                disabled={!planSel || !metodoPagoMejora || procesando}
              >
                {procesando ? "Procesando pago..." : "Confirmar y pagar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cancelar plan */}
      {modalCancelar && (
        <div className="plan-modal-overlay" onClick={() => { setModalCancelar(false); setErrorCancelar(""); }}>
          <div className="plan-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Cancelar plan</h3>
            <p>
              Esta accion desactivara tu contrato. Solo puedes cancelar si estas a paz y salvo con tus pagos.
            </p>
            {errorCancelar && (
              <div style={{ background: "#fdecea", color: "#c0392b", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem", fontSize: "0.9rem" }}>
                {errorCancelar}
              </div>
            )}
            <div className="plan-modal-actions">
              <button className="client-secondary-button" onClick={() => { setModalCancelar(false); setErrorCancelar(""); }}>
                Volver
              </button>
              <button
                className="plan-btn-cancel"
                onClick={confirmarCancelar}
                disabled={cancelando}
                style={{ border: "none", background: "#c0392b", color: "#fff", borderRadius: "14px", padding: "12px 24px" }}
              >
                {cancelando ? "Cancelando..." : "Si, cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
}
