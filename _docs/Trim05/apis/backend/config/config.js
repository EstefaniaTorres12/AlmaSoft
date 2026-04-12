// backend/config/config.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'BBDD_FUNERARIA_ALMASOFT',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  connectionLimit: 10,
  waitForConnections: true,
  timezone: 'Z'
});

module.exports = pool;
