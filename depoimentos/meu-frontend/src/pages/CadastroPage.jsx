import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function CadastroPage() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem('');
    const userData = { nome, email, senha };

     try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
      navigate('/login');
    } else {
      if (response.status === 422 && result.errors) {
        // Se houver erros de validação (status 422)
        const firstError = Object.values(result.errors)[0][0]; 
        setMensagem(`Erro: ${firstError}`);
      } else {
        // Para outros erros
        setMensagem(`Erro: ${result.message || 'Erro no servidor'}`);
      }
    }
  } catch (error) {
    console.error('Erro de rede no cadastro:', error);
    setMensagem('Erro de conexão. Não foi possível se comunicar com o servidor.');
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <>
           <Navbar></Navbar>
    
  
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
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
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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

          {/* O botão agora reage ao estado 'isLoading' */}
          <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Continuar'}
          </button>
          
          {/* A mensagem de erro só aparece quando o estado 'mensagem' tem algum texto */}
          {mensagem && (
            <p className="text-red-500 mt-4 text-lg font-semibold">{mensagem}</p>
          )}
      </form>
    </section>
</>
  );
}


export default CadastroPage;