const { query } = require('../config/db');

const Telefono = {
  async createTelefono(data) {
    const result = await query(
      `INSERT INTO TELEFONO (telefono, usuario_id) VALUES (?, ?)`,
      [data.telefono, data.usuario_id]
    );
    return result.insertId;
  },

  async findAll() {
    return query(`
      SELECT t.telefono, t.usuario_id,
             u.usuario_primer_nombre, u.usuario_primer_apellido, u.usuario_correo
      FROM TELEFONO t
      INNER JOIN USUARIO u ON t.usuario_id = u.usuario_id
      ORDER BY u.usuario_id
    `);
  },

  async findByUsuarioId(usuario_id) {
    return query(
      `SELECT telefono FROM TELEFONO WHERE usuario_id = ?`,
      [usuario_id]
    );
  },

  async updateTelefono(usuario_id, telefono) {
    const result = await query(
      `UPDATE TELEFONO SET telefono = ? WHERE usuario_id = ?`,
      [telefono, usuario_id]
    );
    return result.affectedRows > 0;
  },

  async deleteTelefono(usuario_id, telefono) {
    const result = await query(
      `DELETE FROM TELEFONO WHERE usuario_id = ? AND telefono = ?`,
      [usuario_id, telefono]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Telefono;
