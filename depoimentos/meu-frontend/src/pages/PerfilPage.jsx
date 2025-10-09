import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function PerfilPage() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    nome: "",
    cidade: "",
    upload_file: null,
    bio: "",
    versiculo_favorito: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        cidade: user.cidade || "",
        upload_file: user.upload_file || null,
        bio: user.bio || "",
        versiculo_favorito: user.versiculo_favorito || "",
      });
      setPreviewImage(user.upload_file || null);
    }
  }, [user]);

 
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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
        upload_file: updatedUser.upload_file || null,
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
    <div className="perfil-page mt-4 p-6 max-w-xl mx-auto bg-white shadow-2xl rounded-2xl">
      <h1 className="text-3xl font-serif text-emerald-700 mb-6 text-center">Meu Perfil</h1>

      <div className="relative w-40 h-40 mx-auto mb-5">
        <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden shadow-xl border-4 border-white flex items-center justify-center">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Foto de Perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-20 h-20 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        {isEditing && (
          <label
            htmlFor="upload_file"
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
          >
            <i className="bi bi-camera-fill text-xl"></i>
            <input
              type="file"
              id="upload_file"
              name="upload_file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              disabled={!isEditing}
            />
          </label>
        )}
      </div>

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
            className="bg-blue-500 text-white px-4 py-2 w-40 rounded mt-2 hover:bg-blue-600 transition"
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
                  upload_file: user.upload_file || null,
                  bio: user.bio || "",
                  versiculo_favorito: user.versiculo_favorito || "",
                });
                setPreviewImage(user.upload_file || null);
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