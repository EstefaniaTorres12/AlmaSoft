const http = require('http');
const app = require('./server');

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.set('port', port);

const server = http.createServer(app);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`El puerto ${port} ya está en uso. Cualquier proceso que esté usando el puerto debe cerrarse antes de iniciar el servidor.`);
    process.exit(1);
  }
  console.error('Error del servidor:', err);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`Servidor corriendo en http://${host}:${port}`);
});