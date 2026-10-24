// ============================================================
// garrafa.js — Roda a Garrafa
// Os nomes ficam à volta de um círculo e a garrafa gira até
// apontar para alguém. Opcionalmente mostra um mini-desafio.
// ============================================================

(function () {
  const DARES = [
    'Conta uma piada.', 'Faz um elogio à pessoa à tua esquerda.', 'Imita alguém do grupo.',
    'Responde a uma pergunta do grupo com toda a sinceridade.', 'Canta 10 segundos de uma música.',
    'Faz a tua melhor pose de super-herói.', 'Conta o teu momento mais embaraçoso.',
    'Escolhe quem roda a seguir.', 'Fala com sotaque até à próxima ronda.', 'Faz 10 saltos.'
  ];
  let spinning = false;
  let rotation = 0;
  let doneId = null;

  function render(container, ctx) {
    const { escapeHtml } = ctx.utils;
    if (ctx.players.count() < 2) return GameKit.needPlayers(container, { emoji: '🍾', title: 'Roda a Garrafa', minPlayers: 2 });
    const players = ctx.players.getAll();
    const step = 360 / players.length;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🍾 Roda a Garrafa</span>
        <div class="bottle-ring">
          ${players.map((p, i) => `<span class="bottle-name" style="--angle:${i * step}deg">${escapeHtml(p)}</span>`).join('')}
          <div class="bottle" data-k="bottle" style="transform:rotate(${rotation}deg)">
            <svg viewBox="0 0 40 120" aria-hidden="true"><path d="M15 4h10v26c0 6 11 12 11 26v56a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V56c0-14 11-20 11-26z"/><rect x="13" y="0" width="14" height="10" rx="3"/></svg>
          </div>
        </div>
        <p class="chosen-player" data-k="who" role="status"></p>
        <p class="big-word big-word--text" data-k="dare" hidden></p>
        <button class="game-btn" data-k="spin">Rodar a garrafa ➔</button>
      </div>
    `;

    const bottle = container.querySelector('[data-k="bottle"]');
    const who = container.querySelector('[data-k="who"]');
    const dare = container.querySelector('[data-k="dare"]');
    const btn = container.querySelector('[data-k="spin"]');

    btn.addEventListener('click', () => {
      if (spinning) return;
      spinning = true;
      btn.disabled = true;
      who.textContent = '';
      dare.hidden = true;

      const pick = Math.floor(Math.random() * players.length);
      // O gargalo aponta para cima (0°), tal como o primeiro nome do círculo
      const target = pick * step;
      const current = ((rotation % 360) + 360) % 360;
      rotation += 360 * 5 + ((target - current + 360) % 360);
      bottle.style.transform = `rotate(${rotation}deg)`;

      doneId = setTimeout(() => {
        spinning = false;
        btn.disabled = false;
        who.textContent = players[pick];
        dare.textContent = DARES[Math.floor(Math.random() * DARES.length)];
        dare.hidden = false;
      }, 3200);
    });
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.garrafa = { mount: render, unmount() { clearTimeout(doneId); spinning = false; } };
})();
