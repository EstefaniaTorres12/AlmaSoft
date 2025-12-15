const express = require("express");
const router = express.Router();
const rolUsuarioController = require("../controllers/rolUsuarioController");
const { verifyToken, authorizeRoles } = require("../middlewares/authMiddleware");
const db = require("../config/config");

// Asignar rol
router.post(
  "/asignar",
  async (req, res, next) => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM ROL_USUARIO");

    if (rows[0].total === 0) {
      return rolUsuarioController.assign(req, res);
    }

    verifyToken(req, res, () =>
      authorizeRoles(["Administrador"])(req, res, next)
    );
  },
  rolUsuarioController.assign
);

// Ver todos
router.get(
  "/all",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  rolUsuarioController.getAll
);

// Ver roles de un usuario
router.get(
  "/usuario/:usuario_id",
  verifyToken,
  authorizeRoles(["Administrador", "Asesor"]),
  rolUsuarioController.getByUsuario
);

// Cambiar estado
router.put(
  "/estado/:id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  rolUsuarioController.updateEstado
);

// Eliminar asignación
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles(["Administrador"]),
  rolUsuarioController.remove
);

module.exports = router;


