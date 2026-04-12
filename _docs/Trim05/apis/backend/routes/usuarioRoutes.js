const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarioController");
const { authenticateToken, checkRole } = require("../middlewares/authMiddleware");

// Rutas públicas
router.get("/raiz", (req, res) => {
  res.json({ message: "API Usuarios funcionando correctamente" });
});

router.post("/userCreate", UsuarioController.register);
router.post("/login", UsuarioController.login);

// -------------------------------------------
// 🔐 RUTAS PROTEGIDAS
// -------------------------------------------

// ADMIN y ASESOR pueden ver todos
router.get(
  "/usersAll",
  authenticateToken,
  checkRole("Administrador", "Asesor"),
  UsuarioController.getAll
);

// Restricciones internas aplican dentro del controlador
router.get(
  "/userById/:id",
  authenticateToken,
  UsuarioController.getById
);

// Todos pueden actualizar (control interno decide)
router.put(
  "/userUpdate/:id",
  authenticateToken,
  UsuarioController.update
);

// SOLO ADMIN puede eliminar
router.delete(
  "/userDelete/:id",
  authenticateToken,
  checkRole("Administrador"),
  UsuarioController.remove
);

module.exports = router;

