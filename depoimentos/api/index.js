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
// A linha 'require('console')' foi removida por ser desnecessária

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'meu-frontend', 'src', 'pages'))); // Serve arquivos estáticos do diretório correto

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
const isProduction = process.env.NODE_ENV === 'production';
const connectionOptions = {
  connectionString: process.env.DATABASE_URL,
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

// --- ROTA DE AUTENTICAÇÃO E RECUPERAÇÃO --- //
// ---> CORREÇÃO CRÍTICA NO MIDDLEWARE DE AUTENTICAÇÃO
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // CORRIGIDO: req.headers
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) { // CORRIGIDO: A verificação estava errada
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // CORRIGIDO: jwt.verify
    if (err) {
      console.error("Erro na verificação do Token:", err.message); // Adicionado para depuração
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
    const userResult = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
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
    console.error('Erro em /reset-password:', error);
    res.status(500).json({ error: 'Erro interno ao redefinir a senha.' });
  }
});

app.get('/perfil', autenticarToken, async (req, res) => {
  try {
    const userId = req.user.id; 
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

app.put('/perfil', autenticarToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { nome, bio, versiculo_favorito } = req.body; 

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ error: 'O campo nome é obrigatório.' });
    }

    // A consulta SQL precisa de 4 parâmetros
    const query = `
      UPDATE usuarios
      SET 
        nome = $1,                -- Primeiro parâmetro
        bio = $2,                 -- Segundo parâmetro
        versiculo_favorito = $3   -- Terceiro parâmetro
      WHERE 
        id = $4                   -- QUARTO PARÂMETRO (para identificar o usuário)
      RETURNING id, nome, email, foto_perfil_url, bio, versiculo_favorito;
    `;
    
    // O array de valores DEVE ter 4 itens, na ordem correta
    const values = [
      nome,                 // Corresponde a $1
      bio,                  // Corresponde a $2
      versiculo_favorito,   // Corresponde a $3
      userId                // Corresponde a $4
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado para atualizar.' });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
  }
});

// ==========================================================
// --- ROTAS DE DEPOIMENTOS ---
// ==========================================================
app.post('/upload', autenticarToken, upload.single('experienceImage'), async (req, res) => {
  const { userName, userAge, userMovement, experienceText } = req.body;
  const userId = req.user.id;
  const imageUrl = req.file ? req.file.path : null;
  if (!experienceText || !userName || !userAge) {
    return res.status(400).json({ error: 'Todos os campos do formulário são obrigatórios.' });
  }
  try {
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
    const result = await pool.query(`
      SELECT 
        d.id, d.experiencia, d.imagem_url, d.movimento, d.data_criacao,
        d.nome_autor, d.idade_autor,
        u.foto_perfil_url AS autor_foto_perfil
      FROM 
        depoimentos d
      LEFT JOIN 
        usuarios u ON d.usuario_id = u.id
      ORDER BY 
        d.data_criacao DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao listar depoimentos:', error);
    res.status(500).json({ error: 'Erro ao listar depoimentos.' });
  }
});

// ---> CORREÇÃO DE SEGURANÇA NA ROTA DE DELEÇÃO
app.delete('/depoimentos/:id', autenticarToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const ownershipResult = await pool.query('SELECT usuario_id FROM depoimentos WHERE id = $1', [id]);
        if (ownershipResult.rows.length === 0) {
            return res.status(404).json({ error: 'Depoimento não encontrado.' });
        }
        if (ownershipResult.rows[0].usuario_id !== userId) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar este depoimento.' });
        }
        
        const deleteResult = await pool.query('DELETE FROM depoimentos WHERE id = $1', [id]);
        if (deleteResult.rowCount > 0) {
            res.json({ status: 'ok', message: 'Depoimento deletado com sucesso.' });
        } else {
            res.status(404).json({ error: 'Depoimento não encontrado durante a deleção.' });
        }
    } catch (error) {
        console.error('Erro no DELETE:', error);
        res.status(500).json({ error: 'Erro ao deletar depoimento.' });
    }
});
// No final do seu api/index.js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
  // Esta linha já deveria criar um link clicável na maioria dos terminais
  console.log(`🚀 URL Local: http://localhost:${PORT}`); 
});

module.exports = app;

