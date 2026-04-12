const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

//rutas protegidas
router.post('/createProducto',verifyToken, authorizeRoles(['Administrador']), productoController.createProducto);
router.put('/updateProducto/:id',verifyToken,authorizeRoles(['Administrador','Asesor']),productoController.getProductoUpdate);
router.delete('/deleteProducto/:id',verifyToken,authorizeRoles(['Administrador']),productoController.getProductoDelete);

//rutas publicas
router.get('/productosAll', productoController.getAllProductos);
router.get('/producto/:id',productoController.getProductoById);
router.get('/filtrar', productoController.filtrarPorNombre);

module.exports = router;