const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const open = require('open');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURAÇÃO DO UPLOAD LOCAL ---

// 1. Define o local de armazenamento das imagens
const storage = multer.diskStorage({
  // A pasta de destino para salvar os arquivos
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Salva na pasta 'uploads/'
  },
  // Define como o nome do arquivo será gerado para evitar nomes duplicados
  filename: function (req, file, cb) {
    // Usa a data atual como carimbo de tempo + a extensão original do arquivo
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// 2. Inicializa o Multer com a configuração de armazenamento em disco
const upload = multer({ storage: storage });

// 3. Torna a pasta 'uploads' publicamente acessível para o navegador poder exibir as imagens
// A rota '/uploads' no navegador vai corresponder à pasta 'uploads' no seu projeto.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir arquivos estáticos do frontend (pasta 'public')
app.use(express.static(path.join(__dirname, '..', 'public')));


// Conexão PostgreSQL (nenhuma mudança aqui)
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Rota inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// --- ROTA DE UPLOAD MODIFICADA ---
app.post('/upload', upload.single('experienceImage'), async (req, res) => {
  const { userName, userAge, userMovement, experienceText } = req.body;

  if (!req.file) {
    return res.status(400).json({ status: 'error', error: 'Imagem não enviada' });
  }

  // 4. Constrói a URL da imagem salva localmente
  const imageUrl = `/uploads/${req.file.filename}`; // Ex: /uploads/1678886400000.jpg

  try {
    const result = await pool.query(
      `INSERT INTO depoimentos (nome, idade, movimento, imagem, experiencia) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userName, userAge, userMovement, imageUrl, experienceText]
    );

    const insertedId = result.rows[0].id;

    // Retorna o caminho local da imagem para o frontend
    res.json({ status: 'ok', id: insertedId, image: imageUrl });
  } catch (error) {
    console.error('Erro no INSERT:', error);
    res.status(500).json({ status: 'error', error: 'Erro ao salvar experiência' });
  }
});

// Listar depoimentos (nenhuma mudança aqui)
app.get('/depoimentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM depoimentos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro no SELECT:', error);
    res.status(500).json({ status: 'error', error: 'Erro ao listar depoimentos' });
  }
});

// Excluir depoimento (nenhuma mudança aqui)
app.delete('/depoimentos/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }
  try {
    const result = await pool.query('DELETE FROM depoimentos WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Experiência não encontrada' });
    }
    res.status(200).json({ success: true, message: 'Experiência excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir a experiência:', error);
    res.status(500).json({ success: false, message: 'Erro ao excluir a experiência' });
  }
});

const PORT = process.env.PORT || 3000;
const localUrl = `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Servidor rodando em: ${localUrl}`);
  open(localUrl);
});
