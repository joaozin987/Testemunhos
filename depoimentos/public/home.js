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

  // Adiciona a experiência na página
  function addExperienceToPage(experience) {
    const item = document.createElement('div');
    item.className = 'card';
    item.innerHTML = `
      <img src="${experience.image}" alt="Imagem" class="card-image">
      <div class="card-content">
        <h3>${experience.name}, ${experience.age}</h3>
        <h4>${experience.movement}</h4>
        <p class="text">${experience.text}</p>
      </div>`;
    experienceList.appendChild(item);
  }

  // Carrega todos os depoimentos quando a página é aberta
  fetch('http://localhost:3000/depoimentos')
    .then(res => res.json())
    .then(data => data.forEach(dep => {
      addExperienceToPage({
        image: dep.imagem,
        text: dep.experiencia,
        name: dep.nome,
        age: dep.idade,
        movement: dep.movimento
      });
    }))
    .catch(err => console.error('Erro ao carregar os depoimentos:', err));
});

const verseButton = document.getElementById('getVerseBtn');
const verseContainer = document.getElementById('verseOfDay');

verseButton.addEventListener('click', function () {
  verseContainer.innerHTML = "<p class='text-white'>Carregando versículo...</p>";

  // Pega o versículo em inglês
  fetch('https://beta.ourmanna.com/api/v1/get/?format=json')
    .then(response => response.json())
    .then(data => {
      const verse = data.verse.details.text;
      const reference = data.verse.details.reference;

      // Traduz o versículo para português usando LibreTranslate
      return fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: verse,
          source: "en",
          target: "pt"
        })
      })
      .then(res => res.json())
      .then(translation => {
        verseContainer.innerHTML = `
          <p class="text-center mt-4 text-white italic">"${translation.translatedText}"</p>
          <p class="text-center text-sm text-gray-100">(${reference})</p>
        `;
      });
    })
    .catch(error => {
      console.error('Erro ao buscar ou traduzir versículo:', error);
      verseContainer.innerHTML = '<p class="text-red-200 mt-2">Não foi possível carregar a palavra do dia.</p>';
    });
});
