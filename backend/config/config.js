
require('dotenv').config();
const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
db.connected = false;

db.connect(function (err) {
    if (err) {
        console.error('No se pudo conectar a la base de datos:', err.message || err);
        // marcar como no conectada para que middleware devuelva 503 en rutas que necesitan BD
        db.connected = false;
        return;
    }
    db.connected = true;
    console.log('Base de datos conectada');
});
module.exports = db;