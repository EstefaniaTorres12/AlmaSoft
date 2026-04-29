import { useEffect, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import "../styles/clientPages.css";

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-CO");
}

function paymentChannel(payment) {
  if (payment.pago_tipo_tarjeta) {
    return `Tarjeta ${payment.pago_tipo_tarjeta}`;
  }

  if (payment.pago_entidad) {
    return payment.pago_entidad;
  }

  if ((payment.pago_metodo || "").toLowerCase().includes("efectivo")) {
    return "Pago en sede";
  }

  return "Canal registrado";
}

export default function Pagos() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planData, setPlanData] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:3001/api/client/contrato/mine")
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 404) {
          return null;
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || "No fue posible cargar los pagos.");
        }

        return data.data;
      })
      .then((data) => {
        setPlanData(data);
        setError("");
      })
      .catch((requestError) => {
        console.error(requestError);
        setPlanData(null);
        setError(requestError.message || "No fue posible consultar los pagos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const payments = planData?.pagos || [];

  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Seguimiento financiero</p>
          <h1>Pagos</h1>
          <p>
            Consulta las referencias registradas para tu plan, el estado de cada pago y el canal utilizado para la
            compra.
          </p>
        </div>

        {loading ? <div className="client-empty-state">Cargando pagos...</div> : null}

        {!loading && error ? <div className="client-empty-state">{error}</div> : null}

        {!loading && !error && !planData ? (
          <div className="client-empty-state">Aun no tienes un plan adquirido con pagos registrados.</div>
        ) : null}

        {!loading && !error && planData ? (
          <>
            <div className="client-info-grid">
              <article className="client-info-card">
                <h3>Plan asociado</h3>
                <p>{planData.plan_nombre}</p>
              </article>
              <article className="client-info-card">
                <h3>Contrato</h3>
                <p>#{planData.contrato_id}</p>
              </article>
              <article className="client-info-card">
                <h3>Total de registros</h3>
                <p>{payments.length}</p>
              </article>
            </div>

            <section className="client-info-card payments-shell">
              <h3>Historial registrado</h3>
              {payments.length ? (
                <div className="plan-payments-list">
                  {payments.map((payment) => (
                    <article className="plan-payment-item payment-item-stacked" key={payment.pago_id}>
                      <div className="plan-payment-copy">
                        <strong>{payment.pago_metodo}</strong>
                        <span>Canal: {paymentChannel(payment)}</span>
                        <span>Referencia: {payment.pago_referencia || "No disponible"}</span>
                        <span>Estado: {payment.pago_estado || "Registrado"}</span>
                        {payment.pago_fecha_limite ? (
                          <span>Fecha limite: {formatDate(payment.pago_fecha_limite)}</span>
                        ) : null}
                        {payment.pago_observacion ? <span>{payment.pago_observacion}</span> : null}
                      </div>
                      <span>{formatDate(payment.pago_fecha)}</span>
                    </article>
                  ))}
                </div>
              ) : (
                <p>No hay pagos registrados para este contrato.</p>
              )}
            </section>
          </>
        ) : null}
      </section>
    </ClientLayout>
  );
}
