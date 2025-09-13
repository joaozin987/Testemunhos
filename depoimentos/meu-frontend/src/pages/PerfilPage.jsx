import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function PerfilPage() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    cidade: "",
    upload_file: "",
    bio: "",
    versiculo_favorito: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        cidade: user.cidade || "",
        upload_file: user.upload_file || "",
        bio: user.bio || "",
        versiculo_favorito: user.versiculo_favorito || "",
      });
    }
  }, [user]);

 
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Salva o perfil
  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMensagem("");

    try {
      const token = localStorage.getItem("token");

      
      const data = new FormData();
      data.append("nome", formData.nome);
      data.append("cidade", formData.cidade);
      data.append("bio", formData.bio);
      data.append("versiculo_favorito", formData.versiculo_favorito);

      if (formData.upload_file instanceof File) {
        data.append("upload_file", formData.upload_file);
      }

      
      const response = await api.put("/perfil", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = response.data.usuario;

      setFormData({
        nome: updatedUser.nome || "",
        cidade: updatedUser.cidade || "",
        upload_file: updatedUser.upload_file || "",
        bio: updatedUser.bio || "",
        versiculo_favorito: updatedUser.versiculo_favorito || "",
      });

      setUser(updatedUser);
      setMensagem("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error.response || error);
      setMensagem(error.response?.data?.mensagem || "Erro ao salvar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="perfil-page mt-4 p-6 max-w-xl mx-auto bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      {mensagem && (
        <div
          className={`mb-4 p-2 rounded ${
            mensagem.includes("Erro") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {mensagem}
        </div>
      )}

      <form onSubmit={handleSaveSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Nome:
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="border p-2 rounded mt-1"
            disabled={!isEditing}
          />
        </label>

        <label className="flex flex-col">
          Cidade:
          <input
            type="text"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            className="border p-2 rounded mt-1"
            disabled={!isEditing}
          />
        </label>

        <label className="flex flex-col">
          Escolha a sua imagem:
          <input
            type="file"
            name="upload_file"
            onChange={handleChange} // ✅ lida com arquivo
            className="border p-2 rounded mt-1"
            disabled={!isEditing}
          />
        </label>

        <label className="flex flex-col">
          Bio:
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="border p-2 rounded mt-1"
            disabled={!isEditing}
          />
        </label>

        <label className="flex flex-col">
          Versículo favorito:
          <input
            type="text"
            name="versiculo_favorito"
            value={formData.versiculo_favorito}
            onChange={handleChange}
            className="border p-2 rounded mt-1"
            disabled={!isEditing}
          />
        </label>

        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-25 hover:bg-blue-600 transition"
          >
            Editar
          </button>
        ) : (
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  nome: user.nome || "",
                  cidade: user.cidade || "",
                  upload_file: user.upload_file || "",
                  bio: user.bio || "",
                  versiculo_favorito: user.versiculo_favorito || "",
                });
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
