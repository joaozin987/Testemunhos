import { createContext, useContext, useState, useEffect } from "react";
// Importa a instância do Axios (api), que agora tem a lógica de URL dinâmica
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
      const response = await api.get("/perfil");

      const usuarioBackend = response.data.usuario || response.data;

     const usuario = {
      ...usuarioBackend,
     isAdmin: usuarioBackend.role === 1, 
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

  // 🚀 Função de Cadastro (Usando Axios 'api.post')
 const register = async (nome, email, password) => {
  try {
        // Usa a URL base do 'api.js' corrigido e o endpoint '/register'
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
            const erroMsg = error.response?.data?.erro || "Erro ao cadastrar";
            throw new Error(erroMsg);
 }
 };

 const login = async (email, password) => {
 try {
        // Usa a URL base do 'api.js' corrigido e o endpoint '/login'
        const res = await api.post("/login", { email, password });
        const data = res.data;

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
    } catch (error) {
            // Trata o erro de resposta do Axios (4xx, 5xx)
            const erroMsg = error.response?.data?.erro || "Erro ao logar";
            throw new Error(erroMsg);
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
 value={{ user, setUser, isAuthenticated, loading, login, register, logout }}
 >
{children}
</AuthContext.Provider>
 );
}

export const useAuth = () => useContext(AuthContext);