import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function PerfilPage() {
  const { user, setUser } = useAuth();

  const initialFormData = {
    nome: "",
    cidade: "",
    upload_file: null,
    bio: "",
    versiculo_favorito: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      const updatedForm = {
        nome: user.nome || "",
        cidade: user.cidade || "",
        upload_file: null,
        bio: user.bio || "",
        versiculo_favorito: user.versiculo_favorito || "",
      };
      setFormData(updatedForm);
      setPreviewImage(user.upload_file || null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, upload_file: file }));

        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMensagem("");

    try {
      const data = new FormData();
      data.append("nome", formData.nome);
      data.append("cidade", formData.cidade);
      data.append("bio", formData.bio);
      data.append("versiculo_favorito", formData.versiculo_favorito);

      if (formData.upload_file instanceof File) {
        data.append("upload_file", formData.upload_file);
      }

      const response = await api.put("/perfil", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data.usuario;
      setUser(updatedUser);
      setPreviewImage(updatedUser.upload_file || null);

      setMensagem("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMensagem(error.response?.data?.mensagem || "Erro ao salvar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        nome: user.nome || "",
        cidade: user.cidade || "",
        upload_file: null,
        bio: user.bio || "",
        versiculo_favorito: user.versiculo_favorito || "",
      });
      setPreviewImage(user.upload_file || null);
    }
    setIsEditing(false);
    setMensagem("");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center">
      <div className="w-full max-w-lg mt-10 bg-gray-800 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-400">Meu Perfil</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={previewImage || "https://placehold.co/150x150/png"}
              className="w-36 h-36 rounded-full object-cover border-4 border-emerald-500 shadow-lg"
            />

            {isEditing && (
              <label
                htmlFor="upload_file"
                className="absolute bottom-1 right-1 bg-emerald-500 hover:bg-emerald-600 transition p-2 rounded-full cursor-pointer shadow"
              >
                <i className="bi bi-camera-fill text-white text-lg"></i>
                <input
                  type="file"
                  id="upload_file"
                  name="upload_file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {mensagem && (
          <div
            className={`p-2 mb-4 text-center rounded ${
              mensagem.includes("Erro") ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSaveSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nome:</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1">Cidade:</label>
            <input
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
              
            />
          </div>

          <div>
            <label className="block mb-1">Bio:</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>

          <div>
            <label className="block mb-1">Versículo Favorito:</label>
            <input
              type="text"
              name="versiculo_favorito"
              value={formData.versiculo_favorito}
              onChange={handleChange}
              disabled={!isEditing || isSaving}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isSaving}
              className="w-full bg-emerald-500 hover:bg-emerald-600 transition py-2 rounded font-bold mt-2"
            >
              Editar
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-blue-500 hover:bg-blue-600 transition py-2 rounded font-bold flex justify-center items-center gap-2"
              >
                {isSaving && <i className="bi bi-arrow-clockwise animate-spin"></i>}
                {isSaving ? "Salvando..." : "Salvar"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex-1 bg-red-500 hover:bg-red-600 transition py-2 rounded font-bold"
              >
                Cancelar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}