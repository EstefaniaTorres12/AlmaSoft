const { query } = require('../config/db');

const ContratoPlan = {
  async create(data) {
    const result = await query(
      `INSERT INTO contrato_plan (contrato_id, plan_id) VALUES (?, ?)`,
      [data.contrato_id, data.plan_id]
    );
    return result.insertId;
  },

  async findAll() {
    return query(`
      SELECT
        cp.contrato_id,
        cp.plan_id,
        p.plan_nombre,
        p.plan_precio
      FROM contrato_plan cp
      INNER JOIN plan_funebre p ON cp.plan_id = p.plan_id
      ORDER BY cp.contrato_id DESC
    `);
  },

  async findByContrato(contrato_id) {
    return query(`
      SELECT
        cp.plan_id,
        p.plan_nombre,
        p.plan_precio,
        p.plan_descripcion
      FROM contrato_plan cp
      INNER JOIN plan_funebre p ON cp.plan_id = p.plan_id
      WHERE cp.contrato_id = ?
    `, [contrato_id]);
  },

  async remove(contrato_id, plan_id) {
    const result = await query(
      `DELETE FROM contrato_plan WHERE contrato_id = ? AND plan_id = ?`,
      [contrato_id, plan_id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = ContratoPlan;
