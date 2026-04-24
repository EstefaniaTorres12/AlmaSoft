import { useEffect, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import { getPlanVisual } from "../data/clientPlanVisuals";
import "../styles/clientPages.css";

async function parseJsonResponse(response) {
  const rawText = await response.text();

  try {
    return JSON.parse(rawText);
  } catch {
    if (rawText.trim().startsWith("<!DOCTYPE")) {
      throw new Error(
        "El servidor devolvio una pagina HTML en lugar de JSON. Reinicia el backend para cargar la ruta de tu plan."
      );
    }

    throw new Error("La respuesta del servidor no tuvo un formato valido.");
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

export default function TuPlan() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planData, setPlanData] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:3001/api/client/contrato/mine")
      .then(async (response) => {
        const data = await parseJsonResponse(response);

        if (!response.ok || !data.success) {
          throw new Error(data.message || "No se pudo cargar el plan del cliente");
        }

        return data.data;
      })
      .then((data) => {
        setPlanData(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setPlanData(null);
        setError(err.message || "No fue posible cargar el plan.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const visual = getPlanVisual(planData);

  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Resumen personal</p>
          <h1>Tu plan</h1>
          <p>
            Aqui puedes revisar el plan adquirido, lo que incluye y los pagos
            registrados para tu contrato.
          </p>
        </div>

        {loading ? (
          <div className="client-empty-state">Cargando informacion del plan...</div>
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
                    <p>Estado: {Number(planData.contrato_estado) === 1 ? "Activo" : "Inactivo"}</p>
                  </article>
                  <article className="client-info-card">
                    <h3>Valor del contrato</h3>
                    <p>{formatPrice(planData.contrato_valor)}</p>
                  </article>
                </div>
              </div>
            </section>

            <section className="plan-detail-grid">
              <article className="client-info-card">
                <h3>Servicios incluidos</h3>
                {planData.servicios?.length ? (
                  <ul className="plan-detail-list">
                    {planData.servicios.map((servicio) => (
                      <li key={servicio.servicio_id}>{servicio.servicio_nombre}</li>
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
                    {planData.productos.map((producto) => (
                      <li key={producto}>{producto}</li>
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
                      <strong>{pago.pago_metodo}</strong>
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
    </ClientLayout>
  );
}
