const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    const loadingDiv = document.getElementById('loading');
    const perfilContentDiv = document.getElementById('perfil-content');
    const editContentDiv = document.getElementById('edit-content');
    const formEditar = document.getElementById('form-editar');
    const btnEditar = document.getElementById('btn-editar-perfil');
    const btnCancelar = document.getElementById('btn-cancelar');

    const inputNome = document.getElementById('input-nome');
    const inputBio = document.getElementById('input-bio');
    const inputVersiculo = document.getElementById('input-versiculo'); // Declarado aqui

    if (!token) {
        window.location.href = 'login.html';
        return;
    } 

    try {
        const response = await fetch(`${API_URL}/perfil`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            return;
        }
        if (!response.ok) {
            throw new Error('Falha ao carregar os dados do perfil.');
        }

        const perfil = await response.json();
        exibirPerfil(perfil);

    } catch (error) {
        console.error('Erro:', error);
        loadingDiv.textContent = 'Erro ao carregar perfil. Tente recarregar a página.';
    }

    function exibirPerfil(perfil) {
        loadingDiv.style.display = 'none';
        perfilContentDiv.style.display = 'block';
        editContentDiv.style.display = 'none';

        document.getElementById('nome-usuario').textContent = perfil.nome;
        document.getElementById('email-usuario').textContent = perfil.email;
        document.getElementById('bio-usuario').textContent = perfil.bio || 'Nenhuma biografia informada.';
        document.getElementById('versiculo-usuario').textContent = perfil.versiculo_favorito || 'Nenhum versículo favorito informado.';

        if (perfil.foto_perfil_url) {
            const urlCompleta = perfil.foto_perfil_url.startsWith('/uploads') 
                ? `${API_URL}${perfil.foto_perfil_url}` 
                : perfil.foto_perfil_url;
            document.getElementById('foto-perfil').src = urlCompleta;
        } else {
            document.getElementById('foto-perfil').src = 'img/avatar-padrao.png';
        }
    }

    btnEditar.addEventListener('click', () => {
        inputNome.value = document.getElementById('nome-usuario').textContent;
        const bioText = document.getElementById('bio-usuario').textContent;
        inputBio.value = bioText === 'Nenhuma biografia informada.' ? '' : bioText;
        
        const versiculoText = document.getElementById('versiculo-usuario').textContent;
        inputVersiculo.value = versiculoText === 'Nenhum versículo favorito informado.' ? '' : versiculoText;

        perfilContentDiv.style.display = 'none';
        editContentDiv.style.display = 'block';
    });

    btnCancelar.addEventListener('click', () => {
        editContentDiv.style.display = 'none';
        perfilContentDiv.style.display = 'block';
    });

    formEditar.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dadosAtualizados = {
        nome: inputNome.value,
        bio: inputBio.value,
        versiculo_favorito: inputVersiculo.value
    };

    console.log("Enviando para o back-end:", dadosAtualizados); 

    try {
            const response = await fetch(`${API_URL}/perfil`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosAtualizados)
            });

            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.message || 'Falha ao atualizar perfil.');
            }

            const perfilAtualizado = await response.json();
            exibirPerfil(perfilAtualizado);
            
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            alert(error.message);
        }
    });
});