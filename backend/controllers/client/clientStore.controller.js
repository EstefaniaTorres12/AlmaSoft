const db = require("../../config/config");

// ─── TIENDA: Productos activos ────────────────────────────────────────────────
exports.getProductos = (req, res) => {
  const sql = `
    SELECT p.producto_id, p.producto_nombre, p.producto_descripcion,
           p.producto_precio, p.producto_stock,
           sc.subcategoria_nombre, c.categoria_nombre
    FROM PRODUCTO p
    LEFT JOIN SUBCATEGORIA sc ON sc.subcategoria_id = p.subcategoria_id
    LEFT JOIN CATEGORIA    c  ON c.categoria_id     = sc.categoria_id
    WHERE p.producto_estado = 1
      AND p.producto_id IN (
        SELECT MIN(p2.producto_id)
        FROM PRODUCTO p2
        LEFT JOIN SUBCATEGORIA sc2 ON sc2.subcategoria_id = p2.subcategoria_id
        WHERE p2.producto_estado = 1
        GROUP BY sc2.categoria_id
      )
    ORDER BY c.categoria_nombre ASC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message || err });
    res.json({ success: true, data: rows });
  });
};

// ─── CARRITO: Obtener ─────────────────────────────────────────────────────────
exports.getCarrito = (req, res) => {
  const usuario_id = req.user.usuario_id || req.user.id;
  const sql = `
    SELECT ca.carrito_id, ca.producto_id, ca.cantidad,
           p.producto_nombre, p.producto_precio, p.producto_imagen
    FROM CARRITO ca
    INNER JOIN PRODUCTO p ON p.producto_id = ca.producto_id
    WHERE ca.usuario_id = ?
  `;
  db.query(sql, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, data: rows });
  });
};

// ─── CARRITO: Agregar ─────────────────────────────────────────────────────────
exports.addCarrito = (req, res) => {
  const usuario_id = req.user.usuario_id || req.user.id;
  const { producto_id, cantidad = 1 } = req.body;

  if (!producto_id) {
    return res.status(400).json({ success: false, message: "Falta producto_id" });
  }

  const checkSql = `SELECT carrito_id, cantidad FROM CARRITO WHERE usuario_id = ? AND producto_id = ?`;
  db.query(checkSql, [usuario_id, producto_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });

    if (rows.length > 0) {
      db.query(
        `UPDATE CARRITO SET cantidad = cantidad + ? WHERE carrito_id = ?`,
        [cantidad, rows[0].carrito_id],
        (err2) => {
          if (err2) return res.status(500).json({ success: false, error: err2 });
          res.json({ success: true, message: "Cantidad actualizada" });
        }
      );
    } else {
      db.query(
        `INSERT INTO CARRITO (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)`,
        [usuario_id, producto_id, cantidad],
        (err2) => {
          if (err2) return res.status(500).json({ success: false, error: err2 });
          res.json({ success: true, message: "Producto agregado al carrito" });
        }
      );
    }
  });
};

// ─── CARRITO: Eliminar ────────────────────────────────────────────────────────
exports.removeCarrito = (req, res) => {
  const usuario_id = req.user.usuario_id || req.user.id;
  const { id } = req.params;

  db.query(
    `DELETE FROM CARRITO WHERE carrito_id = ? AND usuario_id = ?`,
    [id, usuario_id],
    (err) => {
      if (err) return res.status(500).json({ success: false, error: err });
      res.json({ success: true, message: "Producto eliminado del carrito" });
    }
  );
};

// ─── CARRITO: Pagar ───────────────────────────────────────────────────────────
exports.checkoutCarrito = (req, res) => {
  const usuario_id = req.user.usuario_id || req.user.id;
  const { metodo_pago } = req.body;

  if (!metodo_pago) {
    return res.status(400).json({ success: false, message: "Falta metodo_pago" });
  }

  db.query(
    `SELECT contrato_id FROM CONTRATO WHERE cliente_id = ? AND contrato_estado = 1 ORDER BY contrato_id DESC LIMIT 1`,
    [usuario_id],
    (err, contratos) => {
      if (err) return res.status(500).json({ success: false, error: err });
      if (contratos.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Necesitas un plan activo para realizar compras.",
        });
      }

      const contrato_id = contratos[0].contrato_id;

      db.query(
        `SELECT ca.carrito_id, ca.cantidad, p.producto_precio, p.producto_nombre
         FROM CARRITO ca
         INNER JOIN PRODUCTO p ON p.producto_id = ca.producto_id
         WHERE ca.usuario_id = ?`,
        [usuario_id],
        (err2, items) => {
          if (err2) return res.status(500).json({ success: false, error: err2 });
          if (items.length === 0) {
            return res.status(400).json({ success: false, message: "El carrito esta vacio." });
          }

          const total = items.reduce((sum, it) => sum + it.producto_precio * it.cantidad, 0);
          const resumen = items.map((it) => `${it.producto_nombre} x${it.cantidad}`).join(", ");
          const pago_metodo = `Tienda | ${metodo_pago} | ${resumen} | Total: $${total.toLocaleString("es-CO")}`;
          const fecha = new Date().toISOString().slice(0, 10);

          db.query(
            `INSERT INTO PAGO (pago_metodo, pago_fecha, contrato_id) VALUES (?, ?, ?)`,
            [pago_metodo, fecha, contrato_id],
            (err3) => {
              if (err3) return res.status(500).json({ success: false, error: err3 });

              db.query(`DELETE FROM CARRITO WHERE usuario_id = ?`, [usuario_id], (err4) => {
                if (err4) return res.status(500).json({ success: false, error: err4 });
                res.json({ success: true, message: "Compra registrada correctamente.", total });
              });
            }
          );
        }
      );
    }
  );
};

// ─── SERVICIOS: Listar ────────────────────────────────────────────────────────
exports.getServicios = (req, res) => {
  db.query(
    `SELECT servicio_id, servicio_nombre, servicio_descripcion, servicio_precio FROM SERVICIO ORDER BY servicio_nombre`,
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: err });
      res.json({ success: true, data: rows });
    }
  );
};

// ─── SERVICIOS: Solicitar ─────────────────────────────────────────────────────
exports.solicitarServicio = (req, res) => {
  const usuario_id = req.user.usuario_id || req.user.id;
  const { servicio_id, metodo_pago } = req.body;

  if (!servicio_id || !metodo_pago) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
  }

  db.query(
    `SELECT contrato_id FROM CONTRATO WHERE cliente_id = ? AND contrato_estado = 1 ORDER BY contrato_id DESC LIMIT 1`,
    [usuario_id],
    (err, contratos) => {
      if (err) return res.status(500).json({ success: false, error: err });
      if (contratos.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Necesitas un plan activo para solicitar servicios.",
        });
      }

      const contrato_id = contratos[0].contrato_id;

      db.query(
        `SELECT servicio_nombre, servicio_precio FROM SERVICIO WHERE servicio_id = ?`,
        [servicio_id],
        (err2, servicios) => {
          if (err2) return res.status(500).json({ success: false, error: err2 });
          if (servicios.length === 0) {
            return res.status(404).json({ success: false, message: "Servicio no encontrado." });
          }

          const s = servicios[0];
          const pago_metodo = `Servicio | ${s.servicio_nombre} | ${metodo_pago} | $${Number(s.servicio_precio).toLocaleString("es-CO")}`;
          const fecha = new Date().toISOString().slice(0, 10);

          db.query(
            `INSERT INTO PAGO (pago_metodo, pago_fecha, contrato_id) VALUES (?, ?, ?)`,
            [pago_metodo, fecha, contrato_id],
            (err3) => {
              if (err3) return res.status(500).json({ success: false, error: err3 });
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
  const usuario_id = req.user.usuario_id || req.user.id;
  const sql = `
    SELECT
      p.pago_id,
      p.pago_metodo,
      p.pago_fecha,
      c.contrato_id,
      c.contrato_valor,
      pf.plan_nombre
    FROM PAGO p
    INNER JOIN CONTRATO      c  ON c.contrato_id  = p.contrato_id
    LEFT  JOIN CONTRATO_PLAN cp ON cp.contrato_id = c.contrato_id
    LEFT  JOIN PLAN_FUNEBRE  pf ON pf.plan_id     = cp.plan_id
    WHERE c.cliente_id = ?
    ORDER BY p.pago_fecha DESC, p.pago_id DESC
  `;
  db.query(sql, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, data: rows });
  });
};
