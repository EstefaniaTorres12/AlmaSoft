const Usuario = require('../models/usuario.js');
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
    try {

        console.log("BODY LOGIN:", req.body);

        if (!req.body || !req.body.usuario_correo || !req.body.usuario_credencial) {
            return res.status(400).json({
                success: false,
                message: "Correo y contraseña son obligatorios"
            });
        }

        const email = req.body.usuario_correo.toLowerCase();
        const password = req.body.usuario_credencial;

        Usuario.findByEmailWithRole(email, async (err, user) => {

            if (err) {
                console.log("ERROR LOGIN DB:", err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al consultar usuario'
                });
            }

            console.log("USER ENCONTRADO:", user);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'El correo no existe'
                });
            }

            if (!user.usuario_credencial) {
                return res.status(500).json({
                    success: false,
                    message: "Usuario sin contraseña"
                });
            }

            let isPasswordValid = false;

            if (user.usuario_credencial.startsWith("$2b$")) {
                isPasswordValid = await bcrypt.compare(password, user.usuario_credencial);
            } else {
                isPasswordValid = password === user.usuario_credencial;
            }

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Contraseña incorrecta'
                });
            }

            const token = jwt.sign(
                {
                    id: user.usuario_id,
                    email: user.usuario_correo,
                    role: user.rol_nombre
                },
                keys.secretOrKey,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                success: true,
                message: "Login correcto",
                token,
                rol: user.rol_nombre,
                usuario:{
                    usuario_id: user.usuario_id,
                    usuario_correo: user.usuario_correo,
                    usuario_primer_nombre: user.usuario_primer_nombre,
                    usuario_segundo_nombre: user.usuario_segundo_nombre,
                    usuario_primer_apellido: user.usuario_primer_apellido,
                    usuario_segundo_apellido: user.usuario_segundo_apellido,
                }
            });

        });

    } catch (error) {
        console.log("ERROR GENERAL LOGIN:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor"
        });
    }
},

    getUsuarioAll(req, res) {
        Usuario.findAll((err, usuario) => {
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
        const userId = req.user?.usuario_id || req.user?.id;
        const userRole = req.user?.role;

        if (userRole === 'Cliente' && Number(id) !== Number(userId)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para consultar este usuario'
            });
        }

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
    const id = req.params.id;
    const usuario = req.body;
    const userId = req.user?.usuario_id || req.user?.id;
    const userRole = req.user?.role;

    if (userRole === 'Cliente' && Number(id) !== Number(userId)) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permiso para actualizar este usuario'
        });
    }

    Usuario.update(id, usuario, (err, data) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar usuario',
                error: err
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado',
            data
        });
    });
},


    getUsuarioDelete(req, res) {
        const id = req.params.id;
        Usuario.delete(id, (err, data) => {
            if (err) return res.status(501).json({ success: false, message: 'Error al eliminar usuario', error: err });
            return res.status(200).json({ success: true, message: 'Usuario eliminado', data });
        });
    }

}
