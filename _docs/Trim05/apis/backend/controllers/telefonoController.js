const Telefono = require("../models/telefono");

module.exports = {
  // Crear teléfono
  async create(req, res) {
    try {
      const { telefono, usuario_id } = req.body;
      const userRoles = req.user.roles;
      const userId = req.user.usuario_id;

      if (!telefono || !usuario_id) {
        return res.status(400).json({ message: "telefono y usuario_id son requeridos" });
      }

      // Cliente o Afiliado solo pueden crear para su usuario
      if ((userRoles.includes("Cliente") || userRoles.includes("Afiliado")) &&
        Number(usuario_id) !== userId) {
        return res.status(403).json({ message: "No puedes agregar teléfonos a otro usuario" });
      }

      const id = await Telefono.createTelefono({ telefono, usuario_id });

      return res.status(201).json({ message: "Teléfono agregado correctamente", id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Obtener todos los teléfonos (solo Admin y Asesor)
  async getAll(req, res) {
    try {
      return res.json(await Telefono.findAll());
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Obtener teléfonos por usuario
  async getByUsuario(req, res) {
    try {
      const { usuario_id } = req.params;
      const userRoles = req.user.roles;
      const userId = req.user.usuario_id;

      // Cliente y Afiliado solo ven sus teléfonos
      if ((userRoles.includes("Cliente") || userRoles.includes("Afiliado")) &&
        Number(usuario_id) !== userId) {
        return res.status(403).json({ message: "No puedes ver teléfonos de otro usuario" });
      }

      const rows = await Telefono.findByUsuarioId(usuario_id);
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Actualizar teléfono
  async update(req, res) {
    try {
      const { usuario_id } = req.params;
      const { telefono } = req.body;

      const userRoles = req.user.roles;
      const userId = req.user.usuario_id;

      if (!telefono) {
        return res.status(400).json({ message: "Debe ingresar un número de teléfono" });
      }

      // Cliente y Afiliado solo actualizan lo suyo
      if ((userRoles.includes("Cliente") || userRoles.includes("Afiliado")) &&
        Number(usuario_id) !== userId) {
        return res.status(403).json({ message: "No puedes actualizar teléfonos de otro usuario" });
      }

      const updated = await Telefono.updateTelefono(usuario_id, telefono);
      if (!updated) {
        return res.status(404).json({ message: "Teléfono no encontrado o sin cambios" });
      }

      return res.json({ message: "Teléfono actualizado correctamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Eliminar teléfono
  async remove(req, res) {
    try {
      const { usuario_id, telefono } = req.params;
      const userRoles = req.user.roles;
      const userId = req.user.usuario_id;

      // Asesor NO puede eliminar
      if (userRoles.includes("Asesor")) {
        return res.status(403).json({ message: "Asesor no puede eliminar teléfonos" });
      }

      // Cliente / Afiliado solo eliminan los suyos
      if ((userRoles.includes("Cliente") || userRoles.includes("Afiliado")) &&
        Number(usuario_id) !== userId) {
        return res.status(403).json({ message: "No puedes eliminar teléfonos de otro usuario" });
      }

      const deleted = await Telefono.deleteTelefono(usuario_id, telefono);

      if (!deleted) {
        return res.status(404).json({ message: "Teléfono no encontrado" });
      }

      return res.json({ message: "Teléfono eliminado correctamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },
};
