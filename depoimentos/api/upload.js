// /api/upload.js

require('dotenv').config();
const multer = require('multer');
const cloudinary =require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configura o Cloudinary com as suas credenciais do arquivo .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configura o "armazenamento" para o Multer, dizendo a ele para enviar os arquivos para a pasta 'testemunhos' no Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'testemunhos',
    allowed_formats: ['jpeg', 'jpg', 'png'],
    // Você pode adicionar transformações aqui, como redimensionar a imagem
    // transformation: [{ width: 800, height: 600, crop: 'limit' }] 
  },
});

// Cria a instância do Multer, que é o middleware que vamos usar nas rotas
const upload = multer({ storage: storage });

// Exporta o middleware 'upload' para que outros arquivos (como o index.js) possam usá-lo
module.exports = upload;