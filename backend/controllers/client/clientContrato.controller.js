const db = require("../../config/config");

exports.obtenerMiPlan = (req, res) => {
  const usuario_id = req.user.usuario_id || req.user.id;

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
    FROM CONTRATO c
    INNER JOIN CONTRATO_PLAN cp ON cp.contrato_id = c.contrato_id
    INNER JOIN PLAN_FUNEBRE p ON p.plan_id = cp.plan_id
    INNER JOIN USUARIO u ON u.usuario_id = c.cliente_id
    WHERE c.cliente_id = ? AND c.contrato_estado = 1
    ORDER BY c.contrato_id DESC
    LIMIT 1
  `;

  db.query(sqlContrato, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Error al consultar el plan", error: err });
    if (rows.length === 0) return res.status(404).json({ success: false, message: "El cliente no tiene un plan adquirido" });

    const contrato = rows[0];

    const sqlServicios = `
      SELECT s.servicio_id, s.servicio_nombre
      FROM SERVICIO_PLAN sp
      INNER JOIN SERVICIO s ON s.servicio_id = sp.servicio_id
      WHERE sp.plan_id = ?
      ORDER BY s.servicio_nombre
    `;

    db.query(sqlServicios, [contrato.plan_id], (err2, servicios) => {
      if (err2) return res.status(500).json({ success: false, error: err2 });

      const sqlPagos = `
        SELECT pago_id, pago_metodo, pago_fecha
        FROM PAGO
        WHERE contrato_id = ?
        ORDER BY pago_fecha DESC, pago_id DESC
      `;

      db.query(sqlPagos, [contrato.contrato_id], (err3, pagos) => {
        if (err3) return res.status(500).json({ success: false, error: err3 });

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
  const sql = `SELECT plan_id, plan_nombre, plan_precio, plan_descripcion FROM PLAN_FUNEBRE WHERE plan_estado = 1 ORDER BY plan_precio ASC`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, data: rows || [] });
  });
};

exports.mejorarPlan = (req, res) => {
  const usuario_id = req.user.usuario_id || req.user.id;
  const { plan_id, metodo_pago } = req.body;

  if (!plan_id)     return res.status(400).json({ success: false, message: "Falta el plan_id" });
  if (!metodo_pago) return res.status(400).json({ success: false, message: "Falta el metodo de pago" });

  const sqlContrato = `
    SELECT c.contrato_id, c.contrato_valor, cp.plan_id AS plan_actual_id
    FROM CONTRATO c
    INNER JOIN CONTRATO_PLAN cp ON cp.contrato_id = c.contrato_id
    WHERE c.cliente_id = ? AND c.contrato_estado = 1
    ORDER BY c.contrato_id DESC LIMIT 1
  `;

  db.query(sqlContrato, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });
    if (rows.length === 0) return res.status(404).json({ success: false, message: "No tienes un contrato activo" });

    const { contrato_id, contrato_valor, plan_actual_id } = rows[0];

    if (Number(plan_id) === Number(plan_actual_id)) {
      return res.status(400).json({ success: false, message: "Ya tienes este plan activo" });
    }

    const sqlPlan = `SELECT plan_precio FROM PLAN_FUNEBRE WHERE plan_id = ? AND plan_estado = 1`;
    db.query(sqlPlan, [plan_id], (err2, planRows) => {
      if (err2) return res.status(500).json({ success: false, error: err2 });
      if (planRows.length === 0) return res.status(404).json({ success: false, message: "Plan no encontrado o inactivo" });

      const nuevo_precio = planRows[0].plan_precio;

      if (nuevo_precio <= contrato_valor) {
        return res.status(400).json({ success: false, message: "Solo puedes cambiar a un plan de mayor valor que el actual" });
      }

      // Primero registrar el pago; el cambio de plan solo ocurre si el pago se inserta correctamente
      const sqlPago = `INSERT INTO PAGO (pago_metodo, pago_fecha, contrato_id) VALUES (?, NOW(), ?)`;
      db.query(sqlPago, [metodo_pago, contrato_id], (err3) => {
        if (err3) return res.status(500).json({ success: false, error: err3 });

        const sqlUpdatePlan = `UPDATE CONTRATO_PLAN SET plan_id = ? WHERE contrato_id = ?`;
        db.query(sqlUpdatePlan, [plan_id, contrato_id], (err4) => {
          if (err4) return res.status(500).json({ success: false, error: err4 });

          const sqlUpdateValor = `UPDATE CONTRATO SET contrato_valor = ? WHERE contrato_id = ?`;
          db.query(sqlUpdateValor, [nuevo_precio, contrato_id], (err5) => {
            if (err5) return res.status(500).json({ success: false, error: err5 });
            res.json({ success: true, message: "Plan mejorado correctamente. El pago ha sido registrado." });
          });
        });
      });
    });
  });
};

exports.cancelarPlan = (req, res) => {
  const usuario_id = req.user.usuario_id || req.user.id;

  const sqlContrato = `SELECT contrato_id FROM CONTRATO WHERE cliente_id = ? AND contrato_estado = 1 ORDER BY contrato_id DESC LIMIT 1`;
  db.query(sqlContrato, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });
    if (rows.length === 0) return res.status(404).json({ success: false, message: "No tienes un contrato activo" });

    const contrato_id = rows[0].contrato_id;

    const sqlPagos = `SELECT COUNT(*) as total FROM PAGO WHERE contrato_id = ?`;
    db.query(sqlPagos, [contrato_id], (err2, countRows) => {
      if (err2) return res.status(500).json({ success: false, error: err2 });

      if (countRows[0].total === 0) {
        return res.status(400).json({ success: false, message: "Tienes un saldo pendiente. No puedes cancelar el plan hasta estar a paz y salvo." });
      }

      const sqlCancel = `UPDATE CONTRATO SET contrato_estado = 0 WHERE contrato_id = ?`;
      db.query(sqlCancel, [contrato_id], (err3) => {
        if (err3) return res.status(500).json({ success: false, error: err3 });
        res.json({ success: true, message: "Plan cancelado. Quedas a paz y salvo con AlmaSoft." });
      });
    });
  });
};

exports.adquirirPlan = (req, res) => {
  const { cliente_id, plan_id, metodo_pago } = req.body;
  const usuario_id = req.user.id;

  if (!cliente_id || !plan_id || !metodo_pago) {
    return res.status(400).json({ success: false, message: "Faltan datos" });
  }

  if (Number(cliente_id) !== Number(usuario_id)) {
    return res.status(403).json({ success: false, message: "No tienes permiso para adquirir planes para este cliente" });
  }

  const sqlVerificarCliente = `SELECT cliente_id FROM CLIENTE WHERE cliente_id = ?`;
  db.query(sqlVerificarCliente, [usuario_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Tu cuenta no tiene un perfil de cliente registrado. Por favor contacta soporte o vuelve a registrarte." });
    }

    const sqlContratoActivo = `SELECT contrato_id FROM CONTRATO WHERE cliente_id = ? AND contrato_estado = 1 LIMIT 1`;
    db.query(sqlContratoActivo, [usuario_id], (errCA, rowsCA) => {
      if (errCA) return res.status(500).json({ error: errCA });
      if (rowsCA.length > 0) {
        return res.status(400).json({ success: false, message: "Ya tienes un plan activo. Usa 'Mejorar plan' desde Tu Plan si deseas cambiarlo." });
      }

      const sqlPlan = `SELECT plan_precio FROM PLAN_FUNEBRE WHERE plan_id = ?`;
      db.query(sqlPlan, [plan_id], (err2, result2) => {
        if (err2) return res.status(500).json({ error: err2 });
        if (result2.length === 0) return res.status(404).json({ message: "Plan no encontrado" });

        const valor = result2[0].plan_precio;

        const sqlContrato = `INSERT INTO CONTRATO (contrato_estado, contrato_valor, cliente_id) VALUES (1, ?, ?)`;
        db.query(sqlContrato, [valor, cliente_id], (err3, resultContrato) => {
          if (err3) return res.status(500).json({ error: err3 });

          const contrato_id = resultContrato.insertId;

          const sqlPago = `INSERT INTO PAGO (pago_metodo, pago_fecha, contrato_id) VALUES (?, NOW(), ?)`;
          db.query(sqlPago, [metodo_pago, contrato_id], (err4) => {
            if (err4) return res.status(500).json({ error: err4 });

            const sqlContratoPlan = `INSERT INTO CONTRATO_PLAN (contrato_id, plan_id) VALUES (?, ?)`;
            db.query(sqlContratoPlan, [contrato_id, plan_id], (err5) => {
              if (err5) return res.status(500).json({ error: err5 });
              res.json({ success: true, message: "Plan adquirido correctamente", contrato_id, plan_id });
            });
          });
        });
      });
    });
  });
};
