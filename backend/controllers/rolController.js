const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {
    register(req, res) {
        const rol = req.body;

        Rol.create(rol, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al crear rol',
                    error: err
                });
            } else {
                return res.status(201).json({
                    success: true,
                    message: 'Rol creado Correctamente',
                    data: data
                });
            }
        });

    },

    getAllRoles(req, res) {
        Rol.findAll((err, rol) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al listar Usuarios',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Lista de roles: ',
                data: rol
            });
        });
    },

    getRolById(req, res) {
        const id = req.params.id;
        Rol.findById(id, (err, rol) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consutar el Rol',
                    error: err
                });
            }
            if (!rol) {
                return res.status(404).json({
                    success: false,
                    message: 'Rol no encontrado'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Rol encontrado',
                data: rol
            });
        });
    },

    getRolDelete(req, res) {
        const id = req.params.id;
        Rol.delete(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al eliminar el rol',
                    error: err
                });
            } return res.status(200).json({
                success: true,
                message: 'Rol eliminado correctamente',
                data: data
            });
        });
    }

};