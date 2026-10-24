// ============================================================
// sorteador.js — Sorteador (utilitário)
// Três ferramentas para o grupo:
//   • Quem começa?  → nomes a passar até parar num
//   • Ordem de jogo → lista baralhada
//   • Equipas       → divide o grupo em 2, 3 ou 4 equipas
// ============================================================

(function () {
  const TEAM_COLORS = ['#A6FF3D', '#FF3D7F', '#3DA5FF', '#FFB020'];
  const TEAM_NAMES = ['Equipa Lima', 'Equipa Rosa', 'Equipa Azul', 'Equipa Ouro'];

  let spinId = null;

  function stopSpin() {
    clearTimeout(spinId);
    spinId = null;
  }

  function menu(container, ctx) {
    stopSpin();
    if (ctx.players.count() < 2) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>🎲 Sorteador</h2>
          <p class="game-lead">Precisas de pelo menos <strong>2 jogadores</strong> adicionados na secção "Quem joga hoje?" para sortear.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🎲 Sorteador</span>
        <h2>O que vamos sortear?</h2>
        <div class="btn-row">
          <button class="game-btn" data-mode="first">Quem começa?</button>
          <button class="game-btn secondary" data-mode="order">Ordem de jogo</button>
          <button class="game-btn secondary" data-mode="teams">Equipas</button>
        </div>
        <div id="draw-result" class="game-screen" aria-live="polite"></div>
      </div>
    `;

    const result = container.querySelector('#draw-result');
    container.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('secondary', b !== btn));
        stopSpin();
        if (btn.dataset.mode === 'first') pickFirst(result, ctx);
        if (btn.dataset.mode === 'order') order(result, ctx);
        if (btn.dataset.mode === 'teams') teamsSetup(result, ctx);
      });
    });
  }

  // Os nomes vão passando cada vez mais devagar até parar
  function pickFirst(target, ctx) {
    const { escapeHtml } = ctx.utils;
    const players = ctx.players.getAll();
    const winner = Math.floor(Math.random() * players.length);
    const steps = players.length * 3 + winner;
    let step = 0;

    target.innerHTML = '<p class="chosen-player" id="first-name"></p>';
    const nameEl = target.querySelector('#first-name');

    function tick() {
      nameEl.textContent = players[step % players.length];
      nameEl.style.animation = 'none';
      if (step < steps) {
        step++;
        spinId = setTimeout(tick, 50 + step * 8);
      } else {
        nameEl.style.animation = '';
        target.insertAdjacentHTML('beforeend', `<p class="mini-note">${escapeHtml(players[winner])} começa! Sorte a todos.</p>`);
      }
    }
    tick();
  }

  function order(target, ctx) {
    const { escapeHtml, shuffle } = ctx.utils;
    target.innerHTML = `
      <ol class="order-list">
        ${shuffle(ctx.players.getAll()).map((p, i) => `<li style="animation-delay:${i * 80}ms">${escapeHtml(p)}</li>`).join('')}
      </ol>
    `;
  }

  function teamsSetup(target, ctx) {
    const max = Math.min(4, ctx.players.count());
    const options = [2, 3, 4].filter(n => n <= max);

    target.innerHTML = `
      <p class="mini-note">Quantas equipas?</p>
      <div class="btn-row">
        ${options.map(n => `<button class="game-btn secondary small" data-teams="${n}">${n} equipas</button>`).join('')}
      </div>
      <div id="teams-out" class="team-grid"></div>
    `;

    target.querySelectorAll('[data-teams]').forEach(btn => {
      btn.addEventListener('click', () => makeTeams(target.querySelector('#teams-out'), ctx, Number(btn.dataset.teams)));
    });
  }

  function makeTeams(target, ctx, count) {
    const { escapeHtml, shuffle } = ctx.utils;
    const teams = Array.from({ length: count }, () => []);
    shuffle(ctx.players.getAll()).forEach((p, i) => teams[i % count].push(p));

    target.innerHTML = teams.map((members, i) => `
      <div class="team-card" style="--team-color:${TEAM_COLORS[i]};animation-delay:${i * 90}ms">
        <h3>${TEAM_NAMES[i]}</h3>
        <ul>${members.map(m => `<li>${escapeHtml(m)}</li>`).join('')}</ul>
      </div>
    `).join('');
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.sorteador = {
    mount(container, ctx) {
      menu(container, ctx);
    },
    unmount() {
      stopSpin();
    }
  };
})();
