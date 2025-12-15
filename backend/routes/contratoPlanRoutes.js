const express = require("express");
const router = express.Router();
const contratoPlanController = require("../controllers/contratoPlanController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Crear relación contrato-plan
router.post(
  "/create",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  contratoPlanController.create
);

// Ver todas las relaciones
router.get(
  "/all",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  contratoPlanController.getAll
);

// Ver los planes de un contrato
router.get(
  "/contrato/:contrato_id",
  verifyToken,
  contratoPlanController.getByContrato
);

// Eliminar relación
router.delete(
  "/delete/:contrato_id/:plan_id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  contratoPlanController.remove
);

module.exports = router;
