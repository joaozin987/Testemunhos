import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('info'); // 'info' ou 'erro'
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem('');

    try {
      // ATENÇÃO: Substitua a URL se seu backend não estiver rodando em localhost:3000
      const response = await fetch('http://localhost:3000/solicitar-recuperacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro desconhecido no servidor.');
      }

      setTipoMensagem('info');
      setMensagem(data.message || 'Solicitação de senha enviada com sucesso!');

    } catch (error) {
      console.error('Erro ao solicitar a recuperação:', error);
      setTipoMensagem('erro');
      setMensagem(error.message || 'Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const mensagemClasses = {
    info: 'bg-blue-100 text-blue-800',
    erro: 'bg-red-100 text-red-800'
  };
 
  return (

     <>
    {<Navbar></Navbar>}
    <section className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      <form onSubmit={handleSubmit} className="bg-white p-8 text-center w-full max-w-md rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Recuperar Senha</h1>
        <p className="mb-6 text-gray-600">Digite seu e-mail e enviaremos um link para você criar uma nova senha.</p>

        <label htmlFor="email-recuperacao" className="block text-left text-lg mb-1 font-semibold text-gray-700">E-mail</label>
        <input
          className="w-full rounded-lg mb-4 p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          type="email"
          id="email-recuperacao"
          name="email"
          placeholder="seu.email@exemplo.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
        </button>

        {mensagem && (
          <div className={`mt-4 p-3 rounded-lg font-medium ${mensagemClasses[tipoMensagem]}`}>
            {mensagem}
          </div>
        )}
         <div className="mt-6 text-center">
            <a href="/login" className="text-blue-600 hover:underline">Voltar para o Login</a>
        </div>
      </form>
    </section>
    </>
  );
}

export default RecuperarSenhaPage;