const db = require("../config/config");

const Servicio = {
  async create(data) {
    const [result] = await db.query(
      "INSERT INTO SERVICIO (servicio_nombre, servicio_descripcion, servicio_precio) VALUES (?, ?, ?)",
      [data.servicio_nombre, data.servicio_descripcion, data.servicio_precio]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await db.query("SELECT * FROM SERVICIO");
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query("SELECT * FROM SERVICIO WHERE servicio_id = ?", [id]);
    return rows[0] || null;
  },

  async update(id, data) {
    const [result] = await db.query(
      "UPDATE SERVICIO SET servicio_nombre = ?, servicio_descripcion = ?, servicio_precio = ? WHERE servicio_id = ?",
      [data.servicio_nombre, data.servicio_descripcion, data.servicio_precio, id]
    );
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await db.query("DELETE FROM SERVICIO WHERE servicio_id = ?", [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Servicio;
