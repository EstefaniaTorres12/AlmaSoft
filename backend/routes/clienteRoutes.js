const express  = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const {verifyToken, authorizeRoles} = require('../middlewares/authMiddleware');

router.get('/clientesAll', clienteController.getClienteAll);


module.exports = router;