import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const API_URL = import.meta.env.VITE_API_URL;

function AdminPosts() {
  const [depoimentos, setDepoimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDepoimentos = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/depoimentos`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Erro ao carregar depoimentos');

        const data = await res.json();
        setDepoimentos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepoimentos();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente deletar este depoimento?')) return;

    try {
      const res = await fetch(`${API_URL}/depoimentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Erro ao deletar depoimento');

      setDepoimentos(prev => prev.filter(d => d.id !== id));
      alert('Depoimento deletado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar depoimento');
    }
  };

  if (loading) return <p>Carregando depoimentos...</p>;

  return (
    <div className="space-y-4">
      {depoimentos.map(d => (
        <div key={d.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
          <div>
            <strong>{d.usuario?.nome || 'Anônimo'}:</strong> {d.texto}
          </div>
          <button
            onClick={() => handleDelete(d.id)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminPosts;
