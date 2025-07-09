document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  const SERVER_URL = 'http://localhost:3000';

  if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          // CORREÇÃO: Verifica se o elemento de mensagem existe antes de usá-lo
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
                  // SUCESSO!
                  alert('Login realizado com sucesso!');

                  // Guarda a "chave de acesso" (token) no navegador
                  localStorage.setItem('authToken', result.token);

                  // Redireciona para a página principal de depoimentos (ou outra que você queira)
                  window.location.href = 'home.html'; // Mude para a sua página principal se for diferente

              } else {
                  // ERRO: Mostra o erro vindo do backend (ex: "Senha incorreta")
                  // CORREÇÃO: Verifica se o elemento de mensagem existe
                  if (loginMessage) {
                      loginMessage.textContent = `Erro: ${result.error}`;
                      loginMessage.className = 'text-red-500 mt-4 text-lg font-semibold';
                  } else {
                      // Se o elemento não existe, mostra um alerta como alternativa
                      alert(`Erro: ${result.error}`);
                  }
              }

          } catch (error) {
              // ERRO DE REDE
              console.error('Erro de rede no login:', error);
              // CORREÇÃO: Verifica se o elemento de mensagem existe
              if (loginMessage) {
                  loginMessage.textContent = 'Erro de conexão com o servidor.';
                  loginMessage.className = 'text-red-500 mt-4 text-lg font-semibold';
              } else {
                  alert('Erro de conexão com o servidor.');
              }
          }
      });
  }
});