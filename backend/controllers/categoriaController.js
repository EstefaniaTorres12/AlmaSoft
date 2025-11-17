const Categoria = require('../models/categoria');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {

    register(req, res) {
        const categoria = req.body;

        Categoria.create(categoria, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear la Categoria',
                    error: err
                });
            } else {
                return res.status(201).json({
                    success: true,
                    message: 'Categoria creada correctamente',
                    data: data
                });
            }
        });
    },


    getAllCategorias(req, res) {
        Categoria.findAll((err, categoria) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al listar Categorias',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'lista de categorias: ',
                data: categoria
            })
        });
    },

    getCategoriaById(req, res) {
        const id = req.params.id;
        Categoria.findById(id, (err, categoria) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consultar categoria',
                    error: err
                });
            }
            if (!categoria) {
                return res.status(404).json({
                    success: false,
                    message: 'Categoria no encontrada'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Categoria encontrada',
                data: categoria
            });
        });
    },

    getCategoriaUpdate(req, res) {
        const categoria = {
            categoria_id: req.params.id,
            categoria_nombre: req.body.categoria_nombre
        };
        Categoria.update(categoria, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al actualizar categoria',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Categoria Actualizada',
                data: data
            });
        });
    },


    getCategoriaDelete(req, res){
        const id = req.params.id;
        Categoria.delete(id, (err,data) => {
            if(err){
                return res.status(501).json({
                    success:false,
                    message: 'Error al eliminar Categoria',
                    error:err
                });
            } return res.status(200).json({
                success: true,
                message: 'Categoria Eliminada',
                data:data
            });
        });
    }
};