const db = require('../config/config');
const PlanFunebre = {};

PlanFunebre.create = (plan, result) => {
    const sql = `
        INSERT INTO plan_funebre(
            plan_nombre,
            plan_descripcion,
            plan_precio,
            plan_estado
        ) VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [
        plan.plan_nombre,
        plan.plan_descripcion,
        plan.plan_precio,
        plan.plan_estado
    ], (err, res) => {
        if (err) {
            console.log("Error al crear plan:", err);
            result(err, null);
        } else {
            result(null, { plan_id: res.insertId, ...plan });
        }
    });
};

PlanFunebre.findAll = (result) => {
    const sql = `SELECT * FROM plan_funebre`;

    db.query(sql, (err, data) => {
        if (err) return result(err, null);
        result(null, data);
    });
};

PlanFunebre.findById = (id, result) => {
    const sql = `SELECT * FROM plan_funebre WHERE plan_id = ?`;

    db.query(sql, [id], (err, data) => {
        if (err) return result(err, null);
        result(null, data[0]);
    });
};

PlanFunebre.update = (plan, result) => {
    const sql = `
        UPDATE plan_funebre SET
        plan_nombre = ?,
        plan_descripcion = ?,
        plan_precio = ?,
        plan_estado = ?
        WHERE plan_id = ?
    `;

    db.query(sql, [
        plan.plan_nombre,
        plan.plan_descripcion,
        plan.plan_precio,
        plan.plan_estado,
        plan.plan_id
    ], (err, res) => {
        if (err) return result(err, null);
        result(null, plan);
    });
};

PlanFunebre.delete = (id, result) => {
    const sql = `DELETE FROM plan_funebre WHERE plan_id = ?`;

    db.query(sql, [id], (err, res) => {
        if (err) return result(err, null);
        result(null, res);
    });
};

module.exports = PlanFunebre;