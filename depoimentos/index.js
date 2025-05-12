const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testemunhos',
  password: '1240',
  port: 5432,
});

// Multer (upload de imagem)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Upload do formulário
app.post('/upload', upload.single('experienceImage'), async (req, res) => {
  const { userName, userAge, userMovement, experienceText } = req.body;
  const imagePath = `/uploads/${req.file.filename}`;

  try {
    await pool.query(
      'INSERT INTO depoimentos (nome, idade, movimento, imagem, experiencia) VALUES ($1, $2, $3, $4, $5)',
      [userName, userAge, userMovement, imagePath, experienceText]
    );
    res.json({ status: 'ok', image: imagePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err });
  }
});

// Listar depoimentos
app.get('/depoimentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM depoimentos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', error: err });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

app.delete('/depoimentos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM depoimentos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Experiência não encontrada' });
    }

    res.status(200).json({ success: true, message: 'Experiência excluída com sucesso' });
  } catch (err) {
    console.error('Erro ao excluir a experiência:', err);
    res.status(500).json({ success: false, message: 'Erro ao excluir a experiência' });
  }
});
