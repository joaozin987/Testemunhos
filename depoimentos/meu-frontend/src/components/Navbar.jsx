import React from 'react';
import { Link } from 'react-router-dom'; // Usamos Link para navegação no React

function Navbar() {
  return (
    <nav className="bg-blue-600 shadow p-4 flex items-center justify-between relative sticky top-0 z-40">
      {/* Título/Logo */}
      <h1 className="text-3xl font-slab text-white">
        <Link to="/">Conectados pela Fé</Link>
      </h1>

      {/* Menu Mobile (usando a tag <details>) */}
      <details className="md:hidden relative">
        <summary className="list-none cursor-pointer">
          <span className="text-3xl text-white">&#9776;</span>
        </summary>
        <div className="absolute top-12 right-0 w-56 bg-blue-500 rounded-lg shadow-xl z-50 p-4">
          <ul className="flex flex-col gap-4 text-white">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/museu">Museu</Link></li>
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/exemplos">Exemplos de Vida</Link></li>
            <hr className="border-blue-400" />
            <li><Link to="/login">Entrar</Link></li>
            <li><Link to="/cadastro">Cadastre-se</Link></li>
          </ul>
        </div>
      </details>

      {/* Menu Desktop */}
      <div className="hidden md:flex items-center gap-6">
        <ul className="flex gap-6">
          <li><Link className="text-lg font-semibold text-white" to="/museu">Museu</Link></li>
          <li><Link className="text-lg font-semibold text-white" to="/">Início</Link></li>
          <li><Link className="text-lg font-semibold text-white" to="/sobre">Sobre</Link></li>
          <li><Link className="text-lg font-semibold text-white" to="/exemplos">Exemplos de Vida</Link></li>
        </ul>

        <div className="flex items-center gap-2">
          <Link to="/login" className="text-lg font-semibold text-white">Entrar</Link>
          <Link to="/cadastro" className="inline-block bg-white text-blue-600 font-bold py-2 px-4 rounded-lg">Cadastre-se</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;