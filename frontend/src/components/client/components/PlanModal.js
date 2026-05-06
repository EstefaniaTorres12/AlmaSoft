import { useMemo, useState } from "react";
import { authFetch } from "../../../utils/authFetch";
import "../styles/PlanModal.css";

const PSE_ENTITIES = [
  "Bancolombia",
  "Bancoomeva",
  "Banco Agrario de Colombia",
  "Banco Caja Social",
  "Banco de Bogota",
  "Banco Cooperativo Coopcentral",
  "Banco AV Villas",
  "BBVA Colombia",
  "Banco Pichincha",
  "Banco GNB Sudameris",
  "Banco Falabella",
  "Banco de Occidente",
  "Banco Popular",
  "Banco ProCredit",
  "Santander",
  "ItaU",
  "Nequi",
  "Banco Serfinanza",
  "Confiar Cooperativa Financiera",
  "DaviPlata",
  "Citibank",
  "CFA Cooperativa Financiera",
  "Davivienda",
  "RappiPay",
  "Scotiabank Colpatria",
];

const CARD_FRANCHISES = ["Visa", "Mastercard", "American Express", "Diners Club"];
const CASH_LOCATIONS = ["Sede principal", "Sede norte", "Sede centro", "Sede sur"];

function formatPrice(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return value || "No disponible";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(number);
}

function getClientId() {
  const rawCliente = localStorage.getItem("usuario_id");
  const clienteId = Number(rawCliente);
  return !clienteId || Number.isNaN(clienteId) ? null : clienteId;
}

function normalizePlanName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function PlanModal({ plan, onClose, onPurchaseSuccess, hasActivePlan = false }) {
  const [metodoPago, setMetodoPago] = useState("");
  const [entidadPago, setEntidadPago] = useState("");
  const [pseTipoCliente, setPseTipoCliente] = useState("persona_natural");
  const [pseCorreo, setPseCorreo] = useState("");
  const [titularPago, setTitularPago] = useState("");
  const [ultimos4, setUltimos4] = useState("");
  const [franquiciaTarjeta, setFranquiciaTarjeta] = useState("");
  const [sedePago, setSedePago] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const productosPorPlan = {
    basico: ["Ataud basico", "Urna", "Traslado", "Preparacion"],
    estandar: ["Ataud estandar", "Urna decorada", "Flores"],
    premium: ["Ataud premium", "Urna especial", "Flores premium"],
    vip: ["Ataud de lujo", "Urna exclusiva", "Servicios VIP"],
  };

  const servicios = Array.isArray(plan?.servicios) ? plan.servicios : [];
  const productos = productosPorPlan[normalizePlanName(plan?.plan_nombre)] || [];

  const paymentPreview = useMemo(() => {
    if (!metodoPago) return "Selecciona un metodo de pago para ver el flujo correspondiente.";

    if (metodoPago === "pse") {
      return entidadPago
        ? `PSE con ${entidadPago}, perfil ${pseTipoCliente === "persona_juridica" ? "persona juridica" : "persona natural"}.`
        : "Selecciona una entidad financiera PSE.";
    }

    if (metodoPago === "debito") {
      const ending = ultimos4 ? `terminada en ${ultimos4}` : "sin terminacion registrada";
      return `Tarjeta debito de ${entidadPago || "entidad emisora"}, ${ending}.`;
    }

    if (metodoPago === "credito") {
      const ending = ultimos4 ? `terminada en ${ultimos4}` : "sin terminacion registrada";
      return `Tarjeta credito ${franquiciaTarjeta || "sin franquicia"} de ${entidadPago || "entidad emisora"}, ${ending}.`;
    }

    return `Pago en efectivo en ${sedePago || "la sede seleccionada"}, pendiente por confirmar en caja.`;
  }, [entidadPago, franquiciaTarjeta, metodoPago, pseTipoCliente, sedePago, ultimos4]);

  if (!plan) return null;

  const resetPaymentForm = () => {
    setMetodoPago("");
    setEntidadPago("");
    setPseTipoCliente("persona_natural");
    setPseCorreo("");
    setTitularPago("");
    setUltimos4("");
    setFranquiciaTarjeta("");
    setSedePago("");
    setMostrarPago(false);
    setError("");
    setSuccessData(null);
  };

  const handleClose = () => {
    resetPaymentForm();
    onClose();
  };

  const handleMethodChange = (value) => {
    setMetodoPago(value);
    setEntidadPago("");
    setPseTipoCliente("persona_natural");
    setPseCorreo("");
    setTitularPago("");
    setUltimos4("");
    setFranquiciaTarjeta("");
    setSedePago("");
    setError("");
  };

  const validatePaymentForm = () => {
    if (!metodoPago) return "Selecciona un metodo de pago.";

    if (metodoPago === "pse") {
      if (!entidadPago) return "Selecciona una entidad PSE.";
      if (!pseCorreo) return "Ingresa el correo asociado al pago PSE.";
      return "";
    }

    if (metodoPago === "debito") {
      if (!entidadPago) return "Selecciona la entidad de la tarjeta debito.";
      if (!titularPago) return "Ingresa el titular de la tarjeta debito.";
      if (!/^\d{4}$/.test(ultimos4)) return "Ingresa los ultimos 4 digitos de la tarjeta debito.";
      return "";
    }

    if (metodoPago === "credito") {
      if (!entidadPago) return "Selecciona la entidad de la tarjeta credito.";
      if (!titularPago) return "Ingresa el titular de la tarjeta credito.";
      if (!franquiciaTarjeta) return "Selecciona la franquicia de la tarjeta credito.";
      if (!/^\d{4}$/.test(ultimos4)) return "Ingresa los ultimos 4 digitos de la tarjeta credito.";
      return "";
    }

    if (!sedePago) return "Selecciona la sede para el pago en efectivo.";
    if (!titularPago) return "Ingresa la persona responsable del pago en efectivo.";
    return "";
  };

  const handlePagar = async () => {
    const cliente_id = getClientId();

    if (!cliente_id) {
      setError("No fue posible identificar al cliente autenticado.");
      return;
    }

    if (hasActivePlan) {
      setError("Ya tienes un plan activo registrado.");
      return;
    }

    const validationError = validatePaymentForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authFetch("http://localhost:3001/api/client/contrato", {
        method: "POST",
        body: JSON.stringify({
          cliente_id,
          plan_id: plan.plan_id,
          metodo_pago: metodoPago,
          entidad_pago: entidadPago || null,
          tipo_tarjeta: metodoPago === "credito" || metodoPago === "debito" ? metodoPago : null,
          ultimos4: metodoPago === "credito" || metodoPago === "debito" ? ultimos4 : null,
          pse_tipo_cliente: metodoPago === "pse" ? pseTipoCliente : null,
          pse_correo: metodoPago === "pse" ? pseCorreo : null,
          franquicia_tarjeta: metodoPago === "credito" ? franquiciaTarjeta : null,
          titular_pago: metodoPago !== "pse" ? titularPago : null,
          sede_pago: metodoPago === "efectivo" ? sedePago : null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No fue posible registrar el pago.");
      }

      setSuccessData(data);

      if (typeof onPurchaseSuccess === "function") {
        onPurchaseSuccess({
          contrato_id: data.contrato_id,
          plan_id: plan.plan_id,
          plan_nombre: plan.plan_nombre,
        });
      }
    } catch (requestError) {
      console.error("Error registrando pago:", requestError);
      setError(requestError.message || "No fue posible procesar la compra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-modal-overlay" onClick={handleClose}>
      <div className="plan-modal" onClick={(event) => event.stopPropagation()}>
        <button className="plan-modal-close" onClick={handleClose} type="button">
          X
        </button>

        <div className="plan-modal-header">
          <h2>{plan.plan_nombre}</h2>
          <p>{plan.plan_descripcion || "Cobertura lista para ser adquirida desde tu panel."}</p>
        </div>

        <div className="plan-modal-price">
          <span>Valor del plan</span>
          <strong>{formatPrice(plan.plan_precio)}</strong>
        </div>

        {hasActivePlan && !successData ? (
          <div className="plan-feedback warning">
            Ya tienes un plan activo. No puedes adquirir un segundo plan hasta finalizar el actual.
          </div>
        ) : null}

        {error ? <div className="plan-feedback error">{error}</div> : null}

        {successData ? (
          <div className="plan-success-shell">
            <h3>Pago registrado</h3>
            <div className="plan-card-preview">
              <span>Referencia</span>
              <strong>{successData.pago?.pago_referencia || "Generada por el sistema"}</strong>
              <small>{successData.pago?.pago_metodo}</small>
            </div>

            <div className="plan-grid">
              <div className="plan-payment-preview">
                <span>Estado</span>
                <strong>{successData.pago?.pago_estado || "Registrado"}</strong>
              </div>
              <div className="plan-payment-preview">
                <span>Contrato</span>
                <strong>#{successData.contrato_id}</strong>
              </div>
            </div>

            {successData.pago?.pago_fecha_limite ? (
              <div className="plan-feedback info">
                Pago en efectivo pendiente. Fecha limite: {successData.pago.pago_fecha_limite}
              </div>
            ) : null}

            <div className="plan-success-actions">
              <a className="plan-modal-button plan-modal-button-link" href="/client/plan">
                Ver mi plan
              </a>
              <button className="plan-secondary-button" onClick={handleClose} type="button">
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="plan-section">
              <h3>Servicios incluidos</h3>
              {servicios.length > 0 ? (
                <ul>
                  {servicios.map((servicio) => (
                    <li key={servicio.servicio_id || servicio.nombre}>{servicio.nombre || servicio.servicio_nombre}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay servicios disponibles para este plan.</p>
              )}
            </div>

            <div className="plan-section">
              <h3>Productos incluidos</h3>
              {productos.length > 0 ? (
                <ul>
                  {productos.map((producto) => (
                    <li key={producto}>{producto}</li>
                  ))}
                </ul>
              ) : (
                <p>No hay productos configurados para este plan.</p>
              )}
            </div>

            <div className="plan-section">
              {!mostrarPago ? (
                <button
                  className="plan-modal-button"
                  onClick={() => setMostrarPago(true)}
                  type="button"
                  disabled={hasActivePlan}
                >
                  Adquirir plan
                </button>
              ) : (
                <>
                  <h3>Registrar pago</h3>
                  <label className="plan-payment-label" htmlFor="metodoPago">
                    Metodo de pago
                  </label>
                  <select
                    id="metodoPago"
                    value={metodoPago}
                    onChange={(event) => handleMethodChange(event.target.value)}
                    className="plan-select"
                  >
                    <option value="">Selecciona un metodo</option>
                    <option value="pse">PSE</option>
                    <option value="debito">Tarjeta debito</option>
                    <option value="credito">Tarjeta credito</option>
                    <option value="efectivo">Efectivo en sede</option>
                  </select>

                  {metodoPago === "pse" ? (
                    <div className="plan-payment-fields">
                      <div className="plan-grid">
                        <div>
                          <label className="plan-payment-label" htmlFor="entidadPse">
                            Entidad financiera
                          </label>
                          <select
                            id="entidadPse"
                            value={entidadPago}
                            onChange={(event) => setEntidadPago(event.target.value)}
                            className="plan-select"
                          >
                            <option value="">Selecciona tu entidad</option>
                            {PSE_ENTITIES.map((entity) => (
                              <option key={entity} value={entity}>
                                {entity}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="plan-payment-label" htmlFor="pseTipoCliente">
                            Tipo de cliente PSE
                          </label>
                          <select
                            id="pseTipoCliente"
                            value={pseTipoCliente}
                            onChange={(event) => setPseTipoCliente(event.target.value)}
                            className="plan-select"
                          >
                            <option value="persona_natural">Persona natural</option>
                            <option value="persona_juridica">Persona juridica</option>
                          </select>
                        </div>
                      </div>

                      <label className="plan-payment-label" htmlFor="pseCorreo">
                        Correo del pagador
                      </label>
                      <input
                        id="pseCorreo"
                        className="plan-input"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={pseCorreo}
                        onChange={(event) => setPseCorreo(event.target.value)}
                      />
                    </div>
                  ) : null}

                  {metodoPago === "debito" ? (
                    <div className="plan-payment-fields">
                      <div className="plan-grid">
                        <div>
                          <label className="plan-payment-label" htmlFor="debitoEntidad">
                            Banco emisor
                          </label>
                          <select
                            id="debitoEntidad"
                            value={entidadPago}
                            onChange={(event) => setEntidadPago(event.target.value)}
                            className="plan-select"
                          >
                            <option value="">Selecciona el banco</option>
                            {PSE_ENTITIES.map((entity) => (
                              <option key={entity} value={entity}>
                                {entity}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="plan-payment-label" htmlFor="debitoUltimos4">
                            Ultimos 4 digitos
                          </label>
                          <input
                            id="debitoUltimos4"
                            className="plan-input"
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="1234"
                            value={ultimos4}
                            onChange={(event) => setUltimos4(event.target.value.replace(/\D/g, "").slice(0, 4))}
                          />
                        </div>
                      </div>

                      <label className="plan-payment-label" htmlFor="debitoTitular">
                        Titular de la tarjeta
                      </label>
                      <input
                        id="debitoTitular"
                        className="plan-input"
                        placeholder="Nombre completo"
                        value={titularPago}
                        onChange={(event) => setTitularPago(event.target.value)}
                      />
                    </div>
                  ) : null}

                  {metodoPago === "credito" ? (
                    <div className="plan-payment-fields">
                      <div className="plan-grid">
                        <div>
                          <label className="plan-payment-label" htmlFor="creditoEntidad">
                            Banco emisor
                          </label>
                          <select
                            id="creditoEntidad"
                            value={entidadPago}
                            onChange={(event) => setEntidadPago(event.target.value)}
                            className="plan-select"
                          >
                            <option value="">Selecciona el banco</option>
                            {PSE_ENTITIES.map((entity) => (
                              <option key={entity} value={entity}>
                                {entity}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="plan-payment-label" htmlFor="creditoFranquicia">
                            Franquicia
                          </label>
                          <select
                            id="creditoFranquicia"
                            value={franquiciaTarjeta}
                            onChange={(event) => setFranquiciaTarjeta(event.target.value)}
                            className="plan-select"
                          >
                            <option value="">Selecciona la franquicia</option>
                            {CARD_FRANCHISES.map((franchise) => (
                              <option key={franchise} value={franchise}>
                                {franchise}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="plan-grid">
                        <div>
                          <label className="plan-payment-label" htmlFor="creditoTitular">
                            Titular de la tarjeta
                          </label>
                          <input
                            id="creditoTitular"
                            className="plan-input"
                            placeholder="Nombre completo"
                            value={titularPago}
                            onChange={(event) => setTitularPago(event.target.value)}
                          />
                        </div>

                        <div>
                          <label className="plan-payment-label" htmlFor="creditoUltimos4">
                            Ultimos 4 digitos
                          </label>
                          <input
                            id="creditoUltimos4"
                            className="plan-input"
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="1234"
                            value={ultimos4}
                            onChange={(event) => setUltimos4(event.target.value.replace(/\D/g, "").slice(0, 4))}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {metodoPago === "efectivo" ? (
                    <div className="plan-payment-fields">
                      <div className="plan-grid">
                        <div>
                          <label className="plan-payment-label" htmlFor="sedePago">
                            Sede de pago
                          </label>
                          <select
                            id="sedePago"
                            value={sedePago}
                            onChange={(event) => setSedePago(event.target.value)}
                            className="plan-select"
                          >
                            <option value="">Selecciona una sede</option>
                            {CASH_LOCATIONS.map((location) => (
                              <option key={location} value={location}>
                                {location}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="plan-payment-label" htmlFor="efectivoResponsable">
                            Responsable del pago
                          </label>
                          <input
                            id="efectivoResponsable"
                            className="plan-input"
                            placeholder="Nombre completo"
                            value={titularPago}
                            onChange={(event) => setTitularPago(event.target.value)}
                          />
                        </div>
                      </div>

                      <div className="plan-feedback info">
                        El pago en efectivo quedara pendiente y se registrara con fecha limite para realizarlo en sede.
                      </div>
                    </div>
                  ) : null}

                  <div className="plan-payment-preview">
                    <span>Resumen del canal</span>
                    <strong>{paymentPreview}</strong>
                  </div>

                  <div className="plan-action-row">
                    <button
                      className="plan-secondary-button"
                      onClick={() => {
                        setMostrarPago(false);
                        handleMethodChange("");
                      }}
                      type="button"
                    >
                      Volver
                    </button>
                    <button className="plan-modal-button" onClick={handlePagar} disabled={loading} type="button">
                      {loading ? "Registrando..." : "Confirmar y registrar pago"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
