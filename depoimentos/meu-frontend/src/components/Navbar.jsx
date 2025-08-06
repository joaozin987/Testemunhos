import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importa o hook de autenticação

function Navbar() {
  // 2. Lê o status de login REAL do nosso AuthContext
  const { isLoggedIn, logout } = useAuth(); 
  const navigate = useNavigate();

  // 3. Cria estados para controlar os menus
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redireciona para o login após sair
  };

  return (
    <nav className="bg-accent200 shadow p-4 flex items-center justify-between relative">
      <h1 className="text-3xl font-slab text-primary100"><Link to="/">Conectados pela Fé</Link></h1>
    
      {/* Botão do menu mobile agora tem uma função onClick */}
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-3xl text-bg100">&#9776;</button>
    
      {/* Menu Desktop */}
      <div className="hidden md:flex items-center gap-6">
          <ul className="flex gap-6">
              <li><Link className="text-lg font-semibold text-bg100" to="/museu">Museu</Link></li>
              <li><Link className="text-lg font-semibold text-bg100" to="/">Início</Link></li>
              <li><Link className="text-lg font-semibold text-bg100" to="/sobre">Sobre</Link></li>
              <li><Link className="text-lg font-semibold text-bg100" to="/exemplos">Exemplos de Vida</Link></li>
          </ul>

          {/* Renderização condicional baseada no isLoggedIn REAL */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
                <Link to="/login" className="text-lg font-semibold text-bg100">Entrar</Link>
                <Link to="/cadastro" className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">Cadastre-se</Link>
            </div>
          ) : (
            <div className="relative">
                {/* Botão "Minha Conta" agora abre e fecha o dropdown */}
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                    <span>Minha Conta</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                {/* O menu dropdown só aparece se isDropdownOpen for true */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <Link to="/perfil" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Meu Perfil</Link>
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sair</button>
                    </div>
                )}
            </div>
          )}
      </div>

      {/* Menu Mobile (Sidebar) agora também é condicional */}
      {isMobileMenuOpen && (
          <div className="absolute top-16 right-4 w-56 bg-accent200 rounded-lg shadow-xl md:hidden z-50 p-4">
              <ul className="flex flex-col gap-4 text-bg100">
                  {/* ... adicione os links do menu aqui ... */}
                  {!isLoggedIn ? (
                    <>
                      <li><Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Entrar</Link></li>
                      <li><Link to="/cadastro" onClick={() => setIsMobileMenuOpen(false)}>Cadastre-se</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/perfil" onClick={() => setIsMobileMenuOpen(false)}>Meu Perfil</Link></li>
                      <li><button onClick={handleLogout}>Sair</button></li>
                    </>
                  )}
              </ul>
          </div>
      )}
    </nav>
  );
}

export default Navbar;