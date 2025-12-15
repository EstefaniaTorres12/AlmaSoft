const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/ReportesCotrollers');

// Rutas para reportes
router.get('/usuarios', reporteController.obtenerReporteUsuarios);
router.get('/contratos', reporteController.obtenerReporteContratos);
router.get('/productos', reporteController.obtenerReporteProductos);
router.get('/planes', reporteController.obtenerReportePlanes);
router.get('/pagos', reporteController.obtenerReportePagos);
router.get('/estadisticas', reporteController.obtenerEstadisticas);
router.get('/ventas-periodo', reporteController.obtenerReporteVentasPeriodo);
router.get('/servicios-populares', reporteController.obtenerReporteServiciosPopulares);

module.exports = router;