// backend/controllers/servicioPlanController.js
const ServicioPlan = require("../models/servicioPlan");

module.exports = {
  // Crear relación
  async create(req, res) {
    try {
      const { servicio_id, plan_id } = req.body;

      if (!servicio_id || !plan_id) {
        return res.status(400).json({
          message: "servicio_id y plan_id son requeridos",
        });
      }

      await ServicioPlan.create({ servicio_id, plan_id });

      return res.status(201).json({
        message: "Servicio asignado al plan correctamente",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Ver todos
  async getAll(req, res) {
    try {
      const rows = await ServicioPlan.findAll();
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Ver servicios por plan
  async getByPlan(req, res) {
    try {
      const { plan_id } = req.params;
      const rows = await ServicioPlan.findByPlan(plan_id);
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // 🔥 UPDATE — actualizar servicio de un plan
  async update(req, res) {
    try {
      const { old_servicio_id, old_plan_id } = req.params;
      const { servicio_id, plan_id } = req.body;

      if (!servicio_id || !plan_id) {
        return res.status(400).json({
          message: "servicio_id y plan_id nuevos son requeridos",
        });
      }

      const updated = await ServicioPlan.update(
        old_servicio_id,
        old_plan_id,
        servicio_id,
        plan_id
      );

      if (!updated) {
        return res.status(404).json({
          message: "Relación no encontrada o sin cambios",
        });
      }

      return res.json({ message: "Relación actualizada correctamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Eliminar relación
  async remove(req, res) {
    try {
      const { servicio_id, plan_id } = req.params;

      const deleted = await ServicioPlan.remove(servicio_id, plan_id);

      if (!deleted)
        return res.status(404).json({ message: "Relación no encontrada" });

      return res.json({ message: "Relación eliminada correctamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },
};

