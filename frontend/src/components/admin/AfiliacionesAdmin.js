import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";

function buildName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-CO");
}

export default function AfiliacionesAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [notes, setNotes] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/api/client/affiliates/review`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "No fue posible cargar solicitudes.");
        }

        setRequests(data.data || []);
      } catch (requestError) {
        console.error(requestError);
        setError(requestError.message || "No fue posible cargar solicitudes.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [token]);

  const handleDecision = async (requestId, decision) => {
    setSavingId(requestId);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/client/affiliates/review/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          decision,
          motivo_revision: notes[requestId] || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No fue posible procesar la solicitud.");
      }

      setRequests((current) => current.filter((request) => request.solicitud_id !== requestId));
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message || "No fue posible procesar la solicitud.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ padding: "32px" }}>
      <div
        style={{
          padding: "28px",
          borderRadius: "24px",
          background: "linear-gradient(180deg, #fffdf8 0%, #f6f0ea 100%)",
          boxShadow: "0 22px 40px rgba(35, 24, 18, 0.08)",
          border: "1px solid #eadfce",
        }}
      >
        <div style={{ marginBottom: "24px" }}>
          <p style={{ margin: 0, color: "#8a6949", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Revision administrativa
          </p>
          <h1 style={{ margin: "8px 0 0", color: "#3f2617" }}>Solicitudes de afiliacion</h1>
          <p style={{ color: "#6f5a4a", maxWidth: "60ch" }}>
            Revisa las solicitudes pendientes, valida el cupo del plan y decide si el usuario puede quedar afiliado.
          </p>
        </div>

        {loading ? <p>Cargando solicitudes...</p> : null}
        {error ? <p style={{ color: "#a03e55" }}>{error}</p> : null}

        {!loading && !requests.length ? (
          <div
            style={{
              padding: "24px",
              borderRadius: "18px",
              background: "#fff",
              border: "1px dashed #dac9b4",
              color: "#6f5a4a",
            }}
          >
            No hay solicitudes pendientes por revisar.
          </div>
        ) : null}

        <div style={{ display: "grid", gap: "18px" }}>
          {requests.map((request) => (
            <article
              key={request.solicitud_id}
              style={{
                padding: "22px",
                borderRadius: "22px",
                background: "#fff",
                border: "1px solid #eadfce",
                display: "grid",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                <div>
                  <strong style={{ color: "#3f2617", fontSize: "1.05rem" }}>
                    {buildName(request.postulado_primer_nombre, request.postulado_primer_apellido)}
                  </strong>
                  <p style={{ margin: "8px 0 0", color: "#6f5a4a" }}>{request.postulado_correo}</p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <strong style={{ color: "#6e4c2d" }}>{request.plan_nombre}</strong>
                  <p style={{ margin: "8px 0 0", color: "#8a6d55" }}>{formatDate(request.fecha_solicitud)}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
                <div>
                  <strong style={{ color: "#5b3b24" }}>Titular</strong>
                  <p style={{ margin: "6px 0 0", color: "#6f5a4a" }}>
                    {buildName(request.titular_primer_nombre, request.titular_primer_apellido)}
                  </p>
                </div>
                <div>
                  <strong style={{ color: "#5b3b24" }}>Parentesco</strong>
                  <p style={{ margin: "6px 0 0", color: "#6f5a4a" }}>{request.parentesco}</p>
                </div>
                <div>
                  <strong style={{ color: "#5b3b24" }}>Observacion</strong>
                  <p style={{ margin: "6px 0 0", color: "#6f5a4a" }}>{request.observacion || "Sin observacion."}</p>
                </div>
              </div>

              <textarea
                value={notes[request.solicitud_id] || ""}
                onChange={(event) =>
                  setNotes((current) => ({
                    ...current,
                    [request.solicitud_id]: event.target.value,
                  }))
                }
                placeholder="Motivo o comentario para la revision"
                style={{
                  minHeight: "96px",
                  borderRadius: "16px",
                  border: "1px solid #dccab5",
                  padding: "14px 16px",
                  resize: "vertical",
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleDecision(request.solicitud_id, "rechazar")}
                  disabled={savingId === request.solicitud_id}
                  style={{
                    border: "1px solid #e3c7ce",
                    background: "#fff1f3",
                    color: "#9d3752",
                    borderRadius: "14px",
                    padding: "12px 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Rechazar
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(request.solicitud_id, "aprobar")}
                  disabled={savingId === request.solicitud_id}
                  style={{
                    border: 0,
                    background: "linear-gradient(135deg, #7a4cff 0%, #4b2b97 100%)",
                    color: "#fff",
                    borderRadius: "14px",
                    padding: "12px 18px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {savingId === request.solicitud_id ? "Procesando..." : "Aprobar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
