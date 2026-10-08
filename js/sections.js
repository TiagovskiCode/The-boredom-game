(function () {
  const section = document.querySelector('[data-featured]');

  if (section) {
    const game = GAMES_DATA.find(g => g.id === section.dataset.featured);
    if (game) {
      const labels = { festa: 'Festa', util: 'Utilitário' };
      document.getElementById('featured-cover').innerHTML = GameCovers.get(game.id, game.icon);
      document.getElementById('featured-title').textContent = game.name;
      document.getElementById('featured-desc').textContent = game.desc;
      document.getElementById('featured-chips').innerHTML = [
        ...game.categories.map(c => labels[c] || c),
        ...(game.duration ? [game.duration] : []),
        `mín. ${game.minPlayers} jogador${game.minPlayers > 1 ? 'es' : ''}`
      ].map(t => `<span class="chip">${escapeHtml(t)}</span>`).join('');
      document.getElementById('featured-play').addEventListener('click', () => openGame(game.id));
    } else {
      section.hidden = true;
    }
  }

  const list = document.getElementById('scoreboard-list');
  const openBtn = document.getElementById('scoreboard-open');

  function renderBoard(snap) {
    if (!list) return;

    if (snap.scores.length === 0) {
      list.innerHTML = '<p class="score-empty">Ainda não há jogadores. Adiciona os nomes do grupo e pontua uma ronda para o placar acender.</p>';
      return;
    }

    const rows = snap.scores.slice(0, 5);
    const max = Math.max(rows[0].points, 1);

    list.innerHTML = rows.map((s, i) => `
      <div class="score-row">
        <span class="score-rank">${String(i + 1).padStart(2, '0')}</span>
        <span class="score-name">${escapeHtml(s.player)}</span>
        <span class="score-pts">${s.points} pts</span>
        <div class="score-bar"><i style="width:${Math.round((Math.max(s.points, 0) / max) * 100)}%"></i></div>
      </div>
    `).join('');
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      const btn = document.getElementById('leaderboard-btn');
      if (btn) btn.click();
    });
  }

  renderBoard(Store.getState());
  Store.subscribe(renderBoard);
})();
