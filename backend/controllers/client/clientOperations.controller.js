const dayjs = require("dayjs");
const db = require("../../config/config");

let operationsSchemaReady = false;

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
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function limpiarUltimos4(value) {
  return String(value || "").replace(/\D/g, "").slice(-4);
}

function generarReferencia(prefijo) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefijo}-${dayjs().format("YYYYMMDDHHmmss")}-${random}`;
}

function buildPaymentCode(scope, method) {
  const normalizedMethod = normalizarTexto(method);
  if (normalizedMethod === "pse") return `${scope}-PSE`;
  if (normalizedMethod === "credito") return `${scope}-TDC`;
  if (normalizedMethod === "debito") return `${scope}-TDD`;
  return `${scope}-EFE`;
}

async function ensureOperationsSchema() {
  if (operationsSchemaReady) return;

  await ejecutarConsulta(
    db,
    `
      CREATE TABLE IF NOT EXISTS notificacion_usuario (
        notificacion_id INT NOT NULL AUTO_INCREMENT,
        usuario_id INT NOT NULL,
        notificacion_titulo VARCHAR(120) NOT NULL,
        notificacion_mensaje VARCHAR(255) NOT NULL,
        notificacion_tipo VARCHAR(45) NOT NULL,
        referencia_id INT NULL,
        leida BOOLEAN NOT NULL DEFAULT 0,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (notificacion_id),
        CONSTRAINT fk_notificacion_usuario_ops
          FOREIGN KEY (usuario_id)
          REFERENCES usuario(usuario_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `
  ).catch(async (error) => {
    if (error.code !== "ER_TABLE_EXISTS_ERROR") throw error;
  });

  await ejecutarConsulta(
    db,
    `
      CREATE TABLE IF NOT EXISTS compra_tienda (
        compra_id INT NOT NULL AUTO_INCREMENT,
        contrato_id INT NOT NULL,
        usuario_id INT NOT NULL,
        pago_id INT NOT NULL,
        compra_total DOUBLE NOT NULL,
        compra_estado VARCHAR(20) NOT NULL DEFAULT 'aprobada',
        metodo_pago VARCHAR(20) NOT NULL,
        referencia_pago VARCHAR(60) NOT NULL,
        entidad_pago VARCHAR(120) NULL,
        tarjeta_tipo VARCHAR(20) NULL,
        tarjeta_ultimos4 VARCHAR(4) NULL,
        observacion VARCHAR(255) NULL,
        fecha_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (compra_id),
        CONSTRAINT fk_compra_contrato
          FOREIGN KEY (contrato_id)
          REFERENCES contrato(contrato_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_compra_usuario
          FOREIGN KEY (usuario_id)
          REFERENCES usuario(usuario_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_compra_pago
          FOREIGN KEY (pago_id)
          REFERENCES pago(pago_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `
  );

  await ejecutarConsulta(
    db,
    `
      CREATE TABLE IF NOT EXISTS compra_tienda_detalle (
        detalle_id INT NOT NULL AUTO_INCREMENT,
        compra_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DOUBLE NOT NULL,
        subtotal DOUBLE NOT NULL,
        PRIMARY KEY (detalle_id),
        CONSTRAINT fk_compra_detalle_compra
          FOREIGN KEY (compra_id)
          REFERENCES compra_tienda(compra_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_compra_detalle_producto
          FOREIGN KEY (producto_id)
          REFERENCES producto(producto_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `
  );

  await ejecutarConsulta(
    db,
    `
      CREATE TABLE IF NOT EXISTS solicitud_servicio_adicional (
        solicitud_id INT NOT NULL AUTO_INCREMENT,
        contrato_id INT NOT NULL,
        usuario_id INT NOT NULL,
        servicio_id INT NOT NULL,
        pago_id INT NOT NULL,
        estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
        metodo_pago VARCHAR(20) NOT NULL,
        referencia_pago VARCHAR(60) NOT NULL,
        entidad_pago VARCHAR(120) NULL,
        tarjeta_tipo VARCHAR(20) NULL,
        tarjeta_ultimos4 VARCHAR(4) NULL,
        descripcion VARCHAR(255) NULL,
        observacion VARCHAR(255) NULL,
        fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (solicitud_id),
        CONSTRAINT fk_servicio_solicitud_contrato
          FOREIGN KEY (contrato_id)
          REFERENCES contrato(contrato_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_servicio_solicitud_usuario
          FOREIGN KEY (usuario_id)
          REFERENCES usuario(usuario_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_servicio_solicitud_servicio
          FOREIGN KEY (servicio_id)
          REFERENCES servicio(servicio_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_servicio_solicitud_pago
          FOREIGN KEY (pago_id)
          REFERENCES pago(pago_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `
  );

  operationsSchemaReady = true;
}

async function obtenerContratoActivo(usuarioId) {
  const rows = await ejecutarConsulta(
    db,
    `
      SELECT
        c.contrato_id,
        c.contrato_valor,
        cp.plan_id,
        p.plan_nombre
      FROM contrato c
      INNER JOIN contrato_plan cp ON cp.contrato_id = c.contrato_id
      INNER JOIN plan_funebre p ON p.plan_id = cp.plan_id
      WHERE c.cliente_id = ? AND c.contrato_estado = 1
      ORDER BY c.contrato_id DESC
      LIMIT 1
    `,
    [usuarioId]
  );

  return rows[0] || null;
}

async function obtenerColumnasProducto() {
  const columns = await ejecutarConsulta(db, "SHOW COLUMNS FROM producto");
  return new Set(columns.map((column) => column.Field));
}

function validarPago(body) {
  const metodo = normalizarTexto(body.metodo_pago);

  if (!["pse", "debito", "credito", "efectivo"].includes(metodo)) {
    return { error: "Selecciona un metodo de pago valido." };
  }

  if (metodo === "pse") {
    if (!body.entidad_pago || !body.pse_correo) {
      return { error: "Completa los datos requeridos para pagar por PSE." };
    }
  }

  if (metodo === "debito") {
    if (!body.entidad_pago || !body.titular_pago || limpiarUltimos4(body.ultimos4).length !== 4) {
      return { error: "Completa los datos requeridos para la tarjeta debito." };
    }
  }

  if (metodo === "credito") {
    if (!body.entidad_pago || !body.titular_pago || !body.franquicia_tarjeta || limpiarUltimos4(body.ultimos4).length !== 4) {
      return { error: "Completa los datos requeridos para la tarjeta credito." };
    }
  }

  if (metodo === "efectivo") {
    if (!body.sede_pago || !body.titular_pago) {
      return { error: "Completa los datos requeridos para el pago en efectivo." };
    }
  }

  return {
    metodo,
    ultimos4: limpiarUltimos4(body.ultimos4),
    referencia: generarReferencia(
      metodo === "pse" ? "PSE" : metodo === "credito" ? "TDC" : metodo === "debito" ? "TDD" : "EFE"
    ),
  };
}

async function registrarNotificacionParaRevision(titulo, mensaje, referenciaId) {
  const reviewers = await ejecutarConsulta(
    db,
    `
      SELECT DISTINCT ru.usuario_id
      FROM rol_usuario ru
      INNER JOIN rol r ON r.rol_id = ru.rol_id
      WHERE ru.estado_cred = 1
        AND LOWER(r.rol_nombre) IN ('administrador', 'asesor')
    `
  );

  for (const reviewer of reviewers) {
    await ejecutarConsulta(
      db,
      `
        INSERT INTO notificacion_usuario (
          usuario_id,
          notificacion_titulo,
          notificacion_mensaje,
          notificacion_tipo,
          referencia_id,
          leida,
          fecha_creacion
        )
        VALUES (?, ?, ?, 'gestion_cliente', ?, 0, NOW())
      `,
      [reviewer.usuario_id, titulo, mensaje, referenciaId]
    );
  }
}

exports.getContractDocument = async (req, res) => {
  const usuarioId = req.user?.usuario_id;

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Tu sesion ha finalizado. Ingresa nuevamente." });
  }

  try {
    const contrato = await obtenerContratoActivo(usuarioId);

    if (!contrato) {
      return res.status(404).json({ success: false, message: "Aun no tienes un contrato activo." });
    }

    return res.json({
      success: true,
      data: {
        contrato_id: contrato.contrato_id,
        contrato_valor: contrato.contrato_valor,
        plan_nombre: contrato.plan_nombre,
        pdf_url: "/docs/contrato.pdf",
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos cargar tu contrato." });
  }
};

exports.getStoreProducts = async (req, res) => {
  try {
    const productColumns = await obtenerColumnasProducto();
    const hasImage = productColumns.has("producto_imagen");

    const rows = await ejecutarConsulta(
      db,
      `
        SELECT
          p.producto_id,
          p.producto_nombre,
          p.producto_descripcion,
          p.producto_precio,
          p.producto_stock,
          p.producto_estado,
          ${hasImage ? "p.producto_imagen," : "NULL AS producto_imagen,"}
          sc.subcategoria_nombre,
          c.categoria_nombre
        FROM producto p
        INNER JOIN subcategoria sc ON sc.subcategoria_id = p.subcategoria_id
        INNER JOIN categoria c ON c.categoria_id = sc.categoria_id
        WHERE p.producto_estado = 1 AND p.producto_stock > 0
        ORDER BY c.categoria_nombre, p.producto_nombre
      `
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos cargar la tienda." });
  }
};

exports.getCart = async (req, res) => {
  const usuarioId = req.user?.usuario_id;

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Tu sesion ha finalizado. Ingresa nuevamente." });
  }

  try {
    const productColumns = await obtenerColumnasProducto();
    const hasImage = productColumns.has("producto_imagen");

    const rows = await ejecutarConsulta(
      db,
      `
        SELECT
          c.carrito_id,
          c.producto_id,
          c.cantidad,
          c.precio_unitario,
          p.producto_nombre,
          p.producto_descripcion,
          p.producto_stock,
          ${hasImage ? "p.producto_imagen," : "NULL AS producto_imagen,"}
          sc.subcategoria_nombre,
          ca.categoria_nombre
        FROM carrito c
        INNER JOIN producto p ON p.producto_id = c.producto_id
        INNER JOIN subcategoria sc ON sc.subcategoria_id = p.subcategoria_id
        INNER JOIN categoria ca ON ca.categoria_id = sc.categoria_id
        WHERE c.usuario_id = ?
        ORDER BY c.fecha DESC
      `,
      [usuarioId]
    );

    const total = rows.reduce((sum, item) => sum + Number(item.precio_unitario) * Number(item.cantidad), 0);

    return res.json({ success: true, data: { items: rows, total } });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos cargar tu carrito." });
  }
};

exports.addToCart = async (req, res) => {
  const usuarioId = req.user?.usuario_id;
  const { producto_id, cantidad } = req.body;
  const requestedQuantity = Math.max(1, Number(cantidad || 1));

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Tu sesion ha finalizado. Ingresa nuevamente." });
  }

  if (!producto_id) {
    return res.status(400).json({ success: false, message: "Selecciona un producto valido." });
  }

  try {
    const products = await ejecutarConsulta(
      db,
      `
        SELECT producto_id, producto_nombre, producto_precio, producto_stock, producto_estado
        FROM producto
        WHERE producto_id = ?
        LIMIT 1
      `,
      [producto_id]
    );

    if (products.length === 0 || Number(products[0].producto_estado) !== 1) {
      return res.status(404).json({ success: false, message: "El producto no esta disponible." });
    }

    const product = products[0];
    if (requestedQuantity > Number(product.producto_stock)) {
      return res.status(400).json({ success: false, message: "La cantidad solicitada supera el stock disponible." });
    }

    const existingItems = await ejecutarConsulta(
      db,
      `
        SELECT carrito_id, cantidad
        FROM carrito
        WHERE usuario_id = ? AND producto_id = ?
        LIMIT 1
      `,
      [usuarioId, producto_id]
    );

    if (existingItems.length > 0) {
      const newQuantity = Number(existingItems[0].cantidad) + requestedQuantity;
      if (newQuantity > Number(product.producto_stock)) {
        return res.status(400).json({ success: false, message: "No hay stock suficiente para aumentar esa cantidad." });
      }

      await ejecutarConsulta(
        db,
        `
          UPDATE carrito
          SET cantidad = ?, precio_unitario = ?, fecha = NOW()
          WHERE carrito_id = ?
        `,
        [newQuantity, product.producto_precio, existingItems[0].carrito_id]
      );
    } else {
      await ejecutarConsulta(
        db,
        `
          INSERT INTO carrito (usuario_id, producto_id, cantidad, precio_unitario, fecha)
          VALUES (?, ?, ?, ?, NOW())
        `,
        [usuarioId, producto_id, requestedQuantity, product.producto_precio]
      );
    }

    return res.status(201).json({ success: true, message: "Producto agregado al carrito." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos actualizar el carrito." });
  }
};

exports.updateCartItem = async (req, res) => {
  const usuarioId = req.user?.usuario_id;
  const carritoId = req.params.id;
  const { cantidad } = req.body;
  const requestedQuantity = Number(cantidad || 0);

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Tu sesion ha finalizado. Ingresa nuevamente." });
  }

  if (requestedQuantity <= 0) {
    return res.status(400).json({ success: false, message: "La cantidad debe ser mayor a cero." });
  }

  try {
    const items = await ejecutarConsulta(
      db,
      `
        SELECT c.carrito_id, c.producto_id, p.producto_stock, p.producto_precio
        FROM carrito c
        INNER JOIN producto p ON p.producto_id = c.producto_id
        WHERE c.carrito_id = ? AND c.usuario_id = ?
        LIMIT 1
      `,
      [carritoId, usuarioId]
    );

    if (items.length === 0) {
      return res.status(404).json({ success: false, message: "El producto no esta en tu carrito." });
    }

    if (requestedQuantity > Number(items[0].producto_stock)) {
      return res.status(400).json({ success: false, message: "La cantidad supera el stock disponible." });
    }

    await ejecutarConsulta(
      db,
      `
        UPDATE carrito
        SET cantidad = ?, precio_unitario = ?, fecha = NOW()
        WHERE carrito_id = ?
      `,
      [requestedQuantity, items[0].producto_precio, carritoId]
    );

    return res.json({ success: true, message: "Cantidad actualizada correctamente." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos actualizar el carrito." });
  }
};

exports.removeCartItem = async (req, res) => {
  const usuarioId = req.user?.usuario_id;
  const carritoId = req.params.id;

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Tu sesion ha finalizado. Ingresa nuevamente." });
  }

  try {
    await ejecutarConsulta(
      db,
      `
        DELETE FROM carrito
        WHERE carrito_id = ? AND usuario_id = ?
      `,
      [carritoId, usuarioId]
    );

    return res.json({ success: true, message: "Producto retirado del carrito." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos retirar el producto." });
  }
};

exports.checkoutCart = async (req, res) => {
  const usuarioId = req.user?.usuario_id;

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Tu sesion ha finalizado. Ingresa nuevamente." });
  }

  const payment = validarPago(req.body);
  if (payment.error) {
    return res.status(400).json({ success: false, message: payment.error });
  }

  try {
    await ensureOperationsSchema();

    const contrato = await obtenerContratoActivo(usuarioId);
    if (!contrato) {
      return res.status(400).json({ success: false, message: "Necesitas un plan activo para comprar en la tienda." });
    }

    const items = await ejecutarConsulta(
      db,
      `
        SELECT
          c.carrito_id,
          c.producto_id,
          c.cantidad,
          c.precio_unitario,
          p.producto_nombre,
          p.producto_stock
        FROM carrito c
        INNER JOIN producto p ON p.producto_id = c.producto_id
        WHERE c.usuario_id = ?
      `,
      [usuarioId]
    );

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: "Tu carrito esta vacio." });
    }

    for (const item of items) {
      if (Number(item.cantidad) > Number(item.producto_stock)) {
        return res.status(400).json({
          success: false,
          message: `No hay stock suficiente para ${item.producto_nombre}. Ajusta tu carrito e intenta nuevamente.`,
        });
      }
    }

    const total = items.reduce((sum, item) => sum + Number(item.precio_unitario) * Number(item.cantidad), 0);
    const paymentCode = buildPaymentCode("TIENDA", payment.metodo);

    await iniciarTransaccion(db);

    try {
      const pagoResult = await ejecutarConsulta(
        db,
        `
          INSERT INTO pago (pago_metodo, pago_fecha, contrato_id)
          VALUES (?, CURDATE(), ?)
        `,
        [paymentCode, contrato.contrato_id]
      );

      const compraResult = await ejecutarConsulta(
        db,
        `
          INSERT INTO compra_tienda (
            contrato_id,
            usuario_id,
            pago_id,
            compra_total,
            compra_estado,
            metodo_pago,
            referencia_pago,
            entidad_pago,
            tarjeta_tipo,
            tarjeta_ultimos4,
            observacion,
            fecha_compra
          )
          VALUES (?, ?, ?, ?, 'aprobada', ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          contrato.contrato_id,
          usuarioId,
          pagoResult.insertId,
          total,
          payment.metodo,
          payment.referencia,
          req.body.entidad_pago || null,
          payment.metodo === "credito" || payment.metodo === "debito" ? payment.metodo : null,
          payment.metodo === "credito" || payment.metodo === "debito" ? payment.ultimos4 : null,
          `Compra en tienda por ${items.length} producto(s)`,
        ]
      );

      for (const item of items) {
        const subtotal = Number(item.precio_unitario) * Number(item.cantidad);

        await ejecutarConsulta(
          db,
          `
            INSERT INTO compra_tienda_detalle (
              compra_id,
              producto_id,
              cantidad,
              precio_unitario,
              subtotal
            )
            VALUES (?, ?, ?, ?, ?)
          `,
          [compraResult.insertId, item.producto_id, item.cantidad, item.precio_unitario, subtotal]
        );

        await ejecutarConsulta(
          db,
          `
            UPDATE producto
            SET producto_stock = producto_stock - ?
            WHERE producto_id = ?
          `,
          [item.cantidad, item.producto_id]
        );

        const relationExists = await ejecutarConsulta(
          db,
          `
            SELECT 1
            FROM contrato_producto
            WHERE contrato_id = ? AND producto_id = ?
            LIMIT 1
          `,
          [contrato.contrato_id, item.producto_id]
        );

        if (relationExists.length === 0) {
          await ejecutarConsulta(
            db,
            `
              INSERT INTO contrato_producto (contrato_id, producto_id)
              VALUES (?, ?)
            `,
            [contrato.contrato_id, item.producto_id]
          );
        }
      }

      await ejecutarConsulta(db, "DELETE FROM carrito WHERE usuario_id = ?", [usuarioId]);
      await confirmarTransaccion(db);

      return res.status(201).json({
        success: true,
        message: "Tu compra fue registrada correctamente.",
      });
    } catch (transactionError) {
      await revertirTransaccion(db);
      throw transactionError;
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos completar la compra." });
  }
};

exports.getServiceCatalog = async (req, res) => {
  const usuarioId = req.user?.usuario_id;

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Tu sesion ha finalizado. Ingresa nuevamente." });
  }

  try {
    const rows = await ejecutarConsulta(
      db,
      `
        SELECT servicio_id, servicio_nombre, servicio_descripcion, servicio_precio
        FROM servicio
        ORDER BY servicio_nombre
      `
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos cargar los servicios." });
  }
};

exports.requestAdditionalService = async (req, res) => {
  const usuarioId = req.user?.usuario_id;
  const { servicio_id, descripcion } = req.body;

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Tu sesion ha finalizado. Ingresa nuevamente." });
  }

  if (!servicio_id) {
    return res.status(400).json({ success: false, message: "Selecciona un servicio para continuar." });
  }

  const payment = validarPago(req.body);
  if (payment.error) {
    return res.status(400).json({ success: false, message: payment.error });
  }

  try {
    await ensureOperationsSchema();

    const contrato = await obtenerContratoActivo(usuarioId);
    if (!contrato) {
      return res.status(400).json({ success: false, message: "Necesitas un plan activo para solicitar servicios adicionales." });
    }

    const services = await ejecutarConsulta(
      db,
      `
        SELECT servicio_id, servicio_nombre, servicio_descripcion, servicio_precio
        FROM servicio
        WHERE servicio_id = ?
        LIMIT 1
      `,
      [servicio_id]
    );

    if (services.length === 0) {
      return res.status(404).json({ success: false, message: "El servicio seleccionado no existe." });
    }

    const service = services[0];
    const paymentCode = buildPaymentCode("SERVICIO", payment.metodo);

    await iniciarTransaccion(db);

    try {
      const pagoResult = await ejecutarConsulta(
        db,
        `
          INSERT INTO pago (pago_metodo, pago_fecha, contrato_id)
          VALUES (?, CURDATE(), ?)
        `,
        [paymentCode, contrato.contrato_id]
      );

      const requestResult = await ejecutarConsulta(
        db,
        `
          INSERT INTO solicitud_servicio_adicional (
            contrato_id,
            usuario_id,
            servicio_id,
            pago_id,
            estado,
            metodo_pago,
            referencia_pago,
            entidad_pago,
            tarjeta_tipo,
            tarjeta_ultimos4,
            descripcion,
            observacion,
            fecha_solicitud
          )
          VALUES (?, ?, ?, ?, 'pendiente', ?, ?, ?, ?, ?, ?, ?, NOW())
        `,
        [
          contrato.contrato_id,
          usuarioId,
          servicio_id,
          pagoResult.insertId,
          payment.metodo,
          payment.referencia,
          req.body.entidad_pago || null,
          payment.metodo === "credito" || payment.metodo === "debito" ? payment.metodo : null,
          payment.metodo === "credito" || payment.metodo === "debito" ? payment.ultimos4 : null,
          descripcion || null,
          `Solicitud del servicio ${service.servicio_nombre}`,
        ]
      );

      await registrarNotificacionParaRevision(
        "Nueva solicitud de servicio",
        `Un cliente solicito el servicio ${service.servicio_nombre} y quedo pendiente de gestion.`,
        requestResult.insertId
      );

      await confirmarTransaccion(db);

      return res.status(201).json({
        success: true,
        message: "Tu solicitud de servicio fue registrada correctamente.",
      });
    } catch (transactionError) {
      await revertirTransaccion(db);
      throw transactionError;
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos registrar la solicitud del servicio." });
  }
};

exports.getGeneralPaymentHistory = async (req, res) => {
  const usuarioId = req.user?.usuario_id;

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Tu sesion ha finalizado. Ingresa nuevamente." });
  }

  try {
    await ensureOperationsSchema();
    const contrato = await obtenerContratoActivo(usuarioId);

    if (!contrato) {
      return res.status(404).json({ success: false, message: "Aun no tienes un contrato activo." });
    }

    const planPayments = await ejecutarConsulta(
      db,
      `
        SELECT
          p.pago_id,
          p.pago_metodo,
          p.pago_fecha
        FROM pago p
        LEFT JOIN compra_tienda ct ON ct.pago_id = p.pago_id
        LEFT JOIN solicitud_servicio_adicional ss ON ss.pago_id = p.pago_id
        WHERE p.contrato_id = ?
          AND ct.pago_id IS NULL
          AND ss.pago_id IS NULL
        ORDER BY p.pago_fecha DESC, p.pago_id DESC
      `,
      [contrato.contrato_id]
    );

    const storePayments = await ejecutarConsulta(
      db,
      `
        SELECT
          p.pago_id,
          p.pago_fecha,
          p.pago_metodo,
          ct.compra_total,
          ct.metodo_pago,
          ct.referencia_pago,
          ct.entidad_pago,
          ct.tarjeta_tipo,
          ct.tarjeta_ultimos4,
          ct.compra_estado
        FROM compra_tienda ct
        INNER JOIN pago p ON p.pago_id = ct.pago_id
        WHERE ct.contrato_id = ?
        ORDER BY ct.fecha_compra DESC
      `,
      [contrato.contrato_id]
    );

    const servicePayments = await ejecutarConsulta(
      db,
      `
        SELECT
          p.pago_id,
          p.pago_fecha,
          p.pago_metodo,
          ssa.estado,
          ssa.metodo_pago,
          ssa.referencia_pago,
          ssa.entidad_pago,
          ssa.tarjeta_tipo,
          ssa.tarjeta_ultimos4,
          s.servicio_nombre,
          s.servicio_precio
        FROM solicitud_servicio_adicional ssa
        INNER JOIN pago p ON p.pago_id = ssa.pago_id
        INNER JOIN servicio s ON s.servicio_id = ssa.servicio_id
        WHERE ssa.contrato_id = ?
        ORDER BY ssa.fecha_solicitud DESC
      `,
      [contrato.contrato_id]
    );

    const payments = [
      ...planPayments.map((item) => ({
        pago_id: item.pago_id,
        pago_fecha: item.pago_fecha,
        pago_metodo: item.pago_metodo,
        origen: "plan",
        titulo: "Adquisicion de plan",
        total: contrato.contrato_valor,
      })),
      ...storePayments.map((item) => ({
        pago_id: item.pago_id,
        pago_fecha: item.pago_fecha,
        pago_metodo: item.metodo_pago,
        origen: "tienda",
        titulo: "Compra en tienda",
        total: item.compra_total,
        referencia: item.referencia_pago,
        entidad: item.entidad_pago,
        tarjeta_tipo: item.tarjeta_tipo,
        tarjeta_ultimos4: item.tarjeta_ultimos4,
        estado: item.compra_estado,
      })),
      ...servicePayments.map((item) => ({
        pago_id: item.pago_id,
        pago_fecha: item.pago_fecha,
        pago_metodo: item.metodo_pago,
        origen: "servicio",
        titulo: `Servicio adicional: ${item.servicio_nombre}`,
        total: item.servicio_precio,
        referencia: item.referencia_pago,
        entidad: item.entidad_pago,
        tarjeta_tipo: item.tarjeta_tipo,
        tarjeta_ultimos4: item.tarjeta_ultimos4,
        estado: item.estado,
      })),
    ].sort((a, b) => new Date(b.pago_fecha) - new Date(a.pago_fecha) || b.pago_id - a.pago_id);

    return res.json({
      success: true,
      data: {
        contrato_id: contrato.contrato_id,
        plan_nombre: contrato.plan_nombre,
        payments,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos cargar el historial de pagos." });
  }
};
