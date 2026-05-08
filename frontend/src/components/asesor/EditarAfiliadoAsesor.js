import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import AsesorLayout from "./layout/AsesorLayout";
import "./styles/asesorPages.css";

const EditarAfiliadoAsesor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setData] = useState({
        documento: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        correo: "",
        direccion: "",
        telefono: "",
        fecha_nacimiento: "",
        edad: "",
        credencial: ""
    });

    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAfiliado = async () => {
            try {
                const res = await authFetch(`http://localhost:3001/api/usuarios/id/${id}`);
                const data = await res.json();

                if (res.ok && data.success) {
                    const usuario = data.data;
                    setData({
                        documento: usuario.usuario_documento || "",
                        primer_nombre: usuario.usuario_primer_nombre || "",
                        segundo_nombre: usuario.usuario_segundo_nombre || "",
                        primer_apellido: usuario.usuario_primer_apellido || "",
                        segundo_apellido: usuario.usuario_segundo_apellido || "",
                        correo: usuario.usuario_correo || "",
                        direccion: usuario.usuario_direccion || "No especificada",
                        telefono: usuario.telefono || "",
                        fecha_nacimiento: usuario.fecha_nacimiento ? new Date(usuario.fecha_nacimiento).toISOString().split('T')[0] : "",
                        edad: usuario.edad || "",
                        credencial: ""
                    });
                } else {
                    alert(data.message || "Error al cargar datos del afiliado");
                    navigate("/asesor/afiliados");
                }
            } catch (error) {
                console.error(error);
                alert("Error de conexión al cargar el afiliado");
            } finally {
                setLoading(false);
            }
        };

        fetchAfiliado();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "documento") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 20) {
                setData(prev => ({ ...prev, [name]: numericValue }));
            }
            return;
        }

        setData(prev => ({ ...prev, [name]: value }));
    };

    const enviarDatos = async (e) => {
        e.preventDefault();

        const payload = {
            usuario_documento: formData.documento,
            usuario_primer_nombre: formData.primer_nombre,
            usuario_segundo_nombre: formData.segundo_nombre,
            usuario_primer_apellido: formData.primer_apellido,
            usuario_segundo_apellido: formData.segundo_apellido,
            usuario_correo: formData.correo,
            usuario_direccion: formData.direccion,
            telefono: formData.telefono,
            fecha_nacimiento: formData.fecha_nacimiento,
            edad: formData.edad
        };

        if (formData.credencial) {
            payload.usuario_credencial = formData.credencial;
        }

        try {
            const res = await authFetch(`http://localhost:3001/api/usuarios/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setMostrarAlerta(true);
                setTimeout(() => {
                    navigate("/asesor/afiliados");
                }, 1500);
            } else {
                alert(data.message || "Error al actualizar afiliado");
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    };

    if (loading) {
        return (
            <AsesorLayout>
                <div className="asesor-page-shell">
                    <p>Cargando datos del afiliado...</p>
                </div>
            </AsesorLayout>
        );
    }

    return (
        <AsesorLayout>
            <div className="asesor-page-shell" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="asesor-page-header">
                    <h1>Editar Afiliado</h1>
                    <p>Actualiza la información personal del afiliado.</p>
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
                        Información del afiliado actualizada ✅
                    </div>
                )}

                <form onSubmit={enviarDatos}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="asesor-form-group">
                            <label>DOCUMENTO (Máx 20 números)</label>
                            <input
                                className="asesor-form-control"
                                type="text"
                                name="documento"
                                value={formData.documento}
                                onChange={handleChange}
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
                            required
                        />
                    </div>

                    <div className="asesor-form-group">
                        <label>DIRECCIÓN</label>
                        <input
                            className="asesor-form-control"
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                        <button type="submit" className="asesor-btn" style={{ flex: 1 }}>
                            Guardar Cambios
                        </button>
                        <button type="button" className="asesor-btn asesor-btn-secondary" onClick={() => navigate("/asesor/afiliados")}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </AsesorLayout>
    );
};

export default EditarAfiliadoAsesor;
