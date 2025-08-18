require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const axios = require('axios');
const upload = require('./upload.js'); 
const app = express();

// ----------------- CORS -----------------
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
app.options('*', cors(corsOptions)); // preflight

// ----------------- Body parsers -----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------- Banco -----------------
const isProduction = process.env.NODE_ENV === 'production';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// ----------------- Email -----------------
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ----------------- Autenticação -----------------
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido ou expirado.' });
    req.user = user;
    next();
  });
};

// ----------------- Rotas -----------------

app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  if (!email.endsWith('@gmail.com')) return res.status(400).json({ error: 'Cadastro permitido apenas para Gmail.' });

  try {
    const validationUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.EMAIL_VALIDATION_API_KEY}&email=${email}`;
    const validationResult = await axios.get(validationUrl);

    if (!validationResult.data.is_smtp_valid.value) {
      return res.status(400).json({ error: 'Email inválido.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const newUser = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, senhaHash]
    );

    res.status(201).json(newUser.rows[0]);

  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'Email já cadastrado.' });
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno ao registrar.' });
  }
});

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
    res.json({ message: 'Login bem-sucedido!', token });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no login.' });
  }
});

// ----------------- Redefinição de senha -----------------
const frontendURL = 'https://conectados-pela-fe.onrender.com';

app.post('/solicitar-recuperacao', async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length > 0) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000); // 1 hora
      await pool.query('UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE email = $3', [token, expires, email]);

      const resetLink = `${frontendURL}/redefinir-senha/${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Redefinição de Senha - Conectados pela Fé',
        html: `<p>Clique aqui para redefinir a senha: <a href="${resetLink}">${resetLink}</a></p>`
      });
    }
    res.status(200).json({ message: 'Se o email existir, um link de redefinição foi enviado.' });
  } catch (error) {
    console.error('Erro em /solicitar-recuperacao:', error);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

app.post('/redefinir-senha', async (req, res) => {
  const { token, senha } = req.body;
  if (!token || !senha) return res.status(400).json({ error: 'Token e senha obrigatórios.' });

  try {
    const userResult = await pool.query('SELECT id FROM usuarios WHERE reset_token = $1 AND reset_token_expires > NOW()', [token]);
    if (userResult.rows.length === 0) return res.status(400).json({ error: 'Token inválido ou expirado.' });

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    await pool.query('UPDATE usuarios SET senha_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2', [senhaHash, userResult.rows[0].id]);

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });

  } catch (error) {
    console.error('Erro em /redefinir-senha:', error);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// ----------------- Perfil -----------------
app.get('/perfil', autenticarToken, async (req, res) => {
  try {
    const perfilResult = await pool.query(
      'SELECT id, nome, email, foto_perfil_url, bio, versiculo_favorito, cidade FROM usuarios WHERE id = $1',
      [req.user.id]
    );
    if (perfilResult.rows.length === 0) return res.status(404).json({ error: 'Perfil não encontrado.' });
    res.json(perfilResult.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

app.put('/perfil', autenticarToken, async (req, res) => {
  try {
    const { nome, bio, versiculo_favorito, cidade } = req.body;
    if (!nome || nome.trim() === '') return res.status(400).json({ error: 'Nome obrigatório.' });

    const fields = [];
    const values = [];
    let idx = 1;

    if (nome) { fields.push(`nome = $${idx++}`); values.push(nome); }
    if (bio) { fields.push(`bio = $${idx++}`); values.push(bio); }
    if (versiculo_favorito) { fields.push(`versiculo_favorito = $${idx++}`); values.push(versiculo_favorito); }
    if (cidade) { fields.push(`cidade = $${idx++}`); values.push(cidade); }

    values.push(req.user.id);
    const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rowCount === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(result.rows[0]);

  } catch (error) {
    console.error('Erro no PUT /perfil:', error);
    res.status(500).json({ error: 'Erro interno.' });
  }
});

// ----------------- Upload / Depoimentos -----------------
app.post('/upload', autenticarToken, upload.single('experienceImage'), async (req, res) => { /* lógica */ });
app.get('/depoimentos', async (req, res) => { /* lógica */ });
app.delete('/depoimentos/:id', autenticarToken, async (req, res) => { /* lógica */ });

// ----------------- Start -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});

module.exports = app;
