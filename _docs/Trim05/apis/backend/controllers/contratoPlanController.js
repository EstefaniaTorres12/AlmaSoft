const ContratoPlan = require("../models/contratoPlan");

module.exports = {
  // Crear relación contrato–plan
  async create(req, res) {
    try {
      const { contrato_id, plan_id } = req.body;

      if (!contrato_id || !plan_id) {
        return res.status(400).json({
          message: "contrato_id y plan_id son requeridos",
        });
      }

      await ContratoPlan.create({ contrato_id, plan_id });

      return res.status(201).json({
        message: "Plan asignado al contrato correctamente",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Ver todas las relaciones
  async getAll(req, res) {
    try {
      const rows = await ContratoPlan.findAll();
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Ver planes de un contrato
  async getByContrato(req, res) {
    try {
      const { contrato_id } = req.params;
      const rows = await ContratoPlan.findByContrato(contrato_id);
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // 🔥 UPDATE — actualizar contrato-plan
  async update(req, res) {
    try {
      const { old_contrato_id, old_plan_id } = req.params;
      const { contrato_id, plan_id } = req.body;

      if (!contrato_id || !plan_id) {
        return res.status(400).json({
          message: "Nuevos contrato_id y plan_id son requeridos",
        });
      }

      const updated = await ContratoPlan.update(
        old_contrato_id,
        old_plan_id,
        contrato_id,
        plan_id
      );

      if (!updated) {
        return res.status(404).json({
          message: "Relación no encontrada o sin cambios",
        });
      }

      return res.json({
        message: "Relación actualizada correctamente",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Eliminar relación
  async remove(req, res) {
    try {
      const { contrato_id, plan_id } = req.params;

      const deleted = await ContratoPlan.remove(contrato_id, plan_id);

      if (!deleted)
        return res.status(404).json({ message: "Relación no encontrada" });

      return res.json({
        message: "Relación eliminada correctamente",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },
};

