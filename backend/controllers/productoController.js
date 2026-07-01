const Producto = require('../models/producto');

module.exports = {

    // 🔹 CREAR
    createProducto(req, res) {
        const producto = req.body;
        if (req.file) {
            producto.producto_imagen = `/uploads/${req.file.filename}`;
        }

        Producto.create(producto, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al crear producto',
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Producto creado',
                data
            });
        });
    },

    getAllProductos(req, res) {
        Producto.findAll((err, productos) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al listar productos',
                });
            }

            return res.status(200).json({
                success: true,
                data: productos
            });
        });
    },

    // 🔹 FILTRAR
    filtrarPorNombre(req, res) {
        const { nombre } = req.query;

        Producto.findByName(nombre, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al filtrar productos'
                });
            }

            return res.status(200).json({
                success: true,
                data
            });
        });
    },

    // 🔹 POR ID
    getProductoById(req, res) {
        const id = req.params.id;

        Producto.findById(id, (err, producto) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al consultar producto'
                });
            }

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            return res.status(200).json({
                success: true,
                data: producto
            });
        });
    },

    // 🔹 UPDATE 🔥
    getProductoUpdate(req, res) {
        const producto = req.body;
        producto.producto_id = req.params.id;
        if (req.file) {
            producto.producto_imagen = `/uploads/${req.file.filename}`;
        }

        Producto.update(producto, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar producto'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Producto actualizado',
                data
            });
        });
    },

    // 🔹 DELETE
    getProductoDelete(req, res) {
        const id = req.params.id;

        Producto.delete(id, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al eliminar producto'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Producto eliminado',
                data
            });
        });
    }
};