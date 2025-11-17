const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const categoriaController = require('../controllers/categoriaController');

router.post('/crearCategoria', categoriaController.register);
router.get('/categorias', categoriaController.getAllCategorias);
router.get('/categoria/:id', categoriaController.getCategoriaById);
router.put('/categoriaUpdate/:id', categoriaController.getCategoriaUpdate);
router.delete('/categoriaDelete/:id', categoriaController.getCategoriaDelete);


module.exports = router;