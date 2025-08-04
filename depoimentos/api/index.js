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
const { error } = require('console');

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

// --- CONEXÃO POSTGRESQL COM LÓGICA CONDICIONAL DE SSL ---
// Verifica se o ambiente é de produção (na Render, vamos definir NODE_ENV='production')
const isProduction = process.env.NODE_ENV === 'production';

// Monta as opções de conexão
const connectionOptions = {
  connectionString: process.env.DATABASE_URL,
  // Usa SSL em produção (Render), mas não em desenvolvimento (local)
  ssl: isProduction ? { rejectUnauthorized: false } : false
};

const pool = new Pool(connectionOptions);


// --- CONFIGURAÇÃO DO NODEMAILER (ENVIO DE E-MAIL) ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// --- ROTAS DE AUTENTICAÇÃO E RECUPERAÇÃO ---
const autenticarToken = (req,res,next) => {
  const authHeader = reqheaders['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token == null) {
    return res.sendStatus(401);
  }
  jwt.verifiy(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};


// ROTA DE CADASTRO (REGISTER)
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ error: 'Cadastro permitido apenas para e-mails do Gmail.' });
  }

  try {
    const apiKey = process.env.EMAIL_VALIDATION_API_KEY;
    const validationUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
    const validationResult = await axios.get(validationUrl);

    if (!validationResult.data.is_smtp_valid.value) {
      return res.status(400).json({ error: 'Esta conta de e-mail do Gmail não é válida ou não pode ser verificada.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    
    const newUser = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, senhaHash]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    if (error.response && error.response.status) {
      console.error('Erro na API de validação de e-mail:', error.response.data);
      return res.status(500).json({ error: 'Serviço de validação de e-mail indisponível. Tente novamente mais tarde.' });
    }
    if (error.code === '23505') { 
      return res.status(409).json({ error: 'O e-mail informado já foi cadastrado. Tente fazer o login.' });
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
    const userResult = await pool.query('SELECT id, nome, senha_hash FROM usuarios WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou senha incorretos, tente novamente.' });
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
    const expires = new Date(Date.now() + 3600000); // 1 hora
    await pool.query(
      'UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [token, expires, email]
    );

    const resetLink = `${process.env.PUBLIC_URL}/redefinir-senha.html?token=${token}`;
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
    
    res.status(200).json({ message: 'Senha redefinida com sucesso!' });

  } catch (error) {
    console.error('Erro em /reset-password:', error);
    res.status(500).json({ error: 'Erro interno ao redefinir a senha.' });
  }
});

app.get('/perfil', autenticarToken, async (req, res) => {
  try {
    const userId = req.user.id; // Pegamos o ID do usuário que o middleware extraiu do token

    const perfilResult = await pool.query(
      'SELECT id, nome, email, foto_perfil_url, bio FROM usuarios WHERE id = $1',
      [userId]
    );

    if (perfilResult.rows.length === 0) {
      return res.status(404).json({ error: 'Perfil de usuário não encontrado.' });
    }

    res.json(perfilResult.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno ao buscar dados do perfil.' });
  }
});

// ==========================================================
// --- ROTAS DE DEPOIMENTOS ---
// ==========================================================
app.post('/upload', autenticarToken, upload.single('experienceImage'), async (req, res) => {
  // Pegamos os dados do formulário como antes
  const { userName, userAge, userMovement, experienceText } = req.body;
  const userId = req.user.id; // Pegamos o ID do usuário logado do token
  
  const imageUrl = req.file ? req.file.path : null;

  if (!experienceText || !userName || !userAge) { // Verificamos os campos novamente
    return res.status(400).json({ error: 'Todos os campos do formulário são obrigatórios.' });
  }

  try {
    // O INSERT agora inclui as colunas nome_autor e idade_autor
    const result = await pool.query(
      `INSERT INTO depoimentos (experiencia, movimento, imagem_url, usuario_id, nome_autor, idade_autor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [experienceText, userMovement, imageUrl, userId, userName, userAge]
    );
    res.status(201).json({ status: 'ok', message: 'Depoimento criado com sucesso!', id: result.rows[0].id });
  } catch (error) {
    console.error('Erro ao salvar depoimento:', error);
    res.status(500).json({ status: 'error', error: 'Erro ao salvar depoimento.' });
  }
});
app.get('/depoimentos', async (req, res) => {
  try {
    // A consulta agora pega o nome_autor e idade_autor da própria tabela de depoimentos
    const result = await pool.query(`
      SELECT 
        id, 
        experiencia, 
        imagem_url, 
        movimento, 
        data_criacao,
        nome_autor,    -- Usa o nome digitado no formulário
        idade_autor    -- Usa a idade digitada no formulário
      FROM 
        depoimentos
      ORDER BY 
        data_criacao DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar depoimentos:', error);
    res.status(500).json({ error: 'Erro ao listar depoimentos.' });
  }
});


app.delete('/depoimentos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await pool.query('DELETE FROM depoimentos WHERE id = $1', [id]);
        if (deleteResult.rowCount > 0) {
            res.json({ status: 'ok', message: 'Depoimento deletado com sucesso.' });
        } else {
            res.status(404).json({ status: 'error', error: 'Depoimento não encontrado.' });
        }
    } catch (error) {
        console.error('Erro no DELETE:', error);
        res.status(500).json({ status: 'error', error: 'Erro ao deletar depoimento.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});

module.exports = app;