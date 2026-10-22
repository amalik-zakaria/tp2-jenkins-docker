const http = require('node:http');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Version 2 - Deploiement via Jenkins\n');
});

server.listen(port, hostname, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
