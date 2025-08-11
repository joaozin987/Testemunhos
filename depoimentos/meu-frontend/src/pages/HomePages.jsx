import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import versesData from '../data/verses.json'; // Nosso arquivo de dados

// Como o Navbar e o Footer estão no Layout, não precisamos importá-los aqui
// import Navbar from '../components/Navbar';

function HomePage() {
  // --- Seus estados, exatamente como você escreveu ---
  const [depoimentos, setDepoimentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isGoalSectionVisible, setIsGoalSectionVisible] = useState(false);
  const [isWordSectionVisible, setIsWordSectionVisible] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  
  const [termoBusca, setTermoBusca] = useState('');
  const [versiculoEncontrado, setVersiculoEncontrado] = useState(null);
  const [erroBusca, setErroBusca] = useState('');
  
  const navigate = useNavigate();
  const API_URL = 'http://localhost:3000';

  // Seu useEffect e funções, exatamente como você escreveu
  useEffect(() => {
    // A lógica para carregar depoimentos viria aqui...
    setIsLoading(false); // Apenas para o exemplo
  }, []);

  const handleSearchVerse = () => {
    setVersiculoEncontrado(null);
    setErroBusca('');
    const chaveBusca = termoBusca.trim().toLowerCase();
    if (versesData[chaveBusca]) {
      const versiculosDaCategoria = versesData[chaveBusca];
      const indiceSorteado = Math.floor(Math.random() * versiculosDaCategoria.length);
      const versiculoSorteado = versiculosDaCategoria[indiceSorteado];
      setVersiculoEncontrado(versiculoSorteado);
    } else {
      setErroBusca(`Não encontrei um versículo para "${termoBusca}". Tente outra palavra.`);
    }
  };

  const handleOpenImage = (imageUrl) => {
    setCurrentImage(imageUrl);
    setIsImageViewerOpen(true);
  };

  const handleOpenModal = (e) => {
    e.preventDefault(); // Impede que o link '#' recarregue a página
    setIsAlertOpen(true);
  };
  
  const handleCloseAlertAndOpenModal = () => {
    setIsAlertOpen(false);
    //setIsModalOpen(true); // Se você tiver um modal de formulário, ele seria aberto aqui
  };

  return (
    <>
       <section id="home" className="container mx-auto px-6 py-8">
        <div className="bg-blue-600 text-white text-center py-6 rounded-lg mb-4">
          <h2 className="text-4xl font-slab">DEUS MUDOU MEU VIVER</h2>
          <p className="mt-4 text-xl sm:text-2xl font-slab">Compartilhe suas experiências...</p>
          {/* O botão "Começar" agora mostra a próxima seção */}
          <button onClick={() => setIsGoalSectionVisible(true)} className="bg-white text-blue-600 px-6 py-2 rounded font-slab transition mt-6">
            Começar
          </button>
        </div>

        {/* Seção "Meta de Palavras" - SÓ APARECE SE isGoalSectionVisible FOR TRUE */}
        {isGoalSectionVisible && (
          <div className="w-full max-w-2xl mx-auto mt-6 p-4 bg-white rounded-lg shadow">
            <h3 className="text-3xl font-slab text-gray-800 mb-2 text-center">Meta de Palavras</h3>
            <p className="text-2xl font-slab text-gray-600 mb-2 text-center">Vamos alcançar a meta juntos!</p>
            <div className="w-full bg-gray-300 rounded-full h-4">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <button onClick={() => setIsWordSectionVisible(true)} className="block mt-3 p-2 bg-blue-600 text-white text-xl text-center font-slab rounded-lg w-full">
              Pedir a Palavra
            </button>
          </div>
        )}

        {/* Seção "Palavra do Dia" - SÓ APARECE SE isWordSectionVisible FOR TRUE */}
        {isWordSectionVisible && (
          <div className="flex flex-col items-center w-full max-w-2xl mx-auto mt-6 p-4 rounded-lg shadow bg-white">
            <h3 className="text-3xl text-center mb-2 text-gray-800 font-slab">Palavra do Dia</h3>
            <p className="mb-4 text-2xl font-slab text-gray-600">Escreva uma palavra que define seu dia</p>
            <input
              className="p-2 w-full mb-2 rounded border border-gray-300"
              type="text"
              placeholder="Escreva aqui"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <button onClick={handleSearchVerse} className="p-2 bg-gray-600 text-white text-xl font-slab rounded-lg w-full mt-3">
              Buscar a Palavra
            </button>
            <div className="verse-of-day mt-4 text-gray-800 text-center min-h-[100px]">
              {versiculoEncontrado && (
                <blockquote className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-xl font-slab">"{versiculoEncontrado.text}"</p>
                  <cite className="block text-right mt-2 font-bold not-italic">- {versiculoEncontrado.reference}</cite>
                </blockquote>
              )}
              {erroBusca && (
                <p className="text-red-500 font-slab">{erroBusca}</p>
              )}
            </div>
          </div>
        )}

        <div className="text-left mt-10 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl text-black font-slab">Meu Depoimento</h2>
          <h3 className="text-lg sm:text-xl text-gray-800 mt-4 font-slab">Olá Pessoal, me chamo <span className="text-blue-500 text-xl sm:text-2xl font-slab">João Paulo</span>...</h3>
          <p className="text-gray-700 font-slab text-base sm:text-lg leading-relaxed mt-4 text-justify">Entrei no EJC em 2023...</p>
        </div>

        <div className="text-center mt-10 max-w-4xl mx-auto">
          <p className="text-2xl font-medium text-gray-700">Tem Alguma Experiência para Compartilhar?</p>
          {/* Botão "Enviar" agora abre o alerta */}
          <a href="#" onClick={handleOpenModal} className="mt-2 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Enviar
          </a>
        </div>
      </section>

      {/* Modal de Alerta - SÓ APARECE SE isAlertOpen FOR TRUE */}
      {isAlertOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-md mx-4">
            <p className="mb-4 text-lg text-gray-700">Não esqueça que algumas informações e fotos sigilosas de movimentos não podem ser relatadas!</p>
            <button onClick={handleCloseAlertAndOpenModal} className="bg-blue-600 text-white px-4 py-2 rounded">
              Entendido, quero continuar
            </button>
          </div>
        </div>
      )}

      {/* Modal Visualizador de Imagem (ainda não usado nesta página, mas pronto para ser) */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setIsImageViewerOpen(false)}>
          <span className="absolute top-4 right-6 text-white text-4xl font-bold cursor-pointer">&times;</span>
          <img className="max-h-[90vh] max-w-[90vw] rounded-lg" src={currentImage} alt="Imagem ampliada" />
        </div>
      )}
    </>
  );
}

export default HomePage;