const express = require('express');
const logger  = require('morgan');
const cors    = require('cors');

// ── Rutas admin/gestión ───────────────────────────────────────────────────────
const rolRoutes          = require('./routes/rolRoutes');
const usuarioRoutes      = require('./routes/usuarioRoutes');
const clienteRoutes      = require('./routes/clienteRoutes');
const categoriaRoutes    = require('./routes/categoriaRoutes');
const subcategoriaRoutes = require('./routes/subcategoriasRoutes');
const productoRoutes     = require('./routes/productoRoutes');
const planFunebreRoutes  = require('./routes/planFunebreRoutes');
const rolUsuarioRoutes   = require('./routes/rolUsuarioRoutes');
const servicioRoutes     = require('./routes/servicioRoutes');
const servicioPlanRoutes = require('./routes/servicioPlanRoutes');
const contratoPlanRoutes = require('./routes/contratoPlanRoutes');
const telefonoRoutes     = require('./routes/telefonoRoutes');
const uploadRoutes       = require('./routes/uploadRoutes');

// ── Rutas cliente ─────────────────────────────────────────────────────────────
const clientPlanRoutes      = require('./routes/client/clientPlan.routes');
const clientContratoRoutes  = require('./routes/client/clientContrato.routes');
const clientAffiliateRoutes = require('./routes/client/clientAffiliate.routes');
const clientStoreRoutes     = require('./routes/client/clientStore.routes');

const app = express();

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(logger('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true
}));

// ── Rutas admin/gestión ───────────────────────────────────────────────────────
app.use('/api/rol',           rolRoutes);
app.use('/api/usuarios',      usuarioRoutes);
app.use('/api/clientes',      clienteRoutes);
app.use('/api/categorias',    categoriaRoutes);
app.use('/api/subcategorias', subcategoriaRoutes);
app.use('/api/productos',     productoRoutes);
app.use('/api/planes',        planFunebreRoutes);
app.use('/api/rol-usuario',   rolUsuarioRoutes);
app.use('/api/servicios',     servicioRoutes);
app.use('/api/servicio-plan', servicioPlanRoutes);
app.use('/api/contrato-plan', contratoPlanRoutes);
app.use('/api/telefonos',     telefonoRoutes);
app.use('/api/upload',        uploadRoutes);

// ── Rutas cliente ─────────────────────────────────────────────────────────────
app.use('/api/client/plans',      clientPlanRoutes);
app.use('/api/client/contrato',   clientContratoRoutes);
app.use('/api/client/affiliates', clientAffiliateRoutes);
app.use('/api/client/store',      clientStoreRoutes);

// ── Rutas de prueba ───────────────────────────────────────────────────────────
app.get('/',     (req, res) => res.send('Backend AlmaSoft activo'));
app.get('/test', (req, res) => res.send('Ruta TEST OK'));

// ── Manejador de errores global ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

module.exports = app;
