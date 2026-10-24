// ============================================================
// sections.js — "Bons para começar" e placar ao vivo
// ============================================================

(function () {
  const picksEl = document.getElementById('quick-picks');
  const list = document.getElementById('scoreboard-list');
  const openBtn = document.getElementById('scoreboard-open');

  // ---------- Sugestões: 3 recomendados que o grupo consegue jogar ----------
  function renderPicks() {
    if (!picksEl) return;
    const group = Math.max(Players.count(), 1);
    const playable = GAMES_DATA.filter(g => g.recommended && g.minPlayers <= group);
    const picks = (playable.length >= 3 ? playable : GAMES_DATA.filter(g => g.recommended)).slice(0, 3);

    picksEl.innerHTML = picks.map(game => `
      <article class="pick-card" data-tilt style="--card-color:${game.color}">
        <div class="pick-art" aria-hidden="true">${GameCovers.get(game.id, game.icon)}</div>
        <div class="pick-body">
          <span class="chip chip--accent">${CATEGORY_LABELS[game.categories[0]]}</span>
          <h3>${escapeHtml(game.name)}</h3>
          <p class="pick-meta">${playersLabel(game.minPlayers)}${game.duration ? ` · ${game.duration}` : ''}</p>
        </div>
        <button type="button" class="card-open" data-open="${game.id}" aria-label="Abrir ${escapeHtml(game.name)}"></button>
      </article>
    `).join('');
  }

  if (picksEl) {
    picksEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-open]');
      if (btn) openGame(btn.dataset.open);
    });
  }

  // ---------- Placar ao vivo ----------
  function renderBoard(snap) {
    if (!list) return;

    if (snap.scores.length === 0) {
      list.innerHTML = '<p class="score-empty">Ainda não há jogadores. Adiciona os nomes do grupo e pontua uma ronda para o placar acender.</p>';
      return;
    }

    const rows = snap.scores.slice(0, 6);
    const max = Math.max(rows[0].points, 1);

    list.innerHTML = rows.map((s, i) => `
      <div class="score-row">
        <span class="score-rank"><small>Rank</small>${String(i + 1).padStart(2, '0')}</span>
        ${Players.avatar(s.player)}
        <span class="score-name">${escapeHtml(s.player)}</span>
        <div class="score-bar" aria-hidden="true"><i style="width:${Math.round((Math.max(s.points, 0) / max) * 100)}%"></i></div>
        <span class="score-pts">${s.points} pts</span>
      </div>
    `).join('');
  }

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      const btn = document.getElementById('leaderboard-btn');
      if (btn) btn.click();
    });
  }

  renderPicks();
  renderBoard(Store.getState());

  Store.subscribe((snap, action) => {
    renderBoard(snap);
    if (action.startsWith('players:') || action === 'session:new' || action === 'sync') renderPicks();
  });
})();
