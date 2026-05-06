import ClientLayout from "../layout/ClientLayout";
import "../styles/clientPages.css";

const sedes = [
  {
    ciudad: "Bogota",
    direccion: "Av. Siempre Viva 145",
    horario: "Lunes a sabado, 8:00 AM – 6:00 PM",
    telefono: "+57 601 123 4567",
    mapQuery: "Bogota+Colombia",
  },
  {
    ciudad: "Medellin",
    direccion: "Cra. Central 24 - 18",
    horario: "Lunes a viernes, 8:00 AM – 5:30 PM",
    telefono: "+57 604 234 5678",
    mapQuery: "Medellin+Colombia",
  },
  {
    ciudad: "Cali",
    direccion: "Calle 10 Norte 32 - 11",
    horario: "Lunes a sabado, 9:00 AM – 6:00 PM",
    telefono: "+57 602 345 6789",
    mapQuery: "Cali+Colombia",
  },
];

export default function Sedes() {
  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Atencion presencial</p>
          <h1>Sedes</h1>
          <p>
            Acercate a cualquiera de nuestras sedes para completar pagos, firmar contratos
            o recibir acompanamiento personalizado.
          </p>
        </div>

        <div className="sedes-grid">
          {sedes.map((sede) => (
            <article className="sede-card" key={sede.ciudad}>
              <div className="sede-map-wrapper">
                <iframe
                  title={`Mapa ${sede.ciudad}`}
                  src={`https://www.google.com/maps?q=${sede.mapQuery}&output=embed`}
                  width="100%"
                  height="220"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="sede-body">
                <div className="sede-header">
                  <span className="sede-icon">📍</span>
                  <h3>{sede.ciudad}</h3>
                </div>

                <div className="sede-details">
                  <div className="sede-detail-row">
                    <span className="sede-detail-label">Direccion</span>
                    <span>{sede.direccion}</span>
                  </div>
                  <div className="sede-detail-row">
                    <span className="sede-detail-label">Horario</span>
                    <span>{sede.horario}</span>
                  </div>
                  <div className="sede-detail-row">
                    <span className="sede-detail-label">Telefono</span>
                    <span>{sede.telefono}</span>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(sede.direccion + " " + sede.ciudad + " Colombia")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sede-maps-btn"
                >
                  Abrir en Google Maps
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </ClientLayout>
  );
}
