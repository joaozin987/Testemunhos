import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle do menu mobile
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-blue-800 shadow p-4 flex items-center justify-between sticky top-0 z-40">
      <h1 className="text-3xl font-slab text-white">
        <Link to="/">Conectados pela Fé</Link>
      </h1>

      {/* Botão menu mobile */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-white text-3xl focus:outline-none"
        aria-label="Menu"
      >
        &#9776;
      </button>

      {/* Menu Desktop */}
      <ul className="hidden md:flex items-center gap-6">
        <li><Link to="/" className="text-white font-semibold">Início</Link></li>
        <li><Link to="/exemplos" className="text-white font-semibold">Exemplos</Link></li>
        <li><Link to="/museu" className="text-white font-semibold">Museu</Link></li>
        <li><Link to="/sobre" className="text-white font-semibold">Sobre</Link></li>

        {isAuthenticated ? (
          <>
            <li>
              <Link to="/perfil" className="text-white font-semibold">
                Olá, {user?.nome || user?.email}
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="text-white font-semibold bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Sair
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="text-white font-semibold">Entrar</Link></li>
            <li>
              <Link to="/cadastro" className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg">
                Cadastre-se
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="absolute top-full right-0 w-56 bg-blue-500 rounded-lg shadow-xl z-50 p-4 md:hidden">
          <ul className="flex flex-col gap-4 text-white">
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Início</Link></li>
            <li><Link to="/exemplos" onClick={() => setMenuOpen(false)}>Exemplos</Link></li>
            <li><Link to="/museu" onClick={() => setMenuOpen(false)}>Museu</Link></li>
            <li><Link to="/sobre" onClick={() => setMenuOpen(false)}>Sobre</Link></li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                    Olá, {user?.nome || user?.email}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="text-white font-semibold bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition w-full text-left"
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" onClick={() => setMenuOpen(false)}>Entrar</Link></li>
                <li>
                  <Link
                    to="/cadastro"
                    onClick={() => setMenuOpen(false)}
                    className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg inline-block text-center"
                  >
                    Cadastre-se
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
