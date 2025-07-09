document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  const SERVER_URL = 'http://localhost:3000';

  if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          // Verifica se o elemento de mensagem existe antes de usá-lo
          if (loginMessage) {
              loginMessage.textContent = ''; // Limpa mensagens antigas
          }

          const formData = new FormData(loginForm);
          const userData = Object.fromEntries(formData.entries());

          try {
              const response = await fetch(`${SERVER_URL}/login`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(userData),
              });

              const result = await response.json();

              if (response.ok) {
                  // SUCESSO! Mantemos o alerta de sucesso para feedback imediato.

                  // Guarda a "chave de acesso" (token) no navegador
                  localStorage.setItem('authToken', result.token);

                  // Redireciona para a página principal de depoimentos
                  window.location.href = 'home.html'; 

              } else {
                  // ERRO: Mostra o erro vindo do backend diretamente na div
                  if (loginMessage) {
                      loginMessage.textContent = `Erro: ${result.error}`;
                      loginMessage.className = 'text-red-500 mt-4 text-lg font-semibold';
                  }
              }

          } catch (error) {
              // ERRO DE REDE: Mostra o erro de conexão diretamente na div
              console.error('Erro de rede no login:', error);
              if (loginMessage) {
                  loginMessage.textContent = 'Erro de conexão com o servidor.';
                  loginMessage.className = 'text-red-500 mt-4 text-lg font-semibold';
              }
          }
      });
  }
});
