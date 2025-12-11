const dayjs = require('dayjs');
const db = require('../config/config');
const bcrypt = require('bcryptjs');
const Cliente = {};

Cliente.create = async (cliente, result) => {
    const sql = `INSERT INTO CLIENTE( 
                 cliente_id,
                 cliente_fecha_nacimiento,
                 cliente_edad
                 )VALUES(?,?,?)`;
    db.query(sql, [
        cliente.cliente_id,
        dayjs(cliente.cliente_fecha_nacimiento, "DD/MM/YYYY").toDate(),
        cliente.cliente_edad
    ], (err, res) => {
        if (err) {
            console.log('Error al insertar datos del cliente', err);
            result(err, null);
        } else {
            console.log('Datos del cliente insertados correctamente: ', { cliente });
            result(null, { cliente });
        }
    });
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
    t.telefono AS telefono,
    c.cliente_fecha_nacimiento AS fecha_nacimiento,
    c.cliente_edad AS edad
FROM USUARIO u
INNER JOIN CLIENTE c ON u.usuario_id = c.cliente_id
LEFT JOIN TELEFONO t ON t.usuario_id = u.usuario_id
`;

    db.query(sql, (err, cliente) => {
        if (err) {
            console.log('Error al consultar los clientes:', err);
            result(err, null);
        } else {
            console.log('Clientes Encontrados:', cliente.length);
            result(null, cliente);
        }
    });
};

module.exports = Cliente;