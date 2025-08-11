import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa a ferramenta de autenticação

// O Navbar provavelmente estará no seu componente de Layout (App.jsx),
// então não precisamos dele aqui, mas mantive como no seu código.
import Navbar from '../components/Navbar'; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Sua função de login do contexto

  // Sua função handleSubmit, já otimizada
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem('');

    try {
      await login(email, senha);
      navigate('/'); // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro de rede no login:', error);
      const errorMsg = error.response?.data?.error || 'Credenciais inválidas ou erro no servidor.';
      setMensagem(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // O HTML que criamos, agora como JSX e conectado à sua lógica
  return (
    <>
    <Navbar></Navbar>
      {/* <Navbar /> */}
      <section className="flex justify-center items-center min-h-screen bg-gray-100">
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
              value={email} // Conectado ao estado 'email'
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado 'email'
            />
            
            <label className="text-left text-xl mb-1 mt-3 font-slab" htmlFor="loginPassword">Senha</label>
            <input 
              id="loginPassword" 
              name="senha" 
              className="w-full rounded-lg mb-4 p-3 border border-gray-300" 
              type="password" 
              placeholder="digite sua senha" 
              required 
              value={senha} // Conectado ao estado 'senha'
              onChange={(e) => setSenha(e.target.value)} // Atualiza o estado 'senha'
            />
            
            {/* Convertemos o Link do React Router */}
            <Link className="text-right text-blue-800" to="/recuperar-senha">esqueceu a senha?</Link>
            
            {/* Botão conectado ao estado 'isLoading' */}
            <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Continuar'}
            </button>
         
            {/* Mensagem de erro conectada ao estado 'mensagem' */}
            {mensagem && (
              <p className="text-red-500 mt-4 text-center text-lg font-semibold">{mensagem}</p>
            )}
        </form>
      </section>
    </>
  );
}

export default LoginPage;