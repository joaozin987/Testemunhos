
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
