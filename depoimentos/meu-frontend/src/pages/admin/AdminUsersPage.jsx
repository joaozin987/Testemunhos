import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';

export default function AdminUsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const { usuario } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);
      const response = await axios.get(`${API_URL}/admin/usuarios`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      if (error.response?.status === 403) {
        setMensagem('Acesso negado. Você não é administrador.');
      } else {
        setMensagem('Erro ao carregar usuários');
      }
    } finally {
      setCarregando(false);
    }
  };

  const tornarAdmin = async (userId) => {
    try {
      await axios.post(`${API_URL}/admin/usuarios/${userId}/make-admin`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setMensagem('Usuário promovido a administrador com sucesso!');
      
      // Atualizar lista local
      setUsuarios(usuarios.map(user => 
        user.id === userId ? { ...user, is_admin: true } : user
      ));
      
    } catch (error) {
      console.error('Erro ao promover usuário:', error);
      setMensagem('Erro ao promover usuário');
    }
  };

  const deletarUsuario = async (userId) => {
    if (!window.confirm('Tem certeza que deseja deletar este usuário?\nEsta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/usuarios/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setMensagem('Usuário deletado com sucesso!');
      setUsuarios(usuarios.filter(user => user.id !== userId));
      
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      if (error.response?.status === 400) {
        setMensagem('Você não pode se deletar');
      } else {
        setMensagem('Erro ao deletar usuário');
      }
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        <span className="text-sm text-gray-600">
          Administrador: {usuario?.nome}
        </span>
      </div>

      {mensagem && (
        <div className={`p-4 mb-4 rounded ${
          mensagem.includes('Erro') || mensagem.includes('negado')
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {mensagem}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Lista de Usuários</h2>
          <p className="text-sm text-gray-600">
            Total: {usuarios.length} usuários
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Cadastro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                usuarios.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.is_admin 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_admin ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {!user.is_admin && (
                        <button
                          onClick={() => tornarAdmin(user.id)}
                          className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded text-sm"
                          title="Tornar administrador"
                        >
                          👑 Promover
                        </button>
                      )}
                      {user.id !== usuario?.id && (
                        <button
                          onClick={() => deletarUsuario(user.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded text-sm"
                          title="Deletar usuário"
                        >
                          🗑️ Deletar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
        <h3 className="font-semibold text-blue-800">💡 Informações:</h3>
        <ul className="list-disc list-inside mt-2 text-blue-700 text-sm">
          <li>Você não pode deletar sua própria conta</li>
          <li>Usuários administradores têm acesso total ao sistema</li>
          <li>Ações de deletar são permanentes</li>
        </ul>
      </div>
    </div>
  );
}