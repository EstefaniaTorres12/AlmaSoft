<<<<<<< HEAD
// backend/controllers/clienteController.js
=======
>>>>>>> main
const Cliente = require('../models/cliente');

module.exports = {

<<<<<<< HEAD
  // Crear cliente - SOLO Admin y Asesor
  async create(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador") && !roles.includes("Asesor")) {
        return res.status(403).json({ message: "No tienes permiso para crear clientes" });
      }

      const { cliente_id, cliente_fecha_nacimiento, cliente_edad } = req.body;

      if (!cliente_id || !cliente_fecha_nacimiento || !cliente_edad) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
      }

      const id = await Cliente.createCliente({
        cliente_id,
        cliente_fecha_nacimiento,
        cliente_edad,
      });

      return res.status(201).json({ message: 'Cliente creado correctamente', id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error del servidor' });
    }
  },

  // Obtener todos los clientes - SOLO Admin y Asesor
  async getAll(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador") && !roles.includes("Asesor")) {
        return res.status(403).json({ message: "No tienes permiso para ver clientes" });
      }

      const rows = await Cliente.findAll();
      return res.json(rows);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Obtener cliente por ID - SOLO Admin y Asesor
  async getById(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador") && !roles.includes("Asesor")) {
        return res.status(403).json({ message: "No tienes permiso para ver clientes" });
      }

      const { id } = req.params;
      const cliente = await Cliente.findById(id);
      if (!cliente)
        return res.status(404).json({ message: 'Cliente no encontrado' });

      return res.json(cliente);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Actualizar cliente - SOLO Admin y Asesor
  async update(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador") && !roles.includes("Asesor")) {
        return res.status(403).json({ message: "No tienes permiso para actualizar clientes" });
      }

      const { id } = req.params;
      const { cliente_fecha_nacimiento, cliente_edad } = req.body;

      const updated = await Cliente.updateCliente(id, {
        cliente_fecha_nacimiento,
        cliente_edad,
      });

      if (!updated)
        return res.status(404).json({ message: 'Cliente no encontrado o sin cambios' });

      return res.json({ message: 'Cliente actualizado correctamente' });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },

  // Eliminar cliente - SOLO Admin
  async remove(req, res) {
    try {
      const roles = req.user.roles;
      if (!roles.includes("Administrador")) {
        return res.status(403).json({ message: "Solo un administrador puede eliminar clientes" });
      }

      const { id } = req.params;
      const deleted = await Cliente.deleteCliente(id);

      if (!deleted)
        return res.status(404).json({ message: "Cliente no encontrado" });

      return res.json({ message: "Cliente eliminado correctamente" });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error del servidor" });
    }
  },
};

=======
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
>>>>>>> main
