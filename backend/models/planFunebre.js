const db = require('../config/config');

const PlanFunebre = function(planFunebre) {
    this.plan_nombre = planFunebre.plan_nombre;
    this.plan_precio = planFunebre.plan_precio;
    this.plan_estado = planFunebre.plan_estado || 'Activo';
    this.plan_descripcion = planFunebre.plan_descripcion;
    this.plan_fecha_creacion = new Date();
};

// Crear un nuevo plan
PlanFunebre.create = (newPlan, result) => {
    db.query('INSERT INTO PLAN_FUNEBRE SET ?', newPlan, (err, res) => {
        if (err) {
            console.log('Error al insertar plan: ', err);
            result(err, null);
        } else {
            console.log('Plan insertado exitosamente');
            result(null, { id: res.insertId, ...newPlan });
        }
    });
};

// Obtener todos los planes
PlanFunebre.getAll = (result) => {
    db.query('SELECT * FROM PLAN_FUNEBRE', (err, res) => {
        if (err) {
            console.log('Error al obtener planes: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Obtener plan por ID
PlanFunebre.findById = (id, result) => {
    db.query('SELECT * FROM PLAN_FUNEBRE WHERE plan_id = ?', id, (err, res) => {
        if (err) {
            console.log('Error al obtener plan: ', err);
            result(err, null);
        } else {
            if (res.length) {
                result(null, res[0]);
            } else {
                result(null, null);
            }
        }
    });
};

// Actualizar plan
PlanFunebre.updateById = (id, planFunebre, result) => {
    db.query(
        'UPDATE PLAN_FUNEBRE SET plan_nombre = ?, plan_precio = ?, plan_estado = ?, plan_descripcion = ? WHERE plan_id = ?',
        [planFunebre.plan_nombre, planFunebre.plan_precio, planFunebre.plan_estado, planFunebre.plan_descripcion, id],
        (err, res) => {
            if (err) {
                console.log('Error al actualizar plan: ', err);
                result(err, null);
            } else {
                result(null, { id, ...planFunebre });
            }
        }
    );
};

// Eliminar plan
PlanFunebre.remove = (id, result) => {
    db.query('DELETE FROM PLAN_FUNEBRE WHERE plan_id = ?', id, (err, res) => {
        if (err) {
            console.log('Error al eliminar plan: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

module.exports = PlanFunebre;
