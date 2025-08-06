import React from 'react';
import { Link } from 'react-router-dom';


function PerfilPage() {
  return (
    <div className="bg-accent200 min-h-screen">
      {/* Menu simples, como no seu HTML original */}
      <nav className="bg-accent200 shadow p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-slab text-primary100"><Link to="/">Conectados pela Fé</Link></h1>
          <Link to="/" className="text-lg font-semibold text-bg100">Voltar ao Início</Link>
        </div>
      </nav>

      <main className="container mx-auto max-w-4xl p-4 sm:p-6 mt-8">
        <div id="perfil-container" className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            
          <div id="loading" className="text-center text-gray-500" style={{ display: 'none' }}>
              <p>Carregando perfil...</p>
          </div>

          <div id="perfil-content">
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b pb-6 mb-6">
              <img id="foto-perfil" src="/img/avatar-padrao.png" alt="Foto de Perfil" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-accent200" />
              <div className="text-center sm:text-left">
                <h2 id="nome-usuario" className="text-3xl sm:text-4xl font-slab text-gray-800">Nome do Usuário</h2>
                <p id="email-usuario" className="text-xl font-slab text-gray-700 mt-2">email@usuario.com</p>
              </div>
            </div>
            <div className="perfil-details">
              <h3 className="text-3xl font-slab text-gray-900 mb-2">Biografia:</h3>
              <p id="bio-usuario" className="text-gray-700 leading-relaxed">Biografia do usuário aparecerá aqui.</p>
            </div>
            <div className="perfil-details">
              <h3 className="text-2xl font-slab text-gray-900 mt-7 mb-2">Versículo Favorito:</h3>
              <p id="versiculo-usuario" className="text-gray-700 leading-relaxed">Versículo favorito do usuário aparecerá aqui.</p>
            </div>
            <div className="mt-8 text-right">
              <button id="btn-editar-perfil" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                Editar Perfil
              </button>
            </div>
          </div>

          <div id="edit-content" style={{ display: 'none' }}>
            <h2 className="text-3xl sm:text-4xl font-slab text-gray-800 mb-6 border-b pb-4">Editar Perfil</h2>
            <form id="form-editar">
              <div className="mb-4">
                <label htmlFor="input-nome" className="block text-gray-700 text-lg font-slab mb-2">Nome:</label>
                <input type="text" id="input-nome" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="mb-6">
                <label htmlFor="input-bio" className="block text-gray-700 text-lg font-slab mb-2">Biografia:</label>
                <textarea id="input-bio" rows="5" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div className="mb-6">
                  <label htmlFor="input-versiculo" className="block text-gray-700 text-lg font-slab mb-2">Versículo Favorito:</label>
                  <input type="text" id="input-versiculo" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" id="btn-cancelar" className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition">
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PerfilPage;