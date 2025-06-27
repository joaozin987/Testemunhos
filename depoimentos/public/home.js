document.addEventListener('DOMContentLoaded', () => {
  // Modais e alertas
  const modal = document.getElementById("myModal");
  const customAlert = document.getElementById('customAlert');
  const uploadAlert = document.getElementById('uploadAlert'); // no seu html não achei, pode remover
  const closeAlertBtn = document.getElementById('closeAlertBtn');
  const openModalBtn = document.getElementById('openModalBtn');
  const experienceForm = document.getElementById('experienceForm');
  const experienceList = document.getElementById('experienceList');
  const experienceImageInput = document.getElementById('experienceImage');
  const continueButton = document.getElementById('continueButton'); // idem, não achei no seu html
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
  const wordInput = document.getElementById('wordInput');


  const SERVER_URL = 'http://localhost:3000';

  openMenu.addEventListener('click', () => {
    sidebar.classList.remove('translate-x-full');
  });

  closeMenu.addEventListener('click', () => {
    sidebar.classList.add('translate-x-full');
  });

  // Botão abrir modal + alerta
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

  // Controle do formulário: habilita/desabilita inputs e botões
  function disableForm(disabled) {
    [...experienceForm.elements].forEach(el => el.disabled = disabled);
  }

  // Upload Alert e ContinueButton não existem no seu html, então não vou usar essa lógica
  // Se quiser, me fala que adiciono.
  // Criar card e adicionar na página
  function addExperienceToPage(exp) {
    const card = document.createElement('div');
    card.id = `experience-${exp.id}`;
    card.className = 'card';

    card.innerHTML = `
      <img src="${exp.image}" alt="Imagem do depoimento" 
           class="w-full sm:w-48 object-cover rounded-lg cursor-pointer" onclick="abrirImagem(this)" />
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-2xl font-black text-gray-900">${exp.name}, ${exp.age} anos</h3>
          <h4 class="text-xl mt-2 text-gray-700 mb-3">Movimento: <span class="font-semibold text-xl">${exp.movement}</span></h4>
          <p class="text-gray-800 font-serif">${exp.text}</p>
        </div>
        <button data-id="${exp.id}" class="mt-4 self-start bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition delete-btn">
          Deletar Publicação
        </button>
      </div>
    `;
    

    card.querySelector('.delete-btn').addEventListener('click', () => {
      const id = card.querySelector('.delete-btn').getAttribute('data-id');
      deleteExperience(id);
    });

    experienceList.prepend(card);
  }

  // Deletar experiência
  function deleteExperience(id) {
    fetch(`${SERVER_URL}/depoimentos/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const elem = document.getElementById(`experience-${id}`);
        if (elem) elem.remove();
        alert('Experiência deletada com sucesso!');
      } else {
        alert('Não foi possível deletar a publicação.');
      }
    })
    .catch(err => {
      console.error('Erro ao deletar:', err);
      alert('Erro ao tentar deletar a publicação.');
    });
  }

  // Envio do formulário
  experienceForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (experienceImageInput.files.length === 0) {
      alert('Por favor, selecione uma imagem.');
      return;
    }
    const file = experienceImageInput.files[0];
    if (file.size > 5 * 1024 * 1024) { // Limite de 5MB
      alert('Imagem muito grande! O máximo permitido é 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('experienceImage', file);
    formData.append('experienceText', experienceForm.experienceText.value);
    formData.append('userName', experienceForm.userName.value);
    formData.append('userAge', experienceForm.userAge.value);
    formData.append('userMovement', experienceForm.userMovement.value);

    disableForm(true);

    try {
      const response = await fetch(`${SERVER_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.status === 'ok') {
        addExperienceToPage({
          id: data.id,
          image: data.image,
          text: formData.get('experienceText'),
          name: formData.get('userName'),
          age: formData.get('userAge'),
          movement: formData.get('userMovement')
        });
        experienceForm.reset();
        // Fecha o modal (assumindo que você tem essa lógica)
        document.getElementById('myModal').classList.add('hidden');
        alert('Depoimento enviado com sucesso!');
      } else {
        alert('Erro ao enviar depoimento: ' + (data.error || 'Verifique os dados'));
      }
    } catch (err) {
      console.error('Erro de rede ao enviar experiência:', err);
      alert('Erro de conexão ao enviar sua experiência. Tente novamente.');
    } finally {
      disableForm(false);
    }
  });

  // Carregar experiências ao abrir página
  async function carregarExperiencias() {
    try {
      const response = await fetch(`${SERVER_URL}/depoimentos`);
      const data = await response.json();
      if (Array.isArray(data)) {
        // Limpa a lista antes de adicionar novos itens para evitar duplicatas
        experienceList.innerHTML = ''; 
        data.forEach(exp => {
          addExperienceToPage({
            id: exp.id,
            image: exp.imagem,
            text: exp.experiencia,
            name: exp.nome,
            age: exp.idade,
            movement: exp.movimento
          });
        });
      }
    } catch(err) {
      console.error('Erro ao carregar depoimentos:', err);
      alert('Não foi possível carregar os depoimentos do servidor.');
    }
  }

  // Chamar ao carregar
  carregarExperiencias();

  // Modal de imagem ampliada
  window.abrirImagem = function (imgElem) {
    const modal = document.getElementById('imgViewerModal');
    const modalImg = document.getElementById('imgModalContent');
    modal.style.display = 'flex';
    modalImg.src = imgElem.src;
    modalImg.alt = imgElem.alt;
  };

  window.fecharImagem = function () {
    const modal = document.getElementById('imgViewerModal');
    modal.style.display = 'none';
  };

  // Palavra do dia - controle de seções e busca de versículos
  startBtn.addEventListener('click', () => {
    goalSection.classList.remove('hidden');
    
  });

  

askWordBtn.addEventListener('click', () => {
  wordSection.classList.remove('hidden');

  setTimeout(() => {
    // Remove alerta existente antes de criar um novo
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
  }, 300);
});

  // Remove o alerta se o usuário clicar no input
  emotionInput.addEventListener('focus', () => {
    const alertDiv = document.getElementById('customAlert');
    if (alertDiv) alertDiv.remove();
  }, 3000);
  
  
  getVerseBtn.addEventListener('click', () => {
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
        }, 2000);
      })
      .catch(err => {
        console.error("Erro ao buscar versículos:", err);
        verseContainer.innerHTML = `<p class="text-red-300 mt-2">Erro ao buscar a palavra do dia.</p>`;
      });
  });

  function fillProgressBar(callback) {
    let width = 0;
    progressBar.style.width = '0%';
  
    const interval = setInterval(() => {
      width += 5;
      progressBar.style.width = width + '%';
  
      if (width >= 100) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 20);
  }
});  

