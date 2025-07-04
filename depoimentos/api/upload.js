// Importa as bibliotecas necessárias
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';

// Configura o Cloudinary com as variáveis de ambiente que você já tem
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Garante que as URLs sejam HTTPS
});

// A Vercel exige essa configuração para desativar o bodyParser padrão
export const config = {
  api: {
    bodyParser: false,
  },
};

// A função principal que lida com a requisição
export default async function handler(req, res) {
  // Permite apenas requisições do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. PROCESSAR O FORMULÁRIO E EXTRAIR DADOS E ARQUIVO
    const { fields, files } = await new Promise((resolve, reject) => {
      const form = formidable({});
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    });

    // Pega o arquivo de imagem do formulário
    // 'experienceImage' deve ser o `name` do seu <input type="file"> no HTML
    const imageFile = files.experienceImage?.[0];

    // Pega os campos de texto do formulário
    const experienceText = fields.experienceText?.[0];
    const userName = fields.userName?.[0];
    const userAge = fields.userAge?.[0];
    const userMovement = fields.userMovement?.[0];

    if (!imageFile) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }

    // 2. FAZER UPLOAD DA IMAGEM PARA O CLOUDINARY
    const uploadResult = await cloudinary.uploader.upload(imageFile.filepath, {
      folder: 'depoimentos', // Opcional: cria uma pasta no Cloudinary para organizar
      // public_id: `depoimento_${Date.now()}`, // Opcional: nome customizado do arquivo
    });

    // A URL segura e permanente da imagem agora está em uploadResult.secure_url

    // 3. SALVAR TUDO NO SEU BANCO DE DADOS
    // (Aqui entra a sua lógica de banco de dados que você já tem)
    
    // Exemplo de como seria o objeto a ser salvo:
    const depoimentoParaSalvar = {
      nome: userName,
      idade: userAge,
      movimento: userMovement,
      experiencia: experienceText,
      imagem_url: uploadResult.secure_url, // Salva a URL do Cloudinary, não a imagem!
      public_id: uploadResult.public_id // Importante para poder deletar depois
    };

    // --- SUBSTITUA O CÓDIGO ABAIXO PELA SUA LÓGICA DE BANCO DE DADOS ---
    // Exemplo: const novoDepoimento = await seuBanco.depoimentos.create(depoimentoParaSalvar);
    // -------------------------------------------------------------------
    
    // Supondo que o salvamento no banco foi um sucesso
    console.log('Dados salvos no banco:', depoimentoParaSalvar);


    // 4. ENVIAR RESPOSTA DE SUCESSO PARA O FRONTEND
    res.status(200).json({
      status: 'ok',
      message: 'Depoimento enviado com sucesso!',
      // Você pode retornar os dados salvos se o frontend precisar
      // id: novoDepoimento.id, 
      image: uploadResult.secure_url 
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor ao processar o upload.' });
  }
}