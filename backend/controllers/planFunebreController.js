const PlanFunebre = require('../models/planFunebre');

module.exports = {

    createPlan(req, res) {
        const plan = req.body;

        PlanFunebre.create(plan, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: "Error al crear plan",
                    error: err
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
                return res.status(501).json({
                    success: false,
                    message: "Error al listar",
                    error: err
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
            if (err) return res.status(501).json({ success: false });

            return res.status(200).json({
                success: true,
                data
            });
        });
    },

    updatePlan(req, res) {
        const plan = req.body;

        PlanFunebre.update(plan, (err, data) => {
            if (err) return res.status(501).json({ success: false });

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
            if (err) return res.status(501).json({ success: false });

            return res.status(200).json({
                success: true,
                message: "Plan eliminado"
            });
        });
    }

};