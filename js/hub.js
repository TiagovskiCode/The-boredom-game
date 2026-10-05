// ============================================================
// hub.js — Controlador principal do HUB.
// Lê o catálogo (data.js), desenha os cards, trata dos filtros
// e abre o jogo certo dentro do modal, indo buscá-lo a
// window.GameModules (preenchido pelos ficheiros em js/games/).
// ============================================================

let currentFilter = 'all';
let currentGame = null; // jogo atualmente aberto no modal, para poder limpar timers

const gamesGrid = document.getElementById('games-grid');
const emptyState = document.getElementById('empty-state');
const modal = document.getElementById('game-modal');
const modalContent = modal.querySelector('.modal-content');
const closeModalBtn = document.getElementById('close-modal');
const gameScreen = document.getElementById('game-screen');
const filterButtons = document.querySelectorAll('.filter-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
let lastFocusedEl = null; // elemento a devolver o foco quando o modal fechar

function showModal() {
  lastFocusedEl = document.activeElement;
  modal.classList.remove('hidden');
  modalContent.focus();
}

function hideModal() {
  modal.classList.add('hidden');
  gameScreen.innerHTML = '';
  if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
  lastFocusedEl = null;
}

function renderGames() {
  const filtered = GAMES_DATA.filter(game => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'favs') return isFavorite(game.id);
    if (currentFilter === 'recom') return game.recommended;
    return game.categories.includes(currentFilter);
  });

  emptyState.classList.toggle('visible', filtered.length === 0);

  gamesGrid.querySelectorAll('.game-card').forEach(el => el.remove());

  filtered.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('data-game', game.id);

    const favActive = isFavorite(game.id);

    card.innerHTML = `
      ${game.recommended ? '<span class="card-badge">Recomendado</span>' : ''}
      <button class="fav-btn ${favActive ? 'active' : ''}" data-fav="${game.id}" title="${favActive ? 'Remover dos favoritos' : 'Marcar como favorito'}" aria-pressed="${favActive}">
        ${favActive ? '❤️' : '🤍'}
      </button>
      <div class="card-thumb">${game.icon}</div>
      <div class="card-info">
        <h3>${game.name}</h3>
        <p>${game.desc}</p>
        <span class="players-tag">👥 mín. ${game.minPlayers} jogador${game.minPlayers > 1 ? 'es' : ''}</span>
      </div>
    `;

    card.addEventListener('click', () => openGame(game.id));

    const favBtn = card.querySelector('.fav-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // não abrir o jogo ao clicar no coração
      toggleFavorite(game.id);
      renderGames(); // redesenha para atualizar ícone/filtro de favoritos
    });

    gamesGrid.appendChild(card);
  });
}

function stopCurrentGame() {
  if (currentGame && typeof currentGame.cleanup === 'function') {
    currentGame.cleanup();
  }
  currentGame = null;
}

function openGame(gameId) {
  stopCurrentGame();
  const mod = window.GameModules && window.GameModules[gameId];
  currentGame = mod || null;

  if (!mod) {
    gameScreen.innerHTML = `<h2>🎮 Jogo em desenvolvimento...</h2>`;
  } else {
    gameScreen.innerHTML = '';
    mod.render(gameScreen);
  }

  showModal();
}

function closeGame() {
  stopCurrentGame();
  hideModal();
}

closeModalBtn.addEventListener('click', closeGame);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeGame(); // clicar fora do conteúdo também fecha
});
document.addEventListener('keydown', (e) => {
  if (modal.classList.contains('hidden')) return;

  if (e.key === 'Escape') {
    closeGame();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = modalContent.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

leaderboardBtn.addEventListener('click', () => {
  stopCurrentGame();
  Leaderboard.renderPanelInto(gameScreen);
  showModal();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    currentFilter = btn.getAttribute('data-filter');
    renderGames();
  });
});

renderGames();
