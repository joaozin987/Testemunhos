// ==========================================================
// --- ARQUIVO COMPLETO E FINAL: app.js ---
// ==========================================================

// --- IMPORTAÇÕES ---
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const open = require('open');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // Para envio de e-mail
const crypto = require('crypto');     // Para gerar tokens seguros
require('dotenv').config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));


// --- CONFIGURAÇÃO DO CLOUDINARY ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'testemunhos',
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});
const upload = multer({ storage: storage });


// --- CONEXÃO POSTGRESQL ---
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});


// --- CONFIGURAÇÃO DO NODEMAILER (ENVIO DE E-MAIL) ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Seu e-mail (ex: seu_email@gmail.com)
    pass: process.env.EMAIL_PASS  // Sua "Senha de app" de 16 dígitos do Gmail
  }
});


// ==========================================================
// --- ROTAS DE AUTENTICAÇÃO E RECUPERAÇÃO ---
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
    if (error.code === '23505') {
      return res.status(409).json({ error: 'O Usuário informado já foi cadastrado. Tente fazer o login.' });
    }
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Ocorreu um erro inesperado ao registrar. Tente novamente.' });
  }
});

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

// ROTA PARA SOLICITAR A REDEFINIÇÃO DE SENHA
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição foi enviado.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // Token expira em 1 hora
    await pool.query(
      'UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [token, expires, email]
    );
    const resetLink = `http://localhost:3000/redefinir-senha.html?token=${token}`; // Altere para o link do seu frontend
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Redefinição de Senha - Conectados pela Fé',
      html: `<p>Você solicitou a redefinição da sua senha. Clique no link a seguir para criar uma nova: <a href="${resetLink}">${resetLink}</a></p><p>Este link expirará em 1 hora.</p>`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição foi enviado.' });
  } catch (error) {
    console.error('Erro em /forgot-password:', error);
    res.status(500).json({ error: 'Erro interno ao processar a solicitação.' });
  }
});

// ROTA PARA EFETIVAMENTE REDEFINIR A SENHA
app.post('/reset-password', async (req, res) => {
  const { token, senha } = req.body;
  if (!token || !senha) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
  }
  try {
    const userResult = await pool.query(
      'SELECT * FROM usuarios WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }
    const user = userResult.rows[0];
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    await pool.query(
      'UPDATE usuarios SET senha_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [senhaHash, user.id]
    );
    
    // ALTERAÇÃO FINAL: Redireciona para a página de login com um status de sucesso
    res.redirect('/login.html?reset=success');

  } catch (error) {
    console.error('Erro em /reset-password:', error);
    res.status(500).json({ error: 'Erro interno ao redefinir a senha.' });
  }
});


// ==========================================================
// --- ROTAS DE DEPOIMENTOS ---
// ==========================================================
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
      `INSERT INTO depoimentos (nome, idade, movimento, imagem, experiencia) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userName, userAge, userMovement, imageUrl, experienceText]
    );
    res.json({ status: 'ok', id: result.rows[0].id, image: imageUrl });
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
    // ... seu código de delete continua aqui ...
    const { id } = req.params;
    // ...
});


// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;
const localUrl = `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Servidor rodando em: ${localUrl}`);
});

