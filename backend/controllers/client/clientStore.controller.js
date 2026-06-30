const db = require("../../config/config");

// ─── TIENDA: Productos activos ────────────────────────────────────────────────
exports.getProductos = (req, res) => {
  const sql = `
    SELECT p.producto_id, p.producto_nombre, p.producto_descripcion,
           p.producto_precio, p.producto_stock, p.producto_imagen,
           sc.subcategoria_nombre, c.categoria_nombre
    FROM producto p
    LEFT JOIN subcategoria sc ON sc.subcategoria_id = p.subcategoria_id
    LEFT JOIN categoria    c  ON c.categoria_id     = sc.categoria_id
    WHERE p.producto_estado = 1
    ORDER BY c.categoria_nombre ASC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al consultar productos" });
    res.json({ success: true, data: rows });
  });
};

// ─── CARRITO: Obtener ─────────────────────────────────────────────────────────
exports.getCarrito = (req, res) => {
  const usuario_id = req.user.usuario_id;
  const sql = `
    SELECT ca.carrito_id, ca.producto_id, ca.cantidad,
           p.producto_nombre, p.producto_precio, p.producto_imagen,
           p.producto_stock,
           sc.subcategoria_nombre, c.categoria_nombre
    FROM carrito ca
    INNER JOIN producto     p  ON p.producto_id      = ca.producto_id
    LEFT  JOIN subcategoria sc ON sc.subcategoria_id = p.subcategoria_id
    LEFT  JOIN categoria    c  ON c.categoria_id     = sc.categoria_id
    WHERE ca.usuario_id = ?
  `;
  db.query(sql, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al consultar el carrito" });
    res.json({ success: true, data: rows });
  });
};

// ─── CARRITO: Agregar ─────────────────────────────────────────────────────────
exports.addCarrito = (req, res) => {
  const usuario_id = req.user.usuario_id;
  const { producto_id, cantidad = 1 } = req.body;

  if (!producto_id) {
    return res.status(400).json({ success: false, message: "Falta producto_id" });
  }

  const productSql = `SELECT producto_precio, producto_stock FROM producto WHERE producto_id = ? AND producto_estado = 1`;
  db.query(productSql, [producto_id], (err, productRows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al consultar el producto" });
    if (productRows.length === 0) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    const precio_unitario = productRows[0].producto_precio;
    const stock = productRows[0].producto_stock;
    const requestedQuantity = Number(cantidad) || 1;

    if (requestedQuantity < 1) {
      return res.status(400).json({ success: false, message: "Cantidad inválida" });
    }

    const checkSql = `SELECT carrito_id, cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?`;
    db.query(checkSql, [usuario_id, producto_id], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: "Error al consultar el carrito" });

      if (rows.length > 0) {
        const newQuantity = rows[0].cantidad + requestedQuantity;
        if (newQuantity > stock) {
          return res.status(400).json({ success: false, message: "No hay stock suficiente para ese producto." });
        }
        db.query(
          `UPDATE carrito SET cantidad = ? WHERE carrito_id = ?`,
          [newQuantity, rows[0].carrito_id],
          (err2) => {
            if (err2) return res.status(500).json({ success: false, message: "Error al actualizar el carrito" });
            res.json({ success: true, message: "Cantidad actualizada" });
          }
        );
      } else {
        if (requestedQuantity > stock) {
          return res.status(400).json({ success: false, message: "No hay stock suficiente para ese producto." });
        }
        db.query(
          `INSERT INTO carrito (usuario_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)`,
          [usuario_id, producto_id, requestedQuantity, precio_unitario],
          (err2) => {
            if (err2) return res.status(500).json({ success: false, message: "Error al agregar al carrito" });
            res.json({ success: true, message: "Producto agregado al carrito" });
          }
        );
      }
    });
  });
};

// ─── CARRITO: Eliminar ────────────────────────────────────────────────────────
exports.removeCarrito = (req, res) => {
  const usuario_id = req.user.usuario_id;
  const { id } = req.params;

  db.query(
    `DELETE FROM carrito WHERE carrito_id = ? AND usuario_id = ?`,
    [id, usuario_id],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: "Error al eliminar del carrito" });
      res.json({ success: true, message: "Producto eliminado del carrito" });
    }
  );
};

// ─── CARRITO: Pagar ───────────────────────────────────────────────────────────
exports.checkoutCarrito = (req, res) => {
  const usuario_id = req.user.usuario_id;
  const { metodo_pago } = req.body;

  if (!metodo_pago) {
    return res.status(400).json({ success: false, message: "Falta metodo_pago" });
  }

  db.query(
    `SELECT contrato_id FROM contrato WHERE cliente_id = ? AND contrato_estado = 1 ORDER BY contrato_id DESC LIMIT 1`,
    [usuario_id],
    (err, contratos) => {
      if (err) return res.status(500).json({ success: false, message: "Error al consultar contrato" });
      if (contratos.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Necesitas un plan activo para realizar compras.",
        });
      }

      const contrato_id = contratos[0].contrato_id;

      db.query(
        `SELECT ca.carrito_id, ca.producto_id, ca.cantidad, p.producto_precio, p.producto_nombre, p.producto_stock
         FROM carrito ca
         INNER JOIN producto p ON p.producto_id = ca.producto_id
         WHERE ca.usuario_id = ?`,
        [usuario_id],
        (err2, items) => {
          if (err2) return res.status(500).json({ success: false, message: "Error al consultar el carrito" });
          if (items.length === 0) {
            return res.status(400).json({ success: false, message: "El carrito esta vacio." });
          }

          // Verificar stock disponible antes de intentar el pago
          for (const it of items) {
            if (it.producto_stock < it.cantidad) {
              return res.status(400).json({ success: false, message: `No hay stock suficiente para ${it.producto_nombre}` });
            }
          }

          const total = items.reduce((sum, it) => sum + it.producto_precio * it.cantidad, 0);
          const resumen = items.map((it) => `${it.producto_nombre} x${it.cantidad}`).join(", ");
          const pago_metodo = `Tienda | ${metodo_pago} | ${resumen} | Total: $${total.toLocaleString("es-CO")}`;
          const fecha = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

          // Usar una conexión para manejar transacción
          db.getConnection((errConn, connection) => {
            if (errConn) return res.status(500).json({ success: false, message: "Error al obtener conexión" });

            connection.beginTransaction((errTr) => {
              if (errTr) {
                connection.release();
                return res.status(500).json({ success: false, message: "Error al iniciar transacción" });
              }

              // Reducir stock para cada producto
              const updateNext = (index) => {
                if (index >= items.length) {
                  // Insertar pago
                  connection.query(
                    `INSERT INTO pago (pago_metodo, pago_fecha, contrato_id) VALUES (?, ?, ?)`,
                    [pago_metodo, fecha, contrato_id],
                    (errIns) => {
                      if (errIns) {
                        return connection.rollback(() => {
                          connection.release();
                          res.status(500).json({ success: false, message: "Error al registrar el pago" });
                        });
                      }

                      // Limpiar carrito
                      connection.query(`DELETE FROM carrito WHERE usuario_id = ?`, [usuario_id], (errDel) => {
                        if (errDel) {
                          return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ success: false, message: "Error al limpiar el carrito" });
                          });
                        }

                        connection.commit((errCommit) => {
                          if (errCommit) {
                            return connection.rollback(() => {
                              connection.release();
                              res.status(500).json({ success: false, message: "Error al confirmar la transacción" });
                            });
                          }
                          connection.release();
                          res.json({ success: true, message: "Compra registrada correctamente.", total });
                        });
                      });
                    }
                  );
                  return;
                }

                const it = items[index];
                connection.query(
                  `UPDATE producto SET producto_stock = producto_stock - ? WHERE producto_id = ? AND producto_stock >= ?`,
                  [it.cantidad, it.producto_id, it.cantidad],
                  (errUp, resUp) => {
                    if (errUp) {
                      return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ success: false, message: "Error al actualizar stock" });
                      });
                    }

                    if (resUp.affectedRows === 0) {
                      return connection.rollback(() => {
                        connection.release();
                        res.status(400).json({ success: false, message: `Stock insuficiente para ${it.producto_nombre}` });
                      });
                    }

                    // siguiente producto
                    updateNext(index + 1);
                  }
                );
              };

              updateNext(0);
            });
          });
        }
      );
    }
  );
};

// ─── SERVICIOS: Listar ────────────────────────────────────────────────────────
exports.getServicios = (req, res) => {
  db.query(
    `SELECT servicio_id, servicio_nombre, servicio_descripcion, servicio_precio FROM servicio ORDER BY servicio_nombre`,
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: "Error al consultar servicios" });
      res.json({ success: true, data: rows });
    }
  );
};

// ─── SERVICIOS: Solicitar ─────────────────────────────────────────────────────
exports.solicitarServicio = (req, res) => {
  const usuario_id = req.user.usuario_id;
  const { servicio_id, metodo_pago } = req.body;

  if (!servicio_id || !metodo_pago) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
  }

  db.query(
    `SELECT contrato_id FROM contrato WHERE cliente_id = ? AND contrato_estado = 1 ORDER BY contrato_id DESC LIMIT 1`,
    [usuario_id],
    (err, contratos) => {
      if (err) return res.status(500).json({ success: false, message: "Error al consultar contrato" });
      if (contratos.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Necesitas un plan activo para solicitar servicios.",
        });
      }

      const contrato_id = contratos[0].contrato_id;

      db.query(
        `SELECT servicio_nombre, servicio_precio FROM servicio WHERE servicio_id = ?`,
        [servicio_id],
        (err2, servicios) => {
          if (err2) return res.status(500).json({ success: false, message: "Error al consultar el servicio" });
          if (servicios.length === 0) {
            return res.status(404).json({ success: false, message: "Servicio no encontrado." });
          }

          const s = servicios[0];
          const pago_metodo = `Servicio | ${s.servicio_nombre} | ${metodo_pago} | $${Number(s.servicio_precio).toLocaleString("es-CO")}`;
          const fecha = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

          db.query(
            `INSERT INTO pago (pago_metodo, pago_fecha, contrato_id) VALUES (?, ?, ?)`,
            [pago_metodo, fecha, contrato_id],
            (err3) => {
              if (err3) return res.status(500).json({ success: false, message: "Error al registrar la solicitud" });
              res.status(201).json({ success: true, message: "Servicio solicitado correctamente." });
            }
          );
        }
      );
    }
  );
};

// ─── PAGOS: Historial completo (plan + tienda + servicios) ────────────────────
exports.getHistorialPagos = (req, res) => {
  const usuario_id = req.user.usuario_id;
  // Subconsulta escalar para plan_nombre evita filas duplicadas si contrato_plan
  // tuviera más de un registro por contrato_id (p. ej. por doble submit).
  const sql = `
    SELECT
      p.pago_id,
      p.pago_metodo,
      p.pago_fecha,
      c.contrato_id,
      c.contrato_valor,
      (SELECT pf.plan_nombre
       FROM   contrato_plan cp
       JOIN   plan_funebre  pf ON pf.plan_id = cp.plan_id
       WHERE  cp.contrato_id = c.contrato_id
       LIMIT  1) AS plan_nombre
    FROM pago p
    INNER JOIN contrato c ON c.contrato_id = p.contrato_id
    WHERE c.cliente_id = ?
    ORDER BY p.pago_fecha DESC, p.pago_id DESC
  `;
  db.query(sql, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al consultar historial de pagos" });
    res.json({ success: true, data: rows });
  });
};
