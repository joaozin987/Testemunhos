
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

function LayoutPublico() {
  const { isAuthenticated, loading } = useAuth();

  
  if (loading) {
    return <div>Carregando...</div>;
  }

  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

 
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default LayoutPublico;
