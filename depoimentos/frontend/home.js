document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("openModalBtn");
    const spanClose = document.querySelector(".close");
    const form = document.getElementById('experienceForm');
    const experienceList = document.getElementById('experienceList');
  
    // Alertas
    const customAlert = document.getElementById('customAlert');
    const closeAlertBtn = document.getElementById('closeAlertBtn');
    const uploadAlert = document.getElementById('uploadAlert');
    const continueButton = document.getElementById('continueButton');
    const experienceImageInput = document.getElementById('experienceImage');
  
    const formElements = document.querySelectorAll('#experienceForm input, #experienceForm textarea, #experienceForm button');
  
    const SERVER_URL = 'http://localhost:3000/depoimentos'; // Altere para seu domínio em produção
  
    function disableForm(disabled) {
      formElements.forEach(elem => {
        elem.disabled = disabled;
      });
    }
  
    btn.addEventListener('click', () => {
      customAlert.classList.remove('hidden');
    });
  
    closeAlertBtn.addEventListener('click', () => {
      customAlert.classList.add('hidden');
      modal.style.display = "block";
    });
  
    spanClose.onclick = function () {
      modal.style.display = "none";
    };
  
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  
    experienceImageInput.addEventListener('change', function () {
      if (this.files.length > 0) {
        uploadAlert.classList.remove('hidden');
      }
    });
  
    continueButton.addEventListener('click', function () {
      uploadAlert.classList.add('hidden');
      disableForm(false);
    });
  
    form.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const imageInput = document.getElementById('experienceImage');
      const textInput = document.getElementById('experienceText');
      const nameInput = document.getElementById('userName');
      const ageInput = document.getElementById('userAge');
      const movementInput = document.getElementById('userMovement');
  
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const experience = {
          image: e.target.result,
          text: textInput.value,
          name: nameInput.value,
          age: ageInput.value,
          movement: movementInput.value
        };
  
        // Enviar para o servidor
        fetch(SERVER_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(experience)
        })
          .then(response => response.json())
          .then(() => {
            addExperienceToPage(experience);
            form.reset();
            modal.style.display = "none";
          })
          .catch(error => {
            console.error('Erro ao enviar depoimento:', error);
          });
      };
  
      if (imageInput.files.length > 0) {
        reader.readAsDataURL(imageInput.files[0]);
      }
    });
  
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
  
    function loadExperiences() {
      fetch(SERVER_URL)
        .then(response => response.json())
        .then(data => {
          data.forEach(addExperienceToPage);
        })
        .catch(error => {
          console.error('Erro ao carregar depoimentos:', error);
        });
    }
  
    loadExperiences();
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
    