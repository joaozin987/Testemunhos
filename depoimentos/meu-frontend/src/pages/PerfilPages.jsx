import React, { useState } from 'react';

function PerfilPage() {
  // Estado para controlar se estamos no modo de edição ou não
  const [isEditing, setIsEditing] = useState(false);

  // Estados para os dados do formulário de edição
  const [nome, setNome] = useState('Nome do Usuário');
  const [bio, setBio] = useState('Biografia do usuário aparecerá aqui...');
  const [versiculo, setVersiculo] = useState('"O Senhor é o meu pastor..."');

  // Função para entrar no modo de edição
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Função para cancelar a edição
  const handleCancelClick = () => {
    setIsEditing(false);
  };

  // Função para salvar as alterações (aqui entraria a lógica de API)
  const handleSaveSubmit = (e) => {
    e.preventDefault();
    console.log('Salvando dados:', { nome, bio, versiculo });
    // Aqui você chamaria a API para salvar os dados...
    setIsEditing(false); // Volta para o modo de visualização após salvar
  };

  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 min-h-screen">
      <div className="container mx-auto max-w-4xl bg-white p-6 sm:p-8 rounded-lg shadow-md">
        
        {/* --- MODO DE VISUALIZAÇÃO --- */}
        {/* Ele só aparece se 'isEditing' for FALSO */}
        <div id="perfil-content" className={isEditing ? 'hidden' : ''}>
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6 mb-6">
            <img id="foto-perfil" src="/img/avatar-padrao.png" alt="Foto de Perfil" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-blue-600" />
            <div className="text-center sm:text-left">
              <h2 id="nome-usuario" className="text-3xl sm:text-4xl font-slab text-gray-800">{nome}</h2>
              <p id="email-usuario" className="text-xl font-slab text-gray-700 mt-2">email@usuario.com</p>
            </div>
          </div>
          <div className="perfil-details">
            <h3 className="text-3xl font-slab text-gray-900 mb-2">Biografia:</h3>
            <p id="bio-usuario" className="text-gray-700 leading-relaxed">{bio}</p>
          </div>
          <div className="perfil-details">
            <h3 className="text-2xl font-slab text-gray-900 mt-7 mb-2">Versículo Favorito:</h3>
            <p id="versiculo-usuario" className="text-gray-700 leading-relaxed">{versiculo}</p>
          </div>
          <div className="mt-8 text-right">
            <button id="btn-editar-perfil" onClick={handleEditClick} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* --- MODO DE EDIÇÃO --- */}
        {/* Ele só aparece se 'isEditing' for VERDADEIRO */}
        <div id="edit-content" className={!isEditing ? 'hidden' : ''}>
          <h2 className="text-3xl sm:text-4xl font-slab text-gray-800 mb-6 border-b pb-4">Editar Perfil</h2>
          <form id="form-editar" onSubmit={handleSaveSubmit}>
            <div className="mb-4">
              <label htmlFor="input-nome" className="block text-gray-700 text-lg font-slab mb-2">Nome:</label>
              <input type="text" id="input-nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="mb-6">
              <label htmlFor="input-bio" className="block text-gray-700 text-lg font-slab mb-2">Biografia:</label>
              <textarea id="input-bio" rows="5" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div className="mb-6">
                <label htmlFor="input-versiculo" className="block text-gray-700 text-lg font-slab mb-2">Versículo Favorito:</label>
                <input type="text" id="input-versiculo" value={versiculo} onChange={(e) => setVersiculo(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={handleCancelClick} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition">
                Cancelar
              </button>
              <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default PerfilPage;