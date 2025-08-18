import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
   alert(`Tentando conectar com a API em: ${import.meta.env.VITE_API_URL}`);
    setIsLoading(true);
    setMensagem('');

    try {
      await login(email, senha); // Redirecionamento já está no contexto
    } catch (error) {
      alert(`Erro capturado: ${error}`);

      setMensagem(error.response?.data?.error || 'Erro ao fazer login.');
    } finally {
      setIsLoading(false);
    }
  };
  axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
    email,
    senha
  }, {
    withCredentials: true
  })

  return (
    <>
      <Navbar />
      <section className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white grid p-8 text-center w-full max-w-md rounded-xl shadow-xl">
          <h1 className="text-3xl font-slab mb-3">Faça o Login</h1>

          <label className="text-left text-xl mb-2 font-slab" htmlFor="loginEmail">E-mail</label>
          <input
            id="loginEmail"
            className="w-full rounded-lg mb-4 p-3 border border-gray-300"
            type="email"
            placeholder="Digite seu email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-left text-xl mb-1 mt-3 font-slab" htmlFor="loginPassword">Senha</label>
          <input
            id="loginPassword"
            className="w-full rounded-lg mb-4 p-3 border border-gray-300"
            type="password"
            placeholder="Digite sua senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <Link className="text-right text-blue-800" to="/recuperar-senha">Esqueceu a senha?</Link>

          <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Continuar'}
          </button>

          {mensagem && (
            <p className="text-red-500 mt-4 text-center text-lg font-semibold">{mensagem}</p>
          )}
        </form>
      </section>
    </>
  );
}

export default LoginPage;
