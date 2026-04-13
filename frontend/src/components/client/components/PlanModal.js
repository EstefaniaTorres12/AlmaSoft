import { useState } from "react";
import "../styles/PlanModal.css";

function formatPrice(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return value || "No disponible";
  }

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(number);
}

export default function PlanModal({ plan, onClose }) {
  const [metodoPago, setMetodoPago] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!plan) return null;

  const productosPorPlan = {
    Basico: ["Ataud basico", "Urna", "Traslado", "Preparacion"],
    Estandar: ["Ataud estandar", "Urna decorada", "Flores"],
    Premium: ["Ataud premium", "Urna especial", "Flores premium"],
    VIP: ["Ataud de lujo", "Urna exclusiva", "Servicios VIP"],
  };

  const servicios = Array.isArray(plan.servicios) ? plan.servicios : [];
  const productos = productosPorPlan[plan.plan_nombre] || [];

  const openPaymentModal = () => {
    if (!metodoPago) {
      alert("Selecciona un metodo de pago");
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePagar = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/client/contrato", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente_id: localStorage.getItem("usuario_id"),
          plan_id: plan.plan_id,
          metodo_pago: metodoPago,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "No fue posible crear el contrato");
      }

      alert("Plan adquirido correctamente");
      setShowPaymentModal(false);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plan-modal-overlay" onClick={onClose}>
      <div className="plan-modal" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="plan-modal-close"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          x
        </button>

        <div className="plan-modal-header">
          <h2>{plan.plan_nombre}</h2>
          <p>{plan.plan_descripcion}</p>
        </div>

        <div className="plan-modal-price">
          <strong>{formatPrice(plan.plan_precio)}</strong>
        </div>

        <h3>Servicios incluidos</h3>
        <ul>
          {servicios.map((servicio, index) => (
            <li key={`${servicio.nombre}-${index}`}>? {servicio.nombre}</li>
          ))}
        </ul>

        <h3>Productos incluidos</h3>
        {productos.length > 0 ? (
          <ul>
            {productos.map((producto, index) => (
              <li key={`${producto}-${index}`}>? {producto}</li>
            ))}
          </ul>
        ) : (
          <p>No hay productos.</p>
        )}

        <h3>Metodo de pago</h3>
        <select
          value={metodoPago}
          onChange={(event) => setMetodoPago(event.target.value)}
          className="plan-select"
        >
          <option value="">Seleccionar</option>
          <option value="efectivo">Efectivo</option>
          <option value="pse">PSE</option>
          <option value="credito">Tarjeta credito</option>
          <option value="debito">Tarjeta debito</option>
        </select>

        <button
          type="button"
          className="plan-modal-button"
          onClick={openPaymentModal}
          disabled={loading}
        >
          Ir a pagar
        </button>

        {showPaymentModal && (
          <div
            className="payment-modal-backdrop"
            onClick={() => setShowPaymentModal(false)}
          >
            <div
              className="payment-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <h3>Confirmar pago</h3>
              <p>
                Plan: <strong>{plan.plan_nombre}</strong>
              </p>
              <p>
                Metodo: <strong>{metodoPago.toUpperCase()}</strong>
              </p>
              <p>
                Total: <strong>{formatPrice(plan.plan_precio)}</strong>
              </p>

              <div className="payment-modal-actions">
                <button
                  type="button"
                  className="payment-modal-cancel"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="plan-modal-button"
                  onClick={handlePagar}
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Confirmar pago"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
