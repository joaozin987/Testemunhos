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
      if (token) {
        try {
          const response = await api.get("/perfil", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const usuarioBackend = response.data.usuario || response.data;

          const usuario = {
            ...usuarioBackend,
            isAdmin: usuarioBackend.role === 1, // role 1 = admin
          };

          setUser(usuario);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Erro ao buscar usuário:", err);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const register = async (nome, email, password) => {
    const res = await fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || "Erro ao cadastrar");

    const usuario = {
      ...data.usuario,
      isAdmin: data.usuario.role === 1,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    setUser(usuario);
    setIsAuthenticated(true);
    return data;
  };

  const login = async (email, password) => {
    const res = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || "Erro ao logar");

    const usuario = {
      id: data.usuario.id,
      nome: data.usuario.nome,
      email: data.usuario.email,
      upload_file: data.usuario.upload_file || "",
      bio: data.usuario.bio || "",
      cidade: data.usuario.cidade || "",
      versiculo_favorito: data.usuario.versiculo_favorito || "",
      isAdmin: data.usuario.role === 1, // role 1 = admin
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(usuario));

    setUser(usuario);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
