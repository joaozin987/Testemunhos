// Conteúdo para o arquivo: recuperar.js

const recuperarForm = document.getElementById('recuperarForm');
const messageContainer = document.getElementById('message-container');

recuperarForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const button = event.target.querySelector('button');
    
    button.disabled = true;
    button.textContent = 'Enviando...';
    messageContainer.innerHTML = '';

    try {
        const response = await fetch('/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (response.ok) {
            messageContainer.innerHTML = `
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                    ${data.message}
                </div>`;
            recuperarForm.reset();
        } else {
            throw new Error(data.error || 'Ocorreu um erro.');
        }
    } catch (error) {
        messageContainer.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <strong>Erro:</strong> ${error.message}
            </div>`;
    } finally {
        button.disabled = false;
        button.textContent = 'Enviar Link de Recuperação';
    }
});