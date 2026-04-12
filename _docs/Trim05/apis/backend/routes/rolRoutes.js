const express = require("express");
const router = express.Router();
const rolController = require("../controllers/rolController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// SOLO ADMIN puede crear roles
router.post(
  "/rolCreate",
  authenticateToken,
  checkRole("Administrador"),
  rolController.create
);

// ADMIN y ASESOR pueden ver todos los roles
router.get(
  "/rolesAll",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  rolController.getAll
);

// ADMIN y ASESOR pueden ver por ID
router.get(
  "/rolById/:id",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  rolController.getById
);

// SOLO ADMIN puede actualizar
router.put(
  "/rolUpdate/:id",
  authenticateToken,
  checkRole("Administrador"),
  rolController.update
);

// SOLO ADMIN puede eliminar
router.delete(
  "/rolDelete/:id",
  authenticateToken,
  checkRole("Administrador"),
  rolController.remove
);

module.exports = router;
