import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RedefinirPage() {
  // O hook useParams() captura os parâmetros da URL, como o :token
  const { token } = useParams(); 
  const navigate = useNavigate();

  // Estados para o formulário
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Apenas para mostrar que capturamos o token (pode remover depois)
  useEffect(() => {
    console.log('Token recebido da URL:', token);
    if (!token) {
        setMensagem('Token de redefinição inválido ou ausente.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    setMensagem('');

    try {
      // --- AQUI ENTRARIA A LÓGICA PARA CHAMAR SEU BACKEND ---
      // Você enviaria o 'token', a 'novaSenha', etc.
      console.log('Enviando nova senha para o backend com o token:', token);
      
      // Simulação de uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      alert('Senha redefinida com sucesso! Você será redirecionado para o login.');
      navigate('/login');

    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setMensagem('Ocorreu um erro. O link pode ter expirado. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white grid p-8 text-center w-full max-w-md rounded-xl shadow-lg">
          <h1 className="text-3xl font-slab mb-6 text-gray-800">Crie uma Nova Senha</h1>
      
          <label className="text-left block text-xl mb-1 font-slab text-gray-700" htmlFor="nova_senha">Nova Senha</label>
          <input 
            className="w-full rounded-lg mb-4 p-3 border border-gray-300" 
            type="password" 
            id="nova_senha" 
            placeholder="Digite sua nova senha" 
            required
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          
          <label className="text-left block text-xl mb-1 font-slab text-gray-700" htmlFor="confirmar_senha">Confirmar Senha</label>
          <input 
            className="w-full rounded-lg mb-6 p-3 border border-gray-300" 
            type="password" 
            id="confirmar_senha" 
            placeholder="Digite novamente sua nova senha" 
            required 
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>

          {mensagem && (
            <p className="mt-4 p-3 text-red-600 font-semibold">
              {mensagem}
            </p>
          )}
      </form>
    </section>
  );
}

export default RedefinirPage;