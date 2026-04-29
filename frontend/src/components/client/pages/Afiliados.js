import { useEffect, useMemo, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import { authFetch } from "../../../utils/authFetch";
import "../styles/clientPages.css";

const KINSHIP_OPTIONS = [
  "Padre o madre",
  "Hijo o hija",
  "Hermano o hermana",
  "Conyuge",
  "Abuelo o abuela",
  "Otro familiar",
];

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-CO");
}

function buildName(usuario) {
  return [
    usuario.usuario_primer_nombre,
    usuario.usuario_segundo_nombre,
    usuario.usuario_primer_apellido,
    usuario.usuario_segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatApprovedName(item) {
  return [
    item.usuario_primer_nombre,
    item.usuario_segundo_nombre,
    item.usuario_primer_apellido,
    item.usuario_segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ");
}

export default function Afiliados() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [formData, setFormData] = useState({
    parentesco: "Hijo o hija",
    observacion: "",
  });
  const rol = localStorage.getItem("rol");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authFetch("http://localhost:3001/api/client/affiliates/dashboard");
      const data = await response.json();

      if (!response.ok || !data.success) {
        const message = data.message || "No pudimos cargar la informacion de afiliados.";
        if (
          message.includes("no tiene un plan") ||
          message.includes("No tienes un plan") ||
          message.includes("no tiene una afiliacion")
        ) {
          setDashboard({
            is_titular: false,
            is_afiliado: false,
            titular_panel: null,
            afiliado_panel: null,
          });
          return;
        }

        throw new Error(message);
      }

      setDashboard(data.data);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message || "No pudimos cargar la informacion de afiliados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (rol !== "Cliente") return;

    if (!/^\d{3,}$/.test(search.trim())) {
      setCandidates([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearching(true);

      try {
        const response = await authFetch(
          `http://localhost:3001/api/client/affiliates/candidates?q=${encodeURIComponent(search)}`
        );
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "No pudimos buscar el documento en este momento.");
        }

        setCandidates(data.data || []);
      } catch (requestError) {
        console.error(requestError);
        setCandidates([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [rol, search]);

  const titularPanel = dashboard?.titular_panel;
  const afiliadoPanel = dashboard?.afiliado_panel;
  const notifications = useMemo(() => {
    const items = [];
    if (titularPanel?.notificaciones?.length) items.push(...titularPanel.notificaciones);
    if (afiliadoPanel?.notificaciones?.length) items.push(...afiliadoPanel.notificaciones);
    return items.slice(0, 8);
  }, [afiliadoPanel, titularPanel]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCandidate) {
      setError("Selecciona a la persona que deseas vincular como afiliada.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await authFetch("http://localhost:3001/api/client/affiliates/request", {
        method: "POST",
        body: JSON.stringify({
          usuario_postulado_id: selectedCandidate.usuario_id,
          parentesco: formData.parentesco,
          observacion: formData.observacion,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No pudimos enviar la solicitud.");
      }

      setSuccess(data.message);
      setSearch("");
      setCandidates([]);
      setSelectedCandidate(null);
      setFormData({
        parentesco: "Hijo o hija",
        observacion: "",
      });
      await loadDashboard();
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message || "No pudimos enviar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <section className="client-page-shell affiliates-shell">
        <div className="client-page-header">
          <p className="client-kicker">Red familiar</p>
          <h1>Afiliados</h1>
          <p>
            Aqui puedes vincular familiares a tu plan, revisar los cupos disponibles y consultar el estado de cada
            solicitud.
          </p>
        </div>

        {loading ? <div className="client-empty-state">Cargando informacion de afiliados...</div> : null}
        {error ? <div className="profile-feedback error">{error}</div> : null}
        {success ? <div className="profile-feedback success">{success}</div> : null}

        {!loading && !dashboard?.is_titular && !dashboard?.is_afiliado ? (
          <div className="client-empty-state">
            Aun no tienes un plan activo como titular ni una afiliacion aprobada.
          </div>
        ) : null}

        {!loading && afiliadoPanel ? (
          <section className="affiliate-hero-card">
            <div>
              <p className="client-kicker">Estado del afiliado</p>
              <h2>Ya haces parte del plan {afiliadoPanel.plan_nombre}</h2>
              <p>
                Tu afiliacion fue aprobada dentro del plan del titular <strong>{afiliadoPanel.titular_nombre}</strong>.
                Desde aqui puedes consultar los beneficios que tienes disponibles.
              </p>
            </div>

            <div className="affiliate-benefits-inline">
              {afiliadoPanel.beneficios.map((benefit) => (
                <article key={benefit} className="affiliate-benefit-chip">
                  {benefit}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {!loading && titularPanel ? (
          <>
            <section className="affiliate-overview-grid">
              <article className="affiliate-stat-card spotlight">
                <span>Plan activo</span>
                <strong>{titularPanel.plan_nombre}</strong>
                <p>{titularPanel.plan_descripcion || "Cobertura activa para tu grupo principal."}</p>
              </article>

              <article className="affiliate-stat-card">
                <span>Cupo del plan</span>
                <strong>{titularPanel.limite_etiqueta}</strong>
                <p>Capacidad de afiliados disponible segun tu plan actual.</p>
              </article>

              <article className="affiliate-stat-card">
                <span>Cupos usados</span>
                <strong>{titularPanel.cupos_usados}</strong>
                <p>Incluye afiliados aprobados y solicitudes pendientes.</p>
              </article>

              <article className="affiliate-stat-card">
                <span>Disponibles</span>
                <strong>
                  {titularPanel.cupos_disponibles === null ? "VIP" : titularPanel.cupos_disponibles}
                </strong>
                <p>Espacios restantes para nuevas afiliaciones.</p>
              </article>
            </section>

            <section className="affiliate-benefits-grid">
              {titularPanel.beneficios.map((benefit) => (
                <article key={benefit} className="affiliate-benefit-card">
                  <h3>Beneficio del plan</h3>
                  <p>{benefit}</p>
                </article>
              ))}
            </section>

            <section className="affiliate-management-grid">
              <form className="affiliate-request-card" onSubmit={handleSubmit}>
                <div className="affiliate-section-header">
                  <div>
                    <p className="client-kicker">Nueva solicitud</p>
                    <h2>Postular un afiliado</h2>
                  </div>
                  <p>
                    Escribe el numero de documento de la persona que deseas vincular y envia la solicitud para
                    validacion.
                  </p>
                </div>

                <label className="profile-field profile-field-full">
                  <span>Buscar por numero de documento</span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Ejemplo: 1023456789"
                  />
                </label>

                {searching ? <p className="affiliate-muted">Buscando documento...</p> : null}

                {candidates.length ? (
                  <div className="affiliate-candidate-list">
                    {candidates.map((candidate) => {
                      const active = selectedCandidate?.usuario_id === candidate.usuario_id;
                      return (
                        <button
                          key={candidate.usuario_id}
                          type="button"
                          className={`affiliate-candidate-card ${active ? "is-selected" : ""}`}
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <strong>{buildName(candidate)}</strong>
                          <span>{candidate.usuario_correo}</span>
                          <small>Documento: {candidate.usuario_documento}</small>
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {selectedCandidate ? (
                  <div className="affiliate-selected-card">
                    <span>Persona seleccionada</span>
                    <strong>{buildName(selectedCandidate)}</strong>
                    <small>{selectedCandidate.usuario_correo}</small>
                  </div>
                ) : null}

                <div className="profile-grid">
                  <label className="profile-field">
                    <span>Parentesco</span>
                    <select
                      value={formData.parentesco}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          parentesco: event.target.value,
                        }))
                      }
                    >
                      {KINSHIP_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="profile-field">
                    <span>Observacion</span>
                    <input
                      value={formData.observacion}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          observacion: event.target.value,
                        }))
                      }
                      placeholder="Comentario adicional para la solicitud"
                    />
                  </label>
                </div>

                <div className="profile-actions">
                  <button type="submit" className="client-primary-button" disabled={submitting}>
                    {submitting ? "Enviando solicitud..." : "Solicitar afiliacion"}
                  </button>
                </div>
              </form>

              <div className="affiliate-status-column">
                <article className="client-info-card">
                  <h3>Afiliados aprobados</h3>
                  {titularPanel.afiliados_aprobados?.length ? (
                    <div className="affiliate-stack-list">
                      {titularPanel.afiliados_aprobados.map((item) => (
                        <article key={`${item.afiliado_id}-${item.parentesco || "ok"}`} className="affiliate-mini-card">
                          <strong>{formatApprovedName(item)}</strong>
                          <span>{item.parentesco || "Afiliado aprobado"}</span>
                          <small>{item.fecha_revision ? `Aprobado: ${formatDate(item.fecha_revision)}` : "Activo"}</small>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p>Aun no tienes personas afiliadas en este plan.</p>
                  )}
                </article>

                <article className="client-info-card">
                  <h3>Solicitudes pendientes</h3>
                  {titularPanel.solicitudes_pendientes?.length ? (
                    <div className="affiliate-stack-list">
                      {titularPanel.solicitudes_pendientes.map((item) => (
                        <article key={item.solicitud_id} className="affiliate-mini-card pending">
                          <strong>{formatApprovedName(item)}</strong>
                          <span>{item.parentesco}</span>
                          <small>Enviada: {formatDate(item.fecha_solicitud)}</small>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p>No tienes solicitudes pendientes por ahora.</p>
                  )}
                </article>
              </div>
            </section>
          </>
        ) : null}

        {!loading && notifications.length ? (
          <section className="client-info-card notifications-shell">
            <div className="affiliate-section-header compact">
              <div>
                <p className="client-kicker">Mensajes</p>
                <h2>Notificaciones recientes</h2>
              </div>
              <button
                type="button"
                className="client-secondary-button"
                onClick={async () => {
                  await authFetch("http://localhost:3001/api/client/affiliates/notifications/read", {
                    method: "PUT",
                  });
                  await loadDashboard();
                }}
              >
                Marcar como revisadas
              </button>
            </div>

            <div className="affiliate-notification-list">
              {notifications.map((notification) => (
                <article key={notification.notificacion_id} className={`affiliate-notification-card ${notification.leida ? "is-read" : ""}`}>
                  <strong>{notification.notificacion_titulo}</strong>
                  <p>{notification.notificacion_mensaje}</p>
                  <small>{formatDate(notification.fecha_creacion)}</small>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </ClientLayout>
  );
}
