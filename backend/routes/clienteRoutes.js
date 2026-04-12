<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Crear cliente
router.post("/create", verifyToken, clienteController.create);

// Todos los clientes (Admin y Asesor)
router.get(
  "/all",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  clienteController.getAll
);

// Obtener cliente por ID
router.get("/:id", verifyToken, clienteController.getById);

// Actualizar cliente
router.put("/update/:id", verifyToken, clienteController.update);

// Eliminar cliente
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  clienteController.remove
);

module.exports = router;
=======
const express  = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Obtener todos los clientes
router.get(
    '/clientesAll',
    verifyToken,
    authorizeRoles(['Administrador', 'Asesor']),
    clienteController.getClienteAll
);

// Obtener cliente por ID
router.get(
    '/id/:id',
    verifyToken,
    authorizeRoles(['Administrador', 'Asesor']),
    clienteController.getClienteById
);

// Crear cliente
router.post(
    '/',
    verifyToken,
    authorizeRoles(['Administrador', 'Asesor']),
    clienteController.createCliente
);

// Actualizar cliente
router.put(
    '/:id',
    verifyToken,
    authorizeRoles(['Administrador', 'Asesor']),
    clienteController.updateCliente
);

// Eliminar cliente
router.delete(
    '/:id',
    verifyToken,
    authorizeRoles(['Administrador']),
    clienteController.deleteCliente
);

module.exports = router;
>>>>>>> main
