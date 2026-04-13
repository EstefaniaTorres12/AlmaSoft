const express = require("express");
const router = express.Router();
const servicioController = require("../controllers/servicioController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Crear servicio (Admin, Asesor)
router.post(
  "/create",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  servicioController.create
);

// Listar servicios (todos pueden ver)
router.get("/all", authenticateToken, servicioController.getAll);

// Ver por ID (todos pueden ver)
router.get("/byId/:id", authenticateToken, servicioController.getById);

// Actualizar servicio (Admin, Asesor)
router.put(
  "/update/:id",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  servicioController.update
);

// Eliminar servicio (solo Admin)
router.delete(
  "/delete/:id",
  authenticateToken,
  checkRole("Administrador"),
  servicioController.remove
);

module.exports = router;
