document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("openModalBtn");
    const spanClose = document.querySelector(".close");
    const form = document.getElementById('experienceForm');
    const experienceList = document.getElementById('experienceList');
    
    // Alerta de "Enviar"
    const customAlert = document.getElementById('customAlert');
    const closeAlertBtn = document.getElementById('closeAlertBtn');
    
    // Alerta de upload de imagem
    const uploadAlert = document.getElementById('uploadAlert');
    const continueButton = document.getElementById('continueButton');
    const experienceImageInput = document.getElementById('experienceImage');
    
    const formElements = document.querySelectorAll('#experienceForm input, #experienceForm textarea, #experienceForm button');
  
    // Função para desabilitar o formulário
    function disableForm(disabled) {
      formElements.forEach(elem => {
        elem.disabled = disabled;
      });
    }
  
    // Mostrar alerta de "Enviar" quando clicar no botão Enviar
    btn.addEventListener('click', () => {
      customAlert.classList.remove('hidden');
    });
  
    // Fechar o alerta de "Enviar" e abrir o modal de formulário
    closeAlertBtn.addEventListener('click', () => {
      customAlert.classList.add('hidden');
      modal.style.display = "block"; // abre o formulário
    });
  
    // Fechar o modal ao clicar no "X"
    spanClose.onclick = function() {
      modal.style.display = "none";
    };
  
    // Fechar o modal clicando fora
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  
    // Mostrar o alerta de upload ao selecionar uma imagem
    experienceImageInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        uploadAlert.classList.remove('hidden'); // Mostra alerta de upload
      }
    });
  
    // Fechar o alerta de upload e habilitar o formulário novamente
    continueButton.addEventListener('click', function() {
      uploadAlert.classList.add('hidden'); // Esconde alerta
      disableForm(false); // Libera o formulário
    });
  
    // Evento de envio do formulário
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const imageInput = document.getElementById('experienceImage');
      const textInput = document.getElementById('experienceText');
      const nameInput = document.getElementById('userName');
      const ageInput = document.getElementById('userAge');
      const movementInput = document.getElementById('userMovement');
  
      const reader = new FileReader();
  
      reader.onload = function(e) {
        const experience = {
          image: e.target.result,
          text: textInput.value,
          name: nameInput.value,
          age: ageInput.value,
          movement: movementInput.value
        };
  
        let experiences = JSON.parse(localStorage.getItem('experiences')) || [];
        experiences.push(experience);
        localStorage.setItem('experiences', JSON.stringify(experiences));
  
        addExperienceToPage(experience);
  
        form.reset();
        modal.style.display = "none";
      };
  
      if (imageInput.files.length > 0) {
        reader.readAsDataURL(imageInput.files[0]);
      }
    });
  
    // Função para adicionar experiência na página
    function addExperienceToPage(experience) {
      const item = document.createElement('div');
      item.className = 'card';
  
      item.innerHTML = `
        <img src="${experience.image}" alt="User experience image" class="card-image">
        <div class="card-content">
          <h3>${experience.name}, ${experience.age}</h3>
          <h4>${experience.movement}</h4>
          <p class="text">${experience.text}</p>
        </div>
      `;
  
      experienceList.appendChild(item);
    }
  
    // Carregar experiências salvas ao abrir a página
    function loadExperiences() {
      const experiences = JSON.parse(localStorage.getItem('experiences')) || [];
      experiences.forEach(addExperienceToPage);
    }
  
    loadExperiences(); // Chama ao carregar a página
  });

  function abrirImagem(img) {
    const modal = document.getElementById("imgViewerModal");
    const modalImg = document.getElementById("imgModalContent");
    
    modal.style.display = "flex";
    modalImg.src = img.src;
  }
  
  function fecharImagem() {
    document.getElementById("imgViewerModal").style.display = "none";
  }
  