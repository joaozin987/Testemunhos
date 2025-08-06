import React from 'react';
import Navbar from '../components/Navbar'; // Usando nosso componente reutilizável!
import { Link } from 'react-router-dom';   // Importando o Link para a navegação


function MuseuPage() {
  return (
    // Envolvemos tudo em um Fragment <>...</> para o React
    <>
      <Navbar />

      <div className="bg-accent200">
        {/* A div acima serve como o antigo <body> */}
        
        {/* Sidebar Mobile (Estrutura estática por enquanto) */}
        <div id="sidebar" className="fixed top-0 right-0 h-auto w-64 bg-accent200 text-bg100 transform translate-x-full transition-transform duration-300 z-50 shadow-lg md:hidden">
          <div className="flex justify-between items-center p-4 border-b border-bg100">
            <h2 className="text-2xl font-slab">Menu</h2>
            <button id="closeMenu" className="text-3xl">&times;</button>
          </div>
          <ul className="flex flex-col gap-4 p-4">
            <li><Link to="/museu" className="text-lg font-semibold">Museu</Link></li>
            <li><Link to="/" className="text-lg font-semibold">Início</Link></li>
            <li><Link to="/sobre" className="text-lg font-semibold">Sobre</Link></li>
            <li><Link to="/exemplos" className="text-lg font-semibold">Exemplos de Vida</Link></li>
            <li id="login-panel-mobile">
              <Link to="/login" className="text-lg font-semibold">Entrar</Link>
              <Link to="/cadastro" className="mt-2 inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Cadastre-se</Link>
            </li>
          </ul>
        </div>
        
        <section className="hero px-4 max-w-4xl mx-auto">
          <section className="bg-accent200 text-primary100 text-center mt-4 py-6 rounded-lg mb-4">
            <h2 className="text-4xl font-slab">DEUS MUDOU MEU VIVER</h2>
            <p className="text-center text-lg sm:text-xl mt-6 text-primary100 font-slab">
              Entrai neste lugar de silêncio e reverência Que cada expressão aqui registrada seja eco do Céu, alimento para a alma e testemunho do amor eterno do Senhor.
            </p>
          </section>
        </section>

        <div className="bg-accent300 p-8 text-center rounded-2xl mt-10">
          <h1 className="font-slab text-[2.5rem] text-[#e0e0e0] m-0">Museu das Palavras</h1>
          <p className="font-slab text-[1.5rem] text-[#e0e0e0] m-0">Frases que atravessam os séculos para tocar o coração</p>
        </div>

        {}
        <main className="mt-8 max-w-8xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="card3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <img src="/img/papa_francisco_vaticano-e1745231643320.webp" alt="Imagem de oração" className="w-full h-40 object-cover" />
            <div className="card-content p-5 flex flex-col flex-grow">
              <p className="quote text-base font-slab text-gray-700 flex-grow">"Queridos jovens, queria olhar nos olhos de cada um de vocês e lhes dizer: não tenham medo. E lhes digo algo ainda mais bonito: já não sou eu, é o próprio Jesus que está olhando neste momento."</p>
              <p className="author font-semibold mt-2 text-right text-gray-900 text-sm">— Papa Francisco</p>
            </div>
          </div>
          <div className="card3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
            <img src="/img/testemunho24.jpeg" alt="Imagem de luz" className="w-full h-40 object-cover" />
            <div className="card-content p-4 flex flex-col flex-grow">
              <p className="quote text-base font-slab text-gray-700 flex-grow">"Não posso temer um Deus que por mim se fez tão pequeno... Eu o amo! Porque Ele é somente Amor e Misericórdia!"</p>
              <p className="author font-semibold mt-2 text-right text-gray-900 text-sm">— Santa Teresinha do Menino Jesus</p>
            </div>
          </div>
          {}
        </main>
        
        {}

        <footer className="bg-accent200 text-bg100 text-center py-6 mt-10">
          <p>© 2025 Conectados pela Fé. Todos os direitos reservados.</p>
        </footer>

      </div>
    </>
  );
}

export default MuseuPage;