const express = require("express");
const router = express.Router();
const rolUsuarioController = require("../controllers/rolUsuarioController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");
const db = require("../config/config");

// Asignar rol
router.post(
  "/asignar",
  async (req, res, next) => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM ROL_USUARIO");

    if (rows[0].total === 0) {
      return rolUsuarioController.assign(req, res);
    }

    authenticateToken(req, res, () =>
      checkRole("Administrador")(req, res, next)
    );
  },
  rolUsuarioController.assign
);

// Ver todos
router.get(
  "/all",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  rolUsuarioController.getAll
);

// Ver roles de un usuario
router.get(
  "/usuario/:usuario_id",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  rolUsuarioController.getByUsuario
);

// Cambiar estado
router.put(
  "/estado/:id",
  authenticateToken,
  checkRole("Administrador"),
  rolUsuarioController.updateEstado
);

// Eliminar asignación
router.delete(
  "/delete/:id",
  authenticateToken,
  checkRole("Administrador"),
  rolUsuarioController.remove
);

module.exports = router;
