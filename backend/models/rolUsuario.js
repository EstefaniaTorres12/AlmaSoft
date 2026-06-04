const { query } = require('../config/db');

const RolUsuario = {};

// Versión callback — usada internamente por models/usuario.js al crear usuario
RolUsuario.create = (rolU, result) => {
  const sql = `INSERT INTO ROL_USUARIO (rol_id, usuario_id, estado_cred) VALUES (?, ?, ?)`;
  require('../config/config').query(
    sql,
    [rolU.rol_id, rolU.usuario_id, rolU.estado_cred],
    (err, res) => {
      if (err) {
        console.error('Error al insertar ROL_USUARIO:', err);
        return result(err, null);
      }
      result(null, { insertId: res.insertId, ...rolU });
    }
  );
};

// Versión async — usada por rolUsuarioController
RolUsuario.assignRole = async ({ usuario_id, rol_id, estado_cred }) => {
  const res = await query(
    `INSERT INTO ROL_USUARIO (rol_id, usuario_id, estado_cred) VALUES (?, ?, ?)`,
    [rol_id, usuario_id, estado_cred]
  );
  return res.insertId;
};

RolUsuario.findAll = async () => {
  return query(`
    SELECT
      ru.cred_id,
      ru.usuario_id,
      ru.rol_id,
      ru.estado_cred,
      r.rol_nombre,
      u.usuario_primer_nombre,
      u.usuario_segundo_nombre,
      u.usuario_primer_apellido,
      u.usuario_segundo_apellido,
      u.usuario_correo
    FROM ROL_USUARIO ru
    INNER JOIN ROL r ON r.rol_id = ru.rol_id
    INNER JOIN USUARIO u ON u.usuario_id = ru.usuario_id
    ORDER BY ru.cred_id DESC
  `);
};

RolUsuario.findByUsuarioId = async (usuario_id) => {
  return query(`
    SELECT
      ru.cred_id,
      ru.usuario_id,
      ru.rol_id,
      ru.estado_cred,
      r.rol_nombre
    FROM ROL_USUARIO ru
    INNER JOIN ROL r ON r.rol_id = ru.rol_id
    WHERE ru.usuario_id = ?
    ORDER BY ru.cred_id DESC
  `, [usuario_id]);
};

RolUsuario.updateEstado = async (cred_id, estado_cred) => {
  const res = await query(
    `UPDATE ROL_USUARIO SET estado_cred = ? WHERE cred_id = ?`,
    [estado_cred, cred_id]
  );
  return res.affectedRows > 0;
};

RolUsuario.remove = async (cred_id) => {
  const res = await query(
    `DELETE FROM ROL_USUARIO WHERE cred_id = ?`,
    [cred_id]
  );
  return res.affectedRows > 0;
};

module.exports = RolUsuario;
