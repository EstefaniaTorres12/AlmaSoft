// backend/routes/servicioPlanRoutes.js
const express = require("express");
const router = express.Router();
const servicioPlanController = require("../controllers/servicioPlanController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Crear relación servicio–plan
router.post(
  "/create",
  authenticateToken,
  checkRole("Administrador"),
  servicioPlanController.create
);

// Ver todas las relaciones
router.get(
  "/all",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  servicioPlanController.getAll
);

// Ver servicios por plan
router.get(
  "/plan/:plan_id",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  servicioPlanController.getByPlan
);

// 🔥 NUEVA RUTA → Actualizar relación
router.put(
  "/update/:servicio_id/:plan_id",
  authenticateToken,
  checkRole("Administrador"),
  servicioPlanController.update
);

// Eliminar relación
router.delete(
  "/delete/:servicio_id/:plan_id",
  authenticateToken,
  checkRole("Administrador"),
  servicioPlanController.remove
);

module.exports = router;
