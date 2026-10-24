const Players = (() => {
  // Cores dos avatares (a mesma pessoa tem sempre a mesma cor)
  const AVATAR_COLORS = ['#A6FF3D', '#FF3D7F', '#3DA5FF', '#FFB020', '#9B6BFF', '#3DE0D0', '#FF7AD9', '#FF8A3D'];

  const add = rawName => Store.addPlayer(rawName);
  const remove = name => Store.removePlayer(name);
  const getAll = () => Store.getPlayers();
  const count = () => Store.getPlayers().length;

  function getRandom(excluding = []) {
    const list = Store.getPlayers();
    const pool = list.filter(p => !excluding.includes(p));
    if (pool.length === 0) return list.length > 0 ? list[0] : 'Alguém do grupo';
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function getRandomMany(n) {
    return shuffle(Store.getPlayers()).slice(0, Math.max(0, n));
  }

  function colorFor(name) {
    let hash = 0;
    for (const ch of String(name).toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
  }

  // HTML do círculo com a inicial — usado também no placar
  function avatar(name) {
    const initial = escapeHtml(String(name).trim().charAt(0).toUpperCase() || '?');
    return `<span class="player-avatar" style="--avatar-color:${colorFor(name)}" aria-hidden="true">${initial}</span>`;
  }

  function render() {
    const container = document.getElementById('players-list');
    if (!container) return;

    container.innerHTML = Store.getPlayers().map(p => `
      <span class="player-tag">
        ${avatar(p)}
        ${escapeHtml(p)}
        <button type="button" class="remove-player" data-name="${escapeHtml(p)}" aria-label="Remover ${escapeHtml(p)}" title="Remover ${escapeHtml(p)}">&times;</button>
      </span>
    `).join('');
  }

  function init() {
    const container = document.getElementById('players-list');
    const input = document.getElementById('player-input');
    const addBtn = document.getElementById('add-player-btn');

    render();

    if (container) {
      container.addEventListener('click', e => {
        const btn = e.target.closest('.remove-player');
        if (btn) remove(btn.dataset.name);
      });
    }

    Store.subscribe((snap, action) => {
      if (action.startsWith('players:') || action === 'session:new' || action === 'sync') render();
    });

    function tryAdd() {
      if (add(input.value)) {
        input.value = '';
        input.focus();
      }
    }

    if (addBtn && input) {
      addBtn.addEventListener('click', tryAdd);
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.isComposing) tryAdd();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { add, remove, getAll, count, getRandom, getRandomMany, render, avatar, colorFor };
})();
