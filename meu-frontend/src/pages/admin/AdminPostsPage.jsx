import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';

export default function AdminDepoimentosPage() {
  const [depoimentos, setDepoimentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const { usuario } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    carregarDepoimentos();
  }, []);

  const carregarDepoimentos = async () => {
    try {
      setCarregando(true);
      const response = await axios.get(`${API_URL}/admin/depoimentos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDepoimentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
      setMensagem('Erro ao carregar depoimentos');
    } finally {
      setCarregando(false);
    }
  };

  const aprovarDepoimento = async (id) => {
    try {
      await axios.post(`${API_URL}/admin/depoimentos/${id}/aprovar`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMensagem('Depoimento aprovado com sucesso!');
      setDepoimentos(depoimentos.map(d => 
        d.id === id ? { ...d, aprovado: true } : d
      ));
    } catch (error) {
      console.error('Erro ao aprovar depoimento:', error);
      setMensagem('Erro ao aprovar depoimento');
    }
  };

  const deletarDepoimento = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar este depoimento?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/admin/depoimentos/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMensagem('Depoimento deletado com sucesso!');
      setDepoimentos(depoimentos.filter(d => d.id !== id));
    } catch (error) {
      console.error('Erro ao deletar depoimento:', error);
      setMensagem('Erro ao deletar depoimento');
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
        <h1 className="text-2xl font-bold">Gerenciamento de Depoimentos</h1>
        <span className="text-sm text-gray-600">
          Administrador: {usuario?.nome}
        </span>
      </div>

      {mensagem && (
        <div className={`p-4 mb-4 rounded ${
          mensagem.includes('Erro')
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {mensagem}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Lista de Depoimentos</h2>
          <p className="text-sm text-gray-600">
            Total: {depoimentos.length} depoimentos
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mensagem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aprovado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {depoimentos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Nenhum depoimento encontrado.
                  </td>
                </tr>
              ) : (
                depoimentos.map(dep => (
                  <tr key={dep.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{dep.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{dep.autor}</td>
                    <td className="px-6 py-4 text-sm">{dep.mensagem}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        dep.aprovado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {dep.aprovado ? 'Sim' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(dep.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      {!dep.aprovado && (
                        <button
                          onClick={() => aprovarDepoimento(dep.id)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded text-sm"
                          title="Aprovar depoimento"
                        >
                          ✅ Aprovar
                        </button>
                      )}
                      <button
                        onClick={() => deletarDepoimento(dep.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded text-sm"
                        title="Deletar depoimento"
                      >
                        🗑️ Deletar
                      </button>
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
          <li>Depoimentos aprovados ficam visíveis na área pública</li>
          <li>Depoimentos deletados não podem ser recuperados</li>
        </ul>
      </div>
    </div>
  );
}