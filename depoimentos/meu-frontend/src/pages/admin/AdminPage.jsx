import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AdminSidebar from '../../components/admin/AdminSidebar';

function AdminPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    verificarPermissoes();
  }, []);

  const verificarPermissoes = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setIsAdmin(userData.is_admin === true);
        
        if (!userData.is_admin) {
          navigate('/'); // Redireciona se não for admin
        }
      }
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Acesso não autorizado.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen">
        <AdminSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
          
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Visão Geral</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold">Total de Usuários</h3>
                  <p className="text-2xl">150</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold">Posts Hoje</h3>
                  <p className="text-2xl">23</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold">Sistema</h3>
                  <p className="text-green-600">Online</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Gerenciar Usuários</h2>
              {/* Conteúdo de gerenciamento de usuários */}
            </div>
          )}

          {activeSection === 'posts' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Gerenciar Posts</h2>
              {/* Conteúdo de gerenciamento de posts */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminPage;