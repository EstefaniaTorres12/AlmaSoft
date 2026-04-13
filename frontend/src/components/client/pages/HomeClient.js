import { useEffect, useState } from "react";
import ClientLayout from "../layout/ClientLayout";
import PlanModal from "../components/PlanModal";

export default function HomeClient() {

  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 estado del modal
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

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

  return (
    <ClientLayout>

      <h1>Bienvenido Cliente</h1>
      <p>Este es tu panel principal</p>

      <h3>Servicios adicionales</h3>

      <div style={plansContainerStyle}>

        {loading ? (
          <p>Cargando planes...</p>
        ) : error ? (
          <p>{error}</p>
        ) : planes.length === 0 ? (
          <p>No hay planes registrados.</p>
        ) : (
          planes.map((plan) => (
            <div
              key={plan.plan_id}
              style={cardStyle}
              onClick={() => setPlanSeleccionado(plan)} // 🔥 abrir modal
            >
              <h4>{plan.plan_nombre}</h4>
              <p>${plan.plan_precio} al mes</p>
              <small>{plan.plan_descripcion}</small>
            </div>
          ))
        )}

      </div>

      {/* 🔥 MODAL */}
      {planSeleccionado && (
        <PlanModal
          plan={planSeleccionado}
          onClose={() => setPlanSeleccionado(null)}
        />
      )}

    </ClientLayout>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  width: "250px",
  cursor: "pointer" // 🔥 para que se note clickeable
};

const plansContainerStyle = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
  flexWrap: "wrap"
};