const express = require("express");
const router = express.Router();
const rolUsuarioController = require("../controllers/rolUsuarioController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");
const { query } = require("../config/db");

// Asignar rol — primer uso sin auth (tabla vacía), resto requiere Admin
router.post(
  "/asignar",
  async (req, res, next) => {
    try {
      const rows = await query("SELECT COUNT(*) AS total FROM rol_usuario");
      if (rows[0].total === 0) {
        return rolUsuarioController.assign(req, res);
      }
      verifyToken(req, res, () =>
        authorizeRoles(["Administrador"])(req, res, next)
      );
    } catch (err) {
      next(err);
    }
  },
  rolUsuarioController.assign
);

// Ver todos los roles asignados
router.get(
  "/all",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  rolUsuarioController.getAll
);

// Ver roles de un usuario específico
router.get(
  "/usuario/:usuario_id",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  rolUsuarioController.getByUsuario
);

// Activar / desactivar credencial
router.put(
  "/estado/:id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  rolUsuarioController.updateEstado
);

// Eliminar asignación de rol
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  rolUsuarioController.remove
);

module.exports = router;
