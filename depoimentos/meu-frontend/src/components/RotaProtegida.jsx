import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RotaProtegida() {
  const { isAuthenticated, loading } = useAuth();

  console.log(`[RotaProtegida] Estado: loading=${loading}, isAuthenticated=${isAuthenticated}`);

  if (loading) {
    // Evita qualquer redirecionamento antes da verificação acabar
    return <div>Carregando sessão...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RotaProtegida;
