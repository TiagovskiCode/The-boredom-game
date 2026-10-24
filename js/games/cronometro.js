// ============================================================
// cronometro.js — Cronómetro Cego
// Cada jogador tenta parar o cronómetro exatamente nos 10.00s.
// Os números só se veem nos primeiros 3 segundos; depois é tudo
// "de cabeça". Quem ficar mais perto ganha mais pontos.
// ============================================================

(function () {
  const TARGET = 10;          // segundos
  const VISIBLE_FOR = 3;      // segundos em que o tempo está visível
  const POINTS_BY_RANK = [30, 20, 10];
  const PERFECT_BONUS = 20;   // a menos de 0.05s

  let rafId = null;
  let state = null;

  function stop() {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  function start(container, ctx) {
    stop();
    state = {
      players: ctx.players.count() > 0 ? ctx.players.getAll() : ['Jogador 1'],
      turn: 0,
      results: []
    };
    renderTurn(container, ctx);
  }

  function renderTurn(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const name = state.players[state.turn];

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">⏱️ Cronómetro Cego · ${state.turn + 1}/${state.players.length}</span>
        <h2>Vez de <span class="highlight">${escapeHtml(name)}</span></h2>
        <p class="mini-note">Pára o cronómetro nos <strong>${TARGET}.00s</strong>. Os números desaparecem aos ${VISIBLE_FOR}s.</p>
        <div class="stopwatch" id="watch">0.00</div>
        <button class="game-btn" id="watch-btn">Começar</button>
      </div>
    `;

    const watch = container.querySelector('#watch');
    const btn = container.querySelector('#watch-btn');
    let startedAt = null;

    function frame() {
      const elapsed = (performance.now() - startedAt) / 1000;
      if (elapsed < VISIBLE_FOR) {
        watch.textContent = elapsed.toFixed(2);
      } else if (!watch.classList.contains('is-hidden-time')) {
        watch.classList.add('is-hidden-time');
        watch.textContent = '?.??';
      }
      rafId = requestAnimationFrame(frame);
    }

    btn.addEventListener('click', () => {
      if (startedAt === null) {
        startedAt = performance.now();
        watch.classList.add('is-running');
        btn.textContent = 'Parar!';
        frame();
        return;
      }

      stop();
      const time = (performance.now() - startedAt) / 1000;
      state.results.push({ name, time, diff: Math.abs(time - TARGET) });
      showTurnResult(container, ctx, time);
    });
  }

  function showTurnResult(container, ctx, time) {
    const diff = Math.abs(time - TARGET);
    const isLast = state.turn === state.players.length - 1;
    const verdict = diff < 0.05 ? 'PERFEITO! 🤯' : diff < 0.3 ? 'Muito perto! 🔥' : diff < 1 ? 'Nada mal 👍' : 'Longe… 😅';

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">${verdict}</span>
        <div class="stopwatch is-running">${time.toFixed(2)}</div>
        <p class="game-lead">Ficaste a <strong class="highlight">${diff.toFixed(2)}s</strong> dos ${TARGET} segundos.</p>
        <button class="game-btn" id="continue">${isLast ? 'Ver resultados ➔' : `Passar a ${ctx.utils.escapeHtml(state.players[state.turn + 1])} ➔`}</button>
      </div>
    `;

    container.querySelector('#continue').addEventListener('click', () => {
      if (isLast) return showResults(container, ctx);
      state.turn++;
      renderTurn(container, ctx);
    });
  }

  function showResults(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const ranking = [...state.results].sort((a, b) => a.diff - b.diff);

    ranking.forEach((r, i) => {
      const points = (POINTS_BY_RANK[i] || 0) + (r.diff < 0.05 ? PERFECT_BONUS : 0);
      r.points = points;
      if (points > 0 && ctx.players.count() > 0) ctx.scoring.award(r.name, points);
    });

    container.innerHTML = `
      <div class="game-screen">
        <h2>🏆 Quem tem o relógio na cabeça?</h2>
        <div class="option-list">
          ${ranking.map((r, i) => `
            <div class="option-row">
              <span class="row-label">${['🥇', '🥈', '🥉'][i] || `${i + 1}.`} ${escapeHtml(r.name)} <span class="row-meta">${r.time.toFixed(2)}s</span></span>
              <span class="row-points ${r.points ? '' : 'is-muted'}">${r.points ? `+${r.points}` : `±${r.diff.toFixed(2)}`}</span>
            </div>
          `).join('')}
        </div>
        <button class="game-btn" id="restart">Jogar outra vez ➔</button>
      </div>
    `;
    container.querySelector('#restart').addEventListener('click', () => start(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.cronometro = {
    mount(container, ctx) {
      start(container, ctx);
    },
    unmount() {
      stop();
      state = null;
    }
  };
})();
