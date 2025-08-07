// HomePage.js

// PASSO 1: Importar os versículos, além das ferramentas que você já usava
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import versesData from '../data/verses.json'; // <-- NOSSO ARQUIVO DE DADOS

function HomePage() {
  // --- ESTADOS (A "MEMÓRIA" DA PÁGINA) ---
  const [depoimentos, setDepoimentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isGoalSectionVisible, setIsGoalSectionVisible] = useState(false);
  const [isWordSectionVisible, setIsWordSectionVisible] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  
  // PASSO 2: Adicionar novos estados para controlar a busca de versículos
  const [termoBusca, setTermoBusca] = useState(''); // Guarda o que o usuário digita
  const [versiculoEncontrado, setVersiculoEncontrado] = useState(null); // Guarda o resultado da busca
  const [erroBusca, setErroBusca] = useState(''); // Guarda mensagens de erro da busca
  
  const navigate = useNavigate();
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    // ... (todo o seu useEffect para carregar depoimentos continua igual)
    const carregarDepoimentos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/depoimentos`);
        if (!response.ok) throw new Error('Falha ao carregar depoimentos.');
        const data = await response.json();
        setDepoimentos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    setIsLoading(false);
  }, []);

  // PASSO 3: Criar a função que busca o versículo quando o botão é clicado
  const handleSearchVerse = () => {
    // Limpa resultados anteriores
    setVersiculoEncontrado(null);
    setErroBusca('');

    // Normaliza o texto digitado (minúsculo, sem espaços extras)
    const chaveBusca = termoBusca.trim().toLowerCase();

    // Verifica se a palavra existe no nosso arquivo verses.json
    if (versesData[chaveBusca]) {
      const versiculosDaCategoria = versesData[chaveBusca];
      const indiceSorteado = Math.floor(Math.random() * versiculosDaCategoria.length);
      const versiculoSorteado = versiculosDaCategoria[indiceSorteado];
      setVersiculoEncontrado(versiculoSorteado);
    } else {
      // Se não encontrar, define uma mensagem de erro
      setErroBusca(`Não encontrei um versículo para "${termoBusca}". Tente outra palavra.`);
    }
  };

  // --- FUNÇÕES DE EVENTO (Handlers) ---
  const handleOpenImage = (imageUrl) => {
    setCurrentImage(imageUrl);
    setIsImageViewerOpen(true);
  };

  const handleOpenModal = () => {
    setIsAlertOpen(true);
  };
  
  const handleCloseAlertAndOpenModal = () => {
    setIsAlertOpen(false);
    setIsModalOpen(true);
  };
  
  return (
    <>
      <Navbar />

      <div className="bg-accent200">
        <section className="hero px-4 max-w-4xl mx-auto">
          {/* ... (o início da sua página continua igual) ... */}
          <section className="bg-accent200 text-primary100 text-center mt-4 py-6 rounded-lg mb-4">
              <h2 className="text-4xl font-slab">DEUS MUDOU MEU VIVER</h2>
              <p className="mt-4 text-xl font-slab text-bg100 sm:font-slab sm:text-2xl">Compartilhe suas experiências...</p>
              <button onClick={() => setIsGoalSectionVisible(true)} className="bg-primary300 text-white px-6 py-2 rounded font-slab transition mt-6">
                Começar
              </button>
            </section>

            {isGoalSectionVisible && (
              <div className="w-75 mx-auto mt-6 p-4 bg-accent100 rounded shadow">
                <h3 className="text-3xl font-slab text-primary100 mb-2 text-center">Meta de Palavras</h3>
                <p className="text-2xl font-slab text-primary100 mb-2 text-center">Vamos alcançar a meta juntos!</p>
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div className="bg-green-500 h-4 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <button onClick={() => setIsWordSectionVisible(true)} className="mt-3 p-2 bg-primary100 text-xl font-slab rounded-lg w-full">
                  Pedir a Palavra
                </button>
              </div>
            )}
            
            {isWordSectionVisible && (
              // PASSO 4: Conectar a interface (JSX) com a nossa lógica
              <div className="flex flex-col items-center w-full mx-auto mt-6 p-4 rounded shadow bg-accent100">
                <h3 className="text-3xl text-center mb-2 text-primary100 font-slab">Palavra do Dia</h3>
                <p className="mb-4 text-2xl font-slab text-primary100">Escreva uma palavra que define seu dia</p>
                <input
                  className="p-2 w-full mb-2 rounded"
                  type="text"
                  placeholder="Escreva aqui"
                  aria-label="Digite uma palavra que define seu dia"
                  value={termoBusca} // Conecta o valor do input ao nosso estado
                  onChange={(e) => setTermoBusca(e.target.value)} // Atualiza o estado a cada letra digitada
                />
                <button 
                  className="p-2 bg-gray-100 text-xl font-slab rounded-lg w-full mt-3"
                  onClick={handleSearchVerse} // Chama nossa função de busca ao clicar
                >
                  Buscar a Palavra
                </button>
                
                {/* A div de resultado agora é inteligente */}
                <div className="verse-of-day mt-4 text-white text-center">
                  {versiculoEncontrado && (
                    // Se encontrou um versículo, mostra ele
                    <blockquote className="text-bg100">
                      <p className="text-xl font-slab">"{versiculoEncontrado.text}"</p>
                      <cite className="block text-right mt-2 font-bold not-italic">- {versiculoEncontrado.reference}</cite>
                    </blockquote>
                  )}
                  {erroBusca && (
                    // Se deu erro na busca, mostra a mensagem
                    <p className="text-red-400 font-slab">{erroBusca}</p>
                  )}
                </div>
              </div>
            )}
          </section>
          
          {/* ... (o resto da sua página continua igual) ... */}
          <main className="p-6 sm:p-10 mt-7 rounded-lg bg-gray-100 max-w-6xl mx-auto">
          </main>
        
          <div className="text-center mt-10 max-w-4xl mx-auto">
            <p className="text-2xl font-medium text-text100">Tem Alguma Experiência para Compartilhar?</p>
            <button onClick={handleOpenModal} className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Enviar
            </button>
          </div>
          
          {isImageViewerOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={() => setIsImageViewerOpen(false)}>
              <span className="absolute top-4 right-6 text-white text-3xl cursor-pointer">&times;</span>
              <img className="max-h-[90vh] max-w-[90vw] rounded-lg" src={currentImage} alt="Imagem ampliada" />
            </div>
          )}

          <footer className="bg-accent200 text-bg100 text-center py-6 mt-10">
            <p>© 2025 Conectados pela Fé. Todos os direitos reservados.</p>
          </footer>
        </div>
      </>
    );
  }

export default HomePage;