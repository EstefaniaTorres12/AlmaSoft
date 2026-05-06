import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import AsesorLayout from "./layout/AsesorLayout";
import "./styles/asesorPages.css";

const AgregarCliente = () => {
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

    const handleChange = (e) => {
        setData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

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
            credencial: formData.credencial
        };

        try {
            const response = await authFetch(
                "http://localhost:3001/api/clientes/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cliente)
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMostrarAlerta(true);

                // limpiar form
                setData({
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

                // redirigir después de 1.5s
                setTimeout(() => {
                    navigate("/asesor/clientes");
                }, 1500);

            } else {
                alert(data.message || "Error al crear cliente");
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <AsesorLayout>
            <div className="asesor-page-shell" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="asesor-page-header">
                    <h1>Agregar Nuevo Cliente</h1>
                    <p>Completa el formulario para registrar un nuevo cliente en el sistema.</p>
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
                        Cliente creado correctamente ✅
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
                        <label>CONTRASEÑA</label>
                        <input
                            className="asesor-form-control"
                            type="password"
                            name="credencial"
                            value={formData.credencial}
                            onChange={handleChange}
                            placeholder="Establece una contraseña"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                        <button
                            type="submit"
                            className="asesor-btn"
                            style={{ flex: 1 }}
                        >
                            Guardar Cliente
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
        </AsesorLayout>
    );
};

export default AgregarCliente;