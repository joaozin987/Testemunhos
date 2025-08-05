// =================================================================
// --- ARQUIVO home.js COMPLETO (SUA LÓGICA + LÓGICA DE LOGIN) ---
// =================================================================

// IMPORTANTE: Mude para a URL da sua API na Render quando for para produção
const API_URL = 'http://localhost:3000'; 

// --- FUNÇÃO PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. PRIMEIRO, VERIFICA SE O USUÁRIO PODE ESTAR AQUI
    const token = localStorage.getItem('token');
    if (!token) {
        // Se NÃO há token, expulsa o usuário para a página de login.
        // O restante do script não será executado.
        window.location.href = 'login.html'; 
        return;
    }
    
    // 2. SE PASSOU, SIGNIFICA QUE O USUÁRIO ESTÁ LOGADO
    // Configura a interface e ativa todas as funcionalidades da página
    setupLoggedInView(token);
    setupPageEventListeners();
    carregarExperiencias(); 
});


// ==========================================================
// --- FUNÇÕES DE CONTROLE DE LOGIN E UI ---
// ==========================================================

async function setupLoggedInView(token) {
    document.getElementById('login-panel-desktop').style.display = 'none';
    document.getElementById('login-panel-mobile').style.display = 'none';

    document.getElementById('user-panel-desktop').classList.remove('hidden');
    document.getElementById('user-panel-mobile').classList.remove('hidden');

    document.getElementById('openModalBtn').style.display = 'inline-block';
    
    try {
        const response = await fetch(`${API_URL}/perfil`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-cache'
        });
        if (response.ok) {
            const user = await response.json();
            if (document.getElementById('userName')) {
                document.getElementById('userName').value = user.nome;
            }
        } else {
            logout();
        }
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        logout();
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html'; 
}

// ==========================================================
// --- SUAS FUNÇÕES ORIGINAIS INTEGRADAS ---
// ==========================================================

function setupPageEventListeners() {
  const modal = document.getElementById("myModal");
  const customAlert = document.getElementById('customAlert');
  const closeAlertBtn = document.getElementById('closeAlertBtn');
  const openModalBtn = document.getElementById('openModalBtn');
  const experienceForm = document.getElementById('experienceForm');
  const experienceImageInput = document.getElementById('experienceImage');
  const progressBar = document.getElementById('progressBar');
  const goalSection = document.getElementById('goalSection');
  const wordSection = document.getElementById('wordSection');
  const emotionInput = document.getElementById('emotionInput');
  const verseContainer = document.getElementById('verseOfDay');
  const startBtn = document.getElementById('startBtn');
  const askWordBtn = document.getElementById('askWordBtn');
  const getVerseBtn = document.getElementById('getVerseBtn');
  const spanClose = modal.querySelector(".close");
  const openMenu = document.getElementById('openMenu');
  const closeMenu = document.getElementById('closeMenu');
  const sidebar = document.getElementById('sidebar');
  
  // --- Menu Mobile ---
  openMenu.addEventListener('click', () => {
    sidebar.classList.remove('translate-x-full');
  });

  closeMenu.addEventListener('click', () => {
    sidebar.classList.add('translate-x-full');
  });

  // --- Menu Dropdown (Desktop) ---
  const userMenuButton = document.getElementById('user-menu-button-desktop');
  const userMenuDropdown = document.getElementById('user-menu-dropdown-desktop');
  userMenuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      userMenuDropdown.classList.toggle('hidden');
  });
  window.addEventListener('click', () => {
      if (!userMenuDropdown.classList.contains('hidden')) {
          userMenuDropdown.classList.add('hidden');
      }
  });

  // --- Botões de Logout (Desktop e Mobile) ---
  document.getElementById('logout-btn-desktop').addEventListener('click', logout);
  document.getElementById('logout-btn-mobile').addEventListener('click', logout);

  // --- Botão abrir modal + alerta ---
  openModalBtn.addEventListener('click', () => {
    customAlert.classList.remove('hidden');
  });

  closeAlertBtn.addEventListener('click', () => {
    customAlert.classList.add('hidden');
    modal.classList.remove('hidden');
  });

  spanClose.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // --- Envio do formulário ---
  experienceForm.addEventListener('submit', handleExperienceFormSubmit);

  // --- Palavra do dia ---
  startBtn.addEventListener('click', () => {
    goalSection.classList.remove('hidden');
  });

  askWordBtn.addEventListener('click', () => {
    wordSection.classList.remove('hidden');
    const existingAlert = document.getElementById('customAlert');
    if (existingAlert) existingAlert.remove();
    const alertHtml = `
      <div id="customAlert" class="bg-yellow-300 text-yellow-900 rounded-xl p-3 mt-2 flex items-center justify-between space-x-3 shadow-md">
        <span>⚠️ Escreva a palavra em minúsculo!</span>
        <button id="closeAlert" class="font-bold hover:text-yellow-700">&times;</button>
      </div>`;
    wordSection.insertAdjacentHTML('beforeend', alertHtml);
    document.getElementById('closeAlert').addEventListener('click', () => {
      const alertDiv = document.getElementById('customAlert');
      if (alertDiv) alertDiv.remove();
    });
  });

  emotionInput.addEventListener('focus', () => {
    const alertDiv = document.getElementById('customAlert');
    if (alertDiv) alertDiv.remove();
  });
  
  getVerseBtn.addEventListener('click', buscarVersiculo);
}

async function handleExperienceFormSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const form = e.target;
    const experienceImageInput = document.getElementById('experienceImage');

    if (experienceImageInput.files.length === 0) {
      alert('Por favor, selecione uma imagem.');
      return;
    }
    const file = experienceImageInput.files[0];
    if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
      alert('Imagem muito grande! O máximo permitido é 5MB.');
      return;
    }

    const formData = new FormData(form);
    
    [...form.elements].forEach(el => el.disabled = true); // Desabilita formulário

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();

      if (data.status === 'ok') {
        form.reset();
        document.getElementById('myModal').classList.add('hidden');
        carregarExperiencias(); // Recarrega a lista para mostrar o novo depoimento
      } else {
        alert('Erro ao enviar depoimento: ' + (data.error || 'Verifique os dados'));
      }
    } catch (err) {
      console.error('Erro de rede ao enviar experiência:', err);
      alert('Erro de conexão ao enviar sua experiência. Tente novamente.');
    } finally {
      [...form.elements].forEach(el => el.disabled = false); // Reabilita formulário
    }
}

async function carregarExperiencias() {
  const experienceList = document.getElementById('experienceList');
  experienceList.innerHTML = '<p class="text-center text-gray-500">Carregando depoimentos...</p>'; 
  try {
    const response = await fetch(`${API_URL}/depoimentos`);

    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.status}`);
    }

    const data = await response.json();
    experienceList.innerHTML = ''; 
    if (data.length === 0) {
      experienceList.innerHTML = '<p class="text-center text-gray-500">Nenhum depoimento encontrado.</p>';
      return;
    }
    data.forEach(addExperienceToPage);
  } catch(err) {
    console.error('Erro ao carregar depoimentos:', err);
    experienceList.innerHTML = '<p class="text-center text-red-500">Não foi possível carregar os depoimentos.</p>';
  }
}

function addExperienceToPage(exp) {
    const experienceList = document.getElementById('experienceList');
    const card = document.createElement('div');
    card.id = `experience-${exp.id}`;
    // A classe foi ajustada para corresponder à sua lógica original
    card.className = 'bg-white text-black p-4 rounded-lg shadow-md flex items-start gap-4 mb-6'; 

    card.innerHTML = `
        <img src="${exp.imagem_url}" alt="Imagem do depoimento" class="w-48 h-full object-cover rounded-lg cursor-pointer flex-shrink-0" onclick="abrirImagem(this)" />
        <div class="flex-1 flex flex-col">
          <div>
            <h3 class="text-2xl font-serif text-black">${exp.nome_autor}, ${exp.idade_autor} anos</h3>
            <h4 class="text-xl mt-2 text-gray-700 mb-3">Movimento: <span class="font-semibold text-xl">${exp.movimento}</span></h4>
            <blockquote class="mt-4 bg-gray-50 p-4 rounded-lg border-l-4 border-accent100 mb-6">
              <p class="text-gray-800 font-serif italic">"${exp.experiencia}"</p>
            </blockquote>
          </div>
          <button data-id="${exp.id}" class="mt-7 self-start bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition delete-btn">
            Deletar Publicação
          </button>
        </div>
    `;

    card.querySelector('.delete-btn').addEventListener('click', () => {
      deleteExperience(exp.id);
    });

    experienceList.prepend(card);
}

async function deleteExperience(id) {
    const token = localStorage.getItem('token');
    if (!confirm('Você tem certeza que deseja deletar este depoimento?')) return;
    
    try {
        const response = await fetch(`${API_URL}/depoimentos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (response.ok) {
            const elem = document.getElementById(`experience-${id}`);
            if (elem) elem.remove();
            alert('Experiência deletada com sucesso!');
        } else {
            throw new Error(data.error || 'Não foi possível deletar a publicação.');
        }
    } catch(err) {
      console.error('Erro ao deletar:', err);
      alert(err.message);
    }
}

function buscarVersiculo() {
    const emotionInput = document.getElementById('emotionInput');
    const verseContainer = document.getElementById('verseOfDay');
    const emotion = emotionInput.value.trim().toLowerCase();
    
    if (!emotion) {
      verseContainer.innerHTML = `<p class="bg-red-600 rounded-xl p-2 mt-2">Por favor, diga como está se sentindo.</p>`;
      return;
    }
    verseContainer.innerHTML = `<p class="text-white mt-2">Buscando versículo...</p>`;
    
    fetch('verses.json')
      .then(res => res.json())
      .then(data => {
        const verses = data[emotion];
        if (!verses || verses.length === 0) {
          verseContainer.innerHTML = `<p class=" bg-red-600 rounded-xl p-2 mt-2">Não encontramos um versículo para essa palavra.</p>`;
          return;
        }
        const verse = verses[Math.floor(Math.random() * verses.length)];
        verseContainer.innerHTML = `
          <p class="text-white text-xl font-slab mt-4 sm:font-slab text-center">"${verse.text}"</p>
          <p class="text-lg text-gray-200 font-slab text-center sm:font-slab">(${verse.reference})</p>
        `;
        fillProgressBar(() => {
          alert("Parabéns! Meta alcançada!");
        });
      })
      .catch(err => {
        console.error("Erro ao buscar versículos:", err);
        verseContainer.innerHTML = `<p class="text-red-300 mt-2">Erro ao buscar a palavra do dia.</p>`;
      });
}

function fillProgressBar(callback) {
    const progressBar = document.getElementById('progressBar');
    let width = 0;
    progressBar.style.width = '0%';
    const interval = setInterval(() => {
      width += 5;
      progressBar.style.width = width + '%';
      if (width >= 100) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 20); // Removido o tempo extra de 2000ms
}
window.abrirImagem = function (imgElem) {
    document.getElementById('imgViewerModal').classList.remove('hidden');
    document.getElementById('imgModalContent').src = imgElem.src;
};
window.fecharImagem = function () {
    document.getElementById('imgViewerModal').classList.add('hidden');
};