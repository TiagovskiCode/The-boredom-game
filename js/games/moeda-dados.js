// ============================================================
// moeda-dados.js — Moeda & Dados (utilitário)
// Atirar uma moeda ao ar ou lançar 1 a 3 dados, para os jogos
// de tabuleiro lá de casa ou para decidir qualquer coisa.
// ============================================================

(function () {
  const FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  let rollId = null;

  function render(container) {
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🪙 Moeda & Dados</span>
        <h2>Atira a moeda</h2>
        <div class="coin" data-k="coin"><span class="coin-face">😀</span><span class="coin-face coin-face--back">👑</span></div>
        <p class="game-lead" data-k="coin-result" role="status">Cara ou coroa?</p>
        <button class="game-btn" data-k="flip">Atirar moeda 🪙</button>

        <h2>Lança os dados</h2>
        <div class="btn-row">
          ${[1, 2, 3].map(n => `<button class="game-btn secondary small ${n === 2 ? 'is-on' : ''}" data-count="${n}">${n} dado${n > 1 ? 's' : ''}</button>`).join('')}
        </div>
        <div class="dice-row" data-k="dice"></div>
        <p class="game-lead" data-k="dice-result" role="status"></p>
        <button class="game-btn" data-k="roll">Lançar 🎲</button>
      </div>
    `;

    // ---------- Moeda ----------
    const coin = container.querySelector('[data-k="coin"]');
    const coinResult = container.querySelector('[data-k="coin-result"]');
    let spins = 0;
    container.querySelector('[data-k="flip"]').addEventListener('click', () => {
      const heads = Math.random() < 0.5;
      spins += 5;
      coin.style.transform = `rotateY(${spins * 360 + (heads ? 0 : 180)}deg)`;
      coinResult.textContent = '…';
      setTimeout(() => { coinResult.innerHTML = `Saiu <strong class="highlight">${heads ? 'CARA' : 'COROA'}</strong>!`; }, 1100);
    });

    // ---------- Dados ----------
    let count = 2;
    const diceEl = container.querySelector('[data-k="dice"]');
    const diceResult = container.querySelector('[data-k="dice-result"]');
    const paintDice = values => {
      diceEl.innerHTML = values.map(v => `<span class="die-face">${FACES[v - 1]}</span>`).join('');
    };
    paintDice(Array(count).fill(1));

    container.querySelectorAll('[data-count]').forEach(btn => btn.addEventListener('click', () => {
      count = Number(btn.dataset.count);
      container.querySelectorAll('[data-count]').forEach(b => b.classList.toggle('is-on', b === btn));
      paintDice(Array(count).fill(1));
      diceResult.textContent = '';
    }));

    container.querySelector('[data-k="roll"]').addEventListener('click', () => {
      clearInterval(rollId);
      let ticks = 0;
      const random = () => Array.from({ length: count }, () => 1 + Math.floor(Math.random() * 6));
      rollId = setInterval(() => {
        const values = random();
        paintDice(values);
        if (++ticks < 10) return;
        clearInterval(rollId);
        diceResult.innerHTML = `Total: <strong class="highlight">${values.reduce((a, b) => a + b, 0)}</strong>`;
      }, 70);
    });
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['moeda-dados'] = { mount: render, unmount() { clearInterval(rollId); } };
})();
