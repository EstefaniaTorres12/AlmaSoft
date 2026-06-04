const PlanFunebre = require('../models/planFunebre');

module.exports = {

    createPlan(req, res) {
        const plan = req.body;

        PlanFunebre.create(plan, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error al crear plan"
                });
            }

            return res.status(201).json({
                success: true,
                message: "Plan creado",
                data
            });
        });
    },

    getAllPlanes(req, res) {
        PlanFunebre.findAll((err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error al listar planes"
                });
            }

            return res.status(200).json({
                success: true,
                data
            });
        });
    },

    getPlanById(req, res) {
        const id = req.params.id;

        PlanFunebre.findById(id, (err, data) => {
            if (err) return res.status(500).json({ success: false, message: 'Error al consultar plan' });

            return res.status(200).json({
                success: true,
                data
            });
        });
    },

    updatePlan(req, res) {
        const plan = { ...req.body, plan_id: req.params.id };

        PlanFunebre.update(plan, (err, data) => {
            if (err) return res.status(500).json({ success: false, message: 'Error al actualizar plan' });

            return res.status(200).json({
                success: true,
                message: "Plan actualizado",
                data
            });
        });
    },

    deletePlan(req, res) {
        const id = req.params.id;

        PlanFunebre.delete(id, (err, data) => {
            if (err) return res.status(500).json({ success: false, message: 'Error al eliminar plan' });

            return res.status(200).json({
                success: true,
                message: "Plan eliminado"
            });
        });
    }

};