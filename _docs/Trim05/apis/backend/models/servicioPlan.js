const db = require("../config/config");

module.exports = {
  // Crear relación servicio–plan
  async create(data) {
    const [result] = await db.query(
      `INSERT INTO SERVICIO_PLAN (servicio_id, plan_id) VALUES (?, ?)`,
      [data.servicio_id, data.plan_id]
    );
    return result.insertId;
  },

  // Obtener todas las relaciones
  async findAll() {
    const [rows] = await db.query(`
      SELECT sp.servicio_id, sp.plan_id, 
             s.servicio_nombre, p.plan_nombre
      FROM SERVICIO_PLAN sp
      JOIN SERVICIO s ON sp.servicio_id = s.servicio_id
      JOIN PLAN_FUNEBRE p ON sp.plan_id = p.plan_id
    `);
    return rows;
  },

  // Obtener servicios por plan
  async findByPlan(plan_id) {
    const [rows] = await db.query(
      `
      SELECT sp.servicio_id, s.servicio_nombre
      FROM SERVICIO_PLAN sp
      JOIN SERVICIO s ON sp.servicio_id = s.servicio_id
      WHERE sp.plan_id = ?
      `,
      [plan_id]
    );
    return rows;
  },

  // 🔥 UPDATE
  async update(old_servicio_id, old_plan_id, new_servicio_id, new_plan_id) {
    const [result] = await db.query(
      `UPDATE SERVICIO_PLAN
       SET servicio_id = ?, plan_id = ?
       WHERE servicio_id = ? AND plan_id = ?`,
      [new_servicio_id, new_plan_id, old_servicio_id, old_plan_id]
    );
    return result.affectedRows > 0;
  },

  // Eliminar relación
  async remove(servicio_id, plan_id) {
    const [result] = await db.query(
      `DELETE FROM SERVICIO_PLAN WHERE servicio_id = ? AND plan_id = ?`,
      [servicio_id, plan_id]
    );
    return result.affectedRows > 0;
  },
};
