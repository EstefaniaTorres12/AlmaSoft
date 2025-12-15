
const Reporte = require('../models/ReportesModels');

exports.obtenerReporteUsuarios = async (req, res) => {
    try {
        Reporte.obtenerUsuarios(req.query, (err, data) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener reporte de usuarios',
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    message: 'Reporte de usuarios obtenido exitosamente',
                    count: data.length,
                    data: data
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.obtenerReporteContratos = async (req, res) => {
    try {
        Reporte.obtenerContratos(req.query, (err, data) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener reporte de contratos',
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    message: 'Reporte de contratos obtenido exitosamente',
                    count: data.length,
                    data: data
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.obtenerReporteProductos = async (req, res) => {
    try {
        Reporte.obtenerProductos(req.query, (err, data) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener reporte de productos',
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    message: 'Reporte de productos obtenido exitosamente',
                    count: data.length,
                    data: data
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.obtenerReportePlanes = async (req, res) => {
    try {
        Reporte.obtenerPlanesFunebres(req.query, (err, data) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener reporte de planes funebres',
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    message: 'Reporte de planes funebres obtenido exitosamente',
                    count: data.length,
                    data: data
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.obtenerReportePagos = async (req, res) => {
    try {
        Reporte.obtenerPagos(req.query, (err, data) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener reporte de pagos',
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    message: 'Reporte de pagos obtenido exitosamente',
                    count: data.length,
                    data: data
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.obtenerEstadisticas = async (req, res) => {
    try {
        Reporte.obtenerEstadisticas((err, data) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener estadísticas',
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    message: 'Estadísticas obtenidas exitosamente',
                    data: data
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.obtenerReporteVentasPeriodo = async (req, res) => {
    try {
        Reporte.obtenerVentasPeriodo(req.query, (err, data) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener reporte de ventas por periodo',
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    message: 'Reporte de ventas por periodo obtenido exitosamente',
                    count: data.length,
                    data: data
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

exports.obtenerReporteServiciosPopulares = async (req, res) => {
    try {
        Reporte.obtenerServiciosPopulares(req.query, (err, data) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'Error al obtener reporte de servicios populares',
                    error: err.message
                });
            } else {
                res.json({
                    success: true,
                    message: 'Reporte de servicios populares obtenido exitosamente',
                    count: data.length,
                    data: data
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};