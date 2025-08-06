// src/pages/RecuperarSenhaPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://localhost:3000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem('');

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMensagem(result.message);
      } else {
        setMensagem(`Erro: ${result.error || 'Ocorreu um problema.'}`);
      }
    } catch (error) {
      setMensagem('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-accent200 shadow p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-slab text-primary100">
            <Link to="/">Conectados pela Fé</Link>
          </h1>
        </div>
      </nav>

      <main className="flex justify-center items-center" style={{ height: 'calc(100vh - 72px)' }}>
        <form onSubmit={handleSubmit} className="bg-white p-8 text-center w-full max-w-md rounded-xl shadow-lg">
          <h1 className="text-3xl font-slab mb-4 text-gray-800">Recuperar Senha</h1>
          <p className="mb-6 text-gray-600">Digite seu e-mail e enviaremos um link para você criar uma nova senha.</p>

          <label htmlFor="email" className="block text-left text-xl mb-1 font-slab text-gray-700">E-mail</label>
          <input
            className="w-full rounded-lg mb-4 p-3 border border-gray-300"
            type="email"
            id="email"
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
        </form>
      </main>
    </div>
  );
}

export default RecuperarSenhaPage;
