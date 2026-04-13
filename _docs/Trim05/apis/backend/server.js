// backend/server.js
const express = require("express");
const bodyParser = require("body-parser");
const usuarioRoutes = require("./routes/usuarioRoutes");
const rolRoutes = require("./routes/rolRoutes");
const rolUsuarioRoutes = require("./routes/rolUsuarioRoutes");
const telefonoRoutes = require("./routes/telefonoRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const planRoutes = require("./routes/planRoutes");
const servicioPlanRoutes = require("./routes/servicioPlanRoutes");
const contratoPlanRoutes = require("./routes/contratoPlanRoutes");
const servicioRoutes = require("./routes/servicioRoutes");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/roles", rolRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/usuario_rol", rolUsuarioRoutes);
app.use("/api/telefonos", telefonoRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/planes", planRoutes);
app.use("/api/servicio_plan", servicioPlanRoutes);
app.use("/api/contrato_plan", contratoPlanRoutes);
app.use("/api/servicios", servicioRoutes);


// ruta base
app.get("/", (req, res) => {
  res.json({ message: "API Funeraria - funcionando" });
});

module.exports = app;
