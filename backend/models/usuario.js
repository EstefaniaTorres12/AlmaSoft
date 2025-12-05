const db = require('../config/config');
const bcrypt = require('bcryptjs');
const Usuario = {};
const RolUsuario = require('./rolUsuario');
const Cliente = require('./cliente');
const dayjs = require('dayjs');

// Crear usuario
Usuario.create = async (user, result) => {
    const hash = await bcrypt.hash(user.usuario_credencial, 10);

    const sql = `INSERT INTO USUARIO(
                    usuario_primer_nombre,
                    usuario_segundo_nombre,
                    usuario_primer_apellido,
                    usuario_segundo_apellido,
                    usuario_documento,
                    usuario_correo,
                    usuario_direccion,
                    usuario_credencial
                    ) VALUES (?,?,?,?,?,?,?,?)`;

    db.query(sql, [
        user.usuario_primer_nombre,
        user.usuario_segundo_nombre,
        user.usuario_primer_apellido,
        user.usuario_segundo_apellido,
        user.usuario_documento,
        user.usuario_correo,
        user.usuario_direccion,
        hash
    ], (err, res) => {
        if (err) {
            console.log('Error al crear al Usuario: ', err);
            result(err, null);
        } else {
            console.log('Usuario creado: ', { usuario_id: res.insertId, ...user });
            asignarRolUsuario(user, res.insertId, result);
        }
    });
};

Usuario.findAll = (result) => {
    const sql = `SELECT usuario_id,
                        usuario_primer_nombre,
                        usuario_segundo_nombre,
                        usuario_primer_apellido,
                        usuario_segundo_apellido,
                        usuario_documento,
                        usuario_correo,
                        usuario_direccion,
                        usuario_credencial 
                 FROM USUARIO`;
    db.query(sql,(err, usuario)=>{
        if (err) {
            console.log('Error al consultar usuarios:', err);
            result(err, null);
        } else {
            console.log('usuarios encontrados;', usuario.length);
            result(null, usuario);
        }
    });
};

// Asignar rol al usuario
function asignarRolUsuario(user, insertId, result) {
    let rolUsuario = {
        rol_id: user.rol_id,
        usuario_id: insertId,
        estado_cred: true
    };

    RolUsuario.create(rolUsuario, (error, datos) => {
        if (error) {
            return result(error, null);
        }

        if (user.rol_id === 3) {
            datosCliente(user, insertId, result);
        } else {
            // Si NO es cliente, terminar aquí
            result(null, { usuario_id: insertId, ...user });
        }
    });
}

// Crear datos de cliente
function datosCliente(user, insertId, result) {
    let hoy = new Date();
    let años = dayjs(hoy).diff(user.cliente_fecha_nacimiento, "year");

    let cliente = {
        cliente_id: insertId,
        cliente_fecha_nacimiento: user.cliente_fecha_nacimiento,
        cliente_edad: años
    };

    Cliente.create(cliente, (error, datos) => {
        if (error) {
            result(error, null);
        } else {
            result(null, { usuario_id: insertId, ...user });
        }
    });
}

// Obtener usuario por ID
Usuario.findById = (id, result) => {
    const sql = `SELECT usuario_id,
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
                        usuario_direccion,
                        usuario_credencial 
                 FROM USUARIO 
                 WHERE usuario_documento = ?`;
    db.query(sql, [documento], (err, doc) => {
        if (err) {
            console.log('Error al consultar : ', err);
            result(err, null);
        } else {
            result(null, doc[0]);
        }
    });
};

// Actualizar usuario
Usuario.update = async (usuario, result) => {
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

    const sql = `UPDATE usuario SET ${fields.join(", ")} WHERE usuario_id = ?`;
    values.push(usuario.usuario_id);

    db.query(sql, values, (err, res) => {
        if (err) {
            console.log('Error al actualizar usuario: ', err);
            result(err, null);
        } else {
            result(null, { usuario_id: usuario.usuario_id, ...usuario });
        }
    });
}

// Eliminar usuario
Usuario.delete = (id, result) => {
    const sql = `DELETE FROM usuario WHERE usuario_id = ?`;
    db.query(sql, [id], (err, res) => {
        if (err) {
            console.log('Error al eliminar usuario: ', err);
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

// Buscar usuario por email con rol (para login con JWT)
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
        INNER JOIN ROL_USUARIO 
            ON USUARIO.usuario_id = ROL_USUARIO.usuario_id
        INNER JOIN ROL 
            ON ROL_USUARIO.rol_id = ROL.rol_id
        WHERE USUARIO.usuario_correo = ?
    `;

    db.query(sql, [email], (err, res) => {
        if (err) {
            console.log("Error en findByEmailWithRole:", err);
            return result(err, null);
        }
        return result(null, res[0]);
    });
};

module.exports = Usuario;