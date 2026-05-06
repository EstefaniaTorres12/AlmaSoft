import React, { useEffect, useState } from "react";
import { authFetch } from "../../../utils/authFetch";
import AsesorLayout from "../layout/AsesorLayout";
import "../styles/asesorPages.css";

function buildName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Date(value).toLocaleString("es-CO");
}

export default function AfiliacionesAsesor() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await authFetch("http://localhost:3001/api/client/affiliates/review");
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
  }, []);

  const handleDecision = async (requestId, decision) => {
    setSavingId(requestId);
    setError("");

    try {
      const response = await authFetch(`http://localhost:3001/api/client/affiliates/review/${requestId}`, {
        method: "PUT",
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
      alert(`Solicitud ${decision === 'aprobar' ? 'aprobada' : 'rechazada'} correctamente.`);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message || "No fue posible procesar la solicitud.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AsesorLayout>
        <div className="asesor-page-shell">
            <div className="asesor-page-header">
                <h1>Solicitudes de Afiliación</h1>
                <p>Revisa y gestiona las solicitudes de afiliados pendientes por aprobación.</p>
            </div>

            {loading ? (
                <div className="client-empty-state">Cargando solicitudes...</div>
            ) : error ? (
                <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                    {error}
                </div>
            ) : requests.length === 0 ? (
                <div className="asesor-empty-state">
                    No hay solicitudes pendientes por revisar en este momento.
                </div>
            ) : (
                <div style={{ display: "grid", gap: "20px" }}>
                    {requests.map((request) => (
                        <div key={request.solicitud_id} className="asesor-info-card">
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{buildName(request.postulado_primer_nombre, request.postulado_primer_apellido)}</h3>
                                    <p style={{ margin: '5px 0 0' }}>{request.postulado_correo}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontWeight: 'bold', color: '#5636a5' }}>{request.plan_nombre}</span>
                                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem' }}>{formatDate(request.fecha_solicitud)}</p>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: '20px' }}>
                                <div>
                                    <small style={{ textTransform: 'uppercase', color: '#6f6789', fontWeight: 'bold' }}>Titular</small>
                                    <p style={{ margin: '4px 0 0' }}>{buildName(request.titular_primer_nombre, request.titular_primer_apellido)}</p>
                                </div>
                                <div>
                                    <small style={{ textTransform: 'uppercase', color: '#6f6789', fontWeight: 'bold' }}>Parentesco</small>
                                    <p style={{ margin: '4px 0 0' }}>{request.parentesco}</p>
                                </div>
                                <div>
                                    <small style={{ textTransform: 'uppercase', color: '#6f6789', fontWeight: 'bold' }}>Observación</small>
                                    <p style={{ margin: '4px 0 0' }}>{request.observacion || "Sin observación."}</p>
                                </div>
                            </div>

                            <div className="asesor-form-group">
                                <textarea
                                    className="asesor-form-control"
                                    value={notes[request.solicitud_id] || ""}
                                    onChange={(e) => setNotes(prev => ({ ...prev, [request.solicitud_id]: e.target.value }))}
                                    placeholder="Agrega un motivo o comentario para la revisión..."
                                    style={{ minHeight: '80px', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                                <button
                                    type="button"
                                    className="asesor-btn asesor-btn-secondary"
                                    onClick={() => handleDecision(request.solicitud_id, "rechazar")}
                                    disabled={savingId === request.solicitud_id}
                                >
                                    Rechazar
                                </button>
                                <button
                                    type="button"
                                    className="asesor-btn"
                                    onClick={() => handleDecision(request.solicitud_id, "aprobar")}
                                    disabled={savingId === request.solicitud_id}
                                >
                                    {savingId === request.solicitud_id ? "Procesando..." : "Aprobar Afiliación"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </AsesorLayout>
  );
}
