const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/login', usuarioController.login);
router.post('/usuarioCreate', usuarioController.register);

//rutas protegidas
router.get('/id/:id', verifyToken, authorizeRoles(['Administrador', 'Asesor']), usuarioController.getUsuarioById);
router.get('/documento/:documento', verifyToken, authorizeRoles(['Administrador', 'Asesor']), usuarioController.getUsuarioByDocument);
router.put('/update/:id', verifyToken, authorizeRoles(['Administrador', 'Asesor','Clieente']), usuarioController.getUsuarioUpdate);
router.delete('/deleteU/:id',verifyToken, authorizeRoles(['Administrador', 'Asesor']), usuarioController.getUsuarioDelete);
router.get('/usuariosAll',usuarioController.getUsuarioAll);

module.exports = router;