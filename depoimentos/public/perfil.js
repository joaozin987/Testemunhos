document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token'); // Pega o token salvo no login

  if (!token) {
    // Se não há token, o usuário não está logado. Redireciona para o login.
    window.location.href = '/login.html';
    return;
  }

  try {
    const response = await fetch('https://sua-api.onrender.com/perfil', { // Use a URL da sua API
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Envia o token para o "guarda" da rota
        'Authorization': `Bearer ${token}` 
      }
    });

    if (response.status === 401 || response.status === 403) {
      // Se o token for inválido ou expirado, redireciona para o login
      window.location.href = '/login.html';
      return;
    }

    const perfil = await response.json();

    // Agora, popule a página com os dados recebidos
    document.getElementById('nome-usuario').textContent = perfil.nome;
    document.getElementById('email-usuario').textContent = perfil.email;
    document.getElementById('bio-usuario').textContent = perfil.bio || 'Nenhuma biografia adicionada.';
    // ... e assim por diante para os outros campos.

  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  }
});