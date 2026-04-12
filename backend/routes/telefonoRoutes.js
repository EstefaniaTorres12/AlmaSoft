const express = require("express");
const router = express.Router();
const telefonoController = require("../controllers/telefonoController");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Crear teléfono
router.post("/create", verifyToken, telefonoController.create);

// Ver todos (solo Admin y Asesor)
router.get(
  "/all",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  telefonoController.getAll
);

// Teléfonos por usuario
router.get(
  "/usuario/:usuario_id",
  verifyToken,
  telefonoController.getByUsuario
);

// Actualizar teléfono
router.put("/update/:usuario_id", verifyToken, telefonoController.update);

// Eliminar teléfono
router.delete(
  "/delete/:usuario_id/:telefono",
  verifyToken,
  telefonoController.remove
);

module.exports = router;

