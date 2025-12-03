import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RotaAdmin() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
