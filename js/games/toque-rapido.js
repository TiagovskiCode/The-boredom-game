// ============================================================
// toque-rapido.js — Toque Rápido
// Cada jogador tem 10 segundos para tocar no botão o máximo de
// vezes possível. Os 3 mais rápidos ganham 30 / 20 / 10 pts.
// ============================================================

(function () {
  const SECONDS = 10;
  const POINTS_BY_RANK = [30, 20, 10];
  let stop = () => {};
  let state = null;

  function start(container, ctx) {
    stop();
    state = { players: ctx.players.count() > 0 ? ctx.players.getAll() : ['Jogador 1'], turn: 0, results: [] };
    ready(container, ctx);
  }

  function ready(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const name = state.players[state.turn];
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">👆 Toque Rápido · ${state.turn + 1}/${state.players.length}</span>
        <h2>Vez de <span class="highlight">${escapeHtml(name)}</span></h2>
        <p class="mini-note">Tens ${SECONDS} segundos. Toca no botão grande o mais depressa que conseguires!</p>
        <div class="game-timer" data-k="timer">${SECONDS}s</div>
        <button class="tap-pad" data-k="pad">Toca para começar</button>
      </div>
    `;

    const pad = container.querySelector('[data-k="pad"]');
    const timerEl = container.querySelector('[data-k="timer"]');
    let taps = 0;
    let running = false;
    let done = false;

    pad.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (done) return;
      if (!running) {
        running = true;
        pad.textContent = '0';
        stop = GameKit.countdown(timerEl, SECONDS, () => {
          done = true;
          pad.disabled = true;
          state.results.push([name, taps]);
          setTimeout(() => next(container, ctx), 900);
        });
        return;
      }
      taps++;
      pad.textContent = taps;
      pad.classList.remove('is-hit');
      void pad.offsetWidth;
      pad.classList.add('is-hit');
    });
  }

  function next(container, ctx) {
    if (!state) return;
    state.turn++;
    if (state.turn < state.players.length) return ready(container, ctx);

    const { escapeHtml } = ctx.utils;
    const ranking = [...state.results].sort((a, b) => b[1] - a[1]);
    if (ctx.players.count() > 0) ranking.forEach(([p], i) => POINTS_BY_RANK[i] && ctx.scoring.award(p, POINTS_BY_RANK[i]));

    container.innerHTML = `
      <div class="game-screen">
        <h2>🏆 Dedos mais rápidos</h2>
        ${GameKit.resultsList(ranking, escapeHtml, 'toques')}
        <button class="game-btn" data-k="again">Jogar outra vez ➔</button>
      </div>
    `;
    container.querySelector('[data-k="again"]').addEventListener('click', () => start(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['toque-rapido'] = { mount: start, unmount() { stop(); state = null; } };
})();
