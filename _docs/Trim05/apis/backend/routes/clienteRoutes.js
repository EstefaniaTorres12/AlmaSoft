const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const { authenticateToken, checkRole } = require("../middlewares/authMiddleware");

// Crear cliente (Admin y Asesor)
router.post(
  "/create",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  clienteController.create
);

// Obtener todos los clientes (Admin y Asesor)
router.get(
  "/all",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  clienteController.getAll
);

// Obtener cliente por ID
// Admin y Asesor -> cualquiera
// Cliente -> solo el suyo
router.get(
  "/byId/:id",
  authenticateToken,
  clienteController.getById
);

// Actualizar cliente
// Admin y Asesor -> cualquiera
// Cliente -> solo el suyo
router.put(
  "/update/:id",
  authenticateToken,
  clienteController.update
);

// Eliminar cliente (solo Admin)
router.delete(
  "/delete/:id",
  authenticateToken,
  checkRole("Administrador"),
  clienteController.remove
);

module.exports = router;

