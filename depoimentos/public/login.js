// login.js

// IMPORTANTE: Mude para a URL da sua API na Render quando for para produção
const API_URL = 'http://localhost:3000'; 

document.addEventListener('DOMContentLoaded', () => {

  // --- Lógica do Menu Mobile ---
  // (É uma boa prática manter a lógica do menu em todas as páginas para consistência)
  const openMenuBtn = document.getElementById('openMenu');
  const closeMenuBtn = document.getElementById('closeMenu');
  const sidebar = document.getElementById('sidebar');

  if (openMenuBtn && closeMenuBtn && sidebar) {
    openMenuBtn.addEventListener('click', () => {
      sidebar.classList.remove('translate-x-full');
    });

    closeMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('translate-x-full');
    });
  }

  // --- Lógica do Formulário de Login ---
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          if (loginMessage) {
              loginMessage.textContent = 'Entrando...'; // Feedback para o usuário
              loginMessage.className = 'text-gray-700 mt-4 text-lg font-semibold';
          }

          const formData = new FormData(loginForm);
          const userData = Object.fromEntries(formData.entries());

          try {
              const response = await fetch(`${API_URL}/login`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(userData),
              });

              const result = await response.json();

              if (response.ok && result.token) {
                  // SUCESSO!
                  // CORREÇÃO CRÍTICA: Salva a chave como 'token' para ser consistente com o resto do site
                  localStorage.setItem('token', result.token);

                  // Redireciona para a página principal
                  window.location.href = 'home.html'; 

              } else {
                  // ERRO: Mostra o erro vindo do backend
                  if (loginMessage) {
                      loginMessage.textContent = `Erro: ${result.error || 'Credenciais inválidas.'}`;
                      loginMessage.className = 'text-red-500 mt-4 text-lg font-semibold';
                  }
              }

          } catch (error) {
              // ERRO DE REDE:
              console.error('Erro de rede no login:', error);
              if (loginMessage) {
                  loginMessage.textContent = 'Erro de conexão com o servidor. Tente novamente.';
                  loginMessage.className = 'text-red-500 mt-4 text-lg font-semibold';
              }
          }
      });
  }
});