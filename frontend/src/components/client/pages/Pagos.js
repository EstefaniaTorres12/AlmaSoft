import ClientLayout from "../layout/ClientLayout";
import "../styles/clientPages.css";

export default function Pagos() {
  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Seguimiento financiero</p>
          <h1>Pagos</h1>
          <p>
            Espacio reservado para mostrar historial, estado del pago y medios
            utilizados por el cliente.
          </p>
        </div>
        <div className="client-info-grid">
          <article className="client-info-card">
            <h3>Pagos digitales</h3>
            <p>PSE y tarjeta podran verse con su referencia y resumen del canal usado.</p>
          </article>
          <article className="client-info-card">
            <h3>Pago en sede</h3>
            <p>Los pagos en efectivo podran mostrar su fecha limite y confirmacion.</p>
          </article>
          <article className="client-info-card">
            <h3>Historial</h3>
            <p>La interfaz ya esta preparada para crecer con una tabla o timeline.</p>
          </article>
        </div>
      </section>
    </ClientLayout>
  );
}
