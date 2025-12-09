// backend/controllers/planController.js
const Plan = require("../models/plan");

module.exports = {
  // Crear plan
  async create(req, res) {
    try {
      const { plan_nombre, plan_precio, plan_estado } = req.body;

      if (!plan_nombre || !plan_precio || plan_estado === undefined) {
        return res
          .status(400)
          .json({ message: "Todos los campos son requeridos" });
      }

      const id = await Plan.createPlan({
        plan_nombre,
        plan_precio,
        plan_estado,
      });

      return res.status(201).json({ message: "Plan creado correctamente", id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Obtener todos los planes
  async getAll(req, res) {
    try {
      const roles = req.user.roles;

      let rows = await Plan.findAll();

      // Cliente y Afiliado solo ven planes activos
      if (roles.includes("Cliente") || roles.includes("Afiliado")) {
        rows = rows.filter((p) => p.plan_estado === 1);
      }

      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Obtener por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const roles = req.user.roles;

      let plan = await Plan.findById(id);

      if (!plan) return res.status(404).json({ message: "Plan no encontrado" });

      // Cliente y Afiliado solo ven activos
      if (
        (roles.includes("Cliente") || roles.includes("Afiliado")) &&
        plan.plan_estado === 0
      ) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para ver este plan" });
      }

      return res.json(plan);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Actualizar plan
  async update(req, res) {
    try {
      const { id } = req.params;
      const { plan_nombre, plan_precio, plan_estado } = req.body;

      const updated = await Plan.updatePlan(id, {
        plan_nombre,
        plan_precio,
        plan_estado,
      });

      if (!updated)
        return res
          .status(404)
          .json({ message: "Plan no encontrado o sin cambios" });

      return res.json({ message: "Plan actualizado correctamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Eliminar plan (solo Admin)
  async remove(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Plan.deletePlan(id);
      if (!deleted)
        return res.status(404).json({ message: "Plan no encontrado" });

      return res.json({ message: "Plan eliminado correctamente" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },
};
