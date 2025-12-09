// backend/models/rol.js
const db = require('../config/config');

const Rol = {
  async createRol(rol) {
    const [result] = await db.query(
      'INSERT INTO ROL (rol_nombre, rol_descripcion) VALUES (?, ?)',
      [rol.rol_nombre, rol.rol_descripcion]
    );
    return result.insertId;
  },

  async findAll() {
    const [rows] = await db.query('SELECT * FROM ROL');
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM ROL WHERE rol_id = ?', [id]);
    return rows[0];
  },

  async updateRol(id, rol) {
    const [result] = await db.query(
      'UPDATE ROL SET rol_nombre = ?, rol_descripcion = ? WHERE rol_id = ?',
      [rol.rol_nombre, rol.rol_descripcion, id]
    );
    return result.affectedRows > 0;
  },

  async deleteRol(id) {
    const [result] = await db.query('DELETE FROM ROL WHERE rol_id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Rol;

