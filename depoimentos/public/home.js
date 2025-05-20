document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById("myModal");
  const btn = document.getElementById("openModalBtn");
  const spanClose = document.querySelector(".close");
  const form = document.getElementById('experienceForm');
  const experienceList = document.getElementById('experienceList');
  
  const customAlert = document.getElementById('customAlert');
  const closeAlertBtn = document.getElementById('closeAlertBtn');
  const uploadAlert = document.getElementById('uploadAlert');
  const continueButton = document.getElementById('continueButton');
  const experienceImageInput = document.getElementById('experienceImage');
  
  const startBtn = document.getElementById('startBtn');      // Botão "Começar"
  const askWordBtn = document.getElementById('askWordBtn');  // Botão "Pedir a Palavra"
  const getVerseBtn = document.getElementById('getVerseBtn'); // Botão "Buscar a Palavra"
  const verseContainer = document.getElementById('verseOfDay');
  const emotionInput = document.getElementById('emotionInput');
  const goalSection = document.getElementById('goalSection');
  const wordSection = document.getElementById('wordSection');
  const progressBar = document.getElementById('progressBar');

  const formElements = document.querySelectorAll('#experienceForm input, #experienceForm textarea, #experienceForm button');
  const SERVER_URL = 'http://localhost:3000/upload';


  // Função para desabilitar/ativar o formulário
  function disableForm(disabled) {
      formElements.forEach(elem => elem.disabled = disabled);
  }

  // Eventos de interação com a interface
  btn.addEventListener('click', () => customAlert.classList.remove('hidden'));
  closeAlertBtn.addEventListener('click', () => {
      customAlert.classList.add('hidden');
      modal.style.display = "block";
  });
  spanClose.onclick = () => modal.style.display = "none";
  window.onclick = event => { if (event.target == modal) modal.style.display = "none"; };

  // Exibição de alerta ao carregar imagem
  experienceImageInput.addEventListener('change', () => {
      if (experienceImageInput.files.length > 0) uploadAlert.classList.remove('hidden');
  });

  continueButton.addEventListener('click', () => {
      uploadAlert.classList.add('hidden');
      disableForm(false);
  });

  // Envio do formulário
  form.addEventListener('submit', function (event) {
      event.preventDefault(); // Evita o envio padrão do formulário

      // Verificação de tamanho de imagem (opcional)
      if (experienceImageInput.files[0].size > 5 * 1024 * 1024) {
          alert("Imagem muito grande! O tamanho máximo permitido é 5MB.");
          return;
      }

      const formData = new FormData();
      formData.append('experienceImage', experienceImageInput.files[0]);
      formData.append('experienceText', document.getElementById('experienceText').value);
      formData.append('userName', document.getElementById('userName').value);
      formData.append('userAge', document.getElementById('userAge').value);
      formData.append('userMovement', document.getElementById('userMovement').value);

      disableForm(true); // Desativa o formulário enquanto envia os dados

      // Envio dos dados com fetch
      fetch(SERVER_URL, {
          method: 'POST',
          body: formData
      })
      .then(res => res.json())
      .then(data => {
          // Atualiza a página com a nova experiência
          addExperienceToPage({
              image: data.image,
              text: formData.get('experienceText'),
              name: formData.get('userName'),
              age: formData.get('userAge'),
              movement: formData.get('userMovement')
          });
          form.reset();
          modal.style.display = "none";
      })
      .catch(err => {
          console.error('Erro ao enviar a experiência:', err);
          alert("Ocorreu um erro ao enviar sua experiência. Tente novamente.");
      })
      .finally(() => disableForm(false)); // Reabilita o formulário após o envio
  });

  /// Função para adicionar a experiência à página
function addExperienceToPage(experience) {
  const item = document.createElement('div');
  item.className = 'card';
  item.id = `experience-${experience.id}`;  // Define um ID único para cada item

  item.innerHTML = `
    <img src="${experience.image}" alt="Imagem" class="card-image">
    <div class="card-content">
      <h3>${experience.name}, ${experience.age}</h3>
      <h4>${experience.movement}</h4>
      <p class="text">${experience.text}</p>
      <button class="delete-btn" data-id="${experience.id}">Deletar Publicação</button>
    </div>
  `;

  // Adiciona listener de deletar
  item.querySelector('.delete-btn').addEventListener('click', function () {
    const id = this.getAttribute('data-id');
    removeExperience(id);  // Chama a função de remoção com o id
  });

  // Adiciona o item à div infinita
  const experienceList = document.getElementById('experienceList');
  experienceList.appendChild(item);
}

// Função para remover a experiência
function removeExperience(id) {
  fetch(`http://localhost:3000/depoimentos/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const experienceItem = document.getElementById(`experience-${id}`);  // Usa o id completo para buscar o item
      if (experienceItem) {
        experienceItem.remove();  // Remove o item da página
      }
    } else {
      alert('Erro ao remover a experiência.');
    }
  })
  .catch(err => {
    console.error('Erro na exclusão:', err);
    alert('Ocorreu um erro ao tentar excluir.');
  });
}

  
 

  // Exemplo de como carregar as experiências ao carregar a página
  fetch('http://localhost:3000/depoimentos')
      .then(res => res.json())
      .then(data => {
          if (data && Array.isArray(data)) {
              data.forEach(dep => {
                  addExperienceToPage({
                      id: dep.id,
                      image: dep.imagem,
                      text: dep.experiencia,
                      name: dep.nome,
                      age: dep.idade,
                      movement: dep.movimento
                  });
              });
          } else {
              console.error('Dados inválidos recebidos da API');
          }
      })
      .catch(err => console.error('Erro ao carregar os depoimentos:', err));

 
// Função para abrir a imagem em visualização maior
function abrirImagem(element) {
  var modal = document.getElementById("imgViewerModal");
  var modalImg = document.getElementById("imgModalContent");

  // Exibe o modal
  modal.style.display = "flex";

  // Atualiza a imagem no modal
  modalImg.src = element.src;
  modalImg.alt = element.alt;
}

// Função para fechar o modal
function fecharImagem() {
  var modal = document.getElementById("imgViewerModal");
  modal.style.display = "none"; // Fecha o modal
}

startBtn.addEventListener('click', () => {
  goalSection.classList.remove('hidden');
});

// Mostrar a seção de palavra ao clicar em "Pedir a Palavra"
askWordBtn.addEventListener('click', () => {
  wordSection.classList.remove('hidden');
});

askWordBtn.addEventListener('click', () => {
  wordSection.classList.remove('hidden'); // <-- mostra a div Palavra do Dia
});


// Buscar versículo
getVerseBtn.addEventListener('click', () => {
  const emotion = emotionInput.value.trim().toLowerCase();

  if (!emotion) {
    verseContainer.innerHTML = `<p class="text-red-300 mt-2">Por favor, diga como está se sentindo.</p>`;
    return;
  }

  verseContainer.innerHTML = "<p class='text-white mt-2'>Buscando versículo...</p>";

  fetch('verses.json')
    .then(res => res.json())
    .then(data => {
      const verses = data[emotion];
      if (!verses || verses.length === 0) {
        verseContainer.innerHTML = `<p class="text-yellow-200 mt-2">Não encontramos um versículo para essa palavra.</p>`;
        return;
      }

      const verse = verses[Math.floor(Math.random() * verses.length)];
      verseContainer.innerHTML = `
        <p class="text-white italic mt-4 text-center">"${verse.text}"</p>
        <p class="text-sm text-gray-200 text-center">(${verse.reference})</p>
      `;

      fillProgressBar(() => {
        alert("Parabéns! Meta alcançada!");
      });
    })
    .catch(err => {
      console.error("Erro ao buscar versículos:", err);
      verseContainer.innerHTML = `<p class="text-red-300 mt-2">Erro ao buscar a palavra do dia.</p>`;
    });
});

// Função para preencher a barra
function fillProgressBar(callback) {
  let width = 0;
  progressBar.style.width = '0%';

  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      if (callback) callback();
    } else {
      width += 1;
      progressBar.style.width = `${width}%`;
    }
  }, 100);
}
});
