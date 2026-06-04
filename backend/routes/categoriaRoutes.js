const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const categoriaController = require('../controllers/categoriaController');

// Ruta pública (antes de /:id para evitar conflicto de segmento)
router.get('/public', categoriaController.getAllCategorias);

router.post('/crear', verifyToken, authorizeRoles(['Administrador', 'Asesor']),categoriaController.register);
router.get('/',verifyToken, authorizeRoles(['Administrador', 'Asesor']), categoriaController.getAllCategorias);
router.get('/:id',verifyToken, authorizeRoles(['Administrador', 'Asesor']), categoriaController.getCategoriaById);
router.put('/update/:id',verifyToken, authorizeRoles(['Administrador', 'Asesor']), categoriaController.getCategoriaUpdate);
router.delete('/delete/:id',verifyToken, authorizeRoles(['Administrador', 'Asesor']), categoriaController.getCategoriaDelete);


module.exports = router;