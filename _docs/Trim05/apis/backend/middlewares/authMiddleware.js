const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const RolUsuario = require("../models/rolUsuario");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ------------------------------
// 🔐 Autenticación
// ------------------------------
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Token requerido" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    // cargar roles
    const rolesDB = await RolUsuario.findByUsuarioId(decoded.usuario_id);
    req.user.roles = rolesDB.map((r) => r.rol_nombre);

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido" });
  }
}

// ------------------------------
// 🔐 Autorización
// ------------------------------
function checkRole(...allowed) {
  return (req, res, next) => {
    const userRoles = req.user.roles || [];

    if (userRoles.some((r) => allowed.includes(r))) {
      return next();
    }

    return res.status(403).json({ message: "No tienes permisos" });
  };
}

module.exports = {
  authenticateToken,
  checkRole,
};
