import { API_URL } from "../../config/api";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import "./styles/asesorPages.css";

const EditarCliente = () => {
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

    // 🔹 OBTENER CLIENTE POR ID
    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const res = await authFetch(
                    `${API_URL}/api/clientes/id/${id}`
                );

                const data = await res.json();

                if (res.ok) {
                    const cliente = data.data;
                    setData({
                        documento: cliente.documento,
                        primer_nombre: cliente.primer_nombre,
                        segundo_nombre: cliente.segundo_nombre || "",
                        primer_apellido: cliente.primer_apellido,
                        segundo_apellido: cliente.segundo_apellido || "",
                        correo: cliente.correo,
                        direccion: cliente.direccion,
                        telefono: cliente.telefono || "",
                        fecha_nacimiento: cliente.fecha_nacimiento ? new Date(cliente.fecha_nacimiento).toISOString().split('T')[0] : "",
                        edad: cliente.edad || "",
                        credencial: "" // No cargar contraseña por seguridad
                    });
                } else {
                    alert(data.message);
                }

            } catch (error) {
                console.error(error);
                alert("Error al cargar cliente");
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    // 🔹 HANDLE CHANGE
    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 🔹 ACTUALIZAR CLIENTE
    const enviarDatos = async (e) => {
        e.preventDefault();

        const cliente = {
            documento: formData.documento,
            primer_nombre: formData.primer_nombre,
            segundo_nombre: formData.segundo_nombre,
            primer_apellido: formData.primer_apellido,
            segundo_apellido: formData.segundo_apellido,
            correo: formData.correo,
            direccion: formData.direccion,
            telefono: formData.telefono,
            fecha_nacimiento: formData.fecha_nacimiento,
            edad: formData.edad,
            credencial: formData.credencial || undefined // Solo si se cambia
        };

        try {
            const res = await authFetch(
                `${API_URL}/api/clientes/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cliente)
                }
            );

            const data = await res.json();

            if (res.ok) {
                setMostrarAlerta(true);
                setTimeout(() => {
                    navigate("/asesor/clientes");
                }, 1500);
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Error al actualizar cliente");
        }
    };

    if (loading) {
        return (
            <div className="asesor-page-shell">
                <p>Cargando datos del cliente...</p>
            </div>
        );
    }

    return (
        <div className="asesor-page-shell" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="asesor-page-header">
                    <h1>Editar Cliente</h1>
                    <p>Actualiza la información del cliente seleccionado.</p>
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
                        Cliente actualizado correctamente ✅
                    </div>
                )}

                <form onSubmit={enviarDatos}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="asesor-form-group">
                            <label>DOCUMENTO</label>
                            <input
                                className="asesor-form-control"
                                type="text"
                                name="documento"
                                value={formData.documento}
                                onChange={handleChange}
                                placeholder="Número de documento"
                                required
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
                                placeholder="Primer nombre"
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
                                placeholder="Segundo nombre"
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
                                placeholder="Primer apellido"
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
                                placeholder="Segundo apellido"
                            />
                        </div>

                        <div className="asesor-form-group">
                            <label>CORREO</label>
                            <input
                                className="asesor-form-control"
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="Correo electrónico"
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
                                placeholder="Número de teléfono"
                                required
                            />
                        </div>

                        <div className="asesor-form-group">
                            <label>EDAD</label>
                            <input
                                className="asesor-form-control"
                                type="text"
                                name="edad"
                                value={formData.edad}
                                onChange={handleChange}
                                placeholder="Edad"
                                required
                            />
                        </div>
                    </div>

                    <div className="asesor-form-group">
                        <label>DIRECCIÓN</label>
                        <input
                            className="asesor-form-control"
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            placeholder="Dirección completa"
                            required
                        />
                    </div>

                    <div className="asesor-form-group">
                        <label>FECHA DE NACIMIENTO</label>
                        <input
                            className="asesor-form-control"
                            type="date"
                            name="fecha_nacimiento"
                            value={formData.fecha_nacimiento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="asesor-form-group">
                        <label>CONTRASEÑA (dejar vacío para no cambiar)</label>
                        <input
                            className="asesor-form-control"
                            type="password"
                            name="credencial"
                            value={formData.credencial}
                            onChange={handleChange}
                            placeholder="Nueva contraseña"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                        <button
                            type="submit"
                            className="asesor-btn"
                            style={{ flex: 1 }}
                        >
                            Actualizar Cliente
                        </button>
                        <button
                            type="button"
                            className="asesor-btn asesor-btn-secondary"
                            onClick={() => navigate("/asesor/clientes")}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
        </div>
    );
};

export default EditarCliente;