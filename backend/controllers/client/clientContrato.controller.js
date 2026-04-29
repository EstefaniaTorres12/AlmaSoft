const dayjs = require("dayjs");
const db = require("../../config/config");
const { sendCashPaymentEmail } = require("../../utils/paymentMailer");

function ejecutarConsulta(connection, sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });
}

function iniciarTransaccion(connection) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function confirmarTransaccion(connection) {
  return new Promise((resolve, reject) => {
    connection.commit((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function revertirTransaccion(connection) {
  return new Promise((resolve) => {
    connection.rollback(() => resolve());
  });
}

function normalizarTexto(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function limpiarUltimos4(value) {
  const soloDigitos = String(value || "").replace(/\D/g, "");
  return soloDigitos.slice(-4);
}

function generarReferencia(prefijo) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefijo}-${dayjs().format("YYYYMMDDHHmmss")}-${random}`;
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

function construirResumenPago({
  metodoPago,
  entidadPago,
  tipoTarjeta,
  ultimos4,
  referenciaPago,
  fechaLimitePago,
  pseTipoCliente,
  pseCorreo,
  franquiciaTarjeta,
  titularPago,
  sedePago,
}) {
  if (metodoPago === "pse") {
    const tipoCliente = pseTipoCliente === "persona_juridica" ? "Juridica" : "Natural";
    return `PSE | Entidad: ${entidadPago} | Cliente: ${tipoCliente} | Correo: ${pseCorreo} | Ref: ${referenciaPago}`;
  }

  if (metodoPago === "credito") {
    return `Tarjeta Credito | Banco: ${entidadPago} | Franquicia: ${franquiciaTarjeta} | Titular: ${titularPago} | ****${ultimos4} | Ref: ${referenciaPago}`;
  }

  if (metodoPago === "debito") {
    return `Tarjeta Debito | Banco: ${entidadPago} | Titular: ${titularPago} | ****${ultimos4} | Ref: ${referenciaPago}`;
  }

  return `Efectivo | Sede: ${sedePago} | Responsable: ${titularPago} | Ref: ${referenciaPago} | Vence: ${fechaLimitePago}`;
}

function construirDetallePago({
  pagoId,
  pagoMetodo,
  pagoFecha,
  metodoPago,
  referenciaPago,
  entidadPago,
  tipoTarjeta,
  ultimos4,
  fechaLimitePago,
}) {
  return {
    pago_id: pagoId,
    pago_metodo: pagoMetodo,
    pago_fecha: pagoFecha,
    pago_estado: metodoPago === "efectivo" ? "pendiente" : "aprobado",
    pago_referencia: referenciaPago || null,
    pago_entidad: entidadPago || null,
    pago_tipo_tarjeta: tipoTarjeta || null,
    pago_ultimos4: ultimos4 || null,
    pago_fecha_limite: fechaLimitePago || null,
    pago_observacion: metodoPago === "efectivo" ? "Pago pendiente por confirmar en sede." : "Pago registrado correctamente.",
  };
}

function construirErrorCompra(error) {
  if (!error) return "No fue posible completar la adquisicion del plan.";

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return "No fue posible relacionar el cliente o el plan en el contrato.";
  }

  if (error.code === "ER_DUP_ENTRY") {
    return "Ya existe un registro duplicado para este proceso.";
  }

  return error.sqlMessage || error.message || "No fue posible completar la adquisicion del plan.";
}

exports.adquirirPlan = async (req, res) => {
  const {
    cliente_id,
    plan_id,
    metodo_pago,
    entidad_pago,
    tipo_tarjeta,
    ultimos4,
    referencia_pago,
    pse_tipo_cliente,
    pse_correo,
    franquicia_tarjeta,
    titular_pago,
    sede_pago,
  } = req.body;
  const usuario_id = req.user?.usuario_id;

  if (!usuario_id) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado.",
    });
  }

  if (!cliente_id || !plan_id || !metodo_pago) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos obligatorios para adquirir el plan.",
    });
  }

  if (!["pse", "debito", "credito", "efectivo"].includes(metodo_pago)) {
    return res.status(400).json({
      success: false,
      message: "El metodo de pago seleccionado no es valido.",
    });
  }

  if (metodo_pago === "pse") {
    if (!entidad_pago || !pse_tipo_cliente || !pse_correo) {
      return res.status(400).json({
        success: false,
        message: "Completa los datos requeridos para pagar por PSE.",
      });
    }
  }

  if (metodo_pago === "debito") {
    if (!entidad_pago || !titular_pago || limpiarUltimos4(ultimos4).length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Completa los datos requeridos para la tarjeta debito.",
      });
    }
  }

  if (metodo_pago === "credito") {
    if (!entidad_pago || !titular_pago || !franquicia_tarjeta || limpiarUltimos4(ultimos4).length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Completa los datos requeridos para la tarjeta credito.",
      });
    }
  }

  if (metodo_pago === "efectivo") {
    if (!sede_pago || !titular_pago) {
      return res.status(400).json({
        success: false,
        message: "Completa los datos requeridos para el pago en efectivo.",
      });
    }
  }

  try {
    const clientes = await ejecutarConsulta(
      db,
      `
        SELECT
          c.cliente_id,
          c.cliente_fecha_nacimiento,
          u.usuario_correo,
          u.usuario_primer_nombre
        FROM CLIENTE c
        INNER JOIN USUARIO u ON u.usuario_id = c.cliente_id
        WHERE c.cliente_id = ? AND c.cliente_id = ?
      `,
      [cliente_id, usuario_id]
    );

    if (clientes.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Tu usuario no esta registrado como cliente o no tiene permiso para adquirir este plan.",
      });
    }

    const planes = await ejecutarConsulta(
      db,
      `
        SELECT plan_id, plan_nombre, plan_precio, plan_estado
        FROM PLAN_FUNEBRE
        WHERE plan_id = ?
        LIMIT 1
      `,
      [plan_id]
    );

    if (planes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "El plan seleccionado no existe.",
      });
    }

    if (Number(planes[0].plan_estado) !== 1) {
      return res.status(400).json({
        success: false,
        message: "El plan seleccionado no esta activo.",
      });
    }

    const contratosActivos = await ejecutarConsulta(
      db,
      `
        SELECT contrato_id
        FROM CONTRATO
        WHERE cliente_id = ? AND contrato_estado = 1
        LIMIT 1
      `,
      [cliente_id]
    );

    if (contratosActivos.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ya tienes un plan activo registrado.",
      });
    }

    const plan = planes[0];
    const cliente = clientes[0];
    const valor = Number(plan.plan_precio);
    const fechaActual = dayjs().format("YYYY-MM-DD");
    const fechaLimitePago = metodo_pago === "efectivo" ? dayjs().add(3, "day").format("YYYY-MM-DD") : null;
    const ultimos4Normalizados = limpiarUltimos4(ultimos4);
    const referenciaGenerada =
      referencia_pago ||
      (metodo_pago === "pse"
        ? generarReferencia("PSE")
        : metodo_pago === "credito"
        ? generarReferencia("TDC")
        : metodo_pago === "debito"
        ? generarReferencia("TDD")
        : generarReferencia("EFE"));

    const resumenPago = construirResumenPago({
      metodoPago: metodo_pago,
      entidadPago: entidad_pago,
      tipoTarjeta: tipo_tarjeta,
      ultimos4: ultimos4Normalizados,
      referenciaPago: referenciaGenerada,
      fechaLimitePago,
      pseTipoCliente: pse_tipo_cliente,
      pseCorreo: pse_correo,
      franquiciaTarjeta: franquicia_tarjeta,
      titularPago: titular_pago,
      sedePago: sede_pago,
    });

    await iniciarTransaccion(db);

    try {
      const contratoResult = await ejecutarConsulta(
        db,
        `
          INSERT INTO CONTRATO (contrato_estado, contrato_valor, cliente_id)
          VALUES (1, ?, ?)
        `,
        [valor, cliente_id]
      );

      const contrato_id = contratoResult.insertId;

      const pagoResult = await ejecutarConsulta(
        db,
        `
          INSERT INTO PAGO (pago_metodo, pago_fecha, contrato_id)
          VALUES (?, ?, ?)
        `,
        [resumenPago, fechaActual, contrato_id]
      );

      await ejecutarConsulta(
        db,
        `
          INSERT INTO CONTRATO_PLAN (contrato_id, plan_id)
          VALUES (?, ?)
        `,
        [contrato_id, plan_id]
      );

      await confirmarTransaccion(db);

      let correoEnviado = null;
      let advertenciaCorreo = null;

      if (metodo_pago === "efectivo") {
        try {
          const mailResult = await sendCashPaymentEmail({
            to: cliente.usuario_correo,
            clientName: cliente.usuario_primer_nombre,
            planName: plan.plan_nombre,
            amount: valor,
            dueDate: dayjs(fechaLimitePago).format("DD/MM/YYYY"),
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

      return res.status(201).json({
        success: true,
        message: "Plan adquirido, pago registrado y contrato creado correctamente.",
        data: {
          contrato_id,
          plan_id: plan.plan_id,
          plan_nombre: plan.plan_nombre,
          pago: construirDetallePago({
            pagoId: pagoResult.insertId,
            pagoMetodo: resumenPago,
            pagoFecha: fechaActual,
            metodoPago: metodo_pago,
            referenciaPago: referenciaGenerada,
            entidadPago: entidad_pago,
            tipoTarjeta: metodo_pago === "credito" || metodo_pago === "debito" ? metodo_pago : null,
            ultimos4: metodo_pago === "credito" || metodo_pago === "debito" ? ultimos4Normalizados : null,
            fechaLimitePago,
          }),
          correo_enviado: correoEnviado,
          advertencia_correo: advertenciaCorreo,
        },
      });
    } catch (transactionError) {
      await revertirTransaccion(db);
      return res.status(500).json({
        success: false,
        message: construirErrorCompra(transactionError),
        error: transactionError,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: construirErrorCompra(error),
      error,
    });
  }
};

exports.obtenerMiPlan = async (req, res) => {
  const usuario_id = req.user?.usuario_id;

  if (!usuario_id) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado",
    });
  }

  try {
    const contratos = await ejecutarConsulta(
      db,
      `
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
      `,
      [usuario_id]
    );

    if (contratos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "El cliente no tiene un plan adquirido",
      });
    }

    const contrato = contratos[0];

    const servicios = await ejecutarConsulta(
      db,
      `
        SELECT s.servicio_id, s.servicio_nombre
        FROM SERVICIO_PLAN sp
        INNER JOIN SERVICIO s ON s.servicio_id = sp.servicio_id
        WHERE sp.plan_id = ?
        ORDER BY s.servicio_nombre
      `,
      [contrato.plan_id]
    );

    const pagos = await ejecutarConsulta(
      db,
      `
        SELECT pago_id, pago_metodo, pago_fecha
        FROM PAGO
        WHERE contrato_id = ?
        ORDER BY pago_fecha DESC, pago_id DESC
      `,
      [contrato.contrato_id]
    );

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
        pagos: (pagos || []).map((pago) =>
          construirDetallePago({
            pagoId: pago.pago_id,
            pagoMetodo: pago.pago_metodo,
            pagoFecha: pago.pago_fecha,
            metodoPago: normalizarTexto(pago.pago_metodo).includes("efectivo") ? "efectivo" : "digital",
            referenciaPago: null,
            entidadPago: null,
            tipoTarjeta: null,
            ultimos4: null,
            fechaLimitePago: null,
          })
        ),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al consultar el plan del cliente",
      error,
    });
  }
};
