import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import versesData from '../data/verses.json';

function HomePage() {
  const [depoimentos, setDepoimentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isGoalSectionVisible, setIsGoalSectionVisible] = useState(false);
  const [isWordSectionVisible, setIsWordSectionVisible] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const [versiculoEncontrado, setVersiculoEncontrado] = useState(null);
  const [erroBusca, setErroBusca] = useState('');

  // Estados para a paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Número de depoimentos por página

  const [formData, setFormData] = useState({
    name: '',
    movement: '',
    location: '',
    experience: ''
  });

  const navigate = useNavigate();
  const API_URL = 'http://127.0.0.1:8000/api';

  // useEffect para buscar os depoimentos na inicialização
  useEffect(() => {
    const fetchDepoimentos = async () => {
      try {
        const response = await fetch(`${API_URL}/depoimentos`);
        if (!response.ok) {
          throw new Error('Falha ao buscar depoimentos.');
        }
        const data = await response.json();
        setDepoimentos(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao buscar depoimentos:", err);
        setError("Não foi possível carregar os depoimentos. Por favor, verifique se o servidor está rodando.");
        setIsLoading(false);
      }
    };
    fetchDepoimentos();
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

  const handleOpenAlert = (e) => {
    e.preventDefault();
    setIsAlertOpen(true);
  };

  const handleCloseAlertAndOpenModal = () => {
    setIsAlertOpen(false);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/depoimentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Falha ao enviar o depoimento. Status: ${response.status}`);
      }
      
      const newDepoimento = await response.json();
      setDepoimentos(prevDepoimentos => [...prevDepoimentos, newDepoimento]);
      
      alert("Obrigado por compartilhar sua experiência!");
      setFormData({ name: '', movement: '', location: '', experience: '' });
      handleCloseFormModal();

    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      alert("Houve um erro ao enviar seu relato. Verifique o console ou tente novamente.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepoimentos = depoimentos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(depoimentos.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Seção principal do JSX
  return (
    <>
      <section id="home" className="container mx-auto px-6 py-8">
        <div className="bg-blue-800 text-white text-center py-6 rounded-lg mb-4">
          <h2 className="text-4xl font-slab">DEUS MUDOU MEU VIVER</h2>
          <p className="mt-4 text-xl sm:text-2xl font-slab">Compartilhe suas experiências...</p>
          <button onClick={() => setIsGoalSectionVisible(true)} className="bg-white text-blue-600 px-6 py-2 rounded font-slab transition mt-6">
            Começar
          </button>
        </div>

        {isGoalSectionVisible && (
          <div className="w-full max-w-2xl mx-auto mt-6 p-4 bg-gray-200 rounded-lg shadow">
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

        <div className="p-8 sm:p-10 mt-7 rounded-lg bg-gray-300 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <img
                src="/src/assets/img/bde0b9ac-ee47-466d-b881-9743b3d8cd46.jpeg"
                className="w-72 h-72 sm:w-56 sm:h-56 md:w-80 md:h-80 object-cover rounded-lg shadow-md cursor-pointer"
                alt="Imagem de João Paulo compartilhando sua experiência no EJC"
                onClick={() => handleOpenImage('/src/assets/img/bde0b9ac-ee47-466d-b881-9743b3d8cd46.jpeg')}
              />
            </div>
            <div className="text-left mt-10 md:mt-0 ml-0 md:ml-5 max-w-4xl">
              <h2 className="text-3xl sm:text-4xl text-black font-slab">Meu Depoimento</h2>
              <h3 className="text-lg sm:text-xl text-gray-800 mt-4 font-slab">
                Olá Pessoal, me chamo <span className="text-blue-500 text-xl sm:text-2xl font-slab">João Paulo</span>
              </h3>
              <p className="text-gray-700 font-slab text-base sm:text-lg leading-relaxed mt-4 text-justify">
                Entrei no EJC em 2023 e, de lá para cá, tive muitos ensinamentos. O que achei mais fascinante foi o de amar ao próximo.
                Diversas vezes passei por ocasiões difíceis, tanto espiritualmente quanto fisicamente, e, a cada situação, eu me surpreendia
                mais com o acolhimento e a ajuda que recebi. Acho que nunca tinha sido tão bem tratado desde que meu irmão faleceu em 2022.
                Cheguei a pensar que nunca conseguiria me recuperar. Mas logo em seguida veio o EJC e curou todas as minhas feridas,
                mostrando-me que vale a pena ser feliz, independentemente de qualquer situação, e que sempre devemos confiar nos planos de Deus.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 max-w-4xl mx-auto">
          <p className="text-2xl font-bold text-white">Tem Alguma Experiência para Compartilhar?</p>
          <a href="#" onClick={handleOpenAlert} className="mt-2 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Enviar
          </a>
        </div>
      </section>

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

      {isImageViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setIsImageViewerOpen(false)}>
          <span className="absolute top-4 right-6 text-white text-4xl font-bold cursor-pointer">&times;</span>
          <img className="max-h-[90vh] max-w-[90vw] rounded-lg" src={currentImage} alt="Imagem ampliada" />
        </div>
      )}

      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg text-left max-w-lg w-full overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Compartilhe sua Experiência</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Seu Nome (Opcional)</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Anônimo"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="movement" className="block text-gray-700 font-semibold mb-2">Nome do movimento (EJC, SEGME, etc.)</label>
                <input
                  type="text"
                  id="movement"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: EJC"
                  value={formData.movement}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">Município e Estado (ou Bairro, se for de Maceió)</label>
                <input
                  type="text"
                  id="location"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Penedo - AL"
                  value={formData.location}
                  onChange={handleFormChange}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="experience" className="block text-gray-700 font-semibold mb-2">Seu Depoimento</label>
                <textarea
                  id="experience"
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva sua experiência aqui..."
                  required
                  value={formData.experience}
                  onChange={handleFormChange}
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={handleCloseFormModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  Enviar Relato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Esta é a seção de depoimentos paginados que deve vir depois de todo o conteúdo */}
      <hr className='my-12 border-t border-gray-700' />

      <section id='depoimentos-list' className='container mx-auto px-6 py-8'>
        <h2 className='text-4xl font-slab text-white text-center mb-10'>Depoimentos Compartilhados</h2>
        
        {isLoading ? (
          <div className="text-center font-slab text-white text-3xl">Carregando Depoimentos...</div>
        ) : error ? (
          <div className="text-center font-slab text-red-500 text-3xl">Erro: {error}</div>
        ) : currentDepoimentos.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">Nenhum depoimento encontrado. Seja o primeiro a compartilhar!</p>
        ) : (
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {currentDepoimentos.map((depoimento, index) => (
              <div key={index} className='bg-white p-6 rounded-lg shadow-lg'>
                <p className='text-gray-600 font-bold text-sm'>{depoimento.movement}</p>
                <h3 className='text-xl font-bold text-gray-700 mt-2'>"{depoimento.experience.substring(0, 100)}..."</h3>
                <p className='text-gray-500 mt-2 text-sm'>
                  - {depoimento.name || 'Anônimo'}, {depoimento.location}
                </p>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className='mt-10 flex justify-center items-center gap-3'>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-slab transition ${
                currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Anterior
            </button>

            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded-lg font-slab transition ${
                  currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-slab transition ${
                currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Próxima
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default HomePage;