const db = require('../config/config');
const bcrypt = require('bcryptjs');
const Rol = {};

Rol.findAll = (result) => {
    const sql = `SELECT rol_id, rol_nombre FROM ROL`;
    db.query(sql, (err, rol) => {
        if (err) {
            console.log('Error al listar los Roles: ', err);
            result(err, null);
        } else {
            console.log('Roles Encontrados: ', rol.lenght);
            result(null, rol);
        }
    });
};

Rol.findById = (rol_id, result) => {
    const sql = `SELECT rol_id, rol_nombre FROM ROL WHERE rol_id = ?`;
    db.query(sql, [rol_id], (err, rol) => {
        if (err) {
            console.log('Error al consultar: ', err);
            result(err, null);
        } else {
            console.log('Rol Consultado: ', rol[0]);
            result(null, rol[0]);
        }
    });
};

Rol.create = async (rol, result) => {
    const sql = `INSERT INTO ROL(
    rol_id,
    rol_nombre
    )VALUES(?,?)`;

    db.query(sql,
        [
            rol.rol_id,
            rol.rol_nombre
        ], (err, res) => {
            if (err) {
                console.log('Error al crear el rol: ', err);
                result(err, null)
            }else{
                console.log('Rol creado correctamente: ',{rol_id: res.insertId, ...rol});
                result(null, {rol_id: res.insertId, ...rol});
            }
        }
    );
};

Rol.delete = (id, result) => {
    const sql = `DELETE FROM ROL WHERE rol_id = ?`;
    db.query(sql, [id], (err, res) => {
        if (err){
            console.log('Error al eliminar Rol: ', err);
            result(err, null);
        } else{
            console.log('Rol eliminado correctamente: ', id);
            result(null,res);
        }
    });
}

module.exports= Rol;