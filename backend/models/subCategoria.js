const db = require('../config/config');
const bcrypt = require('bcryptjs');
const SubCategoria = {};

SubCategoria.create = async (subCategoria, result) => {
    const sql = `INSERT INTO subcategoria (
    subcategoria_id,
    subcategoria_nombre,
    categoria_id
    ) VALUES (?,?,?)`;

    db.query(sql, [
        subCategoria.subcategoria_id,
        subCategoria.subcategoria_nombre,
        subCategoria.categoria_id
    ], (err, res) => {
        if (err) {
            console.log('Error al crear Sub Categoria: ', err);
            result(err, null);
        } else {
            console.log('SubCategoria creada correctamente:', { subcategoria_id: res.insertId, ...subCategoria });
            result(null, { subcategoria_id: res.insertId, ...subCategoria });
        }
    });
};

SubCategoria.findAll = (result) => {
    const sql = `SELECT subcategoria_id,
                 subcategoria_nombre,
                 categoria_id FROM subcategoria`;
    db.query(sql, (err, subcategoria) => {
        if (err) {
            console.log('Error al listar SubCategorias: ', err);
            result(err, null);
        } else {
            console.log('Subcategorias listadas: ', subcategoria.length);
            result(null, subcategoria);
        }
    });
};

SubCategoria.findById = (subcategoria_id, result) => {
    const sql = ` SELECT subcategoria_id, subcategoria_nombre, categoria_id FROM subcategoria WHERE subcategoria_id = ?`;
    db.query(sql, [subcategoria_id], (err, subcategoria) => {
        if (err) {
            console.log('Error al consultar :', err);
             result(err, null);
        } else {
            console.log('Subcategoria Consultada: ', subcategoria[0]);
             result(null, subcategoria[0]);
        }
    });
};

SubCategoria.update = async (subcategoria, result) => {
    let fields = [];
    let values = [];

    if (subcategoria.subcategoria_nombre) {
        fields.push('subcategoria_nombre = ?');
        values.push(subcategoria.subcategoria_nombre);
    }

    if (subcategoria.categoria_id) {
        fields.push('categoria_id = ?');
        values.push(subcategoria.categoria_id);
    }

    const sql = `UPDATE subcategoria SET ${fields.join(", ")} WHERE subcategoria_id = ?`;
    values.push(subcategoria.subcategoria_id);

    db.query(sql, values, (err, res) => {
        if (err) {
            console.log('Error al actualizar la subcategoria: ', err);
            result(err, null);
        } else {
            console.log('Subcategoria actualizada correctamente: ', { subcategoria_id: subcategoria.subcategoria_id, ...subcategoria });
            result(null, { subcategoria_id: subcategoria.subcategoria_id, ...subcategoria });
        }
    });
};

SubCategoria.delete = (id, result) => {
    const sql =`DELETE FROM subcategoria WHERE subcategoria_id = ?`;
    db.query(sql, [id], (err, res) => {
        if (err) {
            console.log('Error al eliminar la subcategoria:', err);
            result(err, null);
        } else {
            console.log('Subcategoria eliminada con id :', id);
            result(null, res);
        }
    });
};

module.exports = SubCategoria;