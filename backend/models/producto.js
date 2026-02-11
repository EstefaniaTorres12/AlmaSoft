const db = require('../config/config');
const bcrypt = require('bcryptjs');
const Producto = {};


Producto.create = async (producto, result) => {
    const sql = `INSERT INTO PRODUCTO(
    producto_nombre,
    producto_descripcion,
    producto_precio,
    producto_stock,
    producto_estado,
    subcategoria_id,
    producto_imagen
    )VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        producto.producto_nombre,
        producto.producto_descripcion,
        producto.producto_precio,
        producto.producto_stock,
        producto.producto_estado,
        producto.subcategoria_id,
        producto.producto_imagen

    ], (err, res) => {
        if (err) {
            console.log('Error al crear el producto', err);
            result(err, null);
        } else {
            console.log('Producto creado correctamente: ', { producto_id: res.insertId, ...producto });
            result(null, { producto_id: res.insertId, ...producto });
        }
    });
};

Producto.findByName = (nombre, result) => {
    const sql = `
        SELECT 
            producto_id,
            producto_nombre,
            producto_descripcion,
            producto_precio,
            producto_stock,
            producto_estado,
            subcategoria_id,
            producto_imagen
        FROM PRODUCTO
        WHERE producto_nombre LIKE ?
        COLLATE utf8_general_ci
    `;

    db.query(sql, [`%${nombre}%`], (err, productos) => {
        if (err) {
            console.log('Error al consultar:', err);
            result(err, null);
        } else {
            result(null, productos);
        }
    });
};

Producto.findAll = (result) => {
    const sql = `SELECT  producto_id,
    producto_nombre,
    producto_descripcion,
    producto_precio,
    producto_stock,
    producto_estado,
    subcategoria_id,
    producto_imagen FROM PRODUCTO`;
    db.query(sql, (err, producto) => {
        if (err) {
            console.log('Error al consultar:', err);
            result(err, null);
        } else {
            console.log('Productos consultados', producto.length);
            result(null, producto);
        }
    });
};

Producto.findById = (producto_id, result) => {
    const sql = `SELECT producto_id,
    producto_nombre,
    producto_descripcion,
    producto_precio,
    producto_stock,
    producto_estado,
    subcategoria_id,
    producto_imagen FROM PRODUCTO WHERE producto_id = ? `;

    db.query(sql, [producto_id], (err, producto) => {
        if (err) {
            console.log('error al consultar :', err);
            result(err, null);
        } else {
            console.log('Producto consultado:', producto[0]);
            result(null, producto[0]);
        }
    });
};

Producto.update = async (producto, result) => {

    let fields = [];
    let values = [];

    if (producto.producto_nombre) {
        fields.push('producto_nombre = ?');
        values.push(producto.producto_nombre);
    }

    if (producto.producto_descripcion) {
        fields.push('producto_descripcion = ?');
        values.push(producto.producto_descripcion);
    }

    if (producto.producto_precio) {
        fields.push('producto_precio = ?');
        values.push(producto.producto_precio);
    }

    if (producto.producto_stock) {
        fields.push('producto_stock = ?');
        values.push(producto.producto_stock);
    }

    if (producto.producto_estado) {
        fields.push('producto_estado = ?');
        values.push(producto.producto_estado);
    }

    if (producto.subcategoria_id) {
        fields.push('subcategoria_id = ?');
        values.push(producto.subcategoria_id);
    }

    if (producto.producto_imagen) {
        fields.push('producto_imagen = ?');
        values.push(producto.producto_imagen);
    }

    const sql = `UPDATE PRODUCTO SET ${fields.join(', ')} WHERE producto_id = ?`;
    values.push(producto.producto_id);

    db.query(sql, values, (err, res) => {
        if (err) {
            console.log('Error al actualizar producto:', err);
            result(err, null);
        } else {
            console.log('Producto actualizado correctamente:', { producto_id: producto.producto_id, ...producto });
            result(null, { producto_id: producto.producto_id, ...producto });
        }
    });
};

Producto.delete = (producto_id, result) => {

    const sql = `DELETE FROM PRODUCTO WHERE producto_id = ?`;

    db.query(sql, [producto_id], (err, res) => {
        if (err) {
            console.log('Error al eliminar producto:', err);
            result(err, null);
        } else {
            console.log('Producto eliminado con id:', producto_id);
            result(null, res);
        }
    });
};



module.exports = Producto;