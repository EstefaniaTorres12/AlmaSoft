const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/createSubC',verifyToken, authorizeRoles(['Administrador', 'Asesor']),subcategoriaController.crearSubcategoria);
router.put('/updateSubC/:id',verifyToken, authorizeRoles(['Administrador', 'Asesor']), subcategoriaController.getSubcategoriaUpdate);
router.delete('/deleteSubC/:id',verifyToken, authorizeRoles(['Administrador', 'Asesor']), subcategoriaController.getSubcategoriaDelete);


//rutas puplicasssss
router.get('/subCAll', subcategoriaController.getAllSubcategorias);
router.get('/subCId/:id',subcategoriaController.getSubcategoriaById);

module.exports = router;