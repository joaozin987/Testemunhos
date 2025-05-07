export default function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).json({ mensagem: 'API funcionando no Vercel!' });
    } else {
      res.status(405).end('Método não permitido');
    }
  }
  