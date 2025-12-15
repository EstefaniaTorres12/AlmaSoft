const db = require('../config/config');

module.exports = (req, res, next) => {
  // Allow root and test even if DB is down
  if (req.path === '/' || req.path === '/test') return next();

  if (!db || db.connected === false) {
    return res.status(503).json({ success: false, message: 'Base de datos no disponible' });
  }

  next();
};