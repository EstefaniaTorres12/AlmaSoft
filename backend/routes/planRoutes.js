const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");

// Crear plan
router.post("/create", verifyToken, planController.create);

// Obtener todos los planes (Admin y Asesor)
router.get(
  "/all",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  planController.getAll
);

// Obtener plan por ID
router.get("/:id", verifyToken, planController.getById);

// Actualizar plan
router.put("/update/:id", verifyToken, planController.update);

// Eliminar plan (solo Admin)
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  planController.remove
);

module.exports = router;

