const Players = (() => {
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

  function render() {
    const container = document.getElementById('players-list');
    if (!container) return;

    container.innerHTML = Store.getPlayers().map(p => `
      <span class="player-tag">
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

  return { add, remove, getAll, count, getRandom, getRandomMany, render };
})();
