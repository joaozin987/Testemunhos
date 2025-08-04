
const openMenu = document.getElementById('openMenu');
  const closeMenu = document.getElementById('closeMenu');
   openMenu.addEventListener('click', () => {
    sidebar.classList.remove('translate-x-full');
  });

  closeMenu.addEventListener('click', () => {
    sidebar.classList.add('translate-x-full');
  });

  
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
          fetch(`${API_URL}/login`, { /* ... opções do fetch ... */ })
    .then(response => {
        if (!response.ok) {
            // Se a resposta não for OK (ex: 401, 404), trata o erro
            return response.json().then(err => { throw new Error(err.error) });
        }
        return response.json();
    })
    .then(data => {
        // 'data' é o objeto que vem do backend, ex: { message: '...', token: '...' }
        if (data.token) {
            // ---> PASSO CRUCIAL #1: Salvar o token no localStorage
            localStorage.setItem('token', data.token); 
            
            // ---> PASSO CRUCIAL #2: Redirecionar para a página inicial
            window.location.href = '/home.html'; // Ou apenas '/' se for o caso
        } else {
            // Mostra mensagem de erro se o backend não retornar um token
            document.getElementById('mensagem-erro').textContent = data.error || 'Erro inesperado.';
        }
    })
    .catch(error => {
        console.error('Erro no login:', error);
        document.getElementById('mensagem-erro').textContent = error.message;
    });
      });
  }
});
