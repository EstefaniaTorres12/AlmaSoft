const express = require("express");
const router = express.Router();
const contratoPlanController = require("../controllers/contratoPlanController");

const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Crear relación contrato-plan
router.post(
  "/create",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  contratoPlanController.create
);

// Ver todas las relaciones
router.get(
  "/all",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  contratoPlanController.getAll
);

// Ver los planes de un contrato
router.get(
  "/contrato/:contrato_id",
  authenticateToken,
  contratoPlanController.getByContrato
);

// Eliminar relación
router.delete(
  "/delete/:contrato_id/:plan_id",
  authenticateToken,
  checkRole("Administrador"),
  contratoPlanController.remove
);

module.exports = router;
