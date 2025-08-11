import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RecuperarSenhaPage() {
  // Estados para controlar o formulário
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem('');

    // Simulação de chamada à API
    console.log(`Enviando link de recuperação para: ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    setMensagem('Se um e-mail correspondente for encontrado, um link de recuperação será enviado.');
    setIsLoading(false);
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 text-center w-full max-w-md rounded-xl shadow-lg">
        <h1 className="text-3xl font-slab mb-4 text-gray-800">Recuperar Senha</h1>
        <p className="mb-6 text-gray-600">Digite seu e-mail e enviaremos um link para você criar uma nova senha.</p>

        <label htmlFor="email-recuperacao" className="block text-left text-xl mb-1 font-slab text-gray-700">E-mail</label>
        <input
          className="w-full rounded-lg mb-4 p-3 border border-gray-300"
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
          className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
        </button>

        {mensagem && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded-lg">
            {mensagem}
          </div>
        )}
         <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:underline">Voltar para o Login</Link>
        </div>
      </form>
    </section>
  );
}

// A linha mais importante, que provavelmente estava faltando:
export default RecuperarSenhaPage;