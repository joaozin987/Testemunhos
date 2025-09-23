import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function RedefinirSenhaPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMensagem("");
    setTipoMensagem("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg =
          data.message ||
          (data.errors ? Object.values(data.errors).join(", ") : "Erro ao redefinir senha");
        throw new Error(msg);
      }

      setMensagem(data.message || "Senha redefinida com sucesso!");
      setTipoMensagem("success");

      // Redireciona para login após 2s
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMensagem(error.message || "Erro no servidor");
      setTipoMensagem("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 text-center w-full max-w-md rounded-xl shadow-lg"
        >
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Redefinir Senha
          </h1>
          <p className="mb-6 text-gray-600">
            Digite sua nova senha para a conta vinculada ao e-mail:
          </p>

          <div className="w-full mb-4 p-3 border border-gray-200 bg-gray-100 rounded-lg text-gray-700 text-sm">
            {email}
          </div>

          <label
            htmlFor="password"
            className="block text-left text-lg mb-1 font-semibold text-gray-700"
          >
            Nova Senha
          </label>
          <input
            className="w-full rounded-lg mb-4 p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label
            htmlFor="password_confirmation"
            className="block text-left text-lg mb-1 font-semibold text-gray-700"
          >
            Confirmar Nova Senha
          </label>
          <input
            className="w-full rounded-lg mb-4 p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            type="password"
            id="password_confirmation"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Redefinir Senha"}
          </button>

          {mensagem && (
            <div
              className={`mt-4 p-3 rounded-lg font-medium ${
                tipoMensagem === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {mensagem}
            </div>
          )}
        </form>
      </section>
    </>
  );
}

export default RedefinirSenhaPage;
