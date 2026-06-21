// backend/models/plan.js
const db = require("../config/config");

const Plan = {
  async createPlan(data) {
    const [result] = await db.query(
      "INSERT INTO plan_funebre (plan_nombre, plan_precio, plan_estado) VALUES (?, ?, ?)",
      [data.plan_nombre, data.plan_precio, data.plan_estado]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await db.query(
      "SELECT * FROM plan_funebre"
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM plan_funebre WHERE plan_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async updatePlan(id, data) {
    const [result] = await db.query(
      `UPDATE plan_funebre 
       SET plan_nombre = ?, plan_precio = ?, plan_estado = ?
       WHERE plan_id = ?`,
      [data.plan_nombre, data.plan_precio, data.plan_estado, id]
    );
    return result.affectedRows > 0;
  },

  async deletePlan(id) {
    const [result] = await db.query(
      "DELETE FROM plan_funebre WHERE plan_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Plan;
