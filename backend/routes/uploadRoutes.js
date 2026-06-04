const express = require('express');
const router  = express.Router();
const upload  = require('../middlewares/uploadMiddleware');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.post(
  '/',
  verifyToken,
  authorizeRoles(['Administrador', 'Asesor']),
  upload.single('image'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo' });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  }
);

module.exports = router;
