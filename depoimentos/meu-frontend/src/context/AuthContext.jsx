// src/context/AuthContext.jsx (VERSÃO CORRIGIDA)

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // PASSO 1: Se um token existe, configure a API para usá-lo imediatamente
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      api.get('/perfil')
        .then(response => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, senha) => {
    const response = await api.post('/login', { email, senha });
    const { token } = response.data;

    localStorage.setItem('token', token);
    
    // PASSO 2: Configure a API para usar o novo token em todas as chamadas futuras
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Agora a chamada para /perfil vai funcionar porque a autorização foi enviada
    const profileResponse = await api.get('/perfil');
    setUser(profileResponse.data);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    
    // PASSO 3: Limpe o cabeçalho de autorização da API
    delete api.defaults.headers.common['Authorization'];

    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}