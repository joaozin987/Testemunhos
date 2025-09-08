import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function RotaAdmin({ children }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!usuario.isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p>Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return children;
}

export default RotaAdmin;