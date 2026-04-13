const db = require("../../config/config");

exports.getClientPlans = (req, res) => {

  const sql = `
    SELECT 
      p.plan_id,
      p.plan_nombre,
      p.plan_precio,
      p.plan_descripcion,
      s.servicio_id,
      s.servicio_nombre

    FROM plan_funebre p

    LEFT JOIN servicio_plan sp 
      ON p.plan_id = sp.plan_id

    LEFT JOIN servicio s 
      ON sp.servicio_id = s.servicio_id

    WHERE p.plan_estado = 1
    ORDER BY p.plan_id;
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }

    const planes = {};

    rows.forEach(row => {

      if (!planes[row.plan_id]) {
        planes[row.plan_id] = {
          plan_id: row.plan_id,
          plan_nombre: row.plan_nombre,
          plan_precio: row.plan_precio,
          plan_descripcion: row.plan_descripcion,
          servicios: []
        };
      }

      if (row.servicio_id) {
        planes[row.plan_id].servicios.push({
          nombre: row.servicio_nombre
        });
      }

    });

    res.json({
      success: true,
      data: Object.values(planes)
    });

  });
};
