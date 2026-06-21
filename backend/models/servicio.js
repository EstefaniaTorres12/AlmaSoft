const { query } = require('../config/db');

const Servicio = {
  async create(data) {
    const result = await query(
      `INSERT INTO servicio (servicio_nombre, servicio_descripcion, servicio_precio) VALUES (?, ?, ?)`,
      [data.servicio_nombre, data.servicio_descripcion, data.servicio_precio]
    );
    return result.insertId;
  },

  async findAll() {
    return query(`SELECT servicio_id, servicio_nombre, servicio_descripcion, servicio_precio FROM servicio ORDER BY servicio_id DESC`);
  },

  async findById(id) {
    const rows = await query(`SELECT servicio_id, servicio_nombre, servicio_descripcion, servicio_precio FROM servicio WHERE servicio_id = ?`, [id]);
    return rows[0] || null;
  },

  async update(id, data) {
    const result = await query(
      `UPDATE servicio SET servicio_nombre = ?, servicio_descripcion = ?, servicio_precio = ? WHERE servicio_id = ?`,
      [data.servicio_nombre, data.servicio_descripcion, data.servicio_precio, id]
    );
    return result.affectedRows > 0;
  },

  async remove(id) {
    const result = await query(`DELETE FROM servicio WHERE servicio_id = ?`, [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Servicio;
