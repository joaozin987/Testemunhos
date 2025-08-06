import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function SobrePage() {
  return (
    <>
      <Navbar />

      <div className="bg-accent200">
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

        <div className="about-idea bg-accent200 w-full rounded-2xl py-12 px-6 sm:px-10 md:px-20 shadow-black/20 ">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-slab text-white drop-shadow-md">
              Como Surgiu a Ideia
            </h2>
          </div>
        
          <div className="max-w-4xl mx-auto text-white text-lg sm:text-xl leading-relaxed space-y-6">
            <p className="text-white/90 text-2xl text-justify">
              Esta ideia não nasceu de mim — <span className="text-text100 font-slab">foi Deus quem a plantou em meu coração</span>. Ela permaneceu pulsando em minha mente por duas semanas, como um chamado insistente, algo que precisava ganhar vida.
            </p>
            <p className="text-white/90 text-2xl text-justify">
              Senti-me usado como um <span className="text-text100 font-slab">instrumento de fé</span> para alcançar outros jovens. Cada detalhe deste site foi cuidadosamente inspirado por Ele, que me guiou com clareza em cada etapa.
            </p>
            <p className="text-white/90 text-2xl text-justify">
              Deus me mostrou que este seria um <span className="text-text100 font-slab">espaço para testemunhos</span> — um lugar onde jovens poderiam partilhar suas experiências, superações, dúvidas e reencontros com Ele.
            </p>
            <p className="text-white/90 text-2xl text-justify">
              Aqui, <strong className="text-white">cada história é uma semente de esperança</strong>. Cada depoimento é uma prova viva de que <span className="font-slab text-text100">Deus age nos detalhes</span> — e que, juntos, somos mais fortes na caminhada da fé.
            </p>
            <p className="text-white/90 text-justify">
             A <span className=" font-slab text-2xl">salvação é unica</span>,<span className="text-text100 text-2xl"> mas a caminhada não precisa ser</span> <span className="font-slab text-2xl">vamos junto até o céu</span>
            </p>
          </div>
        </div>

        <footer className="bg-accent200 text-bg100 text-center py-6 mt-10">
          <p>© 2025 Conectados pela Fé. Todos os direitos reservados.</p>
        </footer>
      </div>
    </>
  );
}

export default SobrePage;