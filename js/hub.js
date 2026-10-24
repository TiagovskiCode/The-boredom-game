// ============================================================
// hub.js — Catálogo (filtros + pesquisa) e janela dos jogos
// ============================================================

const COLLAPSED_COUNT = 16;   // cartões visíveis em "Todos" antes de carregar em "Ver todos"

let currentFilter = 'all';
let currentQuery = '';
let currentGame = null;
let showAll = false;

const gamesGrid = document.getElementById('games-grid');
const emptyState = document.getElementById('empty-state');
const modal = document.getElementById('game-modal');
const modalContent = modal.querySelector('.modal-content');
const closeModalBtn = document.getElementById('close-modal');
const gameScreen = document.getElementById('game-screen');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('game-search');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const showAllBtn = document.getElementById('show-all');
let lastFocusedEl = null;

const HEART_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9Z"/></svg>';

function normalize(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function showModal() {
  lastFocusedEl = document.activeElement;
  modal.classList.remove('hidden');
  modalContent.scrollTop = 0;
  modalContent.focus();
  if (window.Motion) Motion.pause();
}

function hideModal() {
  modal.classList.add('hidden');
  gameScreen.innerHTML = '';
  if (window.Motion) Motion.resume();
  if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus({ preventScroll: true });
  lastFocusedEl = null;
}

function matchesFilter(game) {
  if (currentFilter === 'all') return true;
  if (currentFilter === 'favs') return isFavorite(game.id);
  if (currentFilter === 'recom') return game.recommended;
  return game.categories.includes(currentFilter);
}

function matchesQuery(game) {
  if (!currentQuery) return true;
  return normalize(`${game.name} ${game.desc}`).includes(currentQuery);
}

function cardTemplate(game) {
  const favActive = isFavorite(game.id);
  const missing = game.minPlayers - Players.count();
  const favLabel = favActive ? 'Remover dos favoritos' : 'Marcar como favorito';

  return `
    <div class="card-poster">
      <div class="card-art" aria-hidden="true">${GameCovers.get(game.id, game.icon)}</div>
      ${missing > 0
        ? `<span class="card-lock">Faltam ${missing}</span>`
        : (game.recommended ? '<span class="card-badge">Top</span>' : '')}
      <span class="card-index" aria-hidden="true">${String(GAMES_DATA.indexOf(game) + 1).padStart(2, '0')}</span>
      <div class="card-hover" aria-hidden="true">
        <p>${escapeHtml(game.desc)}</p>
        <span class="card-play">▶ Jogar</span>
      </div>
    </div>
    <div class="card-body">
      <h3 class="card-title">${escapeHtml(game.name)}</h3>
      <span class="score-box" title="${playersLabel(game.minPlayers)}">${game.minPlayers}+</span>
    </div>
    <div class="card-meta">
      ${game.categories.map(c => `<span class="chip">${CATEGORY_LABELS[c] || c}</span>`).join('')}
      ${game.duration ? `<span class="chip">${game.duration}</span>` : ''}
    </div>
    <button type="button" class="card-open" aria-label="Abrir ${escapeHtml(game.name)}"></button>
    <button type="button" class="fav-btn ${favActive ? 'active' : ''}" data-fav="${game.id}" title="${favLabel}" aria-label="${favLabel}" aria-pressed="${favActive}">${HEART_ICON}</button>
  `;
}

function renderGames() {
  const matching = GAMES_DATA.filter(game => matchesFilter(game) && matchesQuery(game));
  const collapsible = currentFilter === 'all' && !currentQuery && matching.length > COLLAPSED_COUNT;
  const filtered = collapsible && !showAll ? matching.slice(0, COLLAPSED_COUNT) : matching;

  showAllBtn.hidden = !collapsible;
  showAllBtn.textContent = showAll ? 'Mostrar menos' : `Ver todos os ${matching.length} jogos`;

  emptyState.textContent = currentQuery
    ? 'Nenhum jogo com esse nome. Experimenta outra palavra.'
    : 'Nenhum jogo encontrado para este filtro.';
  emptyState.classList.toggle('visible', filtered.length === 0);

  gamesGrid.querySelectorAll('.game-card').forEach(el => el.remove());

  filtered.forEach(game => {
    const card = document.createElement('article');
    card.className = 'game-card';
    card.classList.toggle('is-locked', game.minPlayers > Players.count());
    card.dataset.game = game.id;
    card.dataset.tilt = '';
    card.style.setProperty('--card-color', game.color);
    card.innerHTML = cardTemplate(game);

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

  if (window.Motion) Motion.refresh();
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
  modalContent.style.setProperty('--accent-soft', meta ? `color-mix(in srgb, ${meta.color} 14%, transparent)` : '');
  gameScreen.innerHTML = '';

  if (!mod) {
    gameScreen.innerHTML = `<div class="game-screen"><h2>🎮 Jogo em desenvolvimento...</h2></div>`;
  } else {
    currentGame = mod;
    try {
      mod.mount(gameScreen, GameRegistry.createContext(gameId, closeGame));
      Store.recordPlay(gameId);
    } catch (err) {
      console.error(err);
      stopCurrentGame();
      gameScreen.innerHTML = `
        <div class="game-screen">
          <h2>⚠️ Este jogo não abriu</h2>
          <p class="mini-note">Fecha a janela e tenta outra vez.</p>
        </div>
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
  modalContent.style.removeProperty('--accent-soft');
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

showAllBtn.addEventListener('click', () => {
  showAll = !showAll;
  renderGames();
  if (!showAll && window.Motion) Motion.scrollTo('#jogos');
});

if (searchInput) {
  searchInput.addEventListener('input', () => {
    currentQuery = normalize(searchInput.value.trim());
    renderGames();
  });
}

// O número de jogadores muda o estado "Faltam N" dos cartões
Store.subscribe((snap, action) => {
  if (action.startsWith('players:') || action === 'session:new' || action === 'sync') renderGames();
});

GameRegistry.audit();
renderGames();
