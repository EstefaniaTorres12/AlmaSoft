import { API_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import "./styles/asesorPages.css";

const RegistrarAfiliado = () => {
    const navigate = useNavigate();

    const [formData, setData] = useState({
        cliente_id: "",
        documento: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        telefono: "",
        correo: ""
    });

    const [clientes, setClientes] = useState([]);
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [loading, setLoading] = useState(false);

    // Cargar clientes titulares
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const res = await authFetch(`${API_URL}/api/clientes/clientesAll`);
                const data = await res.json();
                if (res.ok) {
                    setClientes(data.data || []);
                }
            } catch (err) {
                console.error("Error cargando clientes:", err);
            }
        };
        fetchClientes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validación de máximo 20 números para la cédula
        if (name === "documento") {
            const numericValue = value.replace(/\D/g, ""); // Solo números
            if (numericValue.length <= 20) {
                setData(prev => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        setData(prev => ({ ...prev, [name]: value }));
    };

    const enviarDatos = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authFetch(
                `${API_URL}/api/client/affiliates/register-by-asesor`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                }
            );

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error("Respuesta no válida del servidor: " + text.substring(0, 50));
            }

            if (response.ok) {
                setMostrarAlerta(true);
                setData({
                    cliente_id: "",
                    documento: "",
                    primer_nombre: "",
                    segundo_nombre: "",
                    primer_apellido: "",
                    segundo_apellido: "",
                    telefono: "",
                    correo: ""
                });
                setTimeout(() => {
                    navigate("/asesor/afiliados");
                }, 2000);
            } else {
                alert(data.message || "Error al registrar afiliado");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message || "Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="asesor-page-shell" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="asesor-page-header">
                    <h1>Registrar Nuevo Afiliado</h1>
                    <p>Vincula un nuevo integrante al plan de un cliente titular.</p>
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
                        Afiliado registrado y vinculado correctamente ✅
                    </div>
                )}

                <form onSubmit={enviarDatos}>
                    <div className="asesor-info-card" style={{ marginBottom: '25px' }}>
                        <h3>Selección de Titular</h3>
                        <div className="asesor-form-group">
                            <label>CLIENTE TITULAR</label>
                            <select
                                className="asesor-form-control"
                                name="cliente_id"
                                value={formData.cliente_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona el cliente responsable</option>
                                {clientes.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {`${c.primer_nombre} ${c.primer_apellido} - CC ${c.documento}`}
                                    </option>
                                ))}
                            </select>
                            <small style={{ color: '#6f6789' }}>El afiliado se vinculará al contrato activo de este cliente.</small>
                        </div>
                    </div>

                    <div className="asesor-info-card">
                        <h3>Datos del Afiliado</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="asesor-form-group">
                                <label>CÉDULA / DOCUMENTO (Máx 20 números)</label>
                                <input
                                    className="asesor-form-control"
                                    type="text"
                                    name="documento"
                                    value={formData.documento}
                                    onChange={handleChange}
                                    placeholder="Ej: 12345678"
                                    required
                                />
                            </div>

                            <div className="asesor-form-group">
                                <label>TELÉFONO</label>
                                <input
                                    className="asesor-form-control"
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="Número de contacto"
                                />
                            </div>

                            <div className="asesor-form-group">
                                <label>PRIMER NOMBRE</label>
                                <input
                                    className="asesor-form-control"
                                    type="text"
                                    name="primer_nombre"
                                    value={formData.primer_nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre"
                                    required
                                />
                            </div>

                            <div className="asesor-form-group">
                                <label>SEGUNDO NOMBRE</label>
                                <input
                                    className="asesor-form-control"
                                    type="text"
                                    name="segundo_nombre"
                                    value={formData.segundo_nombre}
                                    onChange={handleChange}
                                    placeholder="Opcional"
                                />
                            </div>

                            <div className="asesor-form-group">
                                <label>PRIMER APELLIDO</label>
                                <input
                                    className="asesor-form-control"
                                    type="text"
                                    name="primer_apellido"
                                    value={formData.primer_apellido}
                                    onChange={handleChange}
                                    placeholder="Apellido"
                                    required
                                />
                            </div>

                            <div className="asesor-form-group">
                                <label>SEGUNDO APELLIDO</label>
                                <input
                                    className="asesor-form-control"
                                    type="text"
                                    name="segundo_apellido"
                                    value={formData.segundo_apellido}
                                    onChange={handleChange}
                                    placeholder="Opcional"
                                />
                            </div>
                        </div>

                        <div className="asesor-form-group">
                            <label>CORREO ELECTRÓNICO</label>
                            <input
                                className="asesor-form-control"
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                            <button
                                type="submit"
                                className="asesor-btn"
                                style={{ flex: 1 }}
                                disabled={loading}
                            >
                                {loading ? "Registrando..." : "Registrar y Vincular"}
                            </button>
                            <button
                                type="button"
                                className="asesor-btn asesor-btn-secondary"
                                onClick={() => navigate("/asesor/afiliados")}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
        </div>
    );
};

export default RegistrarAfiliado;
