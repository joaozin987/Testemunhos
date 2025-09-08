import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminPostsPage() {
  const { usuario } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Posts</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Bem-vindo à administração de posts!</h2>
        <p className="text-gray-600 mb-4">
          Logado como: <strong>{usuario?.nome}</strong>
        </p>
        
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h3 className="font-semibold text-blue-800">📋 Funcionalidades futuras:</h3>
          <ul className="list-disc list-inside mt-2 text-blue-700">
            <li>Listar todos os posts</li>
            <li>Criar novos posts</li>
            <li>Editar posts existentes</li>
            <li>Deletar posts</li>
            <li>Moderação de conteúdo</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600">
            ⚠️ Esta área está em desenvolvimento. Configure primeiro o backend de posts.
          </p>
        </div>
      </div>
    </div>
  );
}