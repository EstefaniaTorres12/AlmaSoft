const db = require("../config/config");

const ContratoPlan = {
  // Crear relación contrato-plan
  async create(data) {
    const [result] = await db.query(
      "INSERT INTO CONTRATO_PLAN (contrato_id, plan_id) VALUES (?, ?)",
      [data.contrato_id, data.plan_id]
    );
    return result.insertId;
  },

  // Obtener todas las relaciones
  async findAll() {
    const [rows] = await db.query(`
      SELECT 
        cp.contrato_id,
        cp.plan_id,
        p.plan_nombre,
        p.plan_precio
      FROM CONTRATO_PLAN cp
      INNER JOIN PLAN_FUNEBRE p ON cp.plan_id = p.plan_id
    `);
    return rows;
  },

  // Obtener planes de un contrato
  async findByContrato(contrato_id) {
    const [rows] = await db.query(
      `SELECT 
        cp.plan_id,
        p.plan_nombre,
        p.plan_precio
      FROM CONTRATO_PLAN cp
      INNER JOIN PLAN_FUNEBRE p ON cp.plan_id = p.plan_id
      WHERE cp.contrato_id = ?`,
      [contrato_id]
    );
    return rows;
  },

  // Eliminar una relación contrato-plan
  async remove(contrato_id, plan_id) {
    const [result] = await db.query(
      "DELETE FROM CONTRATO_PLAN WHERE contrato_id = ? AND plan_id = ?",
      [contrato_id, plan_id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = ContratoPlan;
