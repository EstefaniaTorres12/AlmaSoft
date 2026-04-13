const express = require("express");
const router = express.Router();
const servicioController = require("../controllers/servicioController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Crear servicio (Admin, Asesor)
router.post(
  "/create",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  servicioController.create
);

// Listar servicios (todos pueden ver)
router.get("/all", verifyToken, servicioController.getAll);

// Ver por ID (todos pueden ver)
router.get("/byId/:id", verifyToken, servicioController.getById);

// Actualizar servicio (Admin, Asesor)
router.put(
  "/update/:id",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  servicioController.update
);

// Eliminar servicio (solo Admin)
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  servicioController.remove
);

module.exports = router;

