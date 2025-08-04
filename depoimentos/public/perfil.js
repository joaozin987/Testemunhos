// perfil.js

// IMPORTANTE: Substitua pela URL da sua API na Render quando publicar
const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const loadingDiv = document.getElementById('loading');
    const perfilContentDiv = document.getElementById('perfil-content');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/perfil`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }
        if (!response.ok) {
            throw new Error('Falha ao carregar os dados do perfil.');
        }

        const perfil = await response.json();

        loadingDiv.style.display = 'none';
        perfilContentDiv.style.display = 'block';

        document.getElementById('nome-usuario').textContent = perfil.nome;
        document.getElementById('email-usuario').textContent = perfil.email;
        document.getElementById('bio-usuario').textContent = perfil.bio || 'Nenhuma biografia informada. Clique em "Editar Perfil" para adicionar uma.';
        
        if (perfil.foto_perfil_url) {
            document.getElementById('foto-perfil').src = perfil.foto_perfil_url;
        }

    } catch (error) {
        console.error('Erro:', error);
        loadingDiv.textContent = 'Erro ao carregar perfil. Tente recarregar a página.';
    }
});