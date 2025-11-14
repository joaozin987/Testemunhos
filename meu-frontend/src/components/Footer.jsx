// src/components/Footer.jsx

import React from 'react';
// Importa os ícones que vamos usar da biblioteca Lucide
import { Instagram, Facebook, Youtube } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-blue-800 text-white text-center py-8 mt-10">
      <div className="container mx-auto px-6">
        
        {/* Título da seção de redes sociais */}
        <h2 className="text-2xl font-slab mb-6">
          Redes Sociais
        </h2>

        {/* Lista de Links de Redes Sociais */}
        <div className="flex justify-center mb-6">
          <ul className="flex items-center space-x-5">
            <li>
              <a 
                href="https://www.instagram.com/joaosantoszz__/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                <Instagram size={28} /> {/* Ícone do Instagram */}
              </a>
            </li>
            <li>
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                <Facebook size={28} /> {/* Ícone do Facebook */}
              </a>
            </li>
            <li>
              <a 
                href="https://www.youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                className="hover:text-gray-300 transition-colors duration-300"
              >
                <Youtube size={28} /> {/* Ícone do YouTube */}
              </a>
            </li>
          </ul>
        </div>

        {/* Texto de Copyright */}
        <div className="border-t border-blue-700 pt-6">
          <p className="text-lg text-gray-100">&copy; {new Date().getFullYear()} Conectados pela Fé. Todos os direitos reservados.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
