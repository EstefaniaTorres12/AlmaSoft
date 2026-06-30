import { useEffect, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import "../styles/clientPages.css";
import "../styles/contrato.css";
import { API_URL } from "../../../config/api";

const API = API_URL;

function formatFecha(value) {
  if (!value) return "No disponible";
  return new Date(value).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function describePago(pago_metodo) {
  if (!pago_metodo) return "Sin descripción";
  const partes = pago_metodo.split(" | ");
  const prefix = (partes[0] || "").toLowerCase().trim();
  if (prefix === "tienda") {
    return [partes[1], partes[2], partes[3]].filter(Boolean).join(" · ") || "Compra en tienda";
  }
  if (prefix === "servicio") {
    return [partes[1], partes[2], partes[3]].filter(Boolean).join(" · ") || "Servicio adicional";
  }
  return pago_metodo || "Pago de plan";
}

export default function Contrato() {
  const [contrato, setContrato]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [sinContrato, setSinContrato] = useState(false);

  useEffect(() => {
    authFetch(`${API}/api/client/contrato/mine`)
      .then(async (r) => {
        const data = await r.json();
        if (r.status === 404) { setSinContrato(true); return; }
        if (data.success) setContrato(data.data);
        else setError(data.message || "No se encontró un contrato activo.");
      })
      .catch(() => setError("No fue posible cargar el contrato."))
      .finally(() => setLoading(false));
  }, []);

  const descargarPDF = () => {
    if (!contrato) return;

    const nombreCompleto = [
      contrato.usuario_primer_nombre,
      contrato.usuario_segundo_nombre,
      contrato.usuario_primer_apellido,
      contrato.usuario_segundo_apellido,
    ].filter(Boolean).join(" ") || contrato.usuario_correo || "No registrado";

    const fechaActual = new Date().toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const serviciosHtml = contrato.servicios?.length
      ? contrato.servicios.map((s) => `<li>${s.servicio_nombre}</li>`).join("")
      : "<li>Sin servicios registrados</li>";

    const pagosHtml = contrato.pagos?.length
      ? contrato.pagos.map((p) => `
          <tr>
            <td>${describePago(p.pago_metodo)}</td>
            <td>${formatFecha(p.pago_fecha)}</td>
          </tr>`).join("")
      : `<tr><td colspan="2">Sin pagos registrados</td></tr>`;

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Contrato AlmaSoft #${contrato.contrato_id}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; padding: 56px 48px; color: #1a1030; line-height: 1.6; }

    .header { text-align: center; margin-bottom: 36px; border-bottom: 2px solid #4a2d99; padding-bottom: 20px; }
    .header h1 { font-size: 1.8rem; color: #2f1d57; letter-spacing: 0.04em; }
    .header .sub { margin-top: 6px; color: #666; font-size: 0.9rem; }

    .meta { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 0.9rem; color: #555; }

    .section { margin-bottom: 28px; }
    .section-title {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #4a2d99;
      border-bottom: 1px solid #d0c8ea;
      padding-bottom: 6px;
      margin-bottom: 14px;
    }

    .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .data-field { }
    .data-label { font-size: 0.78rem; color: #888; margin-bottom: 3px; }
    .data-value { font-weight: 700; color: #2f1d57; font-size: 0.95rem; }

    .contrato-num {
      display: inline-block;
      background: #f0ebff;
      color: #4a2d99;
      font-size: 1.4rem;
      font-weight: 900;
      padding: 8px 20px;
      border-radius: 10px;
      margin-bottom: 14px;
    }

    .estado-badge {
      display: inline-block;
      padding: 4px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 0.82rem;
    }
    .activo   { background: #e1f5e9; color: #2e7b59; }
    .inactivo { background: #fde8ef; color: #9b3060; }

    p.body-text { color: #444; font-size: 0.9rem; line-height: 1.75; }

    ul.servicios-list { padding-left: 22px; color: #444; font-size: 0.9rem; }
    ul.servicios-list li + li { margin-top: 6px; }

    table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    th, td { padding: 9px 12px; border: 1px solid #d0c8ea; text-align: left; }
    th { background: #f0ebff; color: #3b2a6a; font-weight: 700; }

    .firmas { display: flex; justify-content: space-around; margin-top: 20px; }
    .firma-box { text-align: center; }
    .firma-line { border-top: 1px solid #333; width: 200px; margin: 0 auto 8px; }
    .firma-label { font-size: 0.82rem; color: #555; }

    .footer { margin-top: 40px; padding-top: 14px; border-top: 1px solid #d0c8ea; font-size: 0.75rem; color: #aaa; text-align: center; }
  </style>
</head>
<body>

  <div class="header">
    <h1>CONTRATO DE SERVICIOS FUNERARIOS</h1>
    <div class="sub">AlmaSoft &mdash; Sistema de gestion funeraria</div>
  </div>

  <div class="meta">
    <span><strong>Empresa:</strong> AlmaSoft</span>
    <span><strong>Fecha:</strong> ${fechaActual}</span>
  </div>

  <div class="section">
    <div class="section-title">Identificacion del contrato</div>
    <div class="contrato-num">Contrato #${contrato.contrato_id}</div>
    <br/>
    <span class="estado-badge ${contrato.contrato_estado ? 'activo' : 'inactivo'}">
      ${contrato.contrato_estado ? 'Activo' : 'Inactivo'}
    </span>
  </div>

  <div class="section">
    <div class="section-title">Datos del cliente</div>
    <div class="data-grid">
      <div class="data-field">
        <div class="data-label">Nombre completo</div>
        <div class="data-value">${nombreCompleto}</div>
      </div>
      <div class="data-field">
        <div class="data-label">Cedula</div>
        <div class="data-value">${contrato.usuario_documento || "No registrado"}</div>
      </div>
      <div class="data-field">
        <div class="data-label">Correo electronico</div>
        <div class="data-value">${contrato.usuario_correo || "No registrado"}</div>
      </div>
      <div class="data-field">
        <div class="data-label">Direccion</div>
        <div class="data-value">${contrato.usuario_direccion || "No registrada"}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Objeto del contrato</div>
    <p class="body-text">
      Por medio del presente contrato, el cliente adquiere los servicios funerarios prestados por
      <strong>AlmaSoft</strong>, de conformidad con el plan <strong>${contrato.plan_nombre}</strong> seleccionado.
      AlmaSoft se compromete a brindar los servicios acordados con calidad, respeto y oportunidad,
      segun los terminos establecidos en este documento.
    </p>
  </div>

  <div class="section">
    <div class="section-title">Valor del servicio</div>
    <p class="body-text">
      El valor total del servicio es de <strong>$${Number(contrato.contrato_valor).toLocaleString("es-CO")} COP</strong>,
      correspondiente al plan <strong>${contrato.plan_nombre}</strong>.
    </p>
  </div>

  <div class="section">
    <div class="section-title">Servicios incluidos</div>
    <ul class="servicios-list">${serviciosHtml}</ul>
  </div>

  <div class="section">
    <div class="section-title">Condiciones</div>
    <p class="body-text">
      1. El cliente se compromete a cumplir con los pagos establecidos en el contrato.<br/>
      2. Los servicios contratados son los especificados en el plan ${contrato.plan_nombre}.<br/>
      3. AlmaSoft garantiza la prestacion de los servicios en los terminos acordados.<br/>
      4. Cualquier modificacion al presente contrato debera realizarse por escrito y con consentimiento de ambas partes.<br/>
      5. El cliente acepta los terminos y condiciones generales de AlmaSoft vigentes al momento de la firma.
    </p>
  </div>

  <div class="section">
    <div class="section-title">Historial de pagos</div>
    <table>
      <thead>
        <tr><th>Descripcion</th><th>Fecha</th></tr>
      </thead>
      <tbody>${pagosHtml}</tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Firmas</div>
    <div class="firmas">
      <div class="firma-box">
        <div class="firma-line"></div>
        <div class="firma-label">Firma del Cliente</div>
        <div class="firma-label" style="margin-top:4px;">${nombreCompleto}</div>
      </div>
      <div class="firma-box">
        <div class="firma-line"></div>
        <div class="firma-label">Firma del Representante</div>
        <div class="firma-label" style="margin-top:4px;">AlmaSoft</div>
      </div>
    </div>
  </div>

  <div class="footer">
    Documento generado el ${fechaActual} &mdash; AlmaSoft &copy; ${new Date().getFullYear()} &mdash; Contrato #${contrato.contrato_id}
  </div>

</body>
</html>`;

    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 400);
  };

  return (
    <ClientLayout>
      <section className="client-page-shell">

        <div className="client-page-header contrato-header">
          <div>
            <p className="client-kicker">Documentacion</p>
            <h1>Contrato</h1>
            <p>Informacion contractual vinculada a tu plan activo.</p>
          </div>
          {contrato && (
            <button className="contrato-download-btn" onClick={descargarPDF}>
              Descargar PDF
            </button>
          )}
        </div>

        {loading && <div className="client-empty-state">Cargando contrato...</div>}
        {!loading && sinContrato && (
          <div className="client-empty-state" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <p style={{ fontSize: "1.1rem", color: "#6f6789" }}>No tienes un contrato activo en este momento.</p>
            <a href="/client/plan" className="client-primary-button" style={{ textDecoration: "none", padding: "12px 28px", borderRadius: "14px" }}>
              Ver planes disponibles
            </a>
          </div>
        )}
        {!loading && !sinContrato && error && !contrato && <div className="client-empty-state">{error}</div>}

        {!loading && contrato && (
          <div>
            <p className="print-title">Contrato AlmaSoft</p>
            <p className="print-date">Generado el {new Date().toLocaleDateString("es-CO")}</p>

            <div className="contrato-grid">
              <article className="client-info-card">
                <div className="card-label">Numero de contrato</div>
                <strong className="contrato-id">#{contrato.contrato_id}</strong>
              </article>

              <article className="client-info-card">
                <div className="card-label">Estado</div>
                <span className={`contrato-badge ${contrato.contrato_estado ? "activo" : "inactivo"}`}>
                  {contrato.contrato_estado ? "Activo" : "Inactivo"}
                </span>
              </article>

              <article className="client-info-card">
                <div className="card-label">Plan</div>
                <div className="card-value">{contrato.plan_nombre}</div>
              </article>

              <article className="client-info-card">
                <div className="card-label">Valor del contrato</div>
                <div className="card-value">${Number(contrato.contrato_valor).toLocaleString("es-CO")}</div>
              </article>
            </div>

            {contrato.servicios?.length > 0 && (
              <section className="client-info-card payments-shell">
                <h3>Servicios incluidos en el plan</h3>
                <table className="contrato-table">
                  <thead>
                    <tr><th>Servicio</th></tr>
                  </thead>
                  <tbody>
                    {contrato.servicios.map((s) => (
                      <tr key={s.servicio_id}>
                        <td>{s.servicio_nombre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {contrato.pagos?.length > 0 && (
              <section className="client-info-card payments-shell">
                <h3>Pagos registrados</h3>
                <table className="contrato-table">
                  <thead>
                    <tr>
                      <th>Descripcion del pago</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contrato.pagos.map((p) => (
                      <tr key={p.pago_id}>
                        <td>{describePago(p.pago_metodo)}</td>
                        <td>{formatFecha(p.pago_fecha)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        )}
      </section>
    </ClientLayout>
  );
}
