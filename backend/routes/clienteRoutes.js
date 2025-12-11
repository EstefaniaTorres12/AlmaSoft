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
