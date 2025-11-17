const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/createRol', rolController.register);
router.get('/Roles', rolController.getAllRoles);
router.get('/rol/:id',rolController.getRolById);
router.delete('/delete/:id', rolController.getRolDelete);


module.exports=router;