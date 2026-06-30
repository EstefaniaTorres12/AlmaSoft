import { useEffect, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import { formatFecha } from "../../../utils/formatters";
import { clasificarPago, parsePagoMetodo } from "../../../utils/payments";
import "../styles/clientPages.css";
import "../styles/tienda.css";
import { API_URL } from "../../../config/api";

const API = API_URL;

export default function Pagos() {
  const [pagos, setPagos]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    authFetch(`${API}/api/client/store/pagos/historial`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPagos(data.data);
        else setError(data.message || "No fue posible cargar el historial.");
      })
      .catch(() => setError("Error al cargar el historial."))
      .finally(() => setLoading(false));
  }, []);

  const totalTienda   = pagos.filter((p) => p.pago_metodo?.toLowerCase().startsWith("tienda")).length;
  const totalServicio = pagos.filter((p) => p.pago_metodo?.toLowerCase().startsWith("servicio")).length;
  const totalPlan     = pagos.length - totalTienda - totalServicio;

  return (
    <ClientLayout>
      <section className="client-page-shell">

        <div className="client-page-header">
          <p className="client-kicker">Seguimiento financiero</p>
          <h1>Pagos</h1>
          <p>Historial completo: plan, productos comprados y servicios solicitados.</p>
        </div>

        {loading && <div className="client-empty-state">Cargando historial...</div>}
        {!loading && error && <div className="client-empty-state">{error}</div>}

        {!loading && !error && pagos.length === 0 && (
          <div className="client-empty-state">No tienes pagos registrados aún.</div>
        )}

        {!loading && !error && pagos.length > 0 && (
          <>
            {/* Resumen */}
            <div className="client-info-grid" style={{ marginBottom: "22px" }}>
              <article className="client-info-card">
                <h3>Total de registros</h3>
                <strong style={{ display: "block", fontSize: "2rem", color: "#342157", marginTop: "6px" }}>
                  {pagos.length}
                </strong>
              </article>
              <article className="client-info-card">
                <h3>Pagos de plan</h3>
                <strong style={{ display: "block", fontSize: "2rem", color: "#2e7b59", marginTop: "6px" }}>
                  {totalPlan}
                </strong>
              </article>
              <article className="client-info-card">
                <h3>Compras en tienda</h3>
                <strong style={{ display: "block", fontSize: "2rem", color: "#3a7bd5", marginTop: "6px" }}>
                  {totalTienda}
                </strong>
              </article>
              <article className="client-info-card">
                <h3>Servicios solicitados</h3>
                <strong style={{ display: "block", fontSize: "2rem", color: "#6a5acd", marginTop: "6px" }}>
                  {totalServicio}
                </strong>
              </article>
            </div>

            {/* Historial */}
            <section className="client-info-card payments-shell">
              <h3>Historial completo</h3>
              <div className="plan-payments-list">
                {pagos.map((p) => {
                  const tipo   = clasificarPago(p.pago_metodo);
                  const parsed = parsePagoMetodo(p.pago_metodo);
                  return (
                    <article key={p.pago_id} className="plan-payment-item payment-item-stacked">
                      <div className="plan-payment-copy">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          <span
                            style={{
                              padding: "3px 12px",
                              borderRadius: "20px",
                              background: tipo.bg,
                              color: tipo.color,
                              fontWeight: 700,
                              fontSize: "0.78rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {tipo.label}
                          </span>

                          {parsed.tipo === "tienda" && (
                            <strong style={{ color: "#2f1d57", fontSize: "0.9rem" }}>
                              {parsed.metodo}
                              {parsed.total ? ` · ${parsed.total}` : ""}
                            </strong>
                          )}
                          {parsed.tipo === "servicio" && (
                            <strong style={{ color: "#2f1d57", fontSize: "0.9rem" }}>
                              {parsed.nombre}
                            </strong>
                          )}
                          {parsed.tipo === "plan" && (
                            <strong style={{ color: "#2f1d57", fontSize: "0.9rem" }}>
                              {p.plan_nombre || "Pago de plan"}
                            </strong>
                          )}
                        </div>

                        {parsed.tipo === "tienda" && parsed.productos && (
                          <span style={{ fontSize: "0.85rem", color: "#555" }}>
                            {parsed.productos}
                          </span>
                        )}
                        {parsed.tipo === "servicio" && (
                          <span style={{ fontSize: "0.85rem", color: "#555" }}>
                            Método: {parsed.metodo}
                            {parsed.total ? ` · ${parsed.total}` : ""}
                          </span>
                        )}
                        {p.plan_nombre && parsed.tipo !== "plan" && (
                          <span style={{ fontSize: "0.8rem", color: "#888" }}>
                            Plan: {p.plan_nombre}
                          </span>
                        )}
                      </div>
                      <span style={{ whiteSpace: "nowrap", color: "#6f6789", fontSize: "0.9rem" }}>
                        {formatFecha(p.pago_fecha)}
                      </span>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </section>
    </ClientLayout>
  );
}
