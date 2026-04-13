// backend/models/rolUsuario.js
const db = require("../config/config");

const RolUsuario = {
  // Asignar un rol a un usuario
  async assignRole(data) {
    const [result] = await db.query(
      "INSERT INTO ROL_USUARIO (usuario_id, rol_id, estado_cred) VALUES (?, ?, ?)",
      [data.usuario_id, data.rol_id, data.estado_cred]
    );
    return result.insertId;
  },

  // Listar todas las asignaciones con detalles
  async findAll() {
    const [rows] = await db.query(`
      SELECT ru.cred_id, u.usuario_primer_nombre, u.usuario_correo,
             r.rol_nombre, ru.estado_cred
      FROM ROL_USUARIO ru
      INNER JOIN USUARIO u ON ru.usuario_id = u.usuario_id
      INNER JOIN ROL r ON ru.rol_id = r.rol_id
    `);
    return rows;
  },

  // Buscar los roles de un usuario específico
  async findByUsuarioId(usuario_id) {
    const [rows] = await db.query(
      `
      SELECT ru.cred_id, r.rol_nombre, ru.estado_cred
      FROM ROL_USUARIO ru
      INNER JOIN ROL r ON ru.rol_id = r.rol_id
      WHERE ru.usuario_id = ?
      `,
      [usuario_id]
    );
    return rows;
  },

  // Actualizar estado (activar/desactivar)
  async updateEstado(id, estado) {
    const [result] = await db.query(
      "UPDATE ROL_USUARIO SET estado_cred = ? WHERE cred_id = ?",
      [estado, id]
    );
    return result.affectedRows > 0;
  },

  // Eliminar asignación
  async remove(id) {
    const [result] = await db.query(
      "DELETE FROM ROL_USUARIO WHERE cred_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = RolUsuario;
