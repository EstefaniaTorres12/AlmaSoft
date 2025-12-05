const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {

    async register(req, res) {
        const usuario = req.body;

        // normalizar correo a minúsculas
        usuario.usuario_correo = usuario.usuario_correo.toLowerCase();

        Usuario.create(usuario, (err, data) => {
            if (err) return res.status(501).json({ success: false, message: 'Error al crear usuario', error: err });
            return res.status(201).json({ success: true, message: 'Usuario creado correctamente', data });
        });
    },

    async login(req, res) {
        const email = req.body.usuario_correo.toLowerCase();
        const password = req.body.usuario_credencial;

        Usuario.findByEmailWithRole(email, async (err, user) => {
            if (err) return res.status(501).json({ success: false, message: 'Error al consultar usuario', error: err });
            if (!user) return res.status(401).json({ success: false, message: 'El correo no existe' });

            const isPasswordValid = await bcrypt.compare(password, user.usuario_credencial);
            if (!isPasswordValid) return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });

            // generar JWT
            const token = jwt.sign(
                { id: user.usuario_id, email: user.usuario_correo, role: user.rol_nombre },
                keys.secretOrKey,
                { expiresIn: '1h' }
            );

            const data = {
                id: user.usuario_id,
                nombre: user.usuario_primer_nombre,
                correo: user.usuario_correo,
                role: user.rol_nombre,
                session_token: `Bearer ${token}` // JWT listo para usar
            };

            return res.status(200).json({ success: true, message: 'Usuario autenticado', data });
        });
    },

    getUsuarioAll(req, res){
        Usuario.findAll((err, usuario) =>{
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Error al consultar',
                    error: err
                });
            }
            return res.status(200).json({
                success: true,
                message: 'lista de usuarios',
                data: usuario
            });
        });
    },

    getUsuarioById(req, res) {
        const id = req.params.id;
        Usuario.findById(id, (err, user) => {
            if (err) return res.status(501).json({ success: false, message: 'Error al consultar el usuario', error: err });
            if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            return res.status(200).json({ success: true, message: 'Usuario encontrado', data: user });
        });
    },

    getUsuarioByDocument(req, res) {
        const documento = req.params.documento;
        Usuario.findByDocument(documento, (err, doc) => {
            if (err) return res.status(501).json({ success: false, message: 'Error al consultar usuario', error: err });
            if (!doc) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            return res.status(200).json({ success: true, message: 'Usuario encontrado', data: doc });
        });
    },

    getUsuarioUpdate(req, res) {
        const usuario = req.body;
        Usuario.update(usuario, (err, data) => {
            if (err) return res.status(501).json({ success: false, message: 'Error al actualizar usuario', error: err });
            return res.status(200).json({ success: true, message: 'Usuario actualizado', data });
        });
    },

    getUsuarioDelete(req, res) {
        const id = req.params.id;
        Usuario.delete(id, (err, data) => {
            if (err) return res.status(501).json({ success: false, message: 'Error al eliminar usuario', error: err });
            return res.status(200).json({ success: true, message: 'Usuario eliminado', data });
        });
    }

};