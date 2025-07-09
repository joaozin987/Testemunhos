// Espera o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {

  const registerForm = document.getElementById('registerForm');
  const SERVER_URL = 'http://localhost:3000'; // URL do seu backend

  if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          // MARCADOR 1 (FRONTEND): Vemos se a função foi acionada.
          console.log('--- [FRONTEND] Formulário enviado. Prevenindo recarregamento da página.');

          const formData = new FormData(registerForm);
          const userData = Object.fromEntries(formData.entries());

          // MARCADOR 2 (FRONTEND): Vemos os dados que serão enviados.
          console.log('--- [FRONTEND] Dados a serem enviados:', userData);

          try {
              // MARCADOR 3 (FRONTEND): Vemos se ele vai tentar enviar o pedido.
              console.log(`--- [FRONTEND] Enviando requisição POST para ${SERVER_URL}/register...`);

              const response = await fetch(`${SERVER_URL}/register`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(userData),
              });

              // MARCADOR 4 (FRONTEND): Vemos se o servidor respondeu algo.
              console.log('--- [FRONTEND] Resposta recebida do servidor. Status:', response.status);
              const result = await response.json();
              console.log('--- [FRONTEND] Dados da resposta:', result);

              if (response.ok) {
                  alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
                  window.location.href = 'login.html';
              } else {
                  alert(`Erro no cadastro: ${result.error}`);
              }

          } catch (error) {
              // MARCADOR DE ERRO (FRONTEND): Se a conexão falhar.
              console.error('--- !!! [FRONTEND] ERRO DE CONEXÃO CAPTURADO !!! ---');
              console.error('--- [FRONTEND] Detalhes do erro:', error);
              alert('Erro de conexão. Não foi possível se comunicar com o servidor.');
          }
      });
  } else {
      // MARCADOR DE ERRO INICIAL: Se o formulário não for encontrado.
      console.error("--- !!! [FRONTEND] ERRO: Formulário com id='registerForm' não foi encontrado no HTML. !!! ---");
  }
});