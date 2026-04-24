const db = require('../config/config');
const bcrypt = require('bcryptjs');
const Usuario = {};
const RolUsuario = require('./rolUsuario');
const dayjs = require('dayjs');

// En esta base de datos actual el rol Cliente es 1.
const CLIENT_ROLE_ID = 1;

function isEmpty(value) {
  return value === undefined || value === null || value === '';
}

// Crear usuario
Usuario.create = async (user, result) => {
  const required = [
    'rol_id',
    'usuario_documento',
    'usuario_primer_nombre',
    'usuario_primer_apellido',
    'usuario_segundo_apellido',
    'usuario_correo',
    'usuario_direccion',
    'usuario_credencial'
  ];

  for (const field of required) {
    if (isEmpty(user[field])) {
      return result({ message: `El campo ${field} es obligatorio` }, null);
    }
  }

  if (Number(user.rol_id) === CLIENT_ROLE_ID) {
    if (isEmpty(user.usuario_telefono)) {
      return result({ message: 'usuario_telefono es obligatorio para cliente' }, null);
    }

    if (isEmpty(user.cliente_fecha_nacimiento)) {
      return result({ message: 'cliente_fecha_nacimiento es obligatorio para cliente' }, null);
    }
  }

  Usuario.findByDocument(user.usuario_documento, async (errDoc, existsDoc) => {
    if (errDoc) return result(errDoc, null);
    if (existsDoc) return result({ message: 'El documento ya existe' }, null);

    const sqlCheckEmail = 'SELECT usuario_id FROM USUARIO WHERE usuario_correo = ? LIMIT 1';
    db.query(sqlCheckEmail, [user.usuario_correo], async (errEmail, rowsEmail) => {
      if (errEmail) return result(errEmail, null);
      if (rowsEmail.length > 0) return result({ message: 'El correo ya existe' }, null);

      const hash = await bcrypt.hash(user.usuario_credencial, 10);

      const sqlUsuario = `INSERT INTO USUARIO(
        usuario_primer_nombre,
        usuario_segundo_nombre,
        usuario_primer_apellido,
        usuario_segundo_apellido,
        usuario_documento,
        usuario_correo,
        usuario_direccion,
        usuario_credencial
      ) VALUES (?,?,?,?,?,?,?,?)`;

      db.query(
        sqlUsuario,
        [
          user.usuario_primer_nombre,
          user.usuario_segundo_nombre || '',
          user.usuario_primer_apellido,
          user.usuario_segundo_apellido,
          user.usuario_documento,
          user.usuario_correo,
          user.usuario_direccion,
          hash
        ],
        (errInsertUsuario, resUsuario) => {
          if (errInsertUsuario) return result(errInsertUsuario, null);

          const usuarioId = resUsuario.insertId;

          const rolUsuario = {
            rol_id: Number(user.rol_id),
            usuario_id: usuarioId,
            estado_cred: true
          };

          RolUsuario.create(rolUsuario, (errRol) => {
            if (errRol) return result(errRol, null);

            if (Number(user.rol_id) !== CLIENT_ROLE_ID) {
              return result(null, { usuario_id: usuarioId, ...user });
            }

            const edad = dayjs().diff(user.cliente_fecha_nacimiento, 'year');

            const sqlCliente = `INSERT INTO CLIENTE(
              cliente_id,
              cliente_fecha_nacimiento,
              cliente_edad
            ) VALUES (?,?,?)`;

            db.query(
              sqlCliente,
              [usuarioId, user.cliente_fecha_nacimiento, edad],
              (errCliente) => {
                if (errCliente) return result(errCliente, null);

                const sqlTelefono = `INSERT INTO TELEFONO(
                  telefono,
                  usuario_id
                ) VALUES (?,?)`;

                db.query(
                  sqlTelefono,
                  [user.usuario_telefono, usuarioId],
                  (errTelefono) => {
                    if (errTelefono) return result(errTelefono, null);
                    return result(null, { usuario_id: usuarioId, ...user });
                  }
                );
              }
            );
          });
        }
      );
    });
  });
};

Usuario.findAll = (result) => {
  const sql = `
    SELECT
      us.usuario_id,
      r.rol_nombre,
      us.usuario_documento,
      us.usuario_primer_nombre,
      us.usuario_segundo_nombre,
      us.usuario_primer_apellido,
      us.usuario_segundo_apellido,
      us.usuario_correo,
      us.usuario_direccion,
      GROUP_CONCAT(t.telefono) AS telefonos
    FROM usuario us
    INNER JOIN rol_usuario ru ON us.usuario_id = ru.usuario_id
    INNER JOIN rol r ON ru.rol_id = r.rol_id
    LEFT JOIN telefono t ON us.usuario_id = t.usuario_id
    GROUP BY us.usuario_id
  `;

  db.query(sql, (err, usuario) => {
    if (err) return result(err, null);
    result(null, usuario);
  });
};

Usuario.findById = (id, result) => {
  const sql = `SELECT
    usuario_id,
    usuario_primer_nombre,
    usuario_segundo_nombre,
    usuario_primer_apellido,
    usuario_segundo_apellido,
    usuario_documento,
    usuario_correo,
    usuario_direccion,
    usuario_credencial
  FROM USUARIO
  WHERE usuario_id = ?`;

  db.query(sql, [id], (err, user) => {
    if (err) return result(err, null);
    result(null, user[0]);
  });
};

Usuario.findByDocument = (documento, result) => {
  const sql = `SELECT
    usuario_id,
    usuario_primer_nombre,
    usuario_segundo_nombre,
    usuario_primer_apellido,
    usuario_segundo_apellido,
    usuario_documento,
    usuario_correo,
    usuario_direccion,
    usuario_credencial
  FROM USUARIO
  WHERE usuario_documento = ?`;

  db.query(sql, [documento], (err, doc) => {
    if (err) return result(err, null);
    result(null, doc[0]);
  });
};

Usuario.update = async (id, usuario, result) => {
  const fields = [];
  const values = [];
  const documento = usuario.usuario_documento;
  const correo = usuario.usuario_correo ? usuario.usuario_correo.toLowerCase() : null;

  if (documento) {
    const existingByDocument = await new Promise((resolve, reject) => {
      db.query(
        'SELECT usuario_id FROM USUARIO WHERE usuario_documento = ? AND usuario_id <> ? LIMIT 1',
        [documento, id],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    }).catch((err) => result(err, null));

    if (!existingByDocument) return;
    if (existingByDocument.length > 0) {
      return result({ message: 'El documento ya existe' }, null);
    }

    fields.push('usuario_documento = ?');
    values.push(documento);
  }

  if (correo) {
    const existingByEmail = await new Promise((resolve, reject) => {
      db.query(
        'SELECT usuario_id FROM USUARIO WHERE usuario_correo = ? AND usuario_id <> ? LIMIT 1',
        [correo, id],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    }).catch((err) => result(err, null));

    if (!existingByEmail) return;
    if (existingByEmail.length > 0) {
      return result({ message: 'El correo ya existe' }, null);
    }
  }

  if (usuario.usuario_credencial) {
    const hash = await bcrypt.hash(usuario.usuario_credencial, 10);
    fields.push('usuario_credencial = ?');
    values.push(hash);
  }

  if (correo) {
    fields.push('usuario_correo = ?');
    values.push(correo);
  }

  if (usuario.usuario_primer_nombre) {
    fields.push('usuario_primer_nombre = ?');
    values.push(usuario.usuario_primer_nombre);
  }

  if (usuario.usuario_segundo_nombre) {
    fields.push('usuario_segundo_nombre = ?');
    values.push(usuario.usuario_segundo_nombre);
  }

  if (usuario.usuario_primer_apellido) {
    fields.push('usuario_primer_apellido = ?');
    values.push(usuario.usuario_primer_apellido);
  }

  if (usuario.usuario_segundo_apellido) {
    fields.push('usuario_segundo_apellido = ?');
    values.push(usuario.usuario_segundo_apellido);
  }

  if (usuario.usuario_direccion) {
    fields.push('usuario_direccion = ?');
    values.push(usuario.usuario_direccion);
  }

  if (fields.length === 0) {
    return result({ message: 'No hay datos para actualizar' }, null);
  }

  const sql = `UPDATE usuario SET ${fields.join(', ')} WHERE usuario_id = ?`;
  values.push(id);

  db.query(sql, values, (err) => {
    if (err) return result(err, null);
    result(null, { usuario_id: id, ...usuario });
  });
};

Usuario.delete = (id, result) => {
  const sql = 'DELETE FROM usuario WHERE usuario_id = ?';
  db.query(sql, [id], (err, res) => {
    if (err) return result(err, null);
    result(null, res);
  });
};

Usuario.findByEmailWithRole = (email, result) => {
  const sql = `
    SELECT
      USUARIO.usuario_id,
      USUARIO.usuario_primer_nombre,
      USUARIO.usuario_segundo_nombre,
      USUARIO.usuario_primer_apellido,
      USUARIO.usuario_segundo_apellido,
      USUARIO.usuario_documento,
      USUARIO.usuario_correo,
      USUARIO.usuario_direccion,
      USUARIO.usuario_credencial,
      ROL.rol_nombre
    FROM USUARIO
    INNER JOIN ROL_USUARIO ON USUARIO.usuario_id = ROL_USUARIO.usuario_id
    INNER JOIN ROL ON ROL_USUARIO.rol_id = ROL.rol_id
    WHERE USUARIO.usuario_correo = ?
  `;

  db.query(sql, [email], (err, rows) => {
    if (err) return result(err, null);
    result(null, rows[0]);
  });
};

module.exports = Usuario;
