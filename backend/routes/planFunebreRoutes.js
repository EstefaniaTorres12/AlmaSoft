const express = require('express');
const router = express.Router();
const controller = require('../controllers/planFunebreController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Rutas públicas (deben ir antes de /:id para evitar conflicto de segmento)
router.get('/public', controller.getAllPlanes);

// CRUD protegido
router.post('/crear',verifyToken, authorizeRoles(['Administrador', 'Asesor']), controller.createPlan);
router.get('/',verifyToken, authorizeRoles(['Administrador', 'Asesor']), controller.getAllPlanes);
router.get('/:id',verifyToken, authorizeRoles(['Administrador', 'Asesor']), controller.getPlanById);
router.put('/update/:id',verifyToken, authorizeRoles(['Administrador', 'Asesor']), controller.updatePlan);
router.delete('/delete/:id',verifyToken, authorizeRoles(['Administrador', 'Asesor']), controller.deletePlan);

module.exports = router;