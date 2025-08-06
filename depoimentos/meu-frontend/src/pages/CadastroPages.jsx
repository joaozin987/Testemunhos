import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function CadastroPage() {
  // 1. Estados para controlar os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estados para feedback ao usuário
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Hook para navegação
  const SERVER_URL = 'http://localhost:3000'; 

  // 2. Função que lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setIsLoading(true);
    setMensagem('');

    const userData = { nome, email, senha };

    try {
      const response = await fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        // Sucesso! Redireciona para o login.
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        navigate('/login');
      } else {
        // Erro vindo da API
        setMensagem(`Erro: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro de rede no cadastro:', error);
      setMensagem('Erro de conexão. Não foi possível se comunicar com o servidor.');
    } finally {
      setIsLoading(false); // Para o indicador de loading
    }
  };

  return (
    <>  
      <Navbar />

      <section className="flex justify-center items-center h-screen bg-gray-100">
        {/* 3. Conectamos a função ao onSubmit do formulário */}
        <form onSubmit={handleSubmit} className="bg-white grid p-8 text-center w-full max-w-md rounded-xl shadow-lg">
            <h1 className="text-3xl font-slab mb-4">Crie sua conta</h1>

            <label className="text-left text-xl mb-2 font-slab" htmlFor="registerName">Nome</label>
            <input 
              id="registerName" 
              name="nome" 
              className="w-full rounded-lg mb-4 p-3 border border-gray-300" 
              type="text" 
              placeholder="digite seu nome" 
              required 
              value={nome} // O valor do input é controlado pelo estado
              onChange={(e) => setNome(e.target.value)} // Atualiza o estado a cada letra digitada
            />

            <label className="text-left text-xl mb-2 font-slab" htmlFor="registerEmail">E-mail</label>
            <input 
              id="registerEmail" 
              name="email" 
              className="w-full rounded-lg mb-4 p-3 border border-gray-300" 
              type="email" 
              placeholder="digite seu email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="text-left text-xl mb-2 font-slab" htmlFor="registerPassword">Senha</label>
            <input 
              id="registerPassword" 
              name="senha" 
              className="w-full rounded-lg mb-4 p-3 border border-gray-300" 
              type="password" 
              placeholder="digite sua senha" 
              required 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {/* O botão fica desabilitado enquanto a requisição está em andamento */}
            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Continuar'}
            </button>
            
            {/* 4. Mostra a mensagem de erro ou sucesso */}
            {mensagem && (
              <p className="text-red-500 mt-4 text-lg font-semibold">{mensagem}</p>
            )}
        </form>
      </section>

      <footer className="bg-accent100 text-bg100 text-center py-6 mt-10">
        <p>© 2025 Conectados pela Fé. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default CadastroPage;