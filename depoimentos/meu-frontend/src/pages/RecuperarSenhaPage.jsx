import React, { useState } from 'react';
import Navbar from '../components/Navbar';

function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

 const handleSubmit = async (event) => {
  event.preventDefault();

  // Reset mensagens
  setMensagem('');
  setTipoMensagem('');

  // Validação simples
  if (!email || email.trim() === '') {
    setMensagem('Por favor, insira seu e-mail');
    setTipoMensagem('error');
    return;
  }

  setIsLoading(true);

  try {
    console.log("Enviando e-mail:", email);

    const response = await fetch('http://localhost:8000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("Resposta do backend:", data);

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao enviar link');
    }

    setMensagem(data.message || 'Link enviado com sucesso!');
    setTipoMensagem('success');

  } catch (error) {
    console.error("Erro no fetch:", error);
    setMensagem(error.message || 'Erro no servidor');
    setTipoMensagem('error');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <Navbar />
      <section className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
        <form onSubmit={handleSubmit} className="bg-white p-8 text-center w-full max-w-md rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Recuperar Senha</h1>
          <p className="mb-6 text-gray-600">
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>

          <label htmlFor="email" className="block text-left text-lg mb-1 font-semibold text-gray-700">
            E-mail
          </label>
          <input
            className="w-full rounded-lg mb-4 p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            type="email"
            id="email"
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
            {isLoading ? 'Enviando...' : 'Enviar Link'}
          </button>

          {mensagem && (
            <div
              className={`mt-4 p-3 rounded-lg font-medium ${
                tipoMensagem === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {mensagem}
            </div>
          )}

          <div className="mt-6 text-center">
            <a href="/login" className="text-blue-600 hover:underline">
              Voltar para o Login
            </a>
          </div>
        </form>
      </section>
    </>
  );
}

export default RecuperarSenhaPage;
