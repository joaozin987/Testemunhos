import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function RedefinirPage() {
  // O hook useParams() captura os parâmetros da URL, como o :token
  const { token } = useParams(); 
  const navigate = useNavigate();

  // Estados para o formulário
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('info');
  const [isLoading, setIsLoading] = useState(false);
  const [senhaRedefinida, setSenhaRedefinida] = useState(false);

 
  useEffect(() => {
    console.log('Token recebido da URL:', token);
    if (!token) {
        setMensagem('Token de redefinição inválido ou ausente.');
    }
  }, [token]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMensagem('');
  
  if(novaSenha.length < 6) {
    setTipoMensagem('erro');
    setMensagem('a senha deve ter pelo menos 6 caracteres.');
    return;
  }
  if (novaSenha !== confirmarSenha) {
    setTipoMensagem('erro');
    setMensagem('as senhas nao coicidem.');
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch("http://localhost3000/redefinir-senha", {
      method: 'Post',
      headers: {
        'Content-Type': 'applicatio/json',
      },
      body: JSON.stringify({toke, senha: novaSenha }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Ocorreu um erro. o link pode ter expirado.');
    }
    
    setTipoMensagem('sucesso');
    setMensagem(data.mensage);
    setSenhaRedefinida(true);

  } catch (error) {
    console.error('erro ao definir a senha', error);
    setTipoMensagem('error');
    setMensagem(erro.mensage);
  } finally {
    setIsLoading(false);
  }
 };
 const mensagemClasses = {
  erro: 'bg-red-100 text-red-500',
  sucesso: 'bg-green-100 text-green-500',
 };

  return (
    <> 
    {<Navbar></Navbar>}
     <section className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white p-8 text-center w-full max-w-md rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Crie uma Nova Senha</h1>

        {!senhaRedefinida ? (
          <form onSubmit={handleSubmit}>
            <label className="text-left block text-lg mb-1 font-semibold text-gray-700" htmlFor="nova_senha">Nova Senha</label>
            <input
              className="w-full rounded-lg mb-4 p-3 border border-gray-300"
              type="password"
              id="nova_senha"
              placeholder="Digite sua nova senha"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />

            <label className="text-left block text-lg mb-1 font-semibold text-gray-700" htmlFor="confirmar_senha">Confirmar Senha</label>
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
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        ) : (
          <div className="mt-4">
            <Link
              to="/login"
              className="w-full block bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Ir para a página de Login
            </Link>
          </div>
        )}

        {mensagem && (
          <div className={`mt-4 p-3 rounded-lg font-medium ${mensagemClasses[tipoMensagem]}`}>
            {mensagem}
          </div>
        )}
      </div>
    </section>
    </>
  );
}

export default RedefinirPage;