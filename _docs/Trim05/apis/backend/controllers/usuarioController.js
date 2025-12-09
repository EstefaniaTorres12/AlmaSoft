const Usuario = require("../models/usuario");
const RolUsuario = require("../models/rolUsuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

module.exports = {
  async register(req, res) {
    try {
      const {
        usuario_primer_nombre,
        usuario_segundo_nombre,
        usuario_primer_apellido,
        usuario_segundo_apellido,
        usuario_documento,
        usuario_correo,
        usuario_direccion,
        usuario_credencial,
      } = req.body;

      if (
        !usuario_primer_nombre ||
        !usuario_primer_apellido ||
        !usuario_documento ||
        !usuario_correo ||
        !usuario_credencial
      ) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
      }

      const existing = await Usuario.findByEmail(usuario_correo);
      if (existing) {
        return res.status(409).json({ message: "El correo ya está registrado" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(usuario_credencial, salt);

      const newUser = {
        usuario_primer_nombre,
        usuario_segundo_nombre: usuario_segundo_nombre || "",
        usuario_primer_apellido,
        usuario_segundo_apellido: usuario_segundo_apellido || "",
        usuario_documento,
        usuario_correo,
        usuario_direccion: usuario_direccion || "",
        usuario_credencial: hashed,
      };

      const insertedId = await Usuario.createUsuario(newUser);

      // Cliente por defecto
      await RolUsuario.assignRole({
        usuario_id: insertedId,
        rol_id: 2, // Cliente
        estado_cred: 1,
      });

      return res.status(201).json({
        message: "Usuario creado",
        usuario_id: insertedId,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // 🔐 LOGIN CON ROLES EN EL TOKEN
  async login(req, res) {
    try {
      const { usuario_correo, usuario_credencial } = req.body;

      const user = await Usuario.findByEmail(usuario_correo);
      if (!user)
        return res.status(401).json({ message: "Credenciales inválidas" });

      const isMatch = await bcrypt.compare(
        usuario_credencial,
        user.usuario_credencial
      );

      if (!isMatch)
        return res.status(401).json({ message: "Credenciales inválidas" });

      // 🔥 Obtener roles de BD
      const rolesDB = await RolUsuario.findByUsuarioId(user.usuario_id);
      const roles = rolesDB.map(r => r.rol_nombre);

      // 🔥 TOKEN con roles incluidos
      const payload = {
        usuario_id: user.usuario_id,
        roles: roles,
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      return res.json({
        message: "Autenticado",
        token,
        roles,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  async getAll(req, res) {
    try {
      const rows = await Usuario.findAll();
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userRoles = req.user.roles;
      const userId = req.user.usuario_id;

      // Cliente: solo su propio ID
      if (userRoles.includes("Cliente") && Number(id) !== userId) {
        return res.status(403).json({ message: "No puedes ver otros usuarios" });
      }

      // Afiliado: no puede ver NI SU USUARIO
      if (userRoles.includes("Afiliado")) {
        return res.status(403).json({ message: "No tienes permiso" });
      }

      const user = await Usuario.findById(id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      return res.json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const userRoles = req.user.roles;
      const userId = req.user.usuario_id;

      // Cliente solo actualiza su usuario
      if (userRoles.includes("Cliente") && Number(id) !== userId) {
        return res.status(403).json({ message: "No puedes actualizar otros usuarios" });
      }

      const updated = await Usuario.updateUsuario(id, req.body);
      if (!updated)
        return res
          .status(404)
          .json({ message: "Usuario no encontrado o sin cambios" });

      return res.json({ message: "Usuario actualizado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  async remove(req, res) {
    try {
      // Solo admin llega aquí (la ruta ya está protegida)
      const { id } = req.params;
      const deleted = await Usuario.deleteUsuario(id);

      if (!deleted)
        return res.status(404).json({ message: "Usuario no encontrado" });

      return res.json({ message: "Usuario eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },
};
