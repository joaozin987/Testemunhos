// --- IMPORTAÇÕES ---
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const open = require('open');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ... (código de configuração do cloudinary e outros) ...
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'testemunhos',
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});
const upload = multer({ storage: storage });
app.use(express.static(path.join(__dirname, '..', 'public')));
// ...

// --- CONEXÃO POSTGRESQL ---
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// ==========================================================
// --- ROTAS DE AUTENTICAÇÃO ---
// ==========================================================

// ROTA DE CADASTRO (REGISTER)
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    
    const newUser = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, senhaHash]
    );

    res.status(201).json(newUser.rows[0]);

  } catch (error) {
    // Trata o erro de email duplicado
    if (error.code === '23505') {
      // ==========================================================
      // ALTERAÇÃO AQUI: Personalize a mensagem de erro como quiser.
      // ==========================================================
      return res.status(409).json({ error: 'O Usuário informado já foi cadastrado. Tente fazer o login.' });
    }
    
    // Para outros erros, mantém a mensagem genérica
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Ocorreu um erro inesperado ao registrar. Tente novamente.' });
  }
});

// ... (resto do seu código de login e depoimentos) ...
// ROTA DE LOGIN
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const payload = { id: user.id, nome: user.nome };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login bem-sucedido!', token: token });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

// ... ROTAS DE DEPOIMENTOS ...
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
app.post('/upload', upload.single('experienceImage'), async (req, res) => {
  const { userName, userAge, userMovement, experienceText } = req.body;
  if (!req.file) {
    return res.status(400).json({ status: 'error', error: 'Imagem não enviada' });
  }
  const imageUrl = req.file.path;
  try {
    const result = await pool.query(
      `INSERT INTO depoimentos (nome, idade, movimento, imagem, experiencia) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userName, userAge, userMovement, imageUrl, experienceText]
    );
    const insertedId = result.rows[0].id;
    res.json({ status: 'ok', id: insertedId, image: imageUrl });
  } catch (error) {
    console.error('Erro no INSERT:', error);
    res.status(500).json({ status: 'error', error: 'Erro ao salvar experiência' });
  }
});
app.get('/depoimentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM depoimentos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro no SELECT:', error);
    res.status(500).json({ status: 'error', error: 'Erro ao listar depoimentos' });
  }
});
app.delete('/depoimentos/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }
  try {
    const depoimento = await pool.query('SELECT imagem FROM depoimentos WHERE id = $1', [id]);
    if (depoimento.rows.length > 0) {
      const imageUrl = depoimento.rows[0].imagem;
      const publicIdWithFolder = new URL(imageUrl).pathname.substring(1).split('.').slice(0, -1).join('.');
      const publicId = publicIdWithFolder.split('/').slice(2).join('/');
      if (publicId) {
        cloudinary.uploader.destroy(publicId);
      }
    }
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


// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;
const localUrl = `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Servidor rodando em: ${localUrl}`);
});
