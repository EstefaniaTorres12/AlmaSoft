// backend/models/usuario.js
const pool = require('../config/config');

module.exports = {
  async createUsuario(usuario) {
    const sql = `INSERT INTO USUARIO 
      (usuario_primer_nombre, usuario_segundo_nombre, usuario_primer_apellido, usuario_segundo_apellido, usuario_documento, usuario_correo, usuario_direccion, usuario_credencial)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      usuario.usuario_primer_nombre,
      usuario.usuario_segundo_nombre,
      usuario.usuario_primer_apellido,
      usuario.usuario_segundo_apellido,
      usuario.usuario_documento,
      usuario.usuario_correo,
      usuario.usuario_direccion,
      usuario.usuario_credencial // ya viene hasheado desde el controlador
    ];
    const [result] = await pool.execute(sql, params);
    return result.insertId;
  },

  async findAll() {
    const sql = `SELECT usuario_id, usuario_primer_nombre, usuario_segundo_nombre, usuario_primer_apellido, usuario_segundo_apellido, usuario_documento, usuario_correo, usuario_direccion FROM USUARIO`;
    const [rows] = await pool.execute(sql);
    return rows;
  },

  async findById(id) {
    const sql = `SELECT usuario_id, usuario_primer_nombre, usuario_segundo_nombre, usuario_primer_apellido, usuario_segundo_apellido, usuario_documento, usuario_correo, usuario_direccion FROM USUARIO WHERE usuario_id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const sql = `SELECT * FROM USUARIO WHERE usuario_correo = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
  },

  // 🔧 Método corregido para evitar errores "Bind parameters undefined"
  async updateUsuario(id, usuario) {
    const sql = `UPDATE USUARIO SET 
      usuario_primer_nombre = ?,
      usuario_segundo_nombre = ?,
      usuario_primer_apellido = ?,
      usuario_segundo_apellido = ?,
      usuario_documento = ?,
      usuario_correo = ?,
      usuario_direccion = ?
    WHERE usuario_id = ?`;

    const params = [
      usuario.usuario_primer_nombre || null,
      usuario.usuario_segundo_nombre || null,
      usuario.usuario_primer_apellido || null,
      usuario.usuario_segundo_apellido || null,
      usuario.usuario_documento || null,
      usuario.usuario_correo || null,
      usuario.usuario_direccion || null,
      id
    ];

    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
  },

  async deleteUsuario(id) {
    const sql = `DELETE FROM USUARIO WHERE usuario_id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
  },

  async updatePassword(id, hashedPassword) {
    const sql = `UPDATE USUARIO SET usuario_credencial = ? WHERE usuario_id = ?`;
    const [result] = await pool.execute(sql, [hashedPassword, id]);
    return result.affectedRows;
  }
};

