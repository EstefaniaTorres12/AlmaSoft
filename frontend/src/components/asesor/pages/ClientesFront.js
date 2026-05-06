import React, { useEffect, useState } from "react";
import { authFetch } from "../../../utils/authFetch";
import AsesorLayout from "../layout/AsesorLayout";
import "../styles/asesorPages.css";

const ClientesFront = () => {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await authFetch("http://localhost:3001/api/clientes/clientesAll");
                const data = await response.json();

                if (response.ok) {
                    setClientes(data?.data || []);
                } else {
                    alert(data.message || "Error al obtener los clientes");
                }
            } catch (err) {
                console.log(err);
                alert("Error al conectar con el backend");
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    const clientesFiltrados = clientes.filter(c =>
        String(c.documento || "").includes(busqueda) ||
        (c.primer_nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.primer_apellido || "").toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <AsesorLayout>
            <div className="asesor-page-shell">
                <div className="asesor-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Lista de clientes</h1>
                        <p>Gestiona y visualiza la información de tus clientes registrados.</p>
                    </div>
                    <button 
                        className="asesor-btn"
                        onClick={() => window.location.href = "/asesor/clientes/agregar"}
                    >
                        Agregar Cliente
                    </button>
                </div>

                <div className="asesor-form-group" style={{ maxWidth: '400px', marginBottom: '30px' }}>
                    <input 
                        className="asesor-form-control"
                        type="text"
                        placeholder="Buscar por documento, nombre o apellido..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="asesor-table-container">
                    <table className="asesor-table">
                        <thead>
                            <tr>
                                <th>Documento</th>
                                <th>Primer Nombre</th>
                                <th>Primer Apellido</th>
                                <th>Teléfono</th>
                                <th>Correo</th>
                                <th style={{ textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Cargando clientes...</td>
                                </tr>
                            ) : clientesFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No se encontraron clientes.</td>
                                </tr>
                            ) : (
                                clientesFiltrados.map((cliente) => (
                                    <tr key={cliente.cliente_id || cliente.id}>
                                        <td>{cliente.documento}</td>
                                        <td>{cliente.primer_nombre}</td>
                                        <td>{cliente.primer_apellido}</td>
                                        <td>{cliente.telefono}</td>
                                        <td>{cliente.correo}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button 
                                                    className="asesor-btn asesor-btn-secondary"
                                                    style={{ padding: '6px 12px', minHeight: '34px', fontSize: '0.85rem' }}
                                                    onClick={() => window.location.href = `/asesor/clientes/detalles/${cliente.cliente_id || cliente.id}`}
                                                >
                                                    Detalles
                                                </button>
                                                <button 
                                                    className="asesor-btn"
                                                    style={{ padding: '6px 12px', minHeight: '34px', fontSize: '0.85rem' }}
                                                    onClick={() => window.location.href = `/asesor/clientes/editar/${cliente.cliente_id || cliente.id}`}
                                                >
                                                    Editar
                                                </button>
                                            </div>
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

export default ClientesFront;