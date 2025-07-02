// --- NOVAS IMPORTAÇÕES ---
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// --- FIM DAS NOVAS IMPORTAÇÕES ---

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

// --- CONFIGURAÇÃO DO UPLOAD COM CLOUDINARY ---

// 1. Configura o Cloudinary com as credenciais do seu arquivo .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configura o armazenamento do Multer para usar o Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'testemunhos', // Nome da pasta onde as imagens ficarão no Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png'], // Formatos permitidos
  },
});

// 3. Inicializa o Multer com a configuração do Cloudinary
const upload = multer({ storage: storage });

// --- FIM DA CONFIGURAÇÃO DO CLOUDINARY ---


// Servir arquivos estáticos do frontend (pasta 'public')
// A pasta 'public' está um nível acima da pasta 'api'
app.use(express.static(path.join(__dirname, '..', 'public')));


// Conexão PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Rota inicial - Serve o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Rota de upload - Agora envia para o Cloudinary
app.post('/upload', upload.single('experienceImage'), async (req, res) => {
  const { userName, userAge, userMovement, experienceText } = req.body;

  if (!req.file) {
    return res.status(400).json({ status: 'error', error: 'Imagem não enviada' });
  }

  // >>> ALTERAÇÃO IMPORTANTE AQUI <<<
  // A URL da imagem agora vem diretamente do Cloudinary através do req.file.path
  const imageUrl = req.file.path;

  try {
    const result = await pool.query(
      `INSERT INTO depoimentos (nome, idade, movimento, imagem, experiencia) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [userName, userAge, userMovement, imageUrl, experienceText]
    );

    const insertedId = result.rows[0].id;
    // Retorna a URL segura do Cloudinary para o frontend
    res.json({ status: 'ok', id: insertedId, image: imageUrl });
  } catch (error) {
    console.error('Erro no INSERT:', error);
    res.status(500).json({ status: 'error', error: 'Erro ao salvar experiência' });
  }
});

// Listar depoimentos
app.get('/depoimentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM depoimentos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro no SELECT:', error);
    res.status(500).json({ status: 'error', error: 'Erro ao listar depoimentos' });
  }
});

// Excluir depoimento
app.delete('/depoimentos/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }
  try {
    // Adicional: deletar a imagem do Cloudinary quando o depoimento for excluído (opcional, mas recomendado)
    const depoimento = await pool.query('SELECT imagem FROM depoimentos WHERE id = $1', [id]);
    if (depoimento.rows.length > 0) {
      const imageUrl = depoimento.rows[0].imagem;
      const publicId = imageUrl.split('/').pop().split('.')[0]; // Extrai o ID público da URL
      cloudinary.uploader.destroy(`testemunhos/${publicId}`); // Deleta a imagem
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

const PORT = process.env.PORT || 3000;
const localUrl = `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Servidor rodando em: ${localUrl}`);
  // A linha 'open' pode ser comentada ou removida para o ambiente de produção
  // open(localUrl);
});