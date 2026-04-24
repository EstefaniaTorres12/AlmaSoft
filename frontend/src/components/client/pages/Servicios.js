import ClientLayout from "../layout/ClientLayout";
import "../styles/clientPages.css";

export default function Servicios() {
  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Acompanamiento</p>
          <h1>Servicios</h1>
          <p>
            Una vista mas ordenada para listar ayuda, soporte y orientacion
            disponible para el cliente.
          </p>
        </div>
        <div className="client-info-grid">
          <article className="client-info-card">
            <h3>Orientacion</h3>
            <p>Soporte para tomar decisiones con informacion clara y acompanamiento.</p>
          </article>
          <article className="client-info-card">
            <h3>Atencion humana</h3>
            <p>Canal pensado para contacto, dudas y seguimiento operativo.</p>
          </article>
          <article className="client-info-card">
            <h3>Gestion</h3>
            <p>Base visual lista para agregar formularios, PQRS o contacto directo.</p>
          </article>
        </div>
      </section>
    </ClientLayout>
  );
}
