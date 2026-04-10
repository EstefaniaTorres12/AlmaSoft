const Cliente = require('../models/cliente');

module.exports = {

    //  Obtener todos
    getClienteAll(req, res) {
        Cliente.findAll((err, cliente) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al consultar clientes',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Lista de clientes',
                data: cliente
            });
        });
    },

    //  Obtener por ID
    getClienteById(req, res) {
        const id = req.params.id;

        Cliente.findById(id, (err, cliente) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener cliente',
                    error: err
                });
            }

            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }

            return res.status(200).json({
                success: true,
                data: cliente
            });
        });
    },

    //  Crear cliente
    createCliente(req, res) {
        const cliente = req.body;

        // Validación básica
        if (!cliente.documento || !cliente.primer_nombre || !cliente.primer_apellido || !cliente.credencial) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos obligatorios'
            });
        }

        Cliente.create(cliente, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message || 'Error al crear cliente',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Cliente creado correctamente',
                data: data
            });
        });
    },

    // Actualizar cliente
    updateCliente(req, res) {
        const id = req.params.id;
        const cliente = req.body;

        Cliente.update(id, cliente, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al actualizar cliente',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cliente actualizado correctamente',
                data: data
            });
        });
    },

    //  Eliminar cliente
    deleteCliente(req, res) {
        const id = req.params.id;

        Cliente.delete(id, (err, data) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al eliminar cliente',
                    error: err
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cliente eliminado correctamente'
            });
        });
    }

};