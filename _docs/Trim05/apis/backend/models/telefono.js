const db = require("../config/config");

const Telefono = {
  // Crear teléfono para un usuario
  async createTelefono(data) {
    const [result] = await db.query(
      "INSERT INTO TELEFONO (telefono, usuario_id) VALUES (?, ?)",
      [data.telefono, data.usuario_id]
    );
    return result.insertId;
  },

  // Obtener todos los teléfonos
  async findAll() {
    const [rows] = await db.query(`
      SELECT t.telefono, u.usuario_primer_nombre, u.usuario_primer_apellido
      FROM TELEFONO t
      INNER JOIN USUARIO u ON t.usuario_id = u.usuario_id
    `);
    return rows;
  },

  // Obtener teléfonos de un usuario
  async findByUsuarioId(usuario_id) {
    const [rows] = await db.query(
      "SELECT telefono FROM TELEFONO WHERE usuario_id = ?",
      [usuario_id]
    );
    return rows;
  },

  // Actualizar teléfono de un usuario
  async updateTelefono(usuario_id, telefono) {
    const [result] = await db.query(
      "UPDATE TELEFONO SET telefono = ? WHERE usuario_id = ?",
      [telefono, usuario_id]
    );
    return result.affectedRows > 0;
  },

  // Eliminar teléfono
  async deleteTelefono(usuario_id, telefono) {
    const [result] = await db.query(
      "DELETE FROM TELEFONO WHERE usuario_id = ? AND telefono = ?",
      [usuario_id, telefono]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Telefono;

