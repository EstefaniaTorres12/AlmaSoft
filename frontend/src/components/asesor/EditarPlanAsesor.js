import { API_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import "./styles/asesorPages.css";

const EditarPlanAsesor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        plan_id: id,
        plan_nombre: "",
        plan_descripcion: "",
        plan_precio: "",
        plan_estado: 1
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await authFetch(`${API_URL}/api/planes/${id}`);
                const data = await response.json();

                if (response.ok && data.success) {
                    const plan = data.data;
                    setFormData({
                        plan_id: plan.plan_id,
                        plan_nombre: plan.plan_nombre || "",
                        plan_descripcion: plan.plan_descripcion || "",
                        plan_precio: plan.plan_precio || "",
                        plan_estado: plan.plan_estado ?? 1
                    });
                } else {
                    alert("No se pudo cargar la información del plan.");
                    navigate("/asesor/planes");
                }
            } catch (error) {
                console.error("Error cargando plan:", error);
                alert("Error de conexión al cargar el plan.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "plan_estado" || name === "plan_precio" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await authFetch(`${API_URL}/api/planes/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMostrarAlerta(true);
                setTimeout(() => {
                    navigate("/asesor/planes");
                }, 1500);
            } else {
                alert(data.message || "Error al actualizar el plan.");
            }
        } catch (error) {
            console.error("Error actualizando plan:", error);
            alert("Error de conexión al actualizar el plan.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="asesor-page-shell">
                <p>Cargando información del plan...</p>
            </div>
        );
    }

    return (
        <div className="asesor-page-shell" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="asesor-page-header">
                    <h1>Editar Plan Fúnebre</h1>
                    <p>Actualiza los detalles y el estado del plan seleccionado.</p>
                </div>

                {mostrarAlerta && (
                    <div style={{ 
                        padding: '15px', 
                        backgroundColor: '#d4edda', 
                        color: '#155724', 
                        borderRadius: '12px', 
                        marginBottom: '20px',
                        border: '1px solid #c3e6cb'
                    }}>
                        Plan actualizado correctamente ✅
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="asesor-info-card">
                        <div className="asesor-form-group">
                            <label>NOMBRE DEL PLAN</label>
                            <input
                                className="asesor-form-control"
                                type="text"
                                name="plan_nombre"
                                value={formData.plan_nombre}
                                onChange={handleChange}
                                placeholder="Ej: Plan Platino"
                                required
                            />
                        </div>

                        <div className="asesor-form-group">
                            <label>PRECIO</label>
                            <input
                                className="asesor-form-control"
                                type="number"
                                name="plan_precio"
                                value={formData.plan_precio}
                                onChange={handleChange}
                                placeholder="Precio en pesos"
                                required
                            />
                        </div>

                        <div className="asesor-form-group">
                            <label>ESTADO</label>
                            <select
                                className="asesor-form-control"
                                name="plan_estado"
                                value={formData.plan_estado}
                                onChange={handleChange}
                                required
                            >
                                <option value={1}>Activo</option>
                                <option value={0}>Inactivo</option>
                            </select>
                        </div>

                        <div className="asesor-form-group">
                            <label>DESCRIPCIÓN</label>
                            <textarea
                                className="asesor-form-control"
                                name="plan_descripcion"
                                value={formData.plan_descripcion}
                                onChange={handleChange}
                                placeholder="Detalles del plan..."
                                style={{ minHeight: '120px', resize: 'vertical' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                            <button
                                type="submit"
                                className="asesor-btn"
                                style={{ flex: 1 }}
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "Actualizar Plan"}
                            </button>
                            <button
                                type="button"
                                className="asesor-btn asesor-btn-secondary"
                                onClick={() => navigate("/asesor/planes")}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
        </div>
    );
};

export default EditarPlanAsesor;
