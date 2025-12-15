const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const usersRoutes = require('./routes/userRoutes');
const rolRoutes = require('./routes/rolRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const subcategoriaRoutes = require('./routes/subcategoriasRoutes');
const productoRoutes = require('./routes/productoRoutes');
const reportesRoutes = require('./routes/RouterReportes');
const planRoutes = require('./routes/planRoutes');
const dbMiddleware = require('./middlewares/authMiddleware');

const app = express();

// Middlewares globales
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware para verificar disponibilidad de BD en rutas /api
console.log('dbMiddleware type', typeof dbMiddleware, dbMiddleware && Object.prototype.toString.call(dbMiddleware));
console.log('dbMiddleware keys:', Object.keys(dbMiddleware || {}));
app.use('/api', dbMiddleware);

// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/rol',rolRoutes);
app.use('/api/usuarios',usuarioRoutes);
app.use('/api/categorias',categoriaRoutes);
app.use('/api/subcategorias',subcategoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/planes', planRoutes);

// Endpoints de prueba
app.get('/', (req, res) => {
  res.send('Ruta raíz del Backend');
});

app.get('/test', (req, res) => {
  res.send('Ruta TEST');
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

// Exportamos la app para que la use index.js
module.exports = app;