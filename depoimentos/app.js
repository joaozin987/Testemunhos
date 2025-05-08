const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// Configuração do app
const app = express();
const port = 3000;

// Permitir o CORS (caso seu frontend esteja em outro domínio ou porta)
app.use(cors());

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
  },
});

const upload = multer({ storage });

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Rota para upload de imagem
app.post('/upload', upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhuma imagem foi enviada.');
  }
  res.send({ url: `/uploads/${req.file.filename}` });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
