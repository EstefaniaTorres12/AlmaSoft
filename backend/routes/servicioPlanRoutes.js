const express = require("express");
const router = express.Router();
const servicioPlanController = require("../controllers/servicioPlanController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Crear relación servicio–plan
router.post(
  "/create",
  verifyToken,
  authorizeRoles(["Administrador"]),
  servicioPlanController.create
);

// Ver todas las relaciones
router.get(
  "/all",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  servicioPlanController.getAll
);

// Ver servicios por plan
router.get(
  "/plan/:plan_id",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  servicioPlanController.getByPlan
);

// Actualizar relación
router.put(
  "/update/:servicio_id/:plan_id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  servicioPlanController.update
);

// Eliminar relación
router.delete(
  "/delete/:servicio_id/:plan_id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  servicioPlanController.remove
);

module.exports = router;

