// backend/controllers/clienteController.js
const Cliente = require('../models/cliente');

module.exports = {

  // Crear cliente - SOLO Admin y Asesor
  async create(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador") && !roles.includes("Asesor")) {
        return res.status(403).json({ message: "No tienes permiso para crear clientes" });
      }

      const { cliente_id, cliente_fecha_nacimiento, cliente_edad } = req.body;

      if (!cliente_id || !cliente_fecha_nacimiento || !cliente_edad) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const id = await Cliente.createCliente({
        cliente_id,
        cliente_fecha_nacimiento,
        cliente_edad,
      });

      return res.status(201).json({ message: 'Cliente creado correctamente', id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener todos los clientes - SOLO Admin y Asesor
  async getAll(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador") && !roles.includes("Asesor")) {
        return res.status(403).json({ message: "No tienes permiso para ver clientes" });
      }

      const rows = await Cliente.findAll();
      return res.json(rows);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Obtener cliente por ID - SOLO Admin y Asesor
  async getById(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador") && !roles.includes("Asesor")) {
        return res.status(403).json({ message: "No tienes permiso para ver clientes" });
      }

      const { id } = req.params;
      const cliente = await Cliente.findById(id);
      if (!cliente)
        return res.status(404).json({ message: 'Cliente no encontrado' });

      return res.json(cliente);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Actualizar cliente - SOLO Admin y Asesor
  async update(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador") && !roles.includes("Asesor")) {
        return res.status(403).json({ message: "No tienes permiso para actualizar clientes" });
      }

      const { id } = req.params;
      const { cliente_fecha_nacimiento, cliente_edad } = req.body;

      const updated = await Cliente.updateCliente(id, {
        cliente_fecha_nacimiento,
        cliente_edad,
      });

      if (!updated)
        return res.status(404).json({ message: 'Cliente no encontrado o sin cambios' });

      return res.json({ message: 'Cliente actualizado correctamente' });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Eliminar cliente - SOLO Admin
  async remove(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador")) {
        return res.status(403).json({ message: "Solo un administrador puede eliminar clientes" });
      }

      const { id } = req.params;
      const deleted = await Cliente.deleteCliente(id);

      if (!deleted)
        return res.status(404).json({ message: "Cliente no encontrado" });

      return res.json({ message: "Cliente eliminado correctamente" });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },
};

