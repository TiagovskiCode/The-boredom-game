// ============================================================
// jogo-do-galo.js — Jogo do Galo (3 em linha)
// Dois jogadores à vez no mesmo ecrã. Quem ganha leva 15 pts.
// Na desforra, começa quem perdeu.
// ============================================================

(function () {
  const POINTS = 15;
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  let duo = null;

  function setup(container, ctx) {
    const all = ctx.players.getAll();
    duo = all.length >= 2 ? ctx.utils.shuffle(all).slice(0, 2) : ['Jogador X', 'Jogador O'];
    play(container, ctx, 0);
  }

  function play(container, ctx, starter) {
    const { escapeHtml } = ctx.utils;
    const board = Array(9).fill(null);
    const marks = ['X', 'O'];
    let turn = starter;
    let over = false;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">⭕ Jogo do Galo</span>
        <h2><span class="text-accent">${escapeHtml(duo[0])}</span> (X) vs <span class="text-pink">${escapeHtml(duo[1])}</span> (O)</h2>
        <p class="game-lead" data-k="status" role="status"></p>
        <div class="game-board" style="--cols:3">
          ${board.map((_, i) => `<button class="cell" data-cell="${i}" aria-label="Casa ${i + 1}"></button>`).join('')}
        </div>
        <div class="btn-row" data-k="after" hidden>
          <button class="game-btn" data-k="again">Desforra ➔</button>
        </div>
      </div>
    `;

    const status = container.querySelector('[data-k="status"]');
    const cells = [...container.querySelectorAll('[data-cell]')];
    const say = () => { status.innerHTML = `Vez de <strong>${escapeHtml(duo[turn])}</strong> (${marks[turn]})`; };
    say();

    cells.forEach(cell => cell.addEventListener('click', () => {
      const i = Number(cell.dataset.cell);
      if (over || board[i] !== null) return;
      board[i] = turn;
      cell.textContent = marks[turn];
      cell.classList.add(turn ? 'is-p2' : 'is-p1');

      const line = LINES.find(l => l.every(k => board[k] === turn));
      if (line) {
        over = true;
        line.forEach(k => cells[k].classList.add('is-win'));
        status.innerHTML = `🏆 <strong>${escapeHtml(duo[turn])}</strong> ganhou! +${POINTS} pts`;
        if (ctx.players.count() >= 2) ctx.scoring.award(duo[turn], POINTS);
        starter = 1 - turn;
      } else if (board.every(v => v !== null)) {
        over = true;
        status.textContent = '🤝 Empate!';
        starter = 1 - starter;
      } else {
        turn = 1 - turn;
        say();
        return;
      }
      container.querySelector('[data-k="after"]').hidden = false;
    }));

    container.querySelector('[data-k="again"]').addEventListener('click', () => play(container, ctx, starter));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['jogo-do-galo'] = { mount: setup, unmount() {} };
})();
