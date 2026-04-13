const dayjs = require('dayjs');
const db = require('../config/config');
const bcrypt = require('bcryptjs');
const Cliente = {};

Cliente.create = async (cliente, result) => {
    try {

        const correo = cliente.usuario_correo
            ? cliente.usuario_correo.toLowerCase()
            : null;

        const hash = await bcrypt.hash(cliente.usuario_credencial, 10);

        if (!cliente.usuario_documento) {
            return result({ message: "Documento es obligatorio" }, null);
        }

        const checkSql = "SELECT * FROM USUARIO WHERE usuario_documento = ?";
        db.query(checkSql, [cliente.usuario_documento], (err, rows) => {

            if (err) return result(err, null);

            if (rows.length > 0) {
                return result({ message: "El documento ya existe" }, null);
            }

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
                cliente.usuario_documento,
                cliente.usuario_primer_nombre,
                cliente.usuario_segundo_nombre,
                cliente.usuario_primer_apellido,
                cliente.usuario_segundo_apellido,
                correo,
                cliente.usuario_direccion,
                hash
            ], (err2, resUsuario) => {

                if (err2) return result(err2, null);

                const usuario_id = resUsuario.insertId;

                // VALIDACIÓN CLAVE (evita 501)
                if (!cliente.cliente_fecha_nacimiento) {
                    return result({ message: "Fecha de nacimiento es obligatoria" }, null);
                }

                const fecha = cliente.cliente_fecha_nacimiento;
                const edad = cliente.cliente_edad
                    ? cliente.cliente_edad
                    : require('dayjs')().diff(fecha, "year");

                const sqlCliente = `
                    INSERT INTO CLIENTE(
                        cliente_id,
                        cliente_fecha_nacimiento,
                        cliente_edad
                    ) VALUES (?,?,?)
                `;

                db.query(sqlCliente, [
                    usuario_id,
                    fecha,
                    edad
                ], (err3) => {

                    if (err3) return result(err3, null);

                    const sqlTelefono = `
                        INSERT INTO TELEFONO(
                            usuario_id,
                            telefono
                        ) VALUES (?,?)
                    `;

                    db.query(sqlTelefono, [
                        usuario_id,
                        cliente.usuario_telefono || null
                    ], (err4) => {

                        if (err4) return result(err4, null);

                        return result(null, { id: usuario_id });
                    });
                });
            });
        });

    } catch (error) {
        return result(error, null);
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

    // primero actualiza usuario
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

        // luego cliente
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

module.exports = Cliente;