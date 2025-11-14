import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RotaAdmin() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    // Enquanto carrega os dados do usuário
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated || !user?.isAdmin) {
    // Se não estiver logado ou não for admin, redireciona para home
    return <Navigate to="/" replace />;
  }

  // Se for admin, renderiza as rotas internas
  return <Outlet />;
}
