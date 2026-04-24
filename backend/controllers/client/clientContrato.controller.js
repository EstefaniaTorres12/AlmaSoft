const dayjs = require("dayjs");
const db = require("../../config/config");
const { sendCashPaymentEmail } = require("../../utils/paymentMailer");

function construirMetodoPago({
  metodo_pago,
  entidad_pago,
  tipo_tarjeta,
  ultimos4,
  referencia_pago,
}) {
  if (metodo_pago === "pse") {
    const entidad = entidad_pago || "Entidad no especificada";
    const referencia = referencia_pago || "Sin referencia";
    return `PSE - ${entidad} - Ref ${referencia}`;
  }

  if (metodo_pago === "tarjeta") {
    const tipo = tipo_tarjeta || "tipo no especificado";
    const entidad = entidad_pago || "entidad no especificada";
    const terminacion = ultimos4 ? `****${ultimos4}` : "sin terminacion";
    return `Tarjeta ${tipo} - ${entidad} - ${terminacion}`;
  }

  if (metodo_pago === "efectivo") {
    const fechaLimite = referencia_pago || "fecha pendiente";
    return `Efectivo - pago en sede - vence ${fechaLimite}`;
  }

  return metodo_pago;
}

function normalizarTexto(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function productosPorPlan(planNombre) {
  const productos = {
    basico: ["Ataud basico", "Urna", "Traslado", "Preparacion"],
    estandar: ["Ataud estandar", "Urna decorada", "Flores"],
    premium: ["Ataud premium", "Urna especial", "Flores premium"],
    vip: ["Ataud de lujo", "Urna exclusiva", "Servicios VIP"],
  };

  return productos[normalizarTexto(planNombre)] || [];
}

exports.adquirirPlan = (req, res) => {
  const {
    cliente_id,
    plan_id,
    metodo_pago,
    entidad_pago,
    tipo_tarjeta,
    ultimos4,
    referencia_pago,
  } = req.body;
  const usuario_id = req.user?.usuario_id;

  if (!usuario_id) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
    });
  }

  if (!cliente_id || !plan_id || !metodo_pago) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos",
    });
  }

  if (metodo_pago === "pse" && !entidad_pago) {
    return res.status(400).json({
      success: false,
      message: "Debes seleccionar una entidad PSE",
    });
  }

  if (metodo_pago === "tarjeta" && (!entidad_pago || !tipo_tarjeta || !ultimos4)) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos de la tarjeta",
    });
  }

  const sqlVerificarCliente = `
    SELECT
      c.cliente_id,
      u.usuario_correo,
      u.usuario_primer_nombre
    FROM CLIENTE c
    INNER JOIN USUARIO u ON u.usuario_id = c.cliente_id
    WHERE c.cliente_id = ? AND c.cliente_id = ?
  `;

  db.query(sqlVerificarCliente, [cliente_id, usuario_id], (err, clientes) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al validar el cliente",
        error: err,
      });
    }

    if (clientes.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para adquirir planes para este cliente",
      });
    }

    const cliente = clientes[0];
    const sqlContratoExistente = `
      SELECT contrato_id
      FROM CONTRATO
      WHERE cliente_id = ? AND contrato_estado = 1
      LIMIT 1
    `;

    db.query(sqlContratoExistente, [cliente_id], (err, contratos) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al validar el contrato",
          error: err,
        });
      }

      if (contratos.length > 0) {
        return res.status(409).json({
          success: false,
          message: "El usuario ya tiene contrato",
        });
      }

      const sqlPlan = `
        SELECT plan_nombre, plan_precio
        FROM PLAN_FUNEBRE
        WHERE plan_id = ?
      `;

      db.query(sqlPlan, [plan_id], (err, planes) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error al consultar el plan",
            error: err,
          });
        }

        if (planes.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Plan no encontrado",
          });
        }

        const plan = planes[0];
        const valor = plan.plan_precio;
        const fechaLimitePago = dayjs().add(3, "day").format("DD/MM/YYYY");
        const sqlContrato = `
          INSERT INTO CONTRATO (contrato_estado, contrato_valor, cliente_id)
          VALUES (1, ?, ?)
        `;

        db.query(sqlContrato, [valor, cliente_id], (err, resultContrato) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error al crear el contrato",
              error: err,
            });
          }

          const contrato_id = resultContrato.insertId;
          const metodoPagoRegistrado = construirMetodoPago({
            metodo_pago,
            entidad_pago,
            tipo_tarjeta,
            ultimos4,
            referencia_pago: metodo_pago === "efectivo" ? fechaLimitePago : referencia_pago,
          });
          const sqlPago = `
            INSERT INTO PAGO (pago_metodo, pago_fecha, contrato_id)
            VALUES (?, NOW(), ?)
          `;

          db.query(sqlPago, [metodoPagoRegistrado, contrato_id], (err) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Error al registrar el pago",
                error: err,
              });
            }

            const sqlContratoPlan = `
              INSERT INTO CONTRATO_PLAN (contrato_id, plan_id)
              VALUES (?, ?)
            `;

            db.query(sqlContratoPlan, [contrato_id, plan_id], async (err) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: "Error al asociar el plan al contrato",
                  error: err,
                });
              }

              let correoEnviado = null;
              let advertenciaCorreo = null;

              if (metodo_pago === "efectivo") {
                try {
                  const mailResult = await sendCashPaymentEmail({
                    to: cliente.usuario_correo,
                    clientName: cliente.usuario_primer_nombre,
                    planName: plan.plan_nombre,
                    amount: valor,
                    dueDate: fechaLimitePago,
                    contractId: contrato_id,
                  });

                  correoEnviado = mailResult.sent;

                  if (!mailResult.sent) {
                    advertenciaCorreo =
                      "El pago en efectivo fue registrado, pero el correo no pudo enviarse porque SMTP no esta configurado.";
                  }
                } catch (mailError) {
                  console.error("Error enviando correo de pago en efectivo:", mailError);
                  correoEnviado = false;
                  advertenciaCorreo =
                    "El pago en efectivo fue registrado, pero hubo un problema al enviar el correo.";
                }
              }

              return res.json({
                success: true,
                message: "Plan adquirido correctamente",
                contrato_id,
                pago_registrado: metodoPagoRegistrado,
                fecha_limite_pago: metodo_pago === "efectivo" ? fechaLimitePago : null,
                correo_enviado: correoEnviado,
                advertencia_correo: advertenciaCorreo,
              });
            });
          });
        });
      });
    });
  });
};

exports.obtenerMiPlan = (req, res) => {
  const usuario_id = req.user?.usuario_id;

  if (!usuario_id) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
    });
  }

  const sqlContrato = `
    SELECT
      c.contrato_id,
      c.contrato_estado,
      c.contrato_valor,
      cp.plan_id,
      p.plan_nombre,
      p.plan_descripcion,
      p.plan_precio
    FROM CONTRATO c
    INNER JOIN CONTRATO_PLAN cp ON cp.contrato_id = c.contrato_id
    INNER JOIN PLAN_FUNEBRE p ON p.plan_id = cp.plan_id
    WHERE c.cliente_id = ?
    ORDER BY c.contrato_id DESC
    LIMIT 1
  `;

  db.query(sqlContrato, [usuario_id], (err, contratos) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error al consultar el contrato del cliente",
        error: err,
      });
    }

    if (contratos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "El cliente no tiene un plan adquirido",
      });
    }

    const contrato = contratos[0];
    const sqlServicios = `
      SELECT s.servicio_id, s.servicio_nombre
      FROM SERVICIO_PLAN sp
      INNER JOIN SERVICIO s ON s.servicio_id = sp.servicio_id
      WHERE sp.plan_id = ?
      ORDER BY s.servicio_nombre
    `;

    db.query(sqlServicios, [contrato.plan_id], (err, servicios) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al consultar los servicios del plan",
          error: err,
        });
      }

      const sqlPagos = `
        SELECT pago_id, pago_metodo, pago_fecha
        FROM PAGO
        WHERE contrato_id = ?
        ORDER BY pago_fecha DESC
      `;

      db.query(sqlPagos, [contrato.contrato_id], (err, pagos) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error al consultar los pagos del plan",
            error: err,
          });
        }

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
            servicios: servicios || [],
            productos: productosPorPlan(contrato.plan_nombre),
            pagos: pagos || [],
          },
        });
      });
    });
  });
};
