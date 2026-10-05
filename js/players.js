// ============================================================
// players.js — Gestão dos jogadores da sessão atual (em memória,
// não persiste entre recarregamentos, é só para a "roda de amigos"
// que está a jogar agora)
// ============================================================

const Players = (() => {
  let list = [];

  function add(rawName) {
    const name = (rawName || '').trim();
    const alreadyExists = list.some(p => p.toLowerCase() === name.toLowerCase());
    if (!name || alreadyExists) return false;
    list.push(name);
    render();
    return true;
  }

  function remove(name) {
    list = list.filter(p => p !== name);
    if (typeof Leaderboard !== 'undefined') Leaderboard.removePlayer(name);
    render();
  }

  function getAll() {
    return [...list];
  }

  function count() {
    return list.length;
  }

  function getRandom(excluding = []) {
    const pool = list.filter(p => !excluding.includes(p));
    if (pool.length === 0) return list.length > 0 ? list[0] : 'Alguém do grupo';
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Devolve N jogadores diferentes ao acaso (ou o que houver disponível)
  function getRandomMany(n) {
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, shuffled.length));
  }

  function render() {
    const container = document.getElementById('players-list');
    if (!container) return;

    container.innerHTML = list.map(p => `
      <span class="player-tag">
        ${escapeHtml(p)}
        <button class="remove-player" data-name="${escapeHtml(p)}" title="Remover ${escapeHtml(p)}">&times;</button>
      </span>
    `).join('');

    container.querySelectorAll('.remove-player').forEach(btn => {
      btn.addEventListener('click', (e) => remove(e.currentTarget.dataset.name));
    });

    if (typeof Leaderboard !== 'undefined') Leaderboard.ensurePlayers(list);
  }

  return { add, remove, getAll, count, getRandom, getRandomMany, render };
})();

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('player-input');
  const btn = document.getElementById('add-player-btn');

  function tryAdd() {
    if (Players.add(input.value)) {
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', tryAdd);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') tryAdd();
  });
});
