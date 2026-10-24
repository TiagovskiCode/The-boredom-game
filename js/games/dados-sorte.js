// ============================================================
// dados-sorte.js — Dados da Sorte
// Cada jogador lança 2 dados. Quem somar mais ganha 15 pts.
// Tirar dois iguais (duplo) dá +5 pts de bónus.
// ============================================================

(function () {
  const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  const WIN_POINTS = 15;
  const DOUBLE_BONUS = 5;
  let rollId = null;
  let state = null;

  function start(container, ctx) {
    clearInterval(rollId);
    state = { players: ctx.players.count() > 0 ? ctx.players.getAll() : ['Jogador 1'], turn: 0, results: [] };
    turn(container, ctx);
  }

  function turn(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const name = state.players[state.turn];
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🎲 Dados da Sorte · ${state.turn + 1}/${state.players.length}</span>
        <h2>Vez de <span class="highlight">${escapeHtml(name)}</span></h2>
        <div class="dice-row"><span class="die-face" data-die>⚀</span><span class="die-face" data-die>⚀</span></div>
        <p class="game-lead" data-k="sum" role="status"></p>
        <button class="game-btn" data-k="roll">Lançar os dados 🎲</button>
      </div>
    `;

    const dice = [...container.querySelectorAll('[data-die]')];
    const btn = container.querySelector('[data-k="roll"]');

    btn.addEventListener('click', () => {
      btn.disabled = true;
      dice.forEach(d => d.classList.add('is-rolling'));
      let ticks = 0;
      rollId = setInterval(() => {
        dice.forEach(d => { d.textContent = FACES[Math.floor(Math.random() * 6)]; });
        if (++ticks < 12) return;

        clearInterval(rollId);
        const values = [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
        dice.forEach((d, i) => {
          d.textContent = FACES[values[i] - 1];
          d.classList.remove('is-rolling');
        });
        const sum = values[0] + values[1];
        const double = values[0] === values[1];
        state.results.push({ name, sum, double });
        container.querySelector('[data-k="sum"]').innerHTML = `Total: <strong class="highlight">${sum}</strong>${double ? ' · DUPLO! 🔥' : ''}`;

        const isLast = state.turn === state.players.length - 1;
        btn.disabled = false;
        btn.textContent = isLast ? 'Ver resultados ➔' : 'Passar ao próximo ➔';
        btn.onclick = e => {
          e.stopImmediatePropagation();
          if (isLast) return results(container, ctx);
          state.turn++;
          turn(container, ctx);
        };
      }, 70);
    }, { once: true });
  }

  function results(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const ranking = [...state.results].sort((a, b) => b.sum - a.sum);
    const best = ranking[0].sum;
    if (ctx.players.count() > 0) {
      ranking.forEach(r => {
        const points = (r.sum === best ? WIN_POINTS : 0) + (r.double ? DOUBLE_BONUS : 0);
        if (points) ctx.scoring.award(r.name, points);
      });
    }

    container.innerHTML = `
      <div class="game-screen">
        <h2>🏆 A sorte sorriu a</h2>
        <p class="chosen-player">${ranking.filter(r => r.sum === best).map(r => escapeHtml(r.name)).join(' & ')}</p>
        ${GameKit.resultsList(ranking.map(r => [r.name + (r.double ? ' 🔥' : ''), r.sum]), escapeHtml, '')}
        <button class="game-btn" data-k="again">Nova ronda ➔</button>
      </div>
    `;
    container.querySelector('[data-k="again"]').addEventListener('click', () => start(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['dados-sorte'] = { mount: start, unmount() { clearInterval(rollId); state = null; } };
})();
