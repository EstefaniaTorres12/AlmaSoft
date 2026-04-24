import ClientLayout from "../layout/ClientLayout";
import "../styles/clientPages.css";

export default function Tienda() {
  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Complementos</p>
          <h1>Tienda</h1>
          <p>
            Un entorno mas profesional para mostrar productos y servicios
            complementarios relacionados con la experiencia AlmaSoft.
          </p>
        </div>
        <div className="client-info-grid">
          <article className="client-info-card">
            <h3>Catalogo destacado</h3>
            <p>Muestra productos funerarios con mejor jerarquia visual y fotografia.</p>
          </article>
          <article className="client-info-card">
            <h3>Recomendaciones</h3>
            <p>Seccion ideal para paquetes sugeridos o complementos por plan.</p>
          </article>
          <article className="client-info-card">
            <h3>Experiencia visual</h3>
            <p>La pagina ya queda alineada con la identidad del panel cliente.</p>
          </article>
        </div>
      </section>
    </ClientLayout>
  );
}
