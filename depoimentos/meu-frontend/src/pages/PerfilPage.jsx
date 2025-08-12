import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function PerfilPage() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    bio: '',
    versiculo_favorito: '',
    cidade: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Novo estado para o feedback de salvamento
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      // A verificação 'if (user)' garante que só buscamos dados se o usuário estiver logado
      if (user) {
        try {
          setLoading(true);
          const response = await api.get('/perfil');
          const data = response.data;
          setFormData({
            nome: data.nome || '',
            email: data.email || '',
            bio: data.bio || '',
            versiculo_favorito: data.versiculo_favorito || '',
            cidade: data.cidade || ''
          });
        } catch (error) {
          setMensagem('Erro ao carregar perfil');
        } finally {
          setLoading(false);
        }
      } else {
        // Se não houver usuário, paramos o carregamento
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]); // A dependência [user] garante que a busca rode quando o login for concluído

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true); // Ativa o estado de "salvando"
    setMensagem('');
    try {
      const response = await api.put('/perfil', formData);
      setFormData(response.data); // Atualiza o form com os dados retornados
      setMensagem('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      setMensagem(error.response?.data?.error || 'Erro ao salvar.');
    } finally {
      setIsSaving(false); // Desativa o estado de "salvando"
    }
  };

  if (loading) {
    return <div className="text-center p-10">Carregando perfil...</div>;
  }

  return (
    <section className="bg-blue-900 py-12 px-4 sm:px-6 min-h-screen">
      <div className="container mx-auto max-w-4xl bg-yellow-100 p-6 sm:p-8 rounded-lg shadow-md">
        
        {/* MODO DE VISUALIZAÇÃO */}
        <div className={isEditing ? 'hidden' : ''}>
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6 mb-6 rounded-3xl">
            <img src={user?.foto_perfil_url || "/img/avatar-padrao.png"} alt="Foto de Perfil" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-600" />
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-slab text-gray-800">{formData.nome}</h2>
              <p className="text-xl font-slab text-gray-700 mt-2">{formData.email}</p>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-serif text-gray-900 mb-2">Cidade:</h3>
            <p className="text-gray-700 leading-relaxed">{formData.cidade || "Nenhuma cidade adicionada."}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-serif text-gray-900 mb-2">Biografia:</h3>
            <p className="text-gray-700 leading-relaxed">{formData.bio || "Nenhuma biografia adicionada."}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-serif text-gray-900 mb-2">Versículo Favorito:</h3>
            <p className="text-gray-700 leading-relaxed">{formData.versiculo_favorito || "Nenhum versículo adicionado."}</p>
          </div>
          <div className="mt-8 text-right">
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* MODO DE EDIÇÃO */}
        <div className={!isEditing ? 'hidden' : ''}>
          <h2 className="text-3xl sm:text-4xl font-slab text-gray-800 mb-6 border-b pb-4">Editar Perfil</h2>
          <form onSubmit={handleSaveSubmit}>
            <div className="mb-4">
              <label htmlFor="nome" className="block text-gray-700 text-lg font-slab mb-2">Nome:</label>
              <input type="text" id="nome" value={formData.nome} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="mb-6">
              <label htmlFor="cidade" className="block text-gray-700 text-lg font-slab mb-2">Cidade:</label>
              <input type="text" id="cidade" value={formData.cidade} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="mb-6">
              <label htmlFor="bio" className="block text-gray-700 text-lg font-slab mb-2">Biografia:</label>
              <textarea id="bio" rows="5" value={formData.bio} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <div className="mb-6">
              <label htmlFor="versiculo_favorito" className="block text-gray-700 text-lg font-slab mb-2">Versículo Favorito:</label>
              <input type="text" id="versiculo_favorito" value={formData.versiculo_favorito} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition" disabled={isSaving}>Cancelar</button>
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
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
   