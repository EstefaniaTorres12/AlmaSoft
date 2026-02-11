const Producto = require('../models/producto');

module.exports = {

    createProducto(req, res) {

        const producto = req.body;

        Producto.create(producto, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear producto',
                    error: err
                });
            } else {
                return res.status(201).json({
                    success: true,
                    message: 'Producto creado',
                    data: data
                });
            }
        });
    },


    getAllProductos(req, res) {
        Producto.findAll((err, productos) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al listar los productos',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Productos listados',
                data: productos
            });
        });
    },


    filtrarPorNombre(req, res) {
    const { nombre } = req.query;

    Producto.findByName(nombre, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al filtrar productos'
            });
        }

        res.status(200).json({
            success: true,
            data
        });
    });
},

    getProductoById(req, res) {
        const id = req.params.id;

        Producto.findById(id, (err, producto) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consultar el producto',
                    error: err
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
                message: 'Producto encontrado',
                data: producto
            });
        });
    },

    getProductoUpdate(req, res) {
        const producto = req.body;

        Producto.update(producto, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar el producto',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Producto actualizado',
                data: data
            });
        });
    },

    getProductoDelete(req, res) {
        const id = req.params.id;

        Producto.delete(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al eliminar el producto',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Producto eliminado',
                data: data
            });
        });
    }


}