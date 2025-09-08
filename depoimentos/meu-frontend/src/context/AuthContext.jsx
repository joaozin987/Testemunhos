import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  // Configurar interceptor para responses
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Verificar se há token ao carregar a aplicação
  const verificarToken = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      setCarregando(false);
      return;
    }

    try {
      // Configurar axios para usar o token por padrão
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Buscar dados do usuário
      const response = await axios.get(`${API_URL}/user`);
      setUsuario(response.data);
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      if (error.response?.status === 401) {
        logout(); // Remove token inválido
      }
    } finally {
      setCarregando(false);
    }
  }, [API_URL]);

  useEffect(() => {
    verificarToken();
  }, [verificarToken]);

const login = async (email, senha) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            senha,
        });

        const token = response.data.access_token;
        
        if (!token) {
            throw new Error("Token não recebido do servidor");
        }
        
        localStorage.setItem("auth_token", token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Busque os dados completos do usuário
        const userData = await fetchUserData();
        setUsuario(userData);

        return userData;
    } catch (error) {
        console.error("Erro no login:", error);
        
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || "Erro ao fazer login");
        } else {
            throw new Error("Erro de conexão com o servidor");
        }
    }
};

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    delete axios.defaults.headers.common['Authorization'];
    setUsuario(null);
  }, []);

  const fetchUserData = async () => {
    try {
        const response = await axios.get(`${API_URL}/user`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        throw error;
    }
};

  // Função para verificar se o usuário é admin
  const isAdmin = useCallback(() => {
    return usuario && usuario.is_admin === true;
  }, [usuario]);

  const value = {
    usuario,
    carregando,
    login,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};