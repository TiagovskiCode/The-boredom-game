let currentFilter = 'all';
let currentGame = null;

const gamesGrid = document.getElementById('games-grid');
const emptyState = document.getElementById('empty-state');
const modal = document.getElementById('game-modal');
const modalContent = modal.querySelector('.modal-content');
const closeModalBtn = document.getElementById('close-modal');
const gameScreen = document.getElementById('game-screen');
const filterButtons = document.querySelectorAll('.filter-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const leaderboardLink = document.getElementById('leaderboard-link');
let lastFocusedEl = null;

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
      <button type="button" class="card-open" aria-label="Abrir ${game.name}"></button>
      ${game.recommended ? '<span class="card-badge">Recomendado</span>' : ''}
      <button type="button" class="fav-btn ${favActive ? 'active' : ''}" data-fav="${game.id}" title="${favActive ? 'Remover dos favoritos' : 'Marcar como favorito'}" aria-label="${favActive ? 'Remover dos favoritos' : 'Marcar como favorito'}" aria-pressed="${favActive}">
        ${favActive ? '❤️' : '🤍'}
      </button>
      <div class="card-thumb">${game.icon}</div>
      <div class="card-info">
        <h3>${game.name}</h3>
        <p>${game.desc}</p>
        <span class="players-tag">👥 mín. ${game.minPlayers} jogador${game.minPlayers > 1 ? 'es' : ''}</span>
      </div>
    `;

    card.querySelector('.card-open').addEventListener('click', () => openGame(game.id));

    card.querySelector('.fav-btn').addEventListener('click', e => {
      e.stopPropagation();
      toggleFavorite(game.id);
      renderGames();
      const again = gamesGrid.querySelector(`[data-fav="${game.id}"]`);
      if (again) again.focus();
    });

    gamesGrid.appendChild(card);
  });
}

function stopCurrentGame() {
  if (currentGame) {
    try {
      currentGame.unmount();
    } catch (err) {
      console.error(err);
    }
  }
  currentGame = null;
}

function openGame(gameId) {
  stopCurrentGame();

  const meta = GAMES_DATA.find(g => g.id === gameId);
  const mod = GameRegistry.resolve(gameId);

  modalContent.setAttribute('aria-label', meta ? meta.name : 'Janela do jogo');
  gameScreen.innerHTML = '';

  if (!mod) {
    gameScreen.innerHTML = `<h2>🎮 Jogo em desenvolvimento...</h2>`;
  } else {
    currentGame = mod;
    try {
      mod.mount(gameScreen, GameRegistry.createContext(gameId, closeGame));
      Store.recordPlay(gameId);
    } catch (err) {
      console.error(err);
      stopCurrentGame();
      gameScreen.innerHTML = `
        <h2>⚠️ Este jogo não abriu</h2>
        <p class="mini-note">Fecha a janela e tenta outra vez.</p>
      `;
    }
  }

  showModal();
}

function closeGame() {
  stopCurrentGame();
  hideModal();
}

closeModalBtn.addEventListener('click', closeGame);

modal.addEventListener('click', e => {
  if (e.target === modal) closeGame();
});

document.addEventListener('keydown', e => {
  if (modal.classList.contains('hidden')) return;

  if (e.key === 'Escape') {
    closeGame();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = modalContent.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
  modalContent.setAttribute('aria-label', 'Placar');
  Leaderboard.renderPanelInto(gameScreen);
  showModal();
});

if (leaderboardLink) {
  leaderboardLink.addEventListener('click', e => {
    e.preventDefault();
    leaderboardBtn.click();
  });
}

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

GameRegistry.audit();
renderGames();
