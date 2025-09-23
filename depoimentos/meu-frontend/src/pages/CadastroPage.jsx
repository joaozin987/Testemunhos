import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function CadastroPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // agora padronizado
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem("");

    try {
      await register(nome, email, password);
      alert("Cadastro realizado com sucesso! Você será redirecionado para o login.");
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setMensagem(error.message || "Erro ao cadastrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      
      <section className="flex justify-center items-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white grid p-8 text-center w-full max-w-md rounded-xl shadow-lg"
        >
          <h1 className="text-3xl font-slab mb-4">Crie sua conta</h1>

          <label className="text-left text-xl mb-2 font-slab" htmlFor="registerName">
            Nome
          </label>
          <input
            id="registerName"
            className="w-full rounded-lg mb-4 p-3 border border-gray-300"
            type="text"
            placeholder="Digite seu nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label className="text-left text-xl mb-2 font-slab" htmlFor="registerEmail">
            E-mail
          </label>
          <input
            id="registerEmail"
            className="w-full rounded-lg mb-4 p-3 border border-gray-300"
            type="email"
            placeholder="Digite seu email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-left text-xl mb-2 font-slab" htmlFor="registerPassword">
            Password
          </label>
          <input
            id="registerPassword"
            className="w-full rounded-lg mb-4 p-3 border border-gray-300"
            type="password"
            placeholder="Digite sua password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Continuar"}
          </button>

          {mensagem && (
            <p className="text-red-500 mt-4 text-lg font-semibold">{mensagem}</p>
          )}
        </form>
      </section>
    </>
  );
}

export default CadastroPage;
