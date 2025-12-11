const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const rolRoutes = require("./routes/rolRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const subcategoriaRoutes = require("./routes/subcategoriasRoutes");
const productoRoutes = require("./routes/productoRoutes");
const rolUsuarioRoutes = require("./routes/rolUsuarioRoutes");
const telefonoRoutes = require("./routes/telefonoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const planRoutes = require("./routes/planRoutes");
const servicioPlanRoutes = require("./routes/servicioPlanRoutes");
const contratoPlanRoutes = require("./routes/contratoPlanRoutes");
const servicioRoutes = require("./routes/servicioRoutes");

const app = express();

// Middlewares globales
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Rutas

app.use("/api/rol", rolRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/subcategorias", subcategoriaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/usuario_rol", rolUsuarioRoutes);
app.use("/api/telefonos", telefonoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/planes", planRoutes);
app.use("/api/servicio_plan", servicioPlanRoutes);
app.use("/api/contrato_plan", contratoPlanRoutes);
app.use("/api/servicios", servicioRoutes);

// Endpoints de prueba
app.get("/", (req, res) => {
  res.send("Ruta raíz del Backend");
});

app.get("/test", (req, res) => {
  res.send("Ruta TEST");
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send(err.stack);
});

// Exportamos la app para que la use index.js
module.exports = app;
