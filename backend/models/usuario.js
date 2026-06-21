const pool = require('../config/config');
const { getConnection, queryConn, beginTx, commitTx, rollbackTx } = require('../config/db');
const bcrypt = require('bcryptjs');
const Usuario = {};
const dayjs = require('dayjs');

// Crear usuario con transacción completa
Usuario.create = async (user, result) => {
    let conn;
    try {
        const hash = await bcrypt.hash(user.usuario_credencial, 10);
        conn = await getConnection();
        await beginTx(conn);

        const resUsuario = await queryConn(conn, `
            INSERT INTO usuario (
                usuario_primer_nombre,
                usuario_segundo_nombre,
                usuario_primer_apellido,
                usuario_segundo_apellido,
                usuario_documento,
                usuario_correo,
                usuario_direccion,
                usuario_credencial
            ) VALUES (?,?,?,?,?,?,?,?)
        `, [
            user.usuario_primer_nombre,
            user.usuario_segundo_nombre,
            user.usuario_primer_apellido,
            user.usuario_segundo_apellido,
            user.usuario_documento,
            user.usuario_correo,
            user.usuario_direccion,
            hash
        ]);

        const insertId = resUsuario.insertId;

        await queryConn(conn,
            `INSERT INTO rol_usuario (rol_id, usuario_id, estado_cred) VALUES (?,?,?)`,
            [user.rol_id, insertId, true]
        );

        await queryConn(conn,
            `INSERT INTO telefono (telefono, usuario_id) VALUES (?,?)`,
            [user.usuario_telefono, insertId]
        );

        if (Number(user.rol_id) === 1) {
            if (!user.cliente_fecha_nacimiento) {
                await rollbackTx(conn);
                conn.release();
                return result({ message: 'Falta la fecha de nacimiento del cliente' }, null);
            }
            const años = dayjs().diff(dayjs(user.cliente_fecha_nacimiento), 'year');
            await queryConn(conn,
                `INSERT INTO cliente (cliente_id, cliente_fecha_nacimiento, cliente_edad) VALUES (?,?,?)`,
                [insertId, user.cliente_fecha_nacimiento, años]
            );
        }

        await commitTx(conn);
        conn.release();
        result(null, { usuario_id: insertId, ...user });

    } catch (err) {
        if (conn) {
            await rollbackTx(conn);
            conn.release();
        }
        console.error('Error al crear usuario (rollback):', err);
        result(err, null);
    }
};

Usuario.findAll = (result) => {
    const sql = `
        SELECT
            us.usuario_id,
            r.rol_id,
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
        INNER JOIN rol_usuario ru ON us.usuario_id = ru.usuario_id AND ru.estado_cred = 1
        INNER JOIN rol r ON ru.rol_id = r.rol_id
        LEFT JOIN telefono t ON us.usuario_id = t.usuario_id
        GROUP BY us.usuario_id, r.rol_id, r.rol_nombre
        ORDER BY us.usuario_id DESC
    `;
    pool.query(sql, (err, usuario) => {
        if (err) {
            console.log('Error al consultar usuarios:', err);
            result(err, null);
        } else {
            console.log('usuarios encontrados;', usuario.length);
            result(null, usuario);
        }
    });
};

// Obtener usuario por ID
Usuario.findById = (id, result) => {
    const sql = `SELECT usuario_id,
                        usuario_primer_nombre,
                        usuario_segundo_nombre,
                        usuario_primer_apellido,
                        usuario_segundo_apellido,
                        usuario_documento,
                        usuario_correo,
                        usuario_direccion
                 FROM usuario
                 WHERE usuario_id = ?`;
    pool.query(sql, [id], (err, user) => {
        if (err) {
            console.log('Error al consultar : ', err);
            result(err, null);
        } else {
            result(null, user[0]);
        }
    });
};

// Obtener usuario por documento
Usuario.findByDocument = (documento, result) => {
    const sql = `SELECT usuario_id,
                        usuario_primer_nombre,
                        usuario_segundo_nombre,
                        usuario_primer_apellido,
                        usuario_segundo_apellido,
                        usuario_documento,
                        usuario_correo,
                        usuario_direccion
                 FROM usuario
                 WHERE usuario_documento = ?`;
    pool.query(sql, [documento], (err, doc) => {
        if (err) {
            console.log('Error al consultar : ', err);
            result(err, null);
        } else {
            result(null, doc[0]);
        }
    });
};

// Actualizar usuario
Usuario.update = async (id, usuario, result) => {
    let fields = [];
    let values = [];

    if (usuario.usuario_credencial) {
        const hash = await bcrypt.hash(usuario.usuario_credencial, 10);
        fields.push('usuario_credencial = ?');
        values.push(hash);
    }

    if (usuario.usuario_correo) {
        fields.push('usuario_correo = ?');
        values.push(usuario.usuario_correo);
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
        return result({ message: "No hay datos para actualizar" }, null);
    }

    const sql = `UPDATE usuario SET ${fields.join(", ")} WHERE usuario_id = ?`;
    values.push(id);

    pool.query(sql, values, (err, res) => {
        if (err) {
            console.log('Error al actualizar usuario: ', err);
            result(err, null);
        } else {
            result(null, { usuario_id: id, ...usuario });
        }
    });
};

// Eliminar usuario
Usuario.delete = (id, result) => {
    const sql = `DELETE FROM usuario WHERE usuario_id = ?`;
    pool.query(sql, [id], (err, res) => {
        if (err) {
            console.log('Error al eliminar usuario: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Buscar usuario por email con rol activo (para login con JWT)
// Filtro estado_cred = 1 garantiza que solo roles activos acceden.
// ORDER BY + LIMIT 1 garantiza que si hay duplicados, toma el rol más reciente.
Usuario.findByEmailWithRole = (email, result) => {
    const sql = `
        SELECT
            usuario.usuario_id,
            usuario.usuario_primer_nombre,
            usuario.usuario_segundo_nombre,
            usuario.usuario_primer_apellido,
            usuario.usuario_segundo_apellido,
            usuario.usuario_documento,
            usuario.usuario_correo,
            usuario.usuario_direccion,
            usuario.usuario_credencial,
            rol.rol_id,
            rol.rol_nombre
        FROM usuario
        INNER JOIN rol_usuario
            ON usuario.usuario_id = rol_usuario.usuario_id
        INNER JOIN rol
            ON rol_usuario.rol_id = rol.rol_id
        WHERE usuario.usuario_correo = ?
          AND rol_usuario.estado_cred = 1
        ORDER BY rol_usuario.cred_id DESC
        LIMIT 1
    `;

    pool.query(sql, [email], (err, res) => {
        if (err) {
            console.error('Error en findByEmailWithRole:', err);
            return result(err, null);
        }
        return result(null, res[0]);
    });
};



module.exports = Usuario;