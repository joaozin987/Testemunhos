
function abrirImagem(element) {
    const modal = document.getElementById("imgViewerModal");
    const modalImg = document.getElementById("imgModalContent");

    modal.style.display = "flex";
    modalImg.src = element.src;
    modalImg.alt = element.alt;
}

function fecharImagem() {
    const modal = document.getElementById("imgViewerModal");
    modal.style.display = "none";
}
const openMenu = document.getElementById('openMenu');
const closeMenu = document.getElementById('closeMenu');
const sidebar = document.getElementById('sidebar');

openMenu.addEventListener('click', () => {
    sidebar.classList.remove('translate-x-full');
  });

  closeMenu.addEventListener('click', () => {
    sidebar.classList.add('translate-x-full');
  });

  document.getElementById('getMaryBtn').addEventListener('click', () => {
    const title = document.getElementById('maryInput').value.trim().toLowerCase();
    const messageContainer = document.getElementById('maryMessage');
  
    fetch('maria.json')
      .then(res => res.json())
      .then(data => {
        const messages = data[title];
        if (!messages || messages.length === 0) {
          messageContainer.innerHTML = `<p class="bg-red-600 rounded-xl p-2 mt-2">Não encontramos esse título mariano.</p>`;
          return;
        }
  
        const msg = messages[Math.floor(Math.random() * messages.length)];
        messageContainer.innerHTML = `
          <p class="text-white text-xl font-slab mt-4 text-center">"${msg.text}"</p>
          <p class="text-lg text-white font-slab text-center">(${msg.source})</p>
        `;
      })
      .catch(err => {
        console.error("Erro ao buscar mensagem mariana:", err);
        messageContainer.innerHTML = `<p class="text-red-300 mt-2">Erro ao buscar a mensagem.</p>`;
      });
  });
  