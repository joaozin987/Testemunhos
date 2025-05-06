const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 3000;
const ROOT_DIR = path.join(__dirname, '..', 'frontend');

const server = http.createServer((req, res) => {
  // Cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // Requisições OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Roteamento simples
  const filePath = req.url === '/' ? '/home.html' : req.url;
  const fullPath = path.join(ROOT_DIR, filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404 - Arquivo não encontrado');
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
