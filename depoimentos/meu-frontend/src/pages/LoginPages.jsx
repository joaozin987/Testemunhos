import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext'; // 1. Importa a ferramenta de autenticação

function LoginPage() {
  // 2. Cria os estados para os campos e para as mensagens
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // 3. Pega a função 'login' do nosso AuthContext
  const API_URL = 'http://localhost:3000';

  // 4. Função que lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        // SUCESSO!
        login(result.token); // Avisa a aplicação inteira que o login foi feito
        navigate('/');       // Redireciona para a página inicial
      } else {
        // Erro vindo da API
        setMensagem(`Erro: ${result.error || 'Credenciais inválidas.'}`);
      }
    } catch (error) {
      console.error('Erro de rede no login:', error);
      setMensagem('Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <section className="flex justify-center items-center h-screen bg-gray-100">
        {/* 5. Conecta a função ao onSubmit do formulário */}
        <form onSubmit={handleSubmit} className="bg-white grid p-8 text-center w-full max-w-md rounded-xl shadow-xl">
            <h1 className="text-3xl font-slab mb-3">Faça o Login</h1>
           
            <label className="text-left text-xl mb-2 font-slab" htmlFor="loginEmail">E-mail</label>
            <input 
              id="loginEmail" 
              name="email" 
              className="w-full rounded-lg mb-4 p-3 border border-gray-300" 
              type="email" 
              placeholder="digite seu email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <label className="text-left text-xl mb-1 mt-3 font-slab" htmlFor="loginPassword">Senha</label>
            <input 
              id="loginPassword" 
              name="senha" 
              className="w-full rounded-lg mb-4 p-3 border border-gray-300" 
              type="password" 
              placeholder="digite sua senha" 
              required 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            
            <Link className="text-right text-blue-800" to="/recuperar-senha">esqueceu a senha?</Link>
            
            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Continuar'}
            </button>
         
            {mensagem && (
              <p className="text-red-500 mt-4 text-center text-lg font-semibold">{mensagem}</p>
            )}
        </form>
      </section>

      <footer className="bg-accent100 text-bg100 text-center py-6 mt-10">
        <p>© 2025 Conectados pela Fé. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default LoginPage;