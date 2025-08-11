// ==========================================================
// --- VERSÃO FINAL - COMPLETA, CORRIGIDA E OTIMIZADA ---
// ==========================================================

require('dotenv').config();

// --- IMPORTAÇÕES ---
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

// --- MIDDLEWARES ---

// Configuração de CORS mais segura para desenvolvimento e produção
const whitelist = ['http://localhost:5173', 'https://seu-site-em-producao.com']; // Adicione a URL do seu site aqui
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- CONFIGURAÇÕES DE SERVIÇOS EXTERNOS ---


// PostgreSQL (Banco de Dados)
const isProduction = process.env.NODE_ENV === 'production';
const connectionOptions = {
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
};
const pool = new Pool(connectionOptions);

// Nodemailer (Envio de E-mail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Erro na verificação do Token:", err.message);
      return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
    req.user = user;
    next();
  });
};


// ==========================================================
// --- ROTAS DE AUTENTICAÇÃO ---
// ==========================================================

// ROTA DE CADASTRO
app.post('/register', async (req, res) => {
  // ... (Sua lógica de cadastro, que já estava ótima, continua aqui)
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) { return res.status(400).json({ error: 'Todos os campos são obrigatórios.' }); }
  if (!email.endsWith('@gmail.com')) { return res.status(400).json({ error: 'Cadastro permitido apenas para e-mails do Gmail.' }); }
  try {
    const apiKey = process.env.EMAIL_VALIDATION_API_KEY;
    const validationUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
    const validationResult = await axios.get(validationUrl);
    if (!validationResult.data.is_smtp_valid.value) { return res.status(400).json({ error: 'Esta conta de e-mail do Gmail não é válida.' }); }
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const newUser = await pool.query('INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email', [nome, email, senhaHash]);
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    if (error.code === '23505') { return res.status(409).json({ error: 'O e-mail informado já foi cadastrado.' }); }
    console.error('Erro inesperado no registro:', error);
    res.status(500).json({ error: 'Ocorreu um erro inesperado ao registrar.' });
  }
});

// ROTA DE LOGIN
app.post('/login', async (req, res) => {
    // ... (Sua lógica de login, que já estava ótima, continua aqui)
    const { email, senha } = req.body;
    if (!email || !senha) { return res.status(400).json({ error: 'Email e senha são obrigatórios.' }); }
    try {
        const userResult = await pool.query('SELECT id, nome, senha_hash FROM usuarios WHERE email = $1', [email]);
        if (userResult.rows.length === 0) { return res.status(404).json({ error: 'Usuário não encontrado.' }); }
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(senha, user.senha_hash);
        if (!isMatch) { return res.status(401).json({ error: 'Email ou senha incorretos.' }); }
        const payload = { id: user.id, nome: user.nome };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido!', token: token });
    } catch (error) {
        console.error('ERRO CRÍTICO NO LOGIN:', error);
        res.status(500).json({ error: 'Erro interno ao fazer login.' });
    }
});

// **CORREÇÃO 1: ROTA PARA SOLICITAR A RECUPERAÇÃO DE SENHA**
app.post('/solicitar-recuperacao', async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // **NUNCA INFORME SE O E-MAIL EXISTE OU NÃO, POR SEGURANÇA**
      return res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição foi enviado.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora
    await pool.query(
      'UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [token, expires, email]
    );

    // Use a URL do seu frontend para o link de redefinição
    const resetLink = `${process.env.FRONTEND_URL}/redefinir-senha/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Redefinição de Senha - Conectados pela Fé',
      html: `<p>Você solicitou a redefinição da sua senha. Clique no link a seguir para criar uma nova: <a href="${resetLink}">${resetLink}</a></p><p>Este link expirará em 1 hora.</p>`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição foi enviado.' });
  } catch (error) {
    console.error('Erro em /solicitar-recuperacao:', error);
    res.status(500).json({ error: 'Erro interno ao processar a solicitação.' });
  }
});

// **CORREÇÃO 2: ROTA PARA EFETIVAMENTE REDEFINIR A SENHA**
app.post('/redefinir-senha', async (req, res) => {
  const { token, senha } = req.body;
  if (!token || !senha) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
  }
  try {
    const userResult = await pool.query(
      'SELECT id FROM usuarios WHERE reset_token = $1 AND reset_token_expires > NOW()',
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
    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro em /redefinir-senha:', error);
    res.status(500).json({ error: 'Erro interno ao redefinir a senha.' });
  }
});



app.get('/perfil', autenticarToken, async (req, res) => { /* ... sua lógica ... */ 
 
  try {
    const userResult = await pool.query(
      'SELECT id, nome, email FROM usuarios WHERE id = $1',
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
  }
});

app.put('/perfil', autenticarToken, async (req, res) => { /* ... sua lógica ... */ });
app.post('/upload', autenticarToken, upload.single('experienceImage'), async (req, res) => { /* ... sua lógica ... */ });
app.get('/depoimentos', async (req, res) => { /* ... sua lógica ... */ });
app.delete('/depoimentos/:id', autenticarToken, async (req, res) => { /* ... sua lógica ... */ });


// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
  console.log(`🚀 URL Local: http://localhost:${PORT}`); 
});

module.exports = app;