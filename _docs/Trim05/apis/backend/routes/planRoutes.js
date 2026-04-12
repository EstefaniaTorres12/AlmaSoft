// backend/routes/planRoutes.js
const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Crear plan → Admin y Asesor
router.post(
  "/create",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  planController.create
);

// Ver todos → Admin y Asesor ven todo; Cliente y Afiliado solo activos
router.get("/all", authenticateToken, planController.getAll);

// Ver por ID
router.get("/byId/:id", authenticateToken, planController.getById);

// Actualizar plan → Admin y Asesor
router.put(
  "/update/:id",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  planController.update
);

// Eliminar plan → solo Admin
router.delete(
  "/delete/:id",
  authenticateToken,
  checkRole("Administrador"),
  planController.remove
);

module.exports = router;
