// backend/models/cliente.js
const db = require("../config/config");

const Cliente = {
  // Crear cliente (usa el usuario_id como cliente_id)
  async createCliente(data) {
    const [result] = await db.query(
      "INSERT INTO CLIENTE (cliente_id, cliente_fecha_nacimiento, cliente_edad) VALUES (?, ?, ?)",
      [data.cliente_id, data.cliente_fecha_nacimiento, data.cliente_edad]
    );
    return result.insertId;
  },

  // Obtener todos los clientes con su info básica de usuario
  async findAll() {
    const [rows] = await db.query(`
      SELECT c.cliente_id, u.usuario_primer_nombre, u.usuario_primer_apellido, 
             c.cliente_fecha_nacimiento, c.cliente_edad
      FROM CLIENTE c
      INNER JOIN USUARIO u ON c.cliente_id = u.usuario_id
    `);
    return rows;
  },

  // Obtener cliente por id
  async findById(id) {
    const [rows] = await db.query(
      `
      SELECT c.cliente_id, u.usuario_primer_nombre, u.usuario_primer_apellido, 
             c.cliente_fecha_nacimiento, c.cliente_edad
      FROM CLIENTE c
      INNER JOIN USUARIO u ON c.cliente_id = u.usuario_id
      WHERE c.cliente_id = ?
      `,
      [id]
    );
    return rows[0];
  },

  // Actualizar datos del cliente
  async updateCliente(id, data) {
    const [result] = await db.query(
      "UPDATE CLIENTE SET cliente_fecha_nacimiento = ?, cliente_edad = ? WHERE cliente_id = ?",
      [data.cliente_fecha_nacimiento, data.cliente_edad, id]
    );
    return result.affectedRows > 0;
  },

  // Eliminar cliente
  async deleteCliente(id) {
    const [result] = await db.query(
      "DELETE FROM CLIENTE WHERE cliente_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Cliente;
