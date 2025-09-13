import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensagem, setMensagem] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setMensagem(err.message || "Erro ao tentar logar");
    } finally {
      setIsLoading(false);
    }
  };
 <>
  
 </>
  return (
   
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white grid p-8 text-center w-full max-w-md rounded-xl shadow-xl"
      >
        <h1 className="text-3xl font-slab mb-3">Faça o Login</h1>

        {mensagem && (
          <p className="text-red-500 mb-3 text-center text-lg font-semibold">{mensagem}</p>
        )}

        <label className="text-left text-xl mb-2 font-slab" htmlFor="loginEmail">
          E-mail
        </label>
        <input
          id="loginEmail"
          className="w-full rounded-lg mb-4 p-3 border border-gray-300"
          type="email"
          placeholder="Digite seu email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-left text-xl mb-1 mt-3 font-slab" htmlFor="loginPassword">
          Senha
        </label>
        <input
          id="loginPassword"
          className="w-full rounded-lg mb-4 p-3 border border-gray-300"
          type="password"
          placeholder="Digite sua senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link className="text-right text-blue-800 mb-4 block" to="/recuperar-senha">
          Esqueceu a senha?
        </Link>

        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Continuar"}
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
