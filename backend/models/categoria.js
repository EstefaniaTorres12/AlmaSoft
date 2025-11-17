const db = require('../config/config');
const bcrypt = require('bcryptjs');
const Categoria = {};

Categoria.create = (categoria, result) => {
    const sql = `
        INSERT INTO CATEGORIA (
            categoria_id,
            categoria_nombre
        ) VALUES (?, ?)
    `;

    db.query(sql, [
        categoria.categoria_id,
        categoria.categoria_nombre
    ], (err, res) => {
        if (err) {
            return result(err, null);
        }
        return result(null, res.insertId);
    });
};

Categoria.findAll = (result) => {
    const sql = `SELECT categoria_id, categoria_nombre FROM CATEGORIA`;

    db.query(sql, (err, categorias) => {
        if (err) {
            return result(err, null);
        }
        return result(null, categorias);
    });
};

Categoria.findById = (categoria_id, result) => {
    const sql = `SELECT categoria_id, categoria_nombre FROM CATEGORIA WHERE categoria_id = ?`;
    db.query(sql,[categoria_id], (err, categoria) => {
        if(err){
            console.log('Error al consultar :', err);
            result(err, null);
        } else {
            console.log('Categoria Consultada : ', categoria[0]);
            result(null, categoria[0]);
        }
    });
};

Categoria.update = async (categoria, result) => {
    let fields = [];
    let values = [];

    if (categoria.categoria_nombre){
        fields.push('categoria_nombre = ?');
        values.push(categoria.categoria_nombre);
    }

    const sql = `UPDATE categoria SET ${fields.join(", ")} WHERE categoria_id = ?`;
    values.push(categoria.categoria_id);

    db.query(sql, values, (err, res) => {
        if (err) {
            console.log('Error al actualizar la categoria: ', err);
            result(err, null);
        } else {
            console.log('Categoria Actualizada: ', {categoria_id: categoria.categoria_id, ...categoria });
            result(null, {categoria_id: categoria.categoria_id, ...categoria});
        }
    });
}


Categoria.delete = (id, result) => {
    const sql = `DELETE FROM categoria WHERE categoria_id = ?`;
    db.query(sql,  [id], (err, res) =>{
        if (err){
            console.log('Error al eliminar Categoria', err);
            result(err, null);
        } else {
            console.log('Categoria elimminada: ', id);
            result(null, res);
        }
    });
}

module.exports = Categoria;