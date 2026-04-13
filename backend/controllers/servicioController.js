const Servicio = require("../models/servicio");

module.exports = {
  async create(req, res) {
    try {
      const { servicio_nombre, servicio_descripcion, servicio_precio } =
        req.body;

      if (!servicio_nombre || !servicio_precio) {
        return res
          .status(400)
          .json({ message: "Nombre y precio son obligatorios" });
      }

      const id = await Servicio.create({
        servicio_nombre,
        servicio_descripcion,
        servicio_precio,
      });

      return res.status(201).json({ message: "Servicio creado", id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  async getAll(req, res) {
    try {
      const rows = await Servicio.findAll();
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const servicio = await Servicio.findById(id);

      if (!servicio)
        return res.status(404).json({ message: "Servicio no encontrado" });

      return res.json(servicio);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await Servicio.update(id, req.body);

      if (!updated)
        return res.status(404).json({ message: "No se pudo actualizar" });

      return res.json({ message: "Servicio actualizado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Servicio.remove(id);

      if (!deleted)
        return res.status(404).json({ message: "Servicio no encontrado" });

      return res.json({ message: "Servicio eliminado" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },
};
