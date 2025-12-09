// backend/controllers/rolUsuarioController.js
const RolUsuario = require("../models/rolUsuario");

module.exports = {
  // Asignar rol a usuario
  async assign(req, res) {
    try {
      const { usuario_id, rol_id, estado_cred } = req.body;
      if (!usuario_id || !rol_id || estado_cred === undefined) {
        return res
          .status(400)
          .json({ message: "usuario_id, rol_id y estado_cred son requeridos" });
      }

      const id = await RolUsuario.assignRole({
        usuario_id,
        rol_id,
        estado_cred,
      });
      return res
        .status(201)
        .json({ message: "Rol asignado al usuario", cred_id: id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Obtener todas las asignaciones
  async getAll(req, res) {
    try {
      const rows = await RolUsuario.findAll();
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Obtener roles de un usuario
  async getByUsuario(req, res) {
    try {
      const { usuario_id } = req.params;
      const rows = await RolUsuario.findByUsuarioId(usuario_id);
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Cambiar estado (activar/desactivar)
  async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado_cred } = req.body;

      const updated = await RolUsuario.updateEstado(id, estado_cred);
      if (!updated)
        return res
          .status(404)
          .json({ message: "Registro no encontrado o sin cambios" });

      return res.json({ message: "Estado actualizado correctamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Eliminar relación rol-usuario
  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await RolUsuario.remove(id);
      if (!deleted)
        return res.status(404).json({ message: "Asignación no encontrada" });
      return res.json({ message: "Rol de usuario eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },
};
