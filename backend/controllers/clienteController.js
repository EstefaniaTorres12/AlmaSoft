const Cliente = require('../models/cliente');

module.exports = {
 getClienteAll(req, res) {
    Cliente.findAll((err, cliente) =>{
        if (err) {
            return res.status(501).json({
                success: false,
                message: 'Error al consultar',
                error: err
            });
        }
        return res.status(200).json({
            success: true,
            message: 'lista de clientes',
            data: cliente
        });
    });
 },

}