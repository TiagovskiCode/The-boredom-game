// ============================================================
// pedra-papel-tesoura.js — Pedra, Papel, Tesoura
// Dois jogadores escolhem em segredo (passando o telemóvel).
// Melhor de 3: quem ganhar 2 rondas leva 15 pts.
// ============================================================

(function () {
  const POINTS = 15;
  const MOVES = [
    { id: 'pedra', emoji: '✊', beats: 'tesoura' },
    { id: 'papel', emoji: '✋', beats: 'pedra' },
    { id: 'tesoura', emoji: '✌️', beats: 'papel' }
  ];
  let match = null;

  function setup(container, ctx) {
    const all = ctx.players.getAll();
    match = {
      duo: all.length >= 2 ? ctx.utils.shuffle(all).slice(0, 2) : ['Jogador 1', 'Jogador 2'],
      wins: [0, 0],
      picks: []
    };
    choose(container, ctx, 0);
  }

  function choose(container, ctx, who) {
    const { escapeHtml } = ctx.utils;
    const name = escapeHtml(match.duo[who]);
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">✊ Pedra, Papel, Tesoura · ${match.wins[0]} - ${match.wins[1]}</span>
        <h2>${name}, escolhe em segredo</h2>
        <p class="mini-note">${who === 0 ? `Depois passa o telemóvel a ${escapeHtml(match.duo[1])} sem mostrar.` : 'A seguir revelamos!'}</p>
        <div class="rps-row">
          ${MOVES.map((m, i) => `<button class="rps-btn" data-move="${i}" aria-label="${m.id}">${m.emoji}</button>`).join('')}
        </div>
      </div>
    `;
    container.querySelectorAll('[data-move]').forEach(btn => btn.addEventListener('click', () => {
      match.picks[who] = MOVES[Number(btn.dataset.move)];
      if (who === 0) return handOver(container, ctx);
      reveal(container, ctx);
    }));
  }

  // Ecrã intermédio para o primeiro jogador não ver a escolha do segundo (e vice-versa)
  function handOver(container, ctx) {
    container.innerHTML = `
      <div class="game-screen">
        <h2>Escolha guardada 🤫</h2>
        <p class="game-lead">Passa o telemóvel a <strong class="highlight">${ctx.utils.escapeHtml(match.duo[1])}</strong>.</p>
        <button class="game-btn" data-k="ok">Sou ${ctx.utils.escapeHtml(match.duo[1])}, estou pronto</button>
      </div>
    `;
    container.querySelector('[data-k="ok"]').addEventListener('click', () => choose(container, ctx, 1));
  }

  function reveal(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const [a, b] = match.picks;
    const winner = a.id === b.id ? -1 : a.beats === b.id ? 0 : 1;
    if (winner >= 0) match.wins[winner]++;
    const champion = match.wins.findIndex(w => w === 2);
    if (champion >= 0 && ctx.players.count() >= 2) ctx.scoring.award(match.duo[champion], POINTS);

    container.innerHTML = `
      <div class="game-screen">
        <div class="rps-row rps-row--reveal">
          <div><span class="rps-big">${a.emoji}</span><p>${escapeHtml(match.duo[0])}</p></div>
          <span class="versus-or">vs</span>
          <div><span class="rps-big">${b.emoji}</span><p>${escapeHtml(match.duo[1])}</p></div>
        </div>
        <h2>${winner === -1 ? '🤝 Empate!' : `${escapeHtml(match.duo[winner])} ganha a ronda`}</h2>
        <p class="stat-line"><span class="chip">${escapeHtml(match.duo[0])}: ${match.wins[0]}</span><span class="chip">${escapeHtml(match.duo[1])}: ${match.wins[1]}</span></p>
        ${champion >= 0 ? `<p class="chosen-player">🏆 ${escapeHtml(match.duo[champion])}</p><p class="mini-note">+${POINTS} pts</p>` : ''}
        <button class="game-btn" data-k="next">${champion >= 0 ? 'Novo duelo ➔' : 'Próxima ronda ➔'}</button>
      </div>
    `;
    container.querySelector('[data-k="next"]').addEventListener('click', () => {
      if (champion >= 0) return setup(container, ctx);
      choose(container, ctx, 0);
    });
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['pedra-papel-tesoura'] = { mount: setup, unmount() { match = null; } };
})();
