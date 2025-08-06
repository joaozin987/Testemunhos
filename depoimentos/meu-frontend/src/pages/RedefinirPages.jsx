import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function RedefinirSenhaPage() {
  return (
    <>
       <nav className="bg-accent200 shadow p-4 flex items-center justify-between">
              <h1 className="text-3xl font-slab text-primary100"><Link to="/home">Conectados pela Fé</Link></h1>
            
              {}
              <button id="openMenu" className="md:hidden text-3xl text-bg100">&#9776;</button>
              
              <ul className="hidden md:flex gap-6">
                <li><Link className="text-lg font-semibold text-bg100" to="/museu">Museu</Link></li>
                <li><Link className="text-lg font-semibold text-bg100" to="/home">Início</Link></li>
                <li><Link className="text-lg font-semibold text-bg100" to="/sobre">Sobre</Link></li>
                <li><Link className="text-lg font-semibold text-bg100" to="/exemplos">Exemplos de Vida</Link></li>
              </ul>
              <Link to="/login" className="hidden md:inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mt-1 hover:bg-blue-700">
                  Faça o Login
              </Link>
            </nav>
            

      <div className="bg-accent200">
        <div id="sidebar" className="fixed top-0 right-0 h-75 w-64 bg-accent200 text-bg100 transform translate-x-full transition-transform duration-300 z-50 shadow-lg md:hidden">
          <div className="flex justify-between items-center p-4 border-b border-bg100">
            <h2 className="text-2xl font-slab">Menu</h2>
            <button id="closeMenu" className="text-3xl">&times;</button>
          </div>
          <ul className="flex flex-col gap-4 p-4">
            <li><Link to="/museu" className="text-lg font-semibold">Museu</Link></li>
            <li><Link to="/" className="text-lg font-semibold">Início</Link></li>
            <li><Link to="/sobre" className="text-lg font-semibold">Sobre</Link></li>
            <li><Link to="/exemplos" className="text-lg font-semibold">Exemplos de Vida</Link></li>
            <li>
                <Link to="/cadastro" className="inline-block bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mt-1 hover:bg-blue-700">
                    Faça o cadastro
                </Link>
            </li>
          </ul>
        </div>
        
        <main className="flex flex-col justify-center items-center h-screen bg-gray-100">
          <form id="redefinirForm" className="bg-white grid p-8 text-center w-full max-w-md rounded-xl shadow-lg">
              <h1 className="text-3xl font-slab mb-6 text-gray-800">Crie uma Nova Senha</h1>
          
              <label className="text-left block text-xl mb-1 font-slab text-gray-700" htmlFor="nova_senha">Nova Senha</label>
              <input className="w-full rounded-lg mb-4 p-3 border border-gray-300" type="password" id="nova_senha" name="nova_senha" placeholder="Digite sua nova nova senha" required />
              
              <label className="text-left block text-xl mb-1 font-slab text-gray-700" htmlFor="confirmar_senha">Confirmar Senha</label>
              <input className="w-full rounded-lg mb-6 p-3 border border-gray-300" type="password" id="confirmar_senha" name="confirmar_senha" placeholder="Digite novamente sua nova senha" required />
              
              <input type="hidden" name="token" />

              <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Salvar Nova Senha
              </button>
          </form>
          <div id="message-container" className="w-full max-w-md mt-4"></div>
        </main>
      </div>
    </>
  );
}

export default RedefinirSenhaPage;