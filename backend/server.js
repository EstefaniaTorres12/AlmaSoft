const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const usersRoutes = require('./routes/userRoutes');
const rolRoutes = require('./routes/rolRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const subcategoriaRoutes = require('./routes/subcategoriasRoutes');
const productoRoutes = require('./routes/productoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const planFunebreRoutes = require('./routes/planFunebreRoutes');


const app = express();

// Middlewares globales
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/rol',rolRoutes);
app.use('/api/usuarios',usuarioRoutes);
app.use('/api/clientes',clienteRoutes);
app.use('/api/categorias',categoriaRoutes);
app.use('/api/subcategorias',subcategoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/planes', planFunebreRoutes);

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
