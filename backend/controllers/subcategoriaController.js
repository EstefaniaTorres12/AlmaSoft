const SubCategoria = require('../models/subCategoria');

module.exports = {

    crearSubcategoria(req, res) {
        const subcategoria = req.body;

        SubCategoria.create(subcategoria, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al crear subcategoria'
                });
            }
            return res.status(201).json({
                success: true,
                message: 'Subcategoria creada correctamente',
                data
            });
        });
    },

    getAllSubcategorias(req, res) {
        SubCategoria.findAll((err, subcategoria) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al listar subcategorias'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Subcategorias listadas',
                data: subcategoria
            });
        });
    },

    getSubcategoriaById(req, res) {
        const id = req.params.id;
        SubCategoria.findById(id, (err, sub) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al consultar subcategoria'
                });
            }
            if (!sub) {
                return res.status(404).json({
                    success: false,
                    message: 'Subcategoria no encontrada'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Subcategoria encontrada',
                data: sub
            });
        });
    },

    getSubcategoriaUpdate(req, res) {
        const subcategoria = req.body;
        SubCategoria.update(subcategoria, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar subcategoria'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Subcategoria actualizada',
                data
            });
        });
    },

    getSubcategoriaDelete(req, res) {
        const id = req.params.id;
        SubCategoria.delete(id, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al eliminar subcategoria'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Subcategoria eliminada',
                data
            });
        });
    }
};
