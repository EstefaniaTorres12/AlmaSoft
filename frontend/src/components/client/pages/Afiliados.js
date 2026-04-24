import ClientLayout from "../layout/ClientLayout";
import "../styles/clientPages.css";

export default function Afiliados() {
  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Grupo familiar</p>
          <h1>Afiliados</h1>
          <p>
            Este espacio esta listo para mostrar las personas vinculadas al plan
            del cliente con una presentacion clara y profesional.
          </p>
        </div>
        <div className="client-info-grid">
          <article className="client-info-card">
            <h3>Titular principal</h3>
            <p>Identifica quien lidera la afiliacion y el tipo de cobertura.</p>
          </article>
          <article className="client-info-card">
            <h3>Beneficiarios</h3>
            <p>Relacion de afiliados con estado, parentesco y observaciones importantes.</p>
          </article>
          <article className="client-info-card">
            <h3>Actualizaciones</h3>
            <p>Proximamente podras agregar o editar afiliados desde este panel.</p>
          </article>
        </div>
      </section>
    </ClientLayout>
  );
}
