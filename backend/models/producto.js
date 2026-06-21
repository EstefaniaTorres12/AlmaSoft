const db = require('../config/config');
const Producto = {};

// 🔹 CREAR
Producto.create = (producto, result) => {
    const sql = `INSERT INTO producto(
    producto_nombre,
    producto_descripcion,
    producto_precio,
    producto_stock,
    producto_estado,
    subcategoria_id,
    producto_imagen
) VALUES (?, ?, ?, ?, ?, ?, ?)`;

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
            return result(err, null);
        }
        return result(null, { producto_id: res.insertId, ...producto });
    });
};

// 🔹 LISTAR CON JOIN 🔥
Producto.findAll = (result) => {
    const sql = `
        SELECT 
            p.producto_id,
            p.producto_nombre,
            p.producto_descripcion,
            p.producto_precio,
            p.producto_stock,
            p.producto_estado,
            p.producto_imagen,
            sc.subcategoria_nombre,
            c.categoria_nombre
        FROM producto p
        INNER JOIN subcategoria sc 
            ON p.subcategoria_id = sc.subcategoria_id
        INNER JOIN categoria c 
            ON sc.categoria_id = c.categoria_id
    `;

    db.query(sql, (err, data) => {
        if (err) {
            console.log('Error al consultar:', err);
            return result(err, null);
        }
        return result(null, data);
    });
};

// 🔹 FILTRAR
Producto.findByName = (nombre, result) => {
    const sql = `
        SELECT * FROM producto
        WHERE producto_nombre LIKE ?
    `;

    db.query(sql, [`%${nombre}%`], (err, productos) => {
        if (err) return result(err, null);
        result(null, productos);
    });
};

// 🔹 POR ID
Producto.findById = (id, result) => {
    const sql = `SELECT * FROM producto WHERE producto_id = ?`;

    db.query(sql, [id], (err, data) => {
        if (err) return result(err, null);
        result(null, data[0]);
    });
};

// 🔹 UPDATE (CORREGIDO)
Producto.update = (producto, result) => {

    let fields = [];
    let values = [];

    if (producto.producto_nombre !== undefined) {
        fields.push('producto_nombre = ?');
        values.push(producto.producto_nombre);
    }

    if (producto.producto_descripcion !== undefined) {
        fields.push('producto_descripcion = ?');
        values.push(producto.producto_descripcion);
    }

    if (producto.producto_precio !== undefined) {
        fields.push('producto_precio = ?');
        values.push(producto.producto_precio);
    }

    if (producto.producto_stock !== undefined) {
        fields.push('producto_stock = ?');
        values.push(producto.producto_stock);
    }

    if (producto.producto_estado !== undefined) {
        fields.push('producto_estado = ?');
        values.push(producto.producto_estado);
    }

    if (producto.subcategoria_id !== undefined) {
        fields.push('subcategoria_id = ?');
        values.push(producto.subcategoria_id);
    }

    if (producto.producto_imagen !== undefined) {
        fields.push('producto_imagen = ?');
        values.push(producto.producto_imagen);
    }

    const sql = `UPDATE producto SET ${fields.join(', ')} WHERE producto_id = ?`;
    values.push(producto.producto_id);

    db.query(sql, values, (err, res) => {
        if (err) {
            console.log('Error al actualizar producto:', err);
            return result(err, null);
        }
        return result(null, { producto_id: producto.producto_id, ...producto });
    });
};

// 🔹 DELETE
Producto.delete = (id, result) => {
    const sql = `DELETE FROM producto WHERE producto_id = ?`;

    db.query(sql, [id], (err, res) => {
        if (err) return result(err, null);
        result(null, res);
    });
};

module.exports = Producto;