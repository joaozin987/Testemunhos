import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function PerfilPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [versiculo, setVersiculo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregandoDados, setCarregandoDados] = useState(true);

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  // Busca dados do perfil do backend
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        setCarregandoDados(true);
        try {
          const response = await api.get('/perfil');
          const data = response.data;

          setNome(data.nome || '');
          setEmail(data.email || '');
          setBio(data.bio || '');
          setVersiculo(data.versiculo_favorito || '');

        } catch (error) {
          setMensagem('Erro ao carregar perfil');
        } finally {
          setCarregandoDados(false);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  // Salva alterações no perfil
  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setMensagem('Salvando...');
    try {
      const updatedData = { nome, bio, versiculo_favorito: versiculo };
      const response = await api.put('/perfil', updatedData);
      const userData = response.data;

      setNome(userData.nome);
      setBio(userData.bio);
      setVersiculo(userData.versiculo_favorito);
      setMensagem('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      setMensagem(error.response?.data?.error || 'Erro ao salvar. Tente novamente.');
    }
  };

  if (loading || carregandoDados) {
    return <div className="text-center p-10">Carregando perfil...</div>;
  }

  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 min-h-screen">
      <div className="container mx-auto max-w-4xl bg-white p-6 sm:p-8 rounded-lg shadow-md">

        {/* MODO DE VISUALIZAÇÃO */}
        <div id="perfil-content" className={isEditing ? 'hidden' : ''}>
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6 mb-6">
            <img
              id="foto-perfil"
              src={user?.foto_perfil_url || "/img/avatar-padrao.png"}
              alt="Foto de Perfil"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-600"
            />
            <div className="text-center sm:text-left">
              <h2 id="nome-usuario" className="text-3xl sm:text-4xl font-slab text-gray-800">{nome}</h2>
              <p id="email-usuario" className="text-xl font-slab text-gray-700 mt-2">{email}</p>
            </div>
          </div>
          <div className="perfil-details">
            <h3 className="text-3xl font-slab text-gray-900 mb-2">Biografia:</h3>
            <p id="bio-usuario" className="text-gray-700 leading-relaxed">{bio || "Nenhuma biografia adicionada."}</p>
          </div>
          <div className="perfil-details">
            <h3 className="text-2xl font-slab text-gray-900 mt-7 mb-2">Versículo Favorito:</h3>
            <p id="versiculo-usuario" className="text-gray-700 leading-relaxed">{versiculo || "Nenhum versículo adicionado."}</p>
          </div>
          <div className="mt-8 text-right">
            <button
              id="btn-editar-perfil"
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Editar Perfil
            </button>
          </div>
        </div>

        {/* MODO DE EDIÇÃO */}
        <div id="edit-content" className={!isEditing ? 'hidden' : ''}>
          <h2 className="text-3xl sm:text-4xl font-slab text-gray-800 mb-6 border-b pb-4">Editar Perfil</h2>
          <form id="form-editar" onSubmit={handleSaveSubmit}>
            <div className="mb-4">
              <label htmlFor="input-nome" className="block text-gray-700 text-lg font-slab mb-2">Nome:</label>
              <input
                type="text"
                id="input-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="input-bio" className="block text-gray-700 text-lg font-slab mb-2">Biografia:</label>
              <textarea
                id="input-bio"
                rows="5"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              ></textarea>
            </div>
            <div className="mb-6">
              <label htmlFor="input-versiculo" className="block text-gray-700 text-lg font-slab mb-2">Versículo Favorito:</label>
              <input
                type="text"
                id="input-versiculo"
                value={versiculo}
                onChange={(e) => setVersiculo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

        {mensagem && <p className="text-center mt-4 text-blue-600">{mensagem}</p>}

      </div>
    </section>
  );
}

export default PerfilPage;
