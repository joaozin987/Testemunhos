require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const axios = require('axios');
const upload = require('./upload.js'); 
const cookieParser = require('cookie-parser');
const app = express();

const whitelist = [
  'http://localhost:5173',
  'https://conectados-pela-fe.onrender.com',
  'https://www.conectados-pela-fe.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Origin da request:", origin);
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.error("CORS bloqueado para:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const isProduction = process.env.NODE_ENV === 'production';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

  const autenticarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Token de autenticação não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  if (!email.endsWith('@gmail.com')) return res.status(400).json({ error: 'Cadastro permitido apenas para e-mails do Gmail.' });
  try {
    const validationUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.EMAIL_VALIDATION_API_KEY}&email=${email}`;
    const validationResult = await axios.get(validationUrl);
    if (!validationResult.data.is_smtp_valid.value) return res.status(400).json({ error: 'Esta conta de e-mail do Gmail não é válida.' });
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const newUser = await pool.query('INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email', [nome, email, senhaHash]);
    console.log('Novo usuário registrado:', newUser.rows[0]);
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'O e-mail informado já foi cadastrado.' });
    console.error('Erro inesperado no registro:', error);
    res.status(500).json({ error: 'Ocorreu um erro inesperado ao registrar.' });
  }
});


app.use(cookieParser());

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });

  try {
    const userResult = await pool.query('SELECT id, nome, senha_hash FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) return res.status(401).json({ error: 'Email ou senha incorretos.' });

    const token = jwt.sign({ id: user.id, nome: user.nome }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none', 
      maxAge: 3600000
    });

    console.log('Login bem-sucedido para usuário:', email);
    res.json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    console.error('Erro crítico no login:', error);
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

const frontendURL = 'https://conectados-pela-fe.onrender.com';

app.post('/solicitar-recuperacao', async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length > 0) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000);
      await pool.query('UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE email = $3', [token, expires, email]);
      const resetLink = `${frontendURL}/redefinir-senha/${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Redefinição de Senha - Conectados pela Fé',
        html: `<p>Você solicitou a redefinição da sua senha. Clique no link a seguir: <a href="${resetLink}">${resetLink}</a></p><p>Este link expirará em 1 hora.</p>`
      });
      console.log('Email de recuperação enviado para:', email);
    }
    res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição foi enviado.' });
  } catch (error) {
    console.error('Erro em /solicitar-recuperacao:', error);
    res.status(500).json({ error: 'Erro interno ao processar a solicitação.' });
  }
});

app.post('/redefinir-senha', async (req, res) => {
  const { token, senha } = req.body;
  if (!token || !senha) return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
  try {
    const userResult = await pool.query('SELECT id FROM usuarios WHERE reset_token = $1 AND reset_token_expires > NOW()', [token]);
    if (userResult.rows.length === 0) return res.status(400).json({ error: 'Token inválido ou expirado.' });
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    await pool.query('UPDATE usuarios SET senha_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2', [senhaHash, userResult.rows[0].id]);
    console.log('Senha redefinida com sucesso para usuário ID:', userResult.rows[0].id);
    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro em /redefinir-senha:', error);
    res.status(500).json({ error: 'Erro interno ao redefinir a senha.' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'none' });
  res.json({ message: 'Logout realizado com sucesso.' });
});


app.get('/perfil', autenticarToken, async (req, res) => {
  try {
    const perfilResult = await pool.query('SELECT id, nome, email, foto_perfil_url, bio, versiculo_favorito, cidade FROM usuarios WHERE id = $1', [req.user.id]);
    if (perfilResult.rows.length === 0) return res.status(404).json({ error: 'Perfil de usuário não encontrado.' });
    res.json(perfilResult.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno ao buscar dados do perfil.' });
  }
});

app.put('/perfil', autenticarToken, async (req, res) => {
  try {
    const { nome, bio, versiculo_favorito, cidade } = req.body;
    if (!nome || nome.trim() === '') return res.status(400).json({ error: 'O campo nome é obrigatório.' });
    const fields = [];
    const values = [];
    let idx = 1;
    if (nome !== undefined) { fields.push(`nome = $${idx++}`); values.push(nome); }
    if (bio !== undefined) { fields.push(`bio = $${idx++}`); values.push(bio); }
    if (versiculo_favorito !== undefined) { fields.push(`versiculo_favorito = $${idx++}`); values.push(versiculo_favorito); }
    if (cidade !== undefined) { fields.push(`cidade = $${idx++}`); values.push(cidade); }
    values.push(req.user.id);
    const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, nome, email, foto_perfil_url, bio, versiculo_favorito, cidade`;
    const result = await pool.query(query, values);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuário não encontrado para atualizar.' });
    console.log('Perfil atualizado com sucesso:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro crítico no PUT /perfil:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
  }
});

app.use('/upload', autenticarToken, upload.single('experienceImage'));
app.get('/depoimentos', async (req, res) => { /* lógica */ });
app.delete('/depoimentos/:id', autenticarToken, async (req, res) => { /* lógica */ });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});

module.exports = app;
