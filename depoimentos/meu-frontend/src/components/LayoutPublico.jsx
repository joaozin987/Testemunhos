// src/components/LayoutPublico.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LayoutPublico() {
  const { isAuthenticated, loading } = useAuth();

  // Enquanto o contexto está checando o token, mostre uma tela de carregamento
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se já estiver logado, redireciona para a home EM VEZ de mostrar Login/Cadastro
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Se não estiver logado, permite que a página de Login ou Cadastro seja exibida
  return <Outlet />;
}

export default LayoutPublico;