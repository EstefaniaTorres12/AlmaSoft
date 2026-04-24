import ClientLayout from "../layout/ClientLayout";
import "../styles/clientPages.css";

const sedes = [
  { ciudad: "Bogota", direccion: "Av. Siempre Viva 145", horario: "Lunes a sabado, 8:00 AM - 6:00 PM" },
  { ciudad: "Medellin", direccion: "Cra. Central 24 - 18", horario: "Lunes a viernes, 8:00 AM - 5:30 PM" },
  { ciudad: "Cali", direccion: "Calle 10 Norte 32 - 11", horario: "Lunes a sabado, 9:00 AM - 6:00 PM" },
];

export default function Sedes() {
  return (
    <ClientLayout>
      <section className="client-page-shell">
        <div className="client-page-header">
          <p className="client-kicker">Atencion presencial</p>
          <h1>Sedes</h1>
          <p>
            Informacion clara para acercarte a una sede cuando debas completar pagos
            o recibir acompanamiento.
          </p>
        </div>
        <div className="client-info-grid">
          {sedes.map((sede) => (
            <article className="client-info-card" key={sede.ciudad}>
              <h3>{sede.ciudad}</h3>
              <p>{sede.direccion}</p>
              <p>{sede.horario}</p>
            </article>
          ))}
        </div>
      </section>
    </ClientLayout>
  );
}
