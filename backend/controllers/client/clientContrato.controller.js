const db = require("../../config/config");

// ── Helpers de transacción ────────────────────────────────────────────────────

function getConnection() {
  return new Promise((resolve, reject) => {
    db.getConnection((err, conn) => (err ? reject(err) : resolve(conn)));
  });
}

function queryConn(conn, sql, params = []) {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, result) => (err ? reject(err) : resolve(result)));
  });
}

function beginTx(conn) {
  return new Promise((resolve, reject) => {
    conn.beginTransaction((err) => (err ? reject(err) : resolve()));
  });
}

function commitTx(conn) {
  return new Promise((resolve, reject) => {
    conn.commit((err) => (err ? reject(err) : resolve()));
  });
}

function rollbackTx(conn) {
  return new Promise((resolve) => conn.rollback(() => resolve()));
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

exports.obtenerMiPlan = (req, res) => {
  const usuario_id = req.user.usuario_id;

  const sqlContrato = `
    SELECT
      c.contrato_id,
      c.contrato_estado,
      c.contrato_valor,
      cp.plan_id,
      p.plan_nombre,
      p.plan_descripcion,
      p.plan_precio,
      u.usuario_primer_nombre,
      u.usuario_segundo_nombre,
      u.usuario_primer_apellido,
      u.usuario_segundo_apellido,
      u.usuario_documento,
      u.usuario_correo,
      u.usuario_direccion
    FROM contrato c
    INNER JOIN contrato_plan cp ON cp.contrato_id = c.contrato_id
    INNER JOIN plan_funebre p ON p.plan_id = cp.plan_id
    INNER JOIN usuario u ON u.usuario_id = c.cliente_id
    WHERE c.cliente_id = ? AND c.contrato_estado = 1
    ORDER BY c.contrato_id DESC
    LIMIT 1
  `;

  db.query(sqlContrato, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al consultar el plan" });
    if (rows.length === 0) return res.status(404).json({ success: false, message: "El cliente no tiene un plan adquirido" });

    const contrato = rows[0];

    const sqlServicios = `
      SELECT s.servicio_id, s.servicio_nombre
      FROM servicio_plan sp
      INNER JOIN servicio s ON s.servicio_id = sp.servicio_id
      WHERE sp.plan_id = ?
      ORDER BY s.servicio_nombre
    `;

    db.query(sqlServicios, [contrato.plan_id], (err2, servicios) => {
      if (err2) return res.status(500).json({ success: false, message: "Error al consultar servicios del plan" });

      const sqlPagos = `
        SELECT pago_id, pago_metodo, pago_fecha
        FROM pago
        WHERE contrato_id = ?
        ORDER BY pago_fecha DESC, pago_id DESC
      `;

      db.query(sqlPagos, [contrato.contrato_id], (err3, pagos) => {
        if (err3) return res.status(500).json({ success: false, message: "Error al consultar pagos" });

        return res.json({
          success: true,
          data: {
            contrato_id: contrato.contrato_id,
            contrato_estado: contrato.contrato_estado,
            contrato_valor: contrato.contrato_valor,
            plan_id: contrato.plan_id,
            plan_nombre: contrato.plan_nombre,
            plan_descripcion: contrato.plan_descripcion,
            plan_precio: contrato.plan_precio,
            usuario_primer_nombre: contrato.usuario_primer_nombre,
            usuario_segundo_nombre: contrato.usuario_segundo_nombre,
            usuario_primer_apellido: contrato.usuario_primer_apellido,
            usuario_segundo_apellido: contrato.usuario_segundo_apellido,
            usuario_documento: contrato.usuario_documento,
            usuario_correo: contrato.usuario_correo,
            usuario_direccion: contrato.usuario_direccion,
            servicios: servicios || [],
            pagos: pagos || []
          }
        });
      });
    });
  });
};

exports.obtenerPlanesDisponibles = (req, res) => {
  const sql = `SELECT plan_id, plan_nombre, plan_precio, plan_descripcion FROM plan_funebre WHERE plan_estado = 1 ORDER BY plan_precio ASC`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al consultar planes" });
    res.json({ success: true, data: rows || [] });
  });
};

exports.mejorarPlan = async (req, res) => {
  const usuario_id = req.user.usuario_id;
  const { plan_id, metodo_pago } = req.body;

  if (!plan_id)     return res.status(400).json({ success: false, message: "Falta el plan_id" });
  if (!metodo_pago) return res.status(400).json({ success: false, message: "Falta el metodo de pago" });

  let conn;
  try {
    conn = await getConnection();

    const contratoRows = await queryConn(conn, `
      SELECT c.contrato_id, c.contrato_valor, cp.plan_id AS plan_actual_id
      FROM contrato c
      INNER JOIN contrato_plan cp ON cp.contrato_id = c.contrato_id
      WHERE c.cliente_id = ? AND c.contrato_estado = 1
      ORDER BY c.contrato_id DESC LIMIT 1
    `, [usuario_id]);

    if (contratoRows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: "No tienes un contrato activo" });
    }

    const { contrato_id, contrato_valor, plan_actual_id } = contratoRows[0];

    if (Number(plan_id) === Number(plan_actual_id)) {
      conn.release();
      return res.status(400).json({ success: false, message: "Ya tienes este plan activo" });
    }

    const planRows = await queryConn(conn,
      `SELECT plan_precio FROM plan_funebre WHERE plan_id = ? AND plan_estado = 1`,
      [plan_id]
    );

    if (planRows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: "Plan no encontrado o inactivo" });
    }

    const nuevo_precio = planRows[0].plan_precio;

    if (nuevo_precio <= contrato_valor) {
      conn.release();
      return res.status(400).json({ success: false, message: "Solo puedes cambiar a un plan de mayor valor que el actual" });
    }

    await beginTx(conn);

    await queryConn(conn,
      `INSERT INTO pago (pago_metodo, pago_fecha, contrato_id) VALUES (?, NOW(), ?)`,
      [metodo_pago, contrato_id]
    );

    await queryConn(conn,
      `UPDATE contrato_plan SET plan_id = ? WHERE contrato_id = ?`,
      [plan_id, contrato_id]
    );

    await queryConn(conn,
      `UPDATE contrato SET contrato_valor = ? WHERE contrato_id = ?`,
      [nuevo_precio, contrato_id]
    );

    await commitTx(conn);
    conn.release();

    return res.json({ success: true, message: "Plan mejorado correctamente. El pago ha sido registrado." });

  } catch (error) {
    if (conn) {
      await rollbackTx(conn);
      conn.release();
    }
    console.error("Error en mejorarPlan:", error);
    return res.status(500).json({ success: false, message: "Error al mejorar el plan" });
  }
};

exports.cancelarPlan = (req, res) => {
  const usuario_id = req.user.usuario_id;

  const sqlContrato = `SELECT contrato_id FROM contrato WHERE cliente_id = ? AND contrato_estado = 1 ORDER BY contrato_id DESC LIMIT 1`;
  db.query(sqlContrato, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al consultar contrato" });
    if (rows.length === 0) return res.status(404).json({ success: false, message: "No tienes un contrato activo" });

    const contrato_id = rows[0].contrato_id;

    const sqlPagos = `SELECT COUNT(*) as total FROM pago WHERE contrato_id = ?`;
    db.query(sqlPagos, [contrato_id], (err2, countRows) => {
      if (err2) return res.status(500).json({ success: false, message: "Error al verificar pagos" });

      if (countRows[0].total === 0) {
        return res.status(400).json({ success: false, message: "Tienes un saldo pendiente. No puedes cancelar el plan hasta estar a paz y salvo." });
      }

      const sqlCancel = `UPDATE contrato SET contrato_estado = 0 WHERE contrato_id = ?`;
      db.query(sqlCancel, [contrato_id], (err3) => {
        if (err3) return res.status(500).json({ success: false, message: "Error al cancelar el contrato" });
        res.json({ success: true, message: "Plan cancelado. Quedas a paz y salvo con AlmaSoft." });
      });
    });
  });
};

exports.adquirirPlan = async (req, res) => {
  const { cliente_id, plan_id, metodo_pago } = req.body;
  const usuario_id = req.user.usuario_id;

  if (!cliente_id || !plan_id || !metodo_pago) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  if (Number(cliente_id) !== Number(usuario_id)) {
    return res.status(403).json({ success: false, message: "No tienes permiso para adquirir planes para este cliente" });
  }

  let conn;
  try {
    conn = await getConnection();

    const clienteRows = await queryConn(conn,
      `SELECT cliente_id FROM cliente WHERE cliente_id = ?`,
      [usuario_id]
    );

    if (clienteRows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: "Tu cuenta no tiene un perfil de cliente registrado. Por favor contacta soporte o vuelve a registrarte." });
    }

    const contratoActivoRows = await queryConn(conn,
      `SELECT contrato_id FROM contrato WHERE cliente_id = ? AND contrato_estado = 1 LIMIT 1`,
      [usuario_id]
    );

    if (contratoActivoRows.length > 0) {
      conn.release();
      return res.status(400).json({ success: false, message: "Ya tienes un plan activo. Usa 'Mejorar plan' desde Tu Plan si deseas cambiarlo." });
    }

    const planRows = await queryConn(conn,
      `SELECT plan_precio FROM plan_funebre WHERE plan_id = ?`,
      [plan_id]
    );

    if (planRows.length === 0) {
      conn.release();
      return res.status(404).json({ success: false, message: "Plan no encontrado" });
    }

    const valor = planRows[0].plan_precio;

    await beginTx(conn);

    const contratoResult = await queryConn(conn,
      `INSERT INTO contrato (contrato_estado, contrato_valor, cliente_id) VALUES (1, ?, ?)`,
      [valor, cliente_id]
    );

    const contrato_id = contratoResult.insertId;

    await queryConn(conn,
      `INSERT INTO pago (pago_metodo, pago_fecha, contrato_id) VALUES (?, NOW(), ?)`,
      [metodo_pago, contrato_id]
    );

    await queryConn(conn,
      `INSERT INTO contrato_plan (contrato_id, plan_id) VALUES (?, ?)`,
      [contrato_id, plan_id]
    );

    await commitTx(conn);
    conn.release();

    return res.json({ success: true, message: "Plan adquirido correctamente", contrato_id, plan_id });

  } catch (error) {
    if (conn) {
      await rollbackTx(conn);
      conn.release();
    }
    console.error("Error en adquirirPlan:", error);
    return res.status(500).json({ success: false, message: "Error al adquirir el plan" });
  }
};
