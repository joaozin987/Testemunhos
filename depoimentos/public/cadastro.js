// Espera o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('registerForm');
    // 1. Selecionamos o elemento onde a mensagem será exibida
    const registerMessage = document.getElementById('registerMessage');
    const SERVER_URL = 'http://localhost:3000'; // URL do seu backend

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Limpa mensagens de erro antigas
            if (registerMessage) {
                registerMessage.textContent = '';
            }

            const formData = new FormData(registerForm);
            const userData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${SERVER_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();

                if (response.ok) {
                    // Mantemos o alerta de sucesso para feedback claro antes de redirecionar
                    alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
                    window.location.href = 'login.html';
                } else {
                    // ERRO: Mostra a mensagem de erro diretamente na div
                    if (registerMessage) {
                        registerMessage.textContent = `Erro: ${result.error}`;
                        registerMessage.className = 'text-red-500 mt-4 text-lg font-semibold';
                    }
                }

            } catch (error) {
                // ERRO DE REDE: Mostra o erro de conexão diretamente na div
                console.error('Erro de rede no cadastro:', error);
                if (registerMessage) {
                    registerMessage.textContent = 'Erro de conexão. Não foi possível se comunicar com o servidor.';
                    registerMessage.className = 'text-red-500 mt-4 text-lg font-semibold';
                }
            }
        });
    }
});