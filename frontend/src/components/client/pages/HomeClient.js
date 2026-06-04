import { useEffect, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import PlanModal from "../components/PlanModal";
import { getPlanVisual } from "../data/clientPlanVisuals";
import { authFetch } from "../../../utils/authFetch";
import "../styles/homeClient.css";
import "../styles/clientPages.css";

function formatPrice(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return value || "No disponible";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(number);
}

function readClientSession() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
    const nombre =
      [usuario.usuario_primer_nombre, usuario.usuario_primer_apellido]
        .filter(Boolean)
        .join(" ") || usuario.usuario_correo || "Cliente";

    return {
      nombre,
      correo: usuario.usuario_correo || "Correo no disponible",
    };
  } catch {
    return {
      nombre: "Cliente",
      correo: "Correo no disponible",
    };
  }
}

export default function HomeClient() {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [clientSession, setClientSession] = useState(() => readClientSession());
  const [activePlan, setActivePlan] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/client/plans")
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "No se pudieron cargar los planes");
        }

        return data;
      })
      .then((data) => {
        setPlanes(data.data || []);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setPlanes([]);
        setError("No fue posible cargar los planes en este momento.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const syncClientSession = () => {
      setClientSession(readClientSession());
    };

    window.addEventListener("client-profile-updated", syncClientSession);
    window.addEventListener("storage", syncClientSession);

    return () => {
      window.removeEventListener("client-profile-updated", syncClientSession);
      window.removeEventListener("storage", syncClientSession);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setActivePlan(null);
      return;
    }

    authFetch("http://localhost:3001/api/client/contrato/mine")
      .then(async (response) => {
        const data = await response.json();

        if (response.status === 404) {
          setActivePlan(null);
          return null;
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || "No se pudo validar el plan activo.");
        }

        return data.data;
      })
      .then((data) => {
        if (data) {
          setActivePlan(data);
        }
      })
      .catch((requestError) => {
        console.error(requestError);
      });
  }, []);

  return (
    <ClientLayout>
      <section className="client-hero">
        <div className="client-hero-copy">
          <p className="client-kicker">Experiencia cliente</p>
          <h1>Logged In Successfully</h1>
          <h2>Bienvenido, {clientSession.nombre}</h2>
          <p className="client-hero-email">{clientSession.correo}</p>
          <p className="client-hero-text">
            Consulta tus planes disponibles, revisa coberturas y gestiona tu
            acompanamiento desde un solo lugar con una vista mas clara y elegante.
          </p>

          <div className="client-hero-actions">
            <button
              type="button"
              className="client-primary-button"
              onClick={() => {
                const section = document.getElementById("planes-disponibles");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explorar planes
            </button>
            <a className="client-secondary-button" href="/client/pagos">
              Ver pagos
            </a>
          </div>

          <div className="client-stats-grid">
            <article className="client-stat-card">
              <strong>{planes.length || 0}</strong>
              <span>Planes activos para ti</span>
            </article>
            <article className="client-stat-card">
              <strong>Atencion</strong>
              <span>Seguimiento y proceso en una sola vista</span>
            </article>
            <article className="client-stat-card">
              <strong>Flexible</strong>
              <span>Canales PSE, tarjeta y efectivo en sede</span>
            </article>
          </div>
        </div>

        <div className="client-hero-visual">
          <img src="/img/3302177.jpg" alt="Acompanamiento AlmaSoft" />
          <div className="client-hero-badge">
            <span>Que puedes hacer hoy</span>
            <strong>Explora planes, revisa pagos y continua tu proceso sin salir del panel.</strong>
            <ul className="client-hero-list">
              <li>Comparar coberturas disponibles</li>
              <li>Elegir tu medio de pago</li>
              <li>Consultar sedes y seguimiento</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="client-section-shell" id="planes-disponibles">
        <div className="client-section-heading">
          <div>
            <p className="client-kicker">Catalogo de planes</p>
            <h2>Planes con imagen y presentacion personalizada</h2>
          </div>
          <p>Encuentra la opcion que mejor se adapta a tu familia y visualiza cada plan con mas claridad.</p>
        </div>

        {activePlan ? (
          <div className="plan-feedback info">
            Ya tienes un plan activo: <strong>{activePlan.plan_nombre}</strong>. Si deseas consultarlo, entra a
            {" "}
            <a href="/client/plan">Tu plan</a>.
          </div>
        ) : null}

        {loading ? (
          <div className="client-empty-state">Cargando planes disponibles...</div>
        ) : error ? (
          <div className="client-empty-state">{error}</div>
        ) : planes.length === 0 ? (
          <div className="client-empty-state">No hay planes registrados.</div>
        ) : (
          <div className="client-plan-grid">
            {planes.map((plan) => {
              const visual = getPlanVisual(plan);

              return (
                <article
                  key={plan.plan_id}
                  className={`client-plan-card accent-${visual.accent}`}
                >
                  <div className="client-plan-media">
                    <img src={visual.image} alt={plan.plan_nombre} />
                    <span className="client-plan-badge">{visual.badge}</span>
                  </div>

                  <div className="client-plan-body">
                    <div className="client-plan-topline">
                      <h3>{plan.plan_nombre}</h3>
                      <strong>{formatPrice(plan.plan_precio)}</strong>
                    </div>

                    <p className="client-plan-summary">{visual.summary}</p>
                    <p className="client-plan-description">
                      {plan.plan_descripcion || "Cobertura disponible para consulta."}
                    </p>

                    <div className="client-chip-row">
                      {(plan.servicios || []).slice(0, 3).map((servicio, index) => (
                        <span className="client-chip" key={`${plan.plan_id}-${index}`}>
                          {servicio.nombre}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="client-primary-button full-width"
                      onClick={() => setPlanSeleccionado(plan)}
                      disabled={Boolean(activePlan)}
                    >
                      {activePlan ? "Ya tienes un plan activo" : "Ver detalles y adquirir"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {planSeleccionado && (
        <PlanModal
          plan={planSeleccionado}
          onClose={() => setPlanSeleccionado(null)}
          hasActivePlan={Boolean(activePlan)}
          onPurchaseSuccess={(purchaseData) => {
            setActivePlan({
              contrato_id: purchaseData.contrato_id,
              plan_id: purchaseData.plan_id,
              plan_nombre: purchaseData.plan_nombre,
            });
          }}
        />
      )}
    </ClientLayout>
  );
}
