import ClientLayout from "../layout/ClientLayout";
import "../styles/clientPages.css";

export default function Contrato() {
  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Documentacion</p>
          <h1>Contrato</h1>
          <p>
            Consulta el estado de tu contrato y centraliza la informacion
            asociada al plan que hayas adquirido.
          </p>
        </div>
        <div className="client-info-grid">
          <article className="client-info-card">
            <h3>Estado contractual</h3>
            <p>Visualizacion del estado del contrato, fecha y valor pactado.</p>
          </article>
          <article className="client-info-card">
            <h3>Soportes</h3>
            <p>Espacio preparado para anexos, constancias y documentos clave.</p>
          </article>
          <article className="client-info-card">
            <h3>Seguimiento</h3>
            <p>Diseno listo para crecer con historial y observaciones administrativas.</p>
          </article>
        </div>
      </section>
    </ClientLayout>
  );
}
