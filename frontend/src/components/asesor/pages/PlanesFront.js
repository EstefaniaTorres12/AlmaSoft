import React, { useEffect, useState } from "react";
import { authFetch } from "../../../utils/authFetch";
import AsesorLayout from "../layout/AsesorLayout";
import "../styles/asesorPages.css";

const PlanesFrontAsesor = () => {
    const [planes, setPlanes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanes = async () => {
            try {
                const response = await authFetch("http://localhost:3001/api/planes/all");
                const data = await response.json();

                if (response.ok) {
                    setPlanes(data.data || []);
                } else {
                    alert("Error al obtener planes");
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlanes();
    }, []);

    const planesFiltrados = planes.filter(p =>
        p.plan_nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <AsesorLayout>
            <div className="asesor-page-shell">
                <div className="asesor-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Planes Fúnebres</h1>
                        <p>Administra los planes disponibles para los clientes.</p>
                    </div>
                </div>

                <div className="asesor-form-group" style={{ maxWidth: '400px', marginBottom: '30px' }}>
                    <input 
                        className="asesor-form-control"
                        type="text"
                        placeholder="Buscar plan por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="asesor-table-container">
                    <table className="asesor-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Cargando planes...</td>
                                </tr>
                            ) : planesFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No se encontraron planes.</td>
                                </tr>
                            ) : (
                                planesFiltrados.map(plan => (
                                    <tr key={plan.plan_id}>
                                        <td>{plan.plan_id}</td>
                                        <td>{plan.plan_nombre}</td>
                                        <td>{plan.plan_descripcion}</td>
                                        <td>${plan.plan_precio}</td>
                                        <td>
                                            <span style={{ 
                                                padding: '4px 12px', 
                                                borderRadius: '12px', 
                                                fontSize: '0.85rem',
                                                backgroundColor: plan.plan_estado === 1 ? '#d4edda' : '#f8d7da',
                                                color: plan.plan_estado === 1 ? '#155724' : '#721c24'
                                            }}>
                                                {plan.plan_estado === 1 ? "Activo" : "Inactivo"}
                                            </span>
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
};

export default PlanesFrontAsesor;
