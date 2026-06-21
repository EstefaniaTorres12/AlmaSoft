const { query } = require('../config/db');

module.exports = {
  async create(data) {
    const result = await query(
      `INSERT INTO servicio_plan (servicio_id, plan_id) VALUES (?, ?)`,
      [data.servicio_id, data.plan_id]
    );
    return result.insertId;
  },

  async findAll() {
    return query(`
      SELECT sp.servicio_id, sp.plan_id,
             s.servicio_nombre, p.plan_nombre
      FROM servicio_plan sp
      JOIN servicio s ON sp.servicio_id = s.servicio_id
      JOIN plan_funebre p ON sp.plan_id = p.plan_id
      ORDER BY p.plan_id, s.servicio_nombre
    `);
  },

  async findByPlan(plan_id) {
    return query(`
      SELECT sp.servicio_id, s.servicio_nombre, s.servicio_descripcion, s.servicio_precio
      FROM servicio_plan sp
      JOIN servicio s ON sp.servicio_id = s.servicio_id
      WHERE sp.plan_id = ?
      ORDER BY s.servicio_nombre
    `, [plan_id]);
  },

  async update(old_servicio_id, old_plan_id, new_servicio_id, new_plan_id) {
    const result = await query(
      `UPDATE servicio_plan SET servicio_id = ?, plan_id = ? WHERE servicio_id = ? AND plan_id = ?`,
      [new_servicio_id, new_plan_id, old_servicio_id, old_plan_id]
    );
    return result.affectedRows > 0;
  },

  async remove(servicio_id, plan_id) {
    const result = await query(
      `DELETE FROM servicio_plan WHERE servicio_id = ? AND plan_id = ?`,
      [servicio_id, plan_id]
    );
    return result.affectedRows > 0;
  },
};
