const express = require("express");
const router = express.Router();
const telefonoController = require("../controllers/telefonoController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Crear teléfono
router.post("/create", authenticateToken, telefonoController.create);

// Ver todos (solo Admin y Asesor)
router.get(
  "/all",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  telefonoController.getAll
);

// Teléfonos por usuario
router.get(
  "/usuario/:usuario_id",
  authenticateToken,
  telefonoController.getByUsuario
);

// Actualizar teléfono
router.put("/update/:usuario_id", authenticateToken, telefonoController.update);

// Eliminar teléfono
router.delete(
  "/delete/:usuario_id/:telefono",
  authenticateToken,
  telefonoController.remove
);

module.exports = router;
