import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configura axios para enviar cookies automaticamente
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // envia cookies automaticamente
  });

  useEffect(() => {
    // Verifica se já existe sessão no backend
    const checkSession = async () => {
      try {
        const response = await api.get('/perfil');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = useCallback(async (email, senha) => {
    try {
      await api.post('/login', { email, senha }); // backend seta o cookie httpOnly
      const profileResponse = await api.get('/perfil');
      setUser(profileResponse.data);
      setIsAuthenticated(true);
      navigate('/perfil');
    } catch (error) {
      throw error;
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await api.post('/logout'); // cria rota /logout no backend que limpa o cookie
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [navigate]);

  const value = React.useMemo(() => ({
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    api, // expõe a instância do axios pronta com cookies
  }), [isAuthenticated, user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);