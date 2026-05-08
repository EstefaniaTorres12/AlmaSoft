import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../../utils/authFetch";
import AsesorLayout from "../layout/AsesorLayout";
import "../styles/asesorPages.css";

function buildName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

export default function AfiliacionesAsesor() {
  const navigate = useNavigate();
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAffiliates = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await authFetch("http://localhost:3001/api/client/affiliates/all-for-asesor");
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error("La respuesta del servidor no es un JSON válido: " + text.substring(0, 100));
        }
        
        if (response.ok && data.success) {
          setAffiliates(data.data || []);
        } else {
          setError(data.message || "No fue posible cargar los afiliados.");
        }
      } catch (err) {
        console.error("Error cargando afiliados:", err);
        setError(err.message || "Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };
    loadAffiliates();
  }, []);

  const filteredAffiliates = affiliates.filter(a => 
    String(a.afiliado_documento || "").includes(busqueda) ||
    buildName(a.afiliado_nombre, a.afiliado_apellido).toLowerCase().includes(busqueda.toLowerCase()) ||
    buildName(a.titular_nombre, a.titular_apellido).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <AsesorLayout>
        <div className="asesor-page-shell">
            <div className="asesor-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Gestión de Afiliados</h1>
                    <p>Visualiza y administra todos los afiliados vinculados a los contratos.</p>
                </div>
                <button 
                    className="asesor-btn"
                    onClick={() => navigate("/asesor/afiliados/registrar")}
                >
                    Registrar Nuevo Afiliado
                </button>
            </div>

            <div className="asesor-form-group" style={{ maxWidth: '450px', marginBottom: '30px' }}>
                <input 
                    className="asesor-form-control"
                    type="text"
                    placeholder="Buscar por documento, nombre de afiliado o titular..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {error && (
                <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            <div className="asesor-table-container">
                <table className="asesor-table">
                    <thead>
                        <tr>
                            <th>Afiliado</th>
                            <th>Documento</th>
                            <th>Teléfono / Correo</th>
                            <th>Titular Responsable</th>
                            <th style={{ textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Cargando afiliados...</td>
                            </tr>
                        ) : filteredAffiliates.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No se encontraron afiliados registrados.</td>
                            </tr>
                        ) : (
                            filteredAffiliates.map((a) => (
                                <tr key={`${a.afiliado_id}-${a.contrato_id}`}>
                                    <td>
                                        <strong>{buildName(a.afiliado_nombre, a.afiliado_apellido)}</strong>
                                    </td>
                                    <td>{a.afiliado_documento}</td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem' }}>{a.afiliado_telefono || "Sin tel."}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6f6789' }}>{a.afiliado_correo || "Sin correo"}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: '500' }}>{buildName(a.titular_nombre, a.titular_apellido)}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6f6789' }}>CC {a.titular_documento}</div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button 
                                            className="asesor-btn"
                                            style={{ padding: '6px 12px', minHeight: '34px', fontSize: '0.85rem' }}
                                            onClick={() => navigate(`/asesor/afiliados/editar/${a.afiliado_id}`)}
                                        >
                                            Actualizar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </AsesorLayout>
  );
}
