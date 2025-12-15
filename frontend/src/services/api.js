// frontend/src/services/api.js
// Configuración centralizada para las APIs del backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Obtener token del localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Headers por defecto con autenticación
const getHeaders = (requiresAuth = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (requiresAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    return headers;
};

// Funciones para manejo de errores
const handleError = (error) => {
    console.error('Error en la API:', error);
    if (error.response) {
        return {
            success: false,
            message: error.response.data?.message || 'Error en la solicitud',
            status: error.response.status,
        };
    } else if (error.request) {
        return {
            success: false,
            message: 'No se pudo conectar con el servidor',
            status: 0,
        };
    } else {
        return {
            success: false,
            message: error.message || 'Error desconocido',
            status: 0,
        };
    }
};

// ==================== USUARIOS ====================
export const usuarioAPI = {
    // Login
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Crear usuario
    crear: async (usuarioData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/usuarioCreate`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(usuarioData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Obtener usuario por ID
    obtenerPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/id/${id}`, {
                method: 'GET',
                headers: getHeaders(true),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Obtener usuario por documento
    obtenerPorDocumento: async (documento) => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/documento/${documento}`, {
                method: 'GET',
                headers: getHeaders(true),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Actualizar usuario
    actualizar: async (id, usuarioData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/update/${id}`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify(usuarioData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Eliminar usuario
    eliminar: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/deleteU/${id}`, {
                method: 'DELETE',
                headers: getHeaders(true),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },
};

// ==================== PRODUCTOS ====================
export const productoAPI = {
    // Obtener todos los productos
    obtenerTodos: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/productosAll`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Obtener producto por ID
    obtenerPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/producto/${id}`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Crear producto
    crear: async (productoData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/createProducto`, {
                method: 'POST',
                headers: getHeaders(true),
                body: JSON.stringify(productoData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Actualizar producto
    actualizar: async (id, productoData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/updateProducto/${id}`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify(productoData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Eliminar producto
    eliminar: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/productos/deleteProducto/${id}`, {
                method: 'DELETE',
                headers: getHeaders(true),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },
};

// ==================== CATEGORÍAS ====================
export const categoriaAPI = {
    // Obtener todas las categorías
    obtenerTodas: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categorias/categorias`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Obtener categoría por ID
    obtenerPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categorias/categoria/${id}`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Crear categoría
    crear: async (categoriaData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categorias/crearCategoria`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(categoriaData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Actualizar categoría
    actualizar: async (id, categoriaData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categorias/categoriaUpdate/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(categoriaData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Eliminar categoría
    eliminar: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categorias/categoriaDelete/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },
};

// ==================== PLANES ====================
export const planAPI = {
    // Obtener todos los planes
    obtenerTodos: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/planes/all`, {
                method: 'GET',
                headers: getHeaders(true),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Obtener plan por ID
    obtenerPorId: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/planes/${id}`, {
                method: 'GET',
                headers: getHeaders(true),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Crear plan
    crear: async (planData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/planes/create`, {
                method: 'POST',
                headers: getHeaders(true),
                body: JSON.stringify(planData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Actualizar plan
    actualizar: async (id, planData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/planes/update/${id}`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify(planData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Eliminar plan
    eliminar: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/planes/delete/${id}`, {
                method: 'DELETE',
                headers: getHeaders(true),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },
};

// ==================== REPORTES ====================
export const reporteAPI = {
    // Reporte de usuarios
    obtenerUsuarios: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reportes/usuarios`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Reporte de productos
    obtenerProductos: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reportes/productos`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Reporte de planes
    obtenerPlanes: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reportes/planes`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Estadísticas
    obtenerEstadisticas: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/reportes/estadisticas`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Reporte de ventas por período
    obtenerVentasPeriodo: async (fechaInicio, fechaFin) => {
        try {
            const params = new URLSearchParams({
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
            });
            const response = await fetch(`${API_BASE_URL}/reportes/ventas-periodo?${params}`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return handleError(error);
        }
    },
};

// ==================== UTILIDADES ====================
export const guardarToken = (token) => {
    localStorage.setItem('token', token);
};

export const obtenerToken = () => {
    return localStorage.getItem('token');
};

export const eliminarToken = () => {
    localStorage.removeItem('token');
};

const api = {
    usuarioAPI,
    productoAPI,
    categoriaAPI,
    planAPI,
    reporteAPI,
};

export default api;
