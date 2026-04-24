import "../styles/PlanModal.css";
import { useMemo, useState } from "react";
import { authFetch } from "../../../utils/authFetch";

const ENTIDADES_PSE = [
  "Nequi",
  "Daviplata",
  "Bancolombia",
  "Davivienda",
  "BBVA",
  "Banco de Bogota",
  "Banco Popular",
  "Banco AV Villas",
];

const ENTIDADES_TARJETA = [
  "Visa",
  "Mastercard",
  "American Express",
  "Banco de Bogota",
  "Bancolombia",
  "Davivienda",
  "BBVA",
];

function formatPrice(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return value || "No disponible";

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(number);
}

function normalizeText(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value) {
  return onlyDigits(value)
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function buildPseReference(planId, clienteId) {
  return `PSE-${planId}-${clienteId}-${Date.now().toString().slice(-6)}`;
}

export default function PlanModal({ plan, onClose }) {
  const [metodoPago, setMetodoPago] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarPasarelaPse, setMostrarPasarelaPse] = useState(false);
  const [formPago, setFormPago] = useState({
    entidadPse: "",
    tipoTarjeta: "credito",
    entidadTarjeta: "",
    numeroTarjeta: "",
    titularTarjeta: "",
    vencimientoTarjeta: "",
    cvvTarjeta: "",
  });

  if (!plan) return null;

  const productosPorPlan = {
    basico: ["Ataud basico", "Urna", "Traslado", "Preparacion"],
    estandar: ["Ataud estandar", "Urna decorada", "Flores"],
    premium: ["Ataud premium", "Urna especial", "Flores premium"],
    vip: ["Ataud de lujo", "Urna exclusiva", "Servicios VIP"],
  };

  const servicios = Array.isArray(plan.servicios) ? plan.servicios : [];
  const productos = productosPorPlan[normalizeText(plan.plan_nombre)] || [];
  const ultimos4 = useMemo(
    () => onlyDigits(formPago.numeroTarjeta).slice(-4),
    [formPago.numeroTarjeta]
  );

  const resumenTarjeta = useMemo(() => {
    if (metodoPago !== "tarjeta") return "";

    const tipo = formPago.tipoTarjeta || "credito";
    const entidad = formPago.entidadTarjeta || "Entidad por definir";
    const numero = ultimos4 ? `**** ${ultimos4}` : "****";
    return `Tarjeta ${tipo} - ${entidad} - ${numero}`;
  }, [formPago.entidadTarjeta, formPago.tipoTarjeta, metodoPago, ultimos4]);

  const resumenEfectivo = useMemo(() => {
    if (metodoPago !== "efectivo") return "";
    return "Pago en efectivo en sede con soporte por correo";
  }, [metodoPago]);

  const updatePagoField = (field, value) => {
    setFormPago((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const enviarPago = async (payload) => {
    const cliente_id = Number(localStorage.getItem("usuario_id"));

    if (!cliente_id) {
      alert("Usuario no identificado");
      return;
    }

    setLoading(true);

    try {
      const response = await authFetch("http://localhost:3001/api/client/contrato", {
        method: "POST",
        body: JSON.stringify({
          cliente_id,
          plan_id: plan.plan_id,
          ...payload,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }

      if (payload.metodo_pago === "efectivo") {
        const fechaPago = data.fecha_limite_pago
          ? `\nFecha limite de pago: ${data.fecha_limite_pago}`
          : "";
        const avisoCorreo = data.advertencia_correo ? `\n${data.advertencia_correo}` : "";
        alert(
          `Acercate a una sede con el correo para realizar el pago.${fechaPago}${avisoCorreo}`
        );
      } else {
        const detalle = data.pago_registrado ? `\n${data.pago_registrado}` : "";
        alert(`Plan adquirido correctamente${detalle}`);
      }
      setMostrarPasarelaPse(false);
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  const confirmarPagoTarjeta = async () => {
    if (!formPago.entidadTarjeta || !formPago.numeroTarjeta || !formPago.titularTarjeta) {
      alert("Completa los datos principales de la tarjeta");
      return;
    }

    if (onlyDigits(formPago.numeroTarjeta).length < 16) {
      alert("La tarjeta debe tener 16 digitos");
      return;
    }

    if (formPago.vencimientoTarjeta.length !== 5 || formPago.cvvTarjeta.length < 3) {
      alert("Completa el vencimiento y el codigo de seguridad");
      return;
    }

    await enviarPago({
      metodo_pago: "tarjeta",
      entidad_pago: formPago.entidadTarjeta,
      tipo_tarjeta: formPago.tipoTarjeta,
      ultimos4,
    });
  };

  const abrirPasarelaPse = () => {
    if (!formPago.entidadPse) {
      alert("Selecciona una entidad PSE");
      return;
    }

    setMostrarPasarelaPse(true);
  };

  const confirmarPagoPse = async () => {
    const cliente_id = Number(localStorage.getItem("usuario_id"));
    const referencia = buildPseReference(plan.plan_id, cliente_id);

    await enviarPago({
      metodo_pago: "pse",
      entidad_pago: formPago.entidadPse,
      referencia_pago: referencia,
    });
  };

  const confirmarPagoEfectivo = async () => {
    await enviarPago({
      metodo_pago: "efectivo",
    });
  };

  return (
    <>
      <div className="plan-modal-overlay" onClick={onClose}>
        <div className="plan-modal" onClick={(e) => e.stopPropagation()}>
          <button className="plan-modal-close" onClick={onClose}>
            X
          </button>

          <div className="plan-modal-header">
            <h2>{plan.plan_nombre}</h2>
            <p>{plan.plan_descripcion}</p>
          </div>

          <div className="plan-modal-price">
            <span>Valor del plan</span>
            <strong>{formatPrice(plan.plan_precio)}</strong>
          </div>

          <div className="plan-section">
            <h3>Servicios incluidos</h3>
            {servicios.length > 0 ? (
              <ul>
                {servicios.map((s, i) => (
                  <li key={i}>OK {s.nombre}</li>
                ))}
              </ul>
            ) : (
              <p>No hay servicios disponibles</p>
            )}
          </div>

          <div className="plan-section">
            <h3>Productos incluidos</h3>
            {productos.length > 0 ? (
              <ul>
                {productos.map((p, i) => (
                  <li key={i}>OK {p}</li>
                ))}
              </ul>
            ) : (
              <p>No hay productos disponibles</p>
            )}
          </div>

          <div className="plan-section">
            {!mostrarPago ? (
              <button
                className="plan-modal-button"
                onClick={() => setMostrarPago(true)}
              >
                Adquirir plan
              </button>
            ) : (
              <>
                <h3>Metodo de pago</h3>

                <div className="plan-payment">
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="plan-select"
                  >
                    <option value="">Seleccionar metodo</option>
                    <option value="pse">PSE</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="efectivo">Efectivo</option>
                  </select>

                  {metodoPago === "pse" && (
                    <div className="plan-payment-fields">
                      <p className="plan-payment-label">
                        Seras redirigido a una pasarela tipo PSE para continuar.
                      </p>

                      <select
                        value={formPago.entidadPse}
                        onChange={(e) => updatePagoField("entidadPse", e.target.value)}
                        className="plan-select"
                      >
                        <option value="">Seleccionar entidad PSE</option>
                        {ENTIDADES_PSE.map((entidad) => (
                          <option key={entidad} value={entidad}>
                            {entidad}
                          </option>
                        ))}
                      </select>

                      <div className="plan-payment-preview">
                        <span>Canal seleccionado</span>
                        <strong>
                          {formPago.entidadPse
                            ? `PSE - ${formPago.entidadPse}`
                            : "Aun no has elegido entidad"}
                        </strong>
                      </div>

                      <button
                        className="plan-modal-button"
                        onClick={abrirPasarelaPse}
                        disabled={loading}
                      >
                        Ir a PSE
                      </button>
                    </div>
                  )}

                  {metodoPago === "tarjeta" && (
                    <div className="plan-payment-fields">
                      <div className="plan-grid">
                        <div>
                          <label className="plan-payment-label">Tipo de tarjeta</label>
                          <select
                            value={formPago.tipoTarjeta}
                            onChange={(e) =>
                              updatePagoField("tipoTarjeta", e.target.value)
                            }
                            className="plan-select"
                          >
                            <option value="credito">Credito</option>
                            <option value="debito">Debito</option>
                          </select>
                        </div>

                        <div>
                          <label className="plan-payment-label">Entidad</label>
                          <select
                            value={formPago.entidadTarjeta}
                            onChange={(e) =>
                              updatePagoField("entidadTarjeta", e.target.value)
                            }
                            className="plan-select"
                          >
                            <option value="">Seleccionar entidad</option>
                            {ENTIDADES_TARJETA.map((entidad) => (
                              <option key={entidad} value={entidad}>
                                {entidad}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <label className="plan-payment-label">Numero de tarjeta</label>
                      <input
                        className="plan-input"
                        value={formPago.numeroTarjeta}
                        onChange={(e) =>
                          updatePagoField("numeroTarjeta", formatCardNumber(e.target.value))
                        }
                        placeholder="1234 5678 9012 3456"
                      />

                      <label className="plan-payment-label">Titular</label>
                      <input
                        className="plan-input"
                        value={formPago.titularTarjeta}
                        onChange={(e) =>
                          updatePagoField("titularTarjeta", e.target.value.toUpperCase())
                        }
                        placeholder="NOMBRE DEL TITULAR"
                      />

                      <div className="plan-grid">
                        <div>
                          <label className="plan-payment-label">Vence</label>
                          <input
                            className="plan-input"
                            value={formPago.vencimientoTarjeta}
                            onChange={(e) =>
                              updatePagoField(
                                "vencimientoTarjeta",
                                formatExpiry(e.target.value)
                              )
                            }
                            placeholder="MM/AA"
                          />
                        </div>

                        <div>
                          <label className="plan-payment-label">CVV</label>
                          <input
                            className="plan-input"
                            value={formPago.cvvTarjeta}
                            onChange={(e) =>
                              updatePagoField(
                                "cvvTarjeta",
                                onlyDigits(e.target.value).slice(0, 4)
                              )
                            }
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div className="plan-card-preview">
                        <span>Resumen del medio de pago</span>
                        <strong>{resumenTarjeta}</strong>
                        <small>
                          {formPago.titularTarjeta || "Titular pendiente"}
                        </small>
                      </div>

                      <button
                        className="plan-modal-button"
                        onClick={confirmarPagoTarjeta}
                        disabled={loading}
                      >
                        {loading ? "Procesando..." : "Pagar con tarjeta"}
                      </button>
                    </div>
                  )}

                  {metodoPago === "efectivo" && (
                    <div className="plan-payment-fields">
                      <p className="plan-payment-label">
                        Te enviaremos un correo con la informacion del plan y la fecha
                        maxima para acercarte a pagar en una sede.
                      </p>

                      <div className="plan-payment-preview">
                        <span>Resumen del medio de pago</span>
                        <strong>{resumenEfectivo}</strong>
                      </div>

                      <button
                        className="plan-modal-button"
                        onClick={confirmarPagoEfectivo}
                        disabled={loading}
                      >
                        {loading ? "Registrando..." : "Reservar pago en efectivo"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {mostrarPasarelaPse && (
        <div
          className="payment-modal-backdrop"
          onClick={() => {
            if (!loading) setMostrarPasarelaPse(false);
          }}
        >
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Pasarela PSE</h3>
            <p>Entidad: {formPago.entidadPse}</p>
            <p>Plan: {plan.plan_nombre}</p>
            <p>Valor: {formatPrice(plan.plan_precio)}</p>
            <p>
              Simulacion de redireccion PSE: al continuar se registrara el pago
              como si hubiera sido aprobado por la entidad seleccionada.
            </p>

            <div className="payment-modal-actions">
              <button
                className="payment-modal-cancel"
                onClick={() => setMostrarPasarelaPse(false)}
                disabled={loading}
              >
                Volver
              </button>
              <button
                className="plan-modal-button"
                onClick={confirmarPagoPse}
                disabled={loading}
              >
                {loading ? "Conectando..." : "Continuar y pagar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
