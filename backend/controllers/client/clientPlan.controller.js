const db = require("../../config/config");

exports.getClientPlans = (req, res) => {
  const sql = `
    SELECT
      plan_id,
      plan_nombre,
      plan_descripcion,
      plan_precio,
      plan_estado
    FROM plan_funebre
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Error al obtener planes para cliente:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener planes"
      });
    }

    return res.status(200).json({
      success: true,
      data
    });
  });
};
