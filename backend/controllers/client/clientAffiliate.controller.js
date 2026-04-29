const db = require("../../config/config");

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

let affiliateSchemaReady = false;

async function ensureAffiliateSchema() {
  if (affiliateSchemaReady) {
    return;
  }

  await ejecutarConsulta(
    db,
    `
      CREATE TABLE IF NOT EXISTS AFILIACION_SOLICITUD (
        solicitud_id INT NOT NULL AUTO_INCREMENT,
        contrato_id INT NOT NULL,
        titular_id INT NOT NULL,
        usuario_postulado_id INT NOT NULL,
        parentesco VARCHAR(45) NOT NULL,
        observacion VARCHAR(255) NULL,
        estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
        fecha_solicitud DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fecha_revision DATETIME NULL,
        revisado_por INT NULL,
        motivo_revision VARCHAR(255) NULL,
        PRIMARY KEY (solicitud_id),
        CONSTRAINT fk_solicitud_contrato
          FOREIGN KEY (contrato_id)
          REFERENCES CONTRATO(contrato_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_solicitud_titular
          FOREIGN KEY (titular_id)
          REFERENCES USUARIO(usuario_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_solicitud_postulado
          FOREIGN KEY (usuario_postulado_id)
          REFERENCES USUARIO(usuario_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_solicitud_revisor
          FOREIGN KEY (revisado_por)
          REFERENCES USUARIO(usuario_id)
          ON DELETE SET NULL
          ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `
  );

  await ejecutarConsulta(
    db,
    `
      CREATE TABLE IF NOT EXISTS NOTIFICACION_USUARIO (
        notificacion_id INT NOT NULL AUTO_INCREMENT,
        usuario_id INT NOT NULL,
        notificacion_titulo VARCHAR(120) NOT NULL,
        notificacion_mensaje VARCHAR(255) NOT NULL,
        notificacion_tipo VARCHAR(45) NOT NULL,
        referencia_id INT NULL,
        leida BOOLEAN NOT NULL DEFAULT 0,
        fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (notificacion_id),
        CONSTRAINT fk_notificacion_usuario
          FOREIGN KEY (usuario_id)
          REFERENCES USUARIO(usuario_id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `
  );

  affiliateSchemaReady = true;
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

function getPlanLimit(planName) {
  const normalized = normalizarTexto(planName);

  if (normalized.includes("basic")) return 3;
  if (normalized.includes("basico")) return 3;
  if (normalized.includes("estandar")) return 5;
  if (normalized.includes("standard")) return 5;
  if (normalized.includes("premium")) return 8;
  if (normalized.includes("vip")) return Number.POSITIVE_INFINITY;

  return 0;
}

function getPlanBenefits(planName) {
  const normalized = normalizarTexto(planName);

  if (normalized.includes("basic") || normalized.includes("basico")) {
    return [
      "Hasta 3 afiliados protegidos bajo el mismo contrato.",
      "Cobertura esencial con velacion, traslado y preparacion.",
      "Seguimiento administrativo centralizado para el grupo familiar.",
    ];
  }

  if (normalized.includes("estandar")) {
    return [
      "Hasta 5 afiliados con una cobertura familiar ampliada.",
      "Beneficios del plan basico mas acompanamiento adicional.",
      "Mayor capacidad para organizar beneficiarios del hogar.",
    ];
  }

  if (normalized.includes("premium")) {
    return [
      "Hasta 8 afiliados con prioridad en gestion y acompanamiento.",
      "Cobertura ampliada para familias grandes.",
      "Atencion preferente en validacion y seguimiento del plan.",
    ];
  }

  if (normalized.includes("vip")) {
    return [
      "Cobertura VIP con cupos personalizados segun validacion administrativa.",
      "Prioridad alta para gestionar nuevas afiliaciones.",
      "Beneficios preferenciales y acompanamiento reforzado.",
    ];
  }

  return ["Beneficios del plan disponibles segun la configuracion del contrato."];
}

async function obtenerRolAfiliadoId() {
  const roles = await ejecutarConsulta(
    db,
    `
      SELECT rol_id, rol_nombre
      FROM ROL
    `
  );

  const role = roles.find((item) => normalizarTexto(item.rol_nombre) === "afiliado");
  return role ? role.rol_id : null;
}

async function obtenerPanelTitular(usuarioId) {
  const contratos = await ejecutarConsulta(
    db,
    `
      SELECT
        c.contrato_id,
        c.contrato_valor,
        cp.plan_id,
        p.plan_nombre,
        p.plan_descripcion
      FROM CONTRATO c
      INNER JOIN CONTRATO_PLAN cp ON cp.contrato_id = c.contrato_id
      INNER JOIN PLAN_FUNEBRE p ON p.plan_id = cp.plan_id
      WHERE c.cliente_id = ? AND c.contrato_estado = 1
      ORDER BY c.contrato_id DESC
      LIMIT 1
    `,
    [usuarioId]
  );

  if (contratos.length === 0) {
    return null;
  }

  const contrato = contratos[0];
  const approvedAffiliates = await ejecutarConsulta(
    db,
    `
      SELECT
        a.afiliado_id,
        u.usuario_primer_nombre,
        u.usuario_segundo_nombre,
        u.usuario_primer_apellido,
        u.usuario_segundo_apellido,
        s.parentesco,
        s.fecha_revision
      FROM AFILIADO a
      INNER JOIN USUARIO u ON u.usuario_id = a.afiliado_id
      LEFT JOIN AFILIACION_SOLICITUD s
        ON s.usuario_postulado_id = a.afiliado_id
       AND s.contrato_id = a.contrato_id
       AND s.estado = 'aprobada'
      WHERE a.contrato_id = ?
      ORDER BY u.usuario_primer_nombre, u.usuario_primer_apellido
    `,
    [contrato.contrato_id]
  );

  const pendingRequests = await ejecutarConsulta(
    db,
    `
      SELECT
        solicitud_id,
        usuario_postulado_id,
        parentesco,
        observacion,
        estado,
        fecha_solicitud,
        u.usuario_primer_nombre,
        u.usuario_segundo_nombre,
        u.usuario_primer_apellido,
        u.usuario_segundo_apellido,
        u.usuario_correo
      FROM AFILIACION_SOLICITUD s
      INNER JOIN USUARIO u ON u.usuario_id = s.usuario_postulado_id
      WHERE s.titular_id = ? AND s.contrato_id = ? AND s.estado = 'pendiente'
      ORDER BY s.fecha_solicitud DESC
    `,
    [usuarioId, contrato.contrato_id]
  );

  const notifications = await ejecutarConsulta(
    db,
    `
      SELECT
        notificacion_id,
        notificacion_titulo,
        notificacion_mensaje,
        notificacion_tipo,
        leida,
        fecha_creacion
      FROM NOTIFICACION_USUARIO
      WHERE usuario_id = ?
      ORDER BY fecha_creacion DESC
      LIMIT 8
    `,
    [usuarioId]
  );

  const limit = getPlanLimit(contrato.plan_nombre);
  const used = approvedAffiliates.length + pendingRequests.length;

  return {
    contrato_id: contrato.contrato_id,
    plan_id: contrato.plan_id,
    plan_nombre: contrato.plan_nombre,
    plan_descripcion: contrato.plan_descripcion,
    contrato_valor: contrato.contrato_valor,
    limite_afiliados: Number.isFinite(limit) ? limit : null,
    limite_etiqueta: Number.isFinite(limit) ? `${limit}` : "Personalizado VIP",
    cupos_usados: used,
    cupos_disponibles: Number.isFinite(limit) ? Math.max(limit - used, 0) : null,
    beneficios: getPlanBenefits(contrato.plan_nombre),
    afiliados_aprobados: approvedAffiliates,
    solicitudes_pendientes: pendingRequests,
    notificaciones: notifications,
  };
}

async function obtenerPanelAfiliado(usuarioId) {
  const affiliations = await ejecutarConsulta(
    db,
    `
      SELECT
        a.contrato_id,
        c.cliente_id AS titular_id,
        cp.plan_id,
        p.plan_nombre,
        p.plan_descripcion,
        tu.usuario_primer_nombre AS titular_primer_nombre,
        tu.usuario_primer_apellido AS titular_primer_apellido,
        s.fecha_revision
      FROM AFILIADO a
      INNER JOIN CONTRATO c ON c.contrato_id = a.contrato_id
      INNER JOIN CONTRATO_PLAN cp ON cp.contrato_id = c.contrato_id
      INNER JOIN PLAN_FUNEBRE p ON p.plan_id = cp.plan_id
      INNER JOIN USUARIO tu ON tu.usuario_id = c.cliente_id
      LEFT JOIN AFILIACION_SOLICITUD s
        ON s.usuario_postulado_id = a.afiliado_id
       AND s.contrato_id = a.contrato_id
       AND s.estado = 'aprobada'
      WHERE a.afiliado_id = ?
      ORDER BY a.contrato_id DESC
      LIMIT 1
    `,
    [usuarioId]
  );

  if (affiliations.length === 0) {
    return null;
  }

  const affiliation = affiliations[0];
  const notifications = await ejecutarConsulta(
    db,
    `
      SELECT
        notificacion_id,
        notificacion_titulo,
        notificacion_mensaje,
        notificacion_tipo,
        leida,
        fecha_creacion
      FROM NOTIFICACION_USUARIO
      WHERE usuario_id = ?
      ORDER BY fecha_creacion DESC
      LIMIT 8
    `,
    [usuarioId]
  );

  return {
    contrato_id: affiliation.contrato_id,
    plan_id: affiliation.plan_id,
    plan_nombre: affiliation.plan_nombre,
    plan_descripcion: affiliation.plan_descripcion,
    titular_nombre: [affiliation.titular_primer_nombre, affiliation.titular_primer_apellido].filter(Boolean).join(" "),
    fecha_aprobacion: affiliation.fecha_revision || null,
    beneficios: getPlanBenefits(affiliation.plan_nombre),
    notificaciones: notifications,
  };
}

exports.getAffiliateDashboard = async (req, res) => {
  const usuarioId = req.user?.usuario_id;
  const role = req.user?.role;

  if (!usuarioId) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado.",
    });
  }

  try {
    await ensureAffiliateSchema();
    const titularPanel = await obtenerPanelTitular(usuarioId);
    const afiliadoPanel = await obtenerPanelAfiliado(usuarioId);

    return res.json({
      success: true,
      data: {
        role,
        is_titular: Boolean(titularPanel),
        is_afiliado: Boolean(afiliadoPanel),
        titular_panel: titularPanel,
        afiliado_panel: afiliadoPanel,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No pudimos cargar la informacion de tus afiliados en este momento.",
      error,
    });
  }
};

exports.searchAffiliateCandidates = async (req, res) => {
  const usuarioId = req.user?.usuario_id;
  const search = String(req.query.q || "").trim();

  if (!usuarioId) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado.",
    });
  }

  if (!/^\d{3,}$/.test(search)) {
    return res.json({
      success: true,
      data: [],
    });
  }

  try {
    await ensureAffiliateSchema();
    const titularPanel = await obtenerPanelTitular(usuarioId);

    if (!titularPanel) {
      return res.status(403).json({
        success: false,
        message: "Necesitas tener un plan activo para solicitar afiliados.",
      });
    }

    const rows = await ejecutarConsulta(
      db,
      `
        SELECT DISTINCT
          u.usuario_id,
          u.usuario_primer_nombre,
          u.usuario_segundo_nombre,
          u.usuario_primer_apellido,
          u.usuario_segundo_apellido,
          u.usuario_documento,
          u.usuario_correo
        FROM USUARIO u
        INNER JOIN ROL_USUARIO ru ON ru.usuario_id = u.usuario_id AND ru.estado_cred = 1
        INNER JOIN ROL r ON r.rol_id = ru.rol_id
        WHERE u.usuario_id <> ?
          AND LOWER(r.rol_nombre) NOT IN ('administrador', 'asesor')
          AND CAST(u.usuario_documento AS CHAR) LIKE ?
        ORDER BY u.usuario_primer_nombre, u.usuario_primer_apellido
        LIMIT 12
      `,
      [usuarioId, `%${search}%`]
    );

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No pudimos buscar usuarios en este momento.",
      error,
    });
  }
};

exports.requestAffiliate = async (req, res) => {
  const usuarioId = req.user?.usuario_id;
  const { usuario_postulado_id, parentesco, observacion } = req.body;

  if (!usuarioId) {
    return res.status(401).json({
      success: false,
      message: "Tu sesion ha finalizado. Ingresa nuevamente para continuar.",
    });
  }

  if (!usuario_postulado_id || !parentesco) {
    return res.status(400).json({
      success: false,
      message: "Selecciona la persona y el parentesco para continuar.",
    });
  }

  try {
    await ensureAffiliateSchema();
    const titularPanel = await obtenerPanelTitular(usuarioId);

    if (!titularPanel) {
      return res.status(403).json({
        success: false,
        message: "Necesitas tener un plan activo para solicitar una afiliacion.",
      });
    }

    if (Number(usuario_postulado_id) === Number(usuarioId)) {
      return res.status(400).json({
        success: false,
        message: "No puedes agregarte como afiliado desde esta opcion.",
      });
    }

    const limit = getPlanLimit(titularPanel.plan_nombre);
    if (Number.isFinite(limit) && titularPanel.cupos_usados >= limit) {
      return res.status(400).json({
        success: false,
        message: `Tu plan ${titularPanel.plan_nombre} ya completo el numero maximo de afiliados permitidos.`,
      });
    }

    const existingApproved = await ejecutarConsulta(
      db,
      `
        SELECT afiliado_id
        FROM AFILIADO
        WHERE afiliado_id = ? AND contrato_id = ?
        LIMIT 1
      `,
      [usuario_postulado_id, titularPanel.contrato_id]
    );

    if (existingApproved.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Esta persona ya aparece como afiliada en tu plan.",
      });
    }

    const existingPending = await ejecutarConsulta(
      db,
      `
        SELECT solicitud_id
        FROM AFILIACION_SOLICITUD
        WHERE usuario_postulado_id = ? AND contrato_id = ? AND estado = 'pendiente'
        LIMIT 1
      `,
      [usuario_postulado_id, titularPanel.contrato_id]
    );

    if (existingPending.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ya tienes una solicitud pendiente para esta persona.",
      });
    }

    const candidateRows = await ejecutarConsulta(
      db,
      `
        SELECT usuario_id, usuario_primer_nombre, usuario_primer_apellido
        FROM USUARIO
        WHERE usuario_id = ?
        LIMIT 1
      `,
      [usuario_postulado_id]
    );

    if (candidateRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No encontramos un usuario registrado con ese documento.",
      });
    }

    await iniciarTransaccion(db);

    try {
      const requestResult = await ejecutarConsulta(
        db,
        `
          INSERT INTO AFILIACION_SOLICITUD (
            contrato_id,
            titular_id,
            usuario_postulado_id,
            parentesco,
            observacion,
            estado,
            fecha_solicitud
          )
          VALUES (?, ?, ?, ?, ?, 'pendiente', NOW())
        `,
        [titularPanel.contrato_id, usuarioId, usuario_postulado_id, parentesco, observacion || null]
      );

      const title = "Solicitud de afiliacion pendiente";
      const message = `${candidateRows[0].usuario_primer_nombre} ${candidateRows[0].usuario_primer_apellido} fue postulado como afiliado del plan ${titularPanel.plan_nombre}.`;

      const reviewers = await ejecutarConsulta(
        db,
        `
          SELECT DISTINCT ru.usuario_id
          FROM ROL_USUARIO ru
          INNER JOIN ROL r ON r.rol_id = ru.rol_id
          WHERE ru.estado_cred = 1
            AND LOWER(r.rol_nombre) IN ('administrador', 'asesor')
        `
      );

      for (const reviewer of reviewers) {
        await ejecutarConsulta(
          db,
          `
            INSERT INTO NOTIFICACION_USUARIO (
              usuario_id,
              notificacion_titulo,
              notificacion_mensaje,
              notificacion_tipo,
              referencia_id,
              leida,
              fecha_creacion
            )
            VALUES (?, ?, ?, 'afiliacion_pendiente', ?, 0, NOW())
          `,
          [reviewer.usuario_id, title, message, requestResult.insertId]
        );
      }

      await confirmarTransaccion(db);

      return res.status(201).json({
        success: true,
        message: "La solicitud fue enviada correctamente. Te avisaremos cuando sea revisada.",
      });
    } catch (transactionError) {
      await revertirTransaccion(db);
      throw transactionError;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No pudimos guardar la solicitud de afiliacion. Intenta nuevamente.",
      error,
    });
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  const usuarioId = req.user?.usuario_id;

  if (!usuarioId) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado.",
    });
  }

  try {
    await ensureAffiliateSchema();
    await ejecutarConsulta(
      db,
      `
        UPDATE NOTIFICACION_USUARIO
        SET leida = 1
        WHERE usuario_id = ? AND leida = 0
      `,
      [usuarioId]
    );

    return res.json({
      success: true,
      message: "Tus notificaciones fueron actualizadas.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No pudimos actualizar tus notificaciones en este momento.",
      error,
    });
  }
};

exports.getAffiliateRequestsForReview = async (req, res) => {
  try {
    await ensureAffiliateSchema();
    const requests = await ejecutarConsulta(
      db,
      `
        SELECT
          s.solicitud_id,
          s.contrato_id,
          s.titular_id,
          s.usuario_postulado_id,
          s.parentesco,
          s.observacion,
          s.estado,
          s.fecha_solicitud,
          p.plan_nombre,
          tu.usuario_primer_nombre AS titular_primer_nombre,
          tu.usuario_primer_apellido AS titular_primer_apellido,
          pu.usuario_primer_nombre AS postulado_primer_nombre,
          pu.usuario_primer_apellido AS postulado_primer_apellido,
          pu.usuario_correo AS postulado_correo
        FROM AFILIACION_SOLICITUD s
        INNER JOIN CONTRATO_PLAN cp ON cp.contrato_id = s.contrato_id
        INNER JOIN PLAN_FUNEBRE p ON p.plan_id = cp.plan_id
        INNER JOIN USUARIO tu ON tu.usuario_id = s.titular_id
        INNER JOIN USUARIO pu ON pu.usuario_id = s.usuario_postulado_id
        WHERE s.estado = 'pendiente'
        ORDER BY s.fecha_solicitud DESC
      `
    );

    return res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No pudimos cargar las solicitudes de afiliacion.",
      error,
    });
  }
};

exports.reviewAffiliateRequest = async (req, res) => {
  const reviewerId = req.user?.usuario_id;
  const solicitudId = req.params.id;
  const { decision, motivo_revision } = req.body;

  if (!reviewerId) {
    return res.status(401).json({
      success: false,
      message: "Usuario no autenticado.",
    });
  }

  if (!["aprobar", "rechazar"].includes(decision)) {
    return res.status(400).json({
      success: false,
      message: "La solicitud debe aprobarse o rechazarse.",
    });
  }

  try {
    await ensureAffiliateSchema();
    const requests = await ejecutarConsulta(
      db,
      `
        SELECT *
        FROM AFILIACION_SOLICITUD
        WHERE solicitud_id = ? AND estado = 'pendiente'
        LIMIT 1
      `,
      [solicitudId]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "La solicitud ya no esta disponible para revision.",
      });
    }

    const request = requests[0];

    await iniciarTransaccion(db);

    try {
      await ejecutarConsulta(
        db,
        `
          UPDATE AFILIACION_SOLICITUD
          SET
            estado = ?,
            revisado_por = ?,
            fecha_revision = NOW(),
            motivo_revision = ?
          WHERE solicitud_id = ?
        `,
        [decision === "aprobar" ? "aprobada" : "rechazada", reviewerId, motivo_revision || null, solicitudId]
      );

      if (decision === "aprobar") {
        const existingAffiliate = await ejecutarConsulta(
          db,
          `
            SELECT afiliado_id
            FROM AFILIADO
            WHERE afiliado_id = ? AND contrato_id = ?
            LIMIT 1
          `,
          [request.usuario_postulado_id, request.contrato_id]
        );

        if (existingAffiliate.length === 0) {
          await ejecutarConsulta(
            db,
            `
              INSERT INTO AFILIADO (afiliado_id, contrato_id)
              VALUES (?, ?)
            `,
            [request.usuario_postulado_id, request.contrato_id]
          );
        }

        const affiliateRoleId = await obtenerRolAfiliadoId();
        if (affiliateRoleId) {
          const existingRole = await ejecutarConsulta(
            db,
            `
              SELECT cred_id
              FROM ROL_USUARIO
              WHERE usuario_id = ? AND rol_id = ?
              LIMIT 1
            `,
            [request.usuario_postulado_id, affiliateRoleId]
          );

          if (existingRole.length === 0) {
            await ejecutarConsulta(
              db,
              `
                INSERT INTO ROL_USUARIO (rol_id, usuario_id, estado_cred)
                VALUES (?, ?, 1)
              `,
              [affiliateRoleId, request.usuario_postulado_id]
            );
          } else {
            await ejecutarConsulta(
              db,
              `
                UPDATE ROL_USUARIO
                SET estado_cred = 1
                WHERE cred_id = ?
              `,
              [existingRole[0].cred_id]
            );
          }
        }
      }

      const titleForTitular = decision === "aprobar" ? "Afiliacion aprobada" : "Afiliacion no aprobada";
      const titleForAffiliate = decision === "aprobar" ? "Ya eres afiliado" : "Solicitud no aprobada";
      const messageForTitular =
        decision === "aprobar"
          ? "Tu solicitud fue aprobada y la persona ya quedo vinculada a tu plan."
          : `Tu solicitud no fue aprobada.${motivo_revision ? ` Motivo: ${motivo_revision}` : ""}`;
      const messageForAffiliate =
        decision === "aprobar"
          ? "Tu afiliacion fue aprobada. Ya puedes consultar tus beneficios en el panel."
          : `La solicitud para vincularte al plan no fue aprobada.${motivo_revision ? ` Motivo: ${motivo_revision}` : ""}`;

      await ejecutarConsulta(
        db,
        `
          INSERT INTO NOTIFICACION_USUARIO (
            usuario_id,
            notificacion_titulo,
            notificacion_mensaje,
            notificacion_tipo,
            referencia_id,
            leida,
            fecha_creacion
          )
          VALUES
            (?, ?, ?, 'afiliacion_resultado', ?, 0, NOW()),
            (?, ?, ?, 'afiliacion_resultado', ?, 0, NOW())
        `,
        [
          request.titular_id,
          titleForTitular,
          messageForTitular,
          solicitudId,
          request.usuario_postulado_id,
          titleForAffiliate,
          messageForAffiliate,
          solicitudId,
        ]
      );

      await confirmarTransaccion(db);

      return res.json({
        success: true,
        message: decision === "aprobar" ? "La solicitud fue aprobada correctamente." : "La solicitud fue rechazada correctamente.",
      });
    } catch (transactionError) {
      await revertirTransaccion(db);
      throw transactionError;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No pudimos procesar la solicitud de afiliacion.",
      error,
    });
  }
};
