// ============================================================
// duelo-reflexos.js — Duelo de Reflexos
// Dois jogadores, cada um com metade do ecrã. Quando ficar
// VERDE, o primeiro a tocar na sua metade ganha. Tocar antes
// do tempo dá a ronda ao adversário. Primeiro a 3 leva 20 pts.
// ============================================================

(function () {
  const TARGET = 3;
  const POINTS = 20;
  let goId = null;
  let duel = null;

  function setup(container, ctx) {
    const all = ctx.players.getAll();
    duel = { duo: all.length >= 2 ? ctx.utils.shuffle(all).slice(0, 2) : ['Jogador 1', 'Jogador 2'], wins: [0, 0] };
    round(container, ctx);
  }

  function round(container, ctx) {
    clearTimeout(goId);
    const { escapeHtml } = ctx.utils;
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🤠 Duelo de Reflexos · primeiro a ${TARGET}</span>
        <p class="game-lead" data-k="status" role="status">Preparados… toquem quando ficar <strong class="text-success">VERDE</strong>.</p>
        <div class="duel">
          ${duel.duo.map((p, i) => `
            <button class="duel-side" data-side="${i}">
              <strong>${escapeHtml(p)}</strong>
              <span>${duel.wins[i]}</span>
            </button>`).join('')}
        </div>
        <button class="game-btn" data-k="next" hidden>Próxima ronda ➔</button>
      </div>
    `;

    const duelEl = container.querySelector('.duel');
    const status = container.querySelector('[data-k="status"]');
    let live = false;
    let done = false;

    goId = setTimeout(() => {
      live = true;
      duelEl.classList.add('is-go');
      status.innerHTML = '<strong class="text-success">AGORA!</strong>';
    }, 1500 + Math.random() * 3500);

    container.querySelectorAll('[data-side]').forEach(side => side.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (done) return;
      done = true;
      clearTimeout(goId);
      const who = Number(side.dataset.side);
      const winner = live ? who : 1 - who;
      duel.wins[winner]++;
      duelEl.classList.remove('is-go');
      container.querySelectorAll('[data-side]')[winner].classList.add('is-winner');
      status.innerHTML = live
        ? `⚡ <strong>${escapeHtml(duel.duo[winner])}</strong> foi mais rápido!`
        : `🙈 ${escapeHtml(duel.duo[who])} tocou cedo demais. Ponto para <strong>${escapeHtml(duel.duo[winner])}</strong>.`;
      container.querySelectorAll('[data-side] span').forEach((s, i) => { s.textContent = duel.wins[i]; });

      const next = container.querySelector('[data-k="next"]');
      next.hidden = false;
      if (duel.wins[winner] >= TARGET) {
        if (ctx.players.count() >= 2) ctx.scoring.award(duel.duo[winner], POINTS);
        status.innerHTML += `<br>🏆 Ganhou o duelo! +${POINTS} pts`;
        next.textContent = 'Novo duelo ➔';
        next.addEventListener('click', () => setup(container, ctx));
      } else {
        next.addEventListener('click', () => round(container, ctx));
      }
    }));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['duelo-reflexos'] = { mount: setup, unmount() { clearTimeout(goId); } };
})();
