const pool = require('./config');

// Wrapper que convierte las callbacks de mysql v1 en Promises.
// Todos los modelos async deben importar { query } desde aquí
// en lugar de usar await pool.query() directamente.

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) return reject(err);
      resolve(conn);
    });
  });
}

function queryConn(conn, sql, params = []) {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

function beginTx(conn) {
  return new Promise((resolve, reject) => {
    conn.beginTransaction((err) => (err ? reject(err) : resolve()));
  });
}

function commitTx(conn) {
  return new Promise((resolve, reject) => {
    conn.commit((err) => (err ? reject(err) : resolve()));
  });
}

function rollbackTx(conn) {
  return new Promise((resolve) => conn.rollback(() => resolve()));
}

module.exports = { query, getConnection, queryConn, beginTx, commitTx, rollbackTx };
