// ============================================================
// quatro-em-linha.js — Quatro em Linha
// Toca numa coluna para largar a peça. Quem fizer 4 seguidas
// (horizontal, vertical ou diagonal) ganha 20 pts.
// ============================================================

(function () {
  const COLS = 7;
  const ROWS = 6;
  const POINTS = 20;
  const DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];
  let duo = null;

  function setup(container, ctx) {
    const all = ctx.players.getAll();
    duo = all.length >= 2 ? ctx.utils.shuffle(all).slice(0, 2) : ['Jogador 1', 'Jogador 2'];
    play(container, ctx, 0);
  }

  // Devolve as 4+ casas em linha a partir de (r, c), ou null
  function winningLine(grid, r, c) {
    const who = grid[r][c];
    for (const [dr, dc] of DIRS) {
      const line = [[r, c]];
      for (const s of [1, -1]) {
        let rr = r + dr * s;
        let cc = c + dc * s;
        while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && grid[rr][cc] === who) {
          line.push([rr, cc]);
          rr += dr * s;
          cc += dc * s;
        }
      }
      if (line.length >= 4) return line;
    }
    return null;
  }

  function play(container, ctx, starter) {
    const { escapeHtml } = ctx.utils;
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    let turn = starter;
    let over = false;
    let moves = 0;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🔴 Quatro em Linha</span>
        <h2><span class="text-accent">${escapeHtml(duo[0])}</span> vs <span class="text-pink">${escapeHtml(duo[1])}</span></h2>
        <p class="game-lead" data-k="status" role="status"></p>
        <div class="game-board game-board--c4" style="--cols:${COLS}">
          ${Array.from({ length: ROWS * COLS }, (_, i) => `<button class="cell cell--disc" data-col="${i % COLS}" data-row="${Math.floor(i / COLS)}" aria-label="Coluna ${(i % COLS) + 1}"></button>`).join('')}
        </div>
        <button class="game-btn" data-k="again" hidden>Nova partida ➔</button>
      </div>
    `;

    const status = container.querySelector('[data-k="status"]');
    const cellAt = (r, c) => container.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    const say = () => {
      status.innerHTML = `Vez de <strong class="${turn ? 'text-pink' : 'text-accent'}">${escapeHtml(duo[turn])}</strong>`;
    };
    say();

    container.querySelectorAll('[data-col]').forEach(btn => btn.addEventListener('click', () => {
      if (over) return;
      const c = Number(btn.dataset.col);
      let r = ROWS - 1;
      while (r >= 0 && grid[r][c] !== null) r--;
      if (r < 0) return;   // coluna cheia

      grid[r][c] = turn;
      moves++;
      const cell = cellAt(r, c);
      cell.classList.add(turn ? 'is-p2' : 'is-p1', 'is-dropped');

      const line = winningLine(grid, r, c);
      if (line) {
        over = true;
        line.forEach(([rr, cc]) => cellAt(rr, cc).classList.add('is-win'));
        status.innerHTML = `🏆 <strong>${escapeHtml(duo[turn])}</strong> ganhou! +${POINTS} pts`;
        if (ctx.players.count() >= 2) ctx.scoring.award(duo[turn], POINTS);
      } else if (moves === ROWS * COLS) {
        over = true;
        status.textContent = '🤝 Empate! O tabuleiro encheu.';
      } else {
        turn = 1 - turn;
        say();
        return;
      }
      container.querySelector('[data-k="again"]').hidden = false;
    }));

    container.querySelector('[data-k="again"]').addEventListener('click', () => play(container, ctx, 1 - starter));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['quatro-em-linha'] = { mount: setup, unmount() {} };
})();
