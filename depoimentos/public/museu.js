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
