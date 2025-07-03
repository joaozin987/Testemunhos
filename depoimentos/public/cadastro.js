document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    // Botão que abre o menu
    const openMenu = document.getElementById('openMenu');
    // O menu lateral em si
    const sidebar = document.getElementById('sidebar');
  
    // --- Evento de Clique ---
    // Adiciona um "ouvinte" para o evento de clique no botão de abrir
    openMenu.addEventListener('click', () => {
      // Remove a classe 'translate-x-full' da sidebar.
      // Esta classe é do Tailwind CSS e provavelmente está movendo o menu
      // para fora da tela. Ao removê-la, o menu volta à sua posição original (visível).
      sidebar.classList.remove('translate-x-full');
    });
  
    // OBS: É importante também ter o código para fechar o menu,
    // que funciona de forma inversa, adicionando a classe de volta.
    const closeMenu = document.getElementById('closeMenu');
    closeMenu.addEventListener('click', () => {
      sidebar.classList.add('translate-x-full');
    });
  });