import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import AsesorLayout from "./layout/AsesorLayout";
import "./styles/asesorPages.css";

const DetallesCliente = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await authFetch(`http://localhost:3001/api/clientes/id/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setCliente(data.data);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error("Error cargando cliente", error);
                alert("Error cargando datos del cliente");
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    if (loading) {
        return (
            <AsesorLayout>
                <div className="asesor-page-shell">
                    <p>Cargando detalles del cliente...</p>
                </div>
            </AsesorLayout>
        );
    }

    if (!cliente) {
        return (
            <AsesorLayout>
                <div className="asesor-page-shell">
                    <p>No se encontró la información del cliente.</p>
                    <button className="asesor-btn" onClick={() => navigate("/asesor/clientes")}>
                        Volver a la lista
                    </button>
                </div>
            </AsesorLayout>
        );
    }

    return (
        <AsesorLayout>
            <div className="asesor-page-shell">
                <div className="asesor-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Detalles del Cliente</h1>
                        <p>Información completa de {cliente.primer_nombre} {cliente.primer_apellido}.</p>
                    </div>
                    <button className="asesor-btn asesor-btn-secondary" onClick={() => navigate("/asesor/clientes")}>
                        Volver a la lista
                    </button>
                </div>

                <div className="asesor-info-grid" style={{ marginTop: '30px' }}>
                    <div className="asesor-info-card" style={{ gridColumn: 'span 2' }}>
                        <h3>Información Personal</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                            <div>
                                <p><strong>Documento:</strong> {cliente.documento}</p>
                                <p><strong>Nombres:</strong> {cliente.primer_nombre} {cliente.segundo_nombre || ""}</p>
                                <p><strong>Apellidos:</strong> {cliente.primer_apellido} {cliente.segundo_apellido || ""}</p>
                                <p><strong>Edad:</strong> {cliente.edad || "No especificada"}</p>
                            </div>
                            <div>
                                <p><strong>Correo:</strong> {cliente.correo}</p>
                                <p><strong>Teléfono:</strong> {cliente.telefono || "No especificado"}</p>
                                <p><strong>Dirección:</strong> {cliente.direccion}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {cliente.fecha_nacimiento ? new Date(cliente.fecha_nacimiento).toLocaleDateString() : "No especificada"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="asesor-info-card">
                        <div style={{ textAlign: 'center' }}>
                            <img 
                                src="/img/usuario.png" 
                                alt="Perfil" 
                                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px' }} 
                            />
                            <h3>{cliente.primer_nombre}</h3>
                            <p>Cliente Activo</p>
                            <button 
                                className="asesor-btn" 
                                style={{ marginTop: '15px', width: '100%' }}
                                onClick={() => navigate(`/asesor/clientes/editar/${id}`)}
                            >
                                Editar Perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AsesorLayout>
    );
}

export default DetallesCliente;
