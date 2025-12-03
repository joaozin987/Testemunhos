import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/perfil");

      const usuario = response.data.usuario;

      setUser({
        ...usuario,
        isAdmin: response.data.isAdmin,
      });

      setIsAuthenticated(true);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  const register = async (nome, email, password) => {
    try {
      const res = await api.post("/register", { nome, email, password });
      const data = res.data;

        const usuario = {
        ...data.usuario,
        isAdmin: data.usuario.role === 1,
      };


      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      setUser(usuario);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      const erro = error.response?.data?.erro || "Erro ao registrar";
      throw new Error(erro);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      const data = res.data;

      const usuario = {
        ...data.usuario,
        isAdmin: data.isAdmin,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      setUser(usuario);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      const erro = error.response?.data?.erro || "Erro ao fazer login";
      throw new Error(erro);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
