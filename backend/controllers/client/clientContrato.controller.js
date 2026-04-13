const db = require("../../config/config");

exports.createClientContrato = (req, res) => {
  const { cliente_id, plan_id, contrato_estado = true, contrato_valor } = req.body;

  if (!cliente_id || !plan_id) {
    return res.status(400).json({
      success: false,
      message: "cliente_id y plan_id son requeridos",
    });
  }

  const getPlanSql = `
    SELECT plan_id, plan_precio
    FROM PLAN_FUNEBRE
    WHERE plan_id = ? AND plan_estado = 1
  `;

  db.query(getPlanSql, [plan_id], (planErr, planRows) => {
    if (planErr) {
      console.error(planErr);
      return res.status(500).json({
        success: false,
        message: "Error al consultar el plan",
      });
    }

    if (!planRows.length) {
      return res.status(404).json({
        success: false,
        message: "Plan no encontrado o inactivo",
      });
    }

    const valorFinal = contrato_valor ?? planRows[0].plan_precio;

    db.beginTransaction((txErr) => {
      if (txErr) {
        console.error(txErr);
        return res.status(500).json({
          success: false,
          message: "No fue posible iniciar la transaccion",
        });
      }

      const insertContratoSql = `
        INSERT INTO CONTRATO (contrato_estado, contrato_valor, cliente_id)
        VALUES (?, ?, ?)
      `;

      db.query(
        insertContratoSql,
        [contrato_estado, valorFinal, cliente_id],
        (contratoErr, contratoResult) => {
          if (contratoErr) {
            return db.rollback(() => {
              console.error(contratoErr);
              res.status(500).json({
                success: false,
                message: "Error al crear el contrato",
              });
            });
          }

          const contrato_id = contratoResult.insertId;
          const insertContratoPlanSql = `
            INSERT INTO CONTRATO_PLAN (contrato_id, plan_id)
            VALUES (?, ?)
          `;

          db.query(
            insertContratoPlanSql,
            [contrato_id, plan_id],
            (contratoPlanErr) => {
              if (contratoPlanErr) {
                return db.rollback(() => {
                  console.error(contratoPlanErr);
                  res.status(500).json({
                    success: false,
                    message: "Error al asociar el plan al contrato",
                  });
                });
              }

              db.commit((commitErr) => {
                if (commitErr) {
                  return db.rollback(() => {
                    console.error(commitErr);
                    res.status(500).json({
                      success: false,
                      message: "Error al confirmar el contrato",
                    });
                  });
                }

                return res.status(201).json({
                  success: true,
                  message: "Contrato creado correctamente",
                  data: {
                    contrato_id,
                    cliente_id,
                    plan_id,
                    contrato_estado,
                    contrato_valor: valorFinal,
                  },
                });
              });
            }
          );
        }
      );
    });
  });
};
