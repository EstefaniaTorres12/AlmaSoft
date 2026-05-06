import React, { useState, useEffect } from "react";
import { authFetch } from "../../../utils/authFetch";
import AsesorLayout from "../layout/AsesorLayout";
import "../styles/asesorPages.css";

const ProductosFrontAsesor = () => {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await authFetch("http://localhost:3001/api/productos/productosAll");
                const data = await res.json();

                if (res.ok) {
                    setProductos(data.data || []);
                } else {
                    alert("Error al obtener productos");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const productosFiltrados = productos.filter(p =>
        p.producto_nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <AsesorLayout>
            <div className="asesor-page-shell">
                <div className="asesor-page-header">
                    <h1>Lista de Productos</h1>
                    <p>Visualiza el catálogo de productos y servicios disponibles.</p>
                </div>

                <div className="asesor-form-group" style={{ maxWidth: '400px', marginBottom: '30px' }}>
                    <input 
                        className="asesor-form-control"
                        type="text"
                        placeholder="Buscar producto por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                <div className="asesor-table-container">
                    <table className="asesor-table">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Categoría</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Cargando productos...</td>
                                </tr>
                            ) : productosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No se encontraron productos.</td>
                                </tr>
                            ) : (
                                productosFiltrados.map(p => (
                                    <tr key={p.producto_id}>
                                        <td>
                                            <img
                                                src={`/${p.producto_imagen}`}
                                                alt={p.producto_nombre}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                                                onError={(e) => { e.target.src = '/img/default.png'; }}
                                            />
                                        </td>
                                        <td><strong>{p.producto_nombre}</strong></td>
                                        <td>${p.producto_precio}</td>
                                        <td>{p.producto_stock}</td>
                                        <td>
                                            <span style={{ 
                                                padding: '4px 12px', 
                                                borderRadius: '12px', 
                                                fontSize: '0.85rem',
                                                backgroundColor: p.producto_estado === 1 ? '#d4edda' : '#f8d7da',
                                                color: p.producto_estado === 1 ? '#155724' : '#721c24'
                                            }}>
                                                {p.producto_estado === 1 ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td>{p.categoria_nombre}</td>
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

export default ProductosFrontAsesor;
