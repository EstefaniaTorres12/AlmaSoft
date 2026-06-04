const { query } = require('../config/db');

module.exports = {
  async create(data) {
    const result = await query(
      `INSERT INTO SERVICIO_PLAN (servicio_id, plan_id) VALUES (?, ?)`,
      [data.servicio_id, data.plan_id]
    );
    return result.insertId;
  },

  async findAll() {
    return query(`
      SELECT sp.servicio_id, sp.plan_id,
             s.servicio_nombre, p.plan_nombre
      FROM SERVICIO_PLAN sp
      JOIN SERVICIO s ON sp.servicio_id = s.servicio_id
      JOIN PLAN_FUNEBRE p ON sp.plan_id = p.plan_id
      ORDER BY p.plan_id, s.servicio_nombre
    `);
  },

  async findByPlan(plan_id) {
    return query(`
      SELECT sp.servicio_id, s.servicio_nombre, s.servicio_descripcion, s.servicio_precio
      FROM SERVICIO_PLAN sp
      JOIN SERVICIO s ON sp.servicio_id = s.servicio_id
      WHERE sp.plan_id = ?
      ORDER BY s.servicio_nombre
    `, [plan_id]);
  },

  async update(old_servicio_id, old_plan_id, new_servicio_id, new_plan_id) {
    const result = await query(
      `UPDATE SERVICIO_PLAN SET servicio_id = ?, plan_id = ? WHERE servicio_id = ? AND plan_id = ?`,
      [new_servicio_id, new_plan_id, old_servicio_id, old_plan_id]
    );
    return result.affectedRows > 0;
  },

  async remove(servicio_id, plan_id) {
    const result = await query(
      `DELETE FROM SERVICIO_PLAN WHERE servicio_id = ? AND plan_id = ?`,
      [servicio_id, plan_id]
    );
    return result.affectedRows > 0;
  },
};
