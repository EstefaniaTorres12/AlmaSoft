// backend/controllers/rolController.js
const Rol = require('../models/rol');

module.exports = {
  // Crear rol
  async create(req, res) {
    try {
      const { rol_nombre, rol_descripcion } = req.body;
      if (!rol_nombre) {
        return res.status(400).json({ message: 'El nombre del rol es obligatorio' });
      }

      const rol = { rol_nombre, rol_descripcion };
      const insertedId = await Rol.createRol(rol);
      return res.status(201).json({ message: 'Rol creado', rol_id: insertedId });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener todos los roles
  async getAll(req, res) {
    try {
      const rows = await Rol.findAll();
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener un rol por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const rol = await Rol.findById(id);
      if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });
      return res.json(rol);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Actualizar rol
  async update(req, res) {
    try {
      const { id } = req.params;
      const { rol_nombre, rol_descripcion } = req.body;

      const rol = { rol_nombre, rol_descripcion };
      const updated = await Rol.updateRol(id, rol);

      if (!updated) return res.status(404).json({ message: 'Rol no encontrado o sin cambios' });
      return res.json({ message: 'Rol actualizado' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Eliminar rol
  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Rol.deleteRol(id);
      if (!deleted) return res.status(404).json({ message: 'Rol no encontrado' });
      return res.json({ message: 'Rol eliminado' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

