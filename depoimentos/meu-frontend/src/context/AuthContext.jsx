import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Verifica token ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/perfil')
        .then(response => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Login com redirect garantido
const login = useCallback(async (email, senha) => {
  try {
    const response = await api.post('/login', { email, senha });
    const { token } = response.data;

    // Salva token
    localStorage.setItem('token', token);

    // Configura header imediatamente
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Busca perfil já autenticado
    const profileResponse = await api.get('/perfil');

    setUser(profileResponse.data);
    setIsAuthenticated(true);

    // Redireciona após garantir que o user está setado
    navigate('/perfil');
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}, [navigate]);


  const logout = useCallback(() => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const value = React.useMemo(() => ({
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  }), [isAuthenticated, user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
