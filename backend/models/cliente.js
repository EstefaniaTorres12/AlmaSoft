const dayjs = require('dayjs');
const db = require('../config/config');
const bcrypt = require('bcryptjs');

const Cliente = {};

Cliente.create = async (cliente, result) => {
    try {

        const correo = cliente.correo.toLowerCase();
        const hash = await bcrypt.hash(cliente.credencial, 10);

        const checkSql = "SELECT * FROM USUARIO WHERE usuario_documento = ?";
        db.query(checkSql, [cliente.documento], (err, rows) => {

            if (err) {
                console.log(err);
                return result(err, null);
            }

            if (rows.length > 0) {
                return result({ message: "El documento ya existe" }, null);
            }

            // 🔹 1. INSERT USUARIO
            const sqlUsuario = `
                INSERT INTO USUARIO(
                    usuario_documento,
                    usuario_primer_nombre,
                    usuario_segundo_nombre,
                    usuario_primer_apellido,
                    usuario_segundo_apellido,
                    usuario_correo,
                    usuario_direccion,
                    usuario_credencial
                ) VALUES (?,?,?,?,?,?,?,?)
            `;

            db.query(sqlUsuario, [
                cliente.documento,
                cliente.primer_nombre,
                cliente.segundo_nombre,
                cliente.primer_apellido,
                cliente.segundo_apellido,
                correo,
                cliente.direccion,
                hash
            ], (err2, resUsuario) => {

                if (err2) {
                    console.log(err2);
                    return result(err2, null);
                }

                const usuario_id = resUsuario.insertId;

                // 🔥 1.5 INSERT ROL_USUARIO (CLIENTE = 1)
                const sqlRolUsuario = `
                    INSERT INTO ROL_USUARIO(
                        rol_id,
                        usuario_id,
                        estado_cred
                    ) VALUES (?,?,?)
                `;

                db.query(sqlRolUsuario, [
                    1, // 👈 SIEMPRE CLIENTE
                    usuario_id,
                    true
                ], (errRol) => {

                    if (errRol) {
                        console.log(errRol);
                        return result(errRol, null);
                    }

                    // 🔹 2. INSERT CLIENTE
                    const sqlCliente = `
                        INSERT INTO CLIENTE(
                            cliente_id,
                            cliente_fecha_nacimiento,
                            cliente_edad
                        ) VALUES (?,?,?)
                    `;

                    db.query(sqlCliente, [
                        usuario_id,
                        dayjs(cliente.fecha_nacimiento, "DD/MM/YYYY").toDate(),
                        cliente.edad
                    ], (err3) => {

                        if (err3) {
                            console.log(err3);
                            return result(err3, null);
                        }

                        // 🔹 3. INSERT TELEFONO
                        const sqlTelefono = `
                            INSERT INTO TELEFONO(
                                usuario_id,
                                telefono
                            ) VALUES (?,?)
                        `;

                        db.query(sqlTelefono, [
                            usuario_id,
                            cliente.telefono
                        ], (err4) => {

                            if (err4) {
                                console.log(err4);
                                return result(err4, null);
                            }

                            result(null, { id: usuario_id });
                        });
                    });
                });
            });
        });

    } catch (error) {
        console.log(error);
        result(error, null);
    }
};


Cliente.findAll = (result) => {
    const sql = `SELECT 
    u.usuario_id AS id,
    u.usuario_documento AS documento,
    u.usuario_primer_nombre AS primer_nombre,
    u.usuario_segundo_nombre AS segundo_nombre,
    u.usuario_primer_apellido AS primer_apellido,
    u.usuario_segundo_apellido AS segundo_apellido,
    u.usuario_correo AS correo,
    u.usuario_direccion AS direccion,
    GROUP_CONCAT(DISTINCT t.telefono) AS telefono,
    c.cliente_fecha_nacimiento AS fecha_nacimiento,
    c.cliente_edad AS edad
FROM CLIENTE c
INNER JOIN USUARIO u ON u.usuario_id = c.cliente_id
LEFT JOIN TELEFONO t ON t.usuario_id = u.usuario_id
GROUP BY u.usuario_id`;

    db.query(sql, (err, cliente) => {
        if (err) {
            console.log('Error al consultar los clientes:', err);
            result(err, null);
        } else {
            console.log('Clientes encontrados:', cliente.length);
            result(null, cliente);
        }
    });
};


Cliente.findById = (id, result) => {

    const sql = `SELECT 
        u.usuario_id AS id,
        u.usuario_documento AS documento,
        u.usuario_primer_nombre AS primer_nombre,
        u.usuario_segundo_nombre AS segundo_nombre,
        u.usuario_primer_apellido AS primer_apellido,
        u.usuario_segundo_apellido AS segundo_apellido,
        u.usuario_correo AS correo,
        u.usuario_direccion AS direccion,
        GROUP_CONCAT(DISTINCT t.telefono) AS telefono,
        c.cliente_fecha_nacimiento AS fecha_nacimiento,
        c.cliente_edad AS edad
    FROM CLIENTE c
    INNER JOIN USUARIO u ON u.usuario_id = c.cliente_id
    LEFT JOIN TELEFONO t ON t.usuario_id = u.usuario_id
    WHERE u.usuario_id = ?
    GROUP BY u.usuario_id`;

    db.query(sql, [id], (err, res) => {
        if (err) {
            console.log('Error al obtener cliente:', err);
            result(err, null);
        } else {
            result(null, res[0]); 
        }
    });
};


Cliente.update = (id, cliente, result) => {

    const sqlUsuario = `
        UPDATE USUARIO SET
            usuario_primer_nombre = ?,
            usuario_segundo_nombre = ?,
            usuario_primer_apellido = ?,
            usuario_segundo_apellido = ?,
            usuario_correo = ?,
            usuario_direccion = ?
        WHERE usuario_id = ?
    `;

    const sqlCliente = `
        UPDATE CLIENTE SET
            cliente_fecha_nacimiento = ?,
            cliente_edad = ?
        WHERE cliente_id = ?
    `;

    db.query(sqlUsuario, [
        cliente.primer_nombre,
        cliente.segundo_nombre,
        cliente.primer_apellido,
        cliente.segundo_apellido,
        cliente.correo,
        cliente.direccion,
        id
    ], (err) => {

        if (err) {
            console.log('Error actualizando usuario:', err);
            return result(err, null);
        }

        db.query(sqlCliente, [
            dayjs(cliente.fecha_nacimiento, "DD/MM/YYYY").toDate(),
            cliente.edad,
            id
        ], (err2, res) => {

            if (err2) {
                console.log('Error actualizando cliente:', err2);
                return result(err2, null);
            }

            console.log('Cliente completo actualizado');
            result(null, res);
        });
    });
};

Cliente.delete = (id, result) => {
    const sqlTelefono = `DELETE FROM TELEFONO WHERE usuario_id = ?`;
    db.query(sqlTelefono, [id], (err) => {
        if (err) return result(err, null);

        const sqlCliente = `DELETE FROM CLIENTE WHERE cliente_id = ?`;
        db.query(sqlCliente, [id], (err2) => {
            if (err2) return result(err2, null);

            const sqlUsuario = `DELETE FROM USUARIO WHERE usuario_id = ?`;
            db.query(sqlUsuario, [id], (err3, res) => {
                if (err3) return result(err3, null);
                result(null, res);
            });
        });
    });
};

module.exports = Cliente;