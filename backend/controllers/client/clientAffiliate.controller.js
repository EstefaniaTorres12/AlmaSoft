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

function normalizarTexto(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function getPlanLimit(planName) {
  const normalized = normalizarTexto(planName);
  if (normalized.includes("basic") || normalized.includes("basico")) return 3;
  if (normalized.includes("estandar") || normalized.includes("standard")) return 5;
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
      FROM contrato c
      INNER JOIN contrato_plan cp ON cp.contrato_id = c.contrato_id
      INNER JOIN plan_funebre p ON p.plan_id = cp.plan_id
      WHERE c.cliente_id = ? AND c.contrato_estado = 1
      ORDER BY c.contrato_id DESC
      LIMIT 1
    `,
    [usuarioId]
  );

  if (contratos.length === 0) return null;

  const contrato = contratos[0];

  const approvedAffiliates = await ejecutarConsulta(
    db,
    `
      SELECT
        a.afiliado_id,
        u.usuario_primer_nombre,
        u.usuario_segundo_nombre,
        u.usuario_primer_apellido,
        u.usuario_segundo_apellido
      FROM afiliado a
      INNER JOIN usuario u ON u.usuario_id = a.afiliado_id
      WHERE a.contrato_id = ?
      ORDER BY u.usuario_primer_nombre, u.usuario_primer_apellido
    `,
    [contrato.contrato_id]
  );

  const limit = getPlanLimit(contrato.plan_nombre);
  const used = approvedAffiliates.length;

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
    solicitudes_pendientes: [],
    notificaciones: [],
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
        tu.usuario_primer_apellido AS titular_primer_apellido
      FROM afiliado a
      INNER JOIN contrato c ON c.contrato_id = a.contrato_id
      INNER JOIN contrato_plan cp ON cp.contrato_id = c.contrato_id
      INNER JOIN plan_funebre p ON p.plan_id = cp.plan_id
      INNER JOIN usuario tu ON tu.usuario_id = c.cliente_id
      WHERE a.afiliado_id = ? AND c.contrato_estado = 1
      ORDER BY a.contrato_id DESC
      LIMIT 1
    `,
    [usuarioId]
  );

  if (affiliations.length === 0) return null;

  const affiliation = affiliations[0];

  return {
    contrato_id: affiliation.contrato_id,
    plan_id: affiliation.plan_id,
    plan_nombre: affiliation.plan_nombre,
    plan_descripcion: affiliation.plan_descripcion,
    titular_nombre: [affiliation.titular_primer_nombre, affiliation.titular_primer_apellido]
      .filter(Boolean)
      .join(" "),
    fecha_aprobacion: null,
    beneficios: getPlanBenefits(affiliation.plan_nombre),
    notificaciones: [],
  };
}

exports.getAffiliateDashboard = async (req, res) => {
  const usuarioId = req.user?.usuario_id;
  const role = req.user?.role;

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Usuario no autenticado." });
  }

  try {
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
    return res.status(401).json({ success: false, message: "Usuario no autenticado." });
  }

  if (!/^\d{3,}$/.test(search)) {
    return res.json({ success: true, data: [] });
  }

  try {
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
        FROM usuario u
        INNER JOIN rol_usuario ru ON ru.usuario_id = u.usuario_id AND ru.estado_cred = 1
        INNER JOIN rol r ON r.rol_id = ru.rol_id
        WHERE u.usuario_id <> ?
          AND LOWER(r.rol_nombre) NOT IN ('administrador', 'asesor')
          AND CAST(u.usuario_documento AS CHAR) LIKE ?
        ORDER BY u.usuario_primer_nombre, u.usuario_primer_apellido
        LIMIT 12
      `,
      [usuarioId, `%${search}%`]
    );

    return res.json({ success: true, data: rows });
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

    const existingAffiliate = await ejecutarConsulta(
      db,
      `SELECT afiliado_id FROM afiliado WHERE afiliado_id = ? AND contrato_id = ? LIMIT 1`,
      [usuario_postulado_id, titularPanel.contrato_id]
    );

    if (existingAffiliate.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Esta persona ya aparece como afiliada en tu plan.",
      });
    }

    const candidateRows = await ejecutarConsulta(
      db,
      `SELECT usuario_id FROM usuario WHERE usuario_id = ? LIMIT 1`,
      [usuario_postulado_id]
    );

    if (candidateRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No encontramos un usuario registrado con ese documento.",
      });
    }

    await ejecutarConsulta(
      db,
      `INSERT INTO afiliado (afiliado_id, contrato_id) VALUES (?, ?)`,
      [usuario_postulado_id, titularPanel.contrato_id]
    );

    return res.status(201).json({
      success: true,
      message: "La persona fue vinculada correctamente como afiliada a tu plan.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No pudimos guardar la afiliacion. Intenta nuevamente.",
      error,
    });
  }
};

exports.removeAffiliate = async (req, res) => {
  const usuarioId = req.user?.usuario_id;
  const afiliadoId = req.params.id;

  if (!usuarioId) {
    return res.status(401).json({ success: false, message: "Usuario no autenticado." });
  }

  try {
    const titularPanel = await obtenerPanelTitular(usuarioId);
    if (!titularPanel) {
      return res.status(403).json({ success: false, message: "No tienes un contrato activo." });
    }

    const existing = await ejecutarConsulta(
      db,
      `SELECT afiliado_id FROM afiliado WHERE afiliado_id = ? AND contrato_id = ? LIMIT 1`,
      [afiliadoId, titularPanel.contrato_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Este afiliado no pertenece a tu contrato." });
    }

    await ejecutarConsulta(
      db,
      `DELETE FROM afiliado WHERE afiliado_id = ? AND contrato_id = ?`,
      [afiliadoId, titularPanel.contrato_id]
    );

    return res.json({ success: true, message: "Afiliado eliminado correctamente." });
  } catch (error) {
    return res.status(500).json({ success: false, message: "No pudimos eliminar el afiliado." });
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  return res.json({ success: true, message: "Tus notificaciones fueron actualizadas." });
};

exports.getAffiliateRequestsForReview = async (req, res) => {
  return res.json({ success: true, data: [] });
};

exports.reviewAffiliateRequest = async (req, res) => {
  return res.status(404).json({
    success: false,
    message: "No hay solicitudes pendientes para revisar.",
  });
};
