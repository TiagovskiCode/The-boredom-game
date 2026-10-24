// ============================================================
// memoria.js — Jogo da Memória
// 8 pares de cartas viradas para baixo. À vez, cada jogador
// vira duas. Se forem iguais, ganha o par e joga outra vez.
// No fim, 5 pts por cada par.
// ============================================================

(function () {
  const SYMBOLS = ['🍕', '🎸', '🚀', '🐙', '🌵', '🎲', '🍩', '👾', '🦄', '⚽', '🍉', '🎩'];
  const PAIRS = 8;
  const POINTS_PER_PAIR = 5;
  let flipBackId = null;

  function start(container, ctx) {
    clearTimeout(flipBackId);
    const { escapeHtml, shuffle } = ctx.utils;
    const players = ctx.players.count() > 0 ? ctx.players.getAll() : ['Jogador 1'];
    const deck = shuffle(shuffle(SYMBOLS).slice(0, PAIRS).flatMap(s => [s, s]));
    const score = new Map(players.map(p => [p, 0]));
    let turn = 0;
    let open = [];
    let found = 0;
    let busy = false;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🧠 Memória</span>
        <p class="game-lead" data-k="status" role="status"></p>
        <div class="memory-grid">
          ${deck.map((s, i) => `<button class="memory-card" data-i="${i}" aria-label="Carta ${i + 1}"><span>${s}</span></button>`).join('')}
        </div>
        <p class="stat-line" data-k="score"></p>
      </div>
    `;

    const status = container.querySelector('[data-k="status"]');
    const scoreEl = container.querySelector('[data-k="score"]');
    const cards = [...container.querySelectorAll('[data-i]')];
    const paint = () => {
      status.innerHTML = `Vez de <strong class="highlight">${escapeHtml(players[turn])}</strong>`;
      scoreEl.innerHTML = players.map(p => `<span class="chip">${escapeHtml(p)}: ${score.get(p)}</span>`).join('');
    };
    paint();

    cards.forEach(card => card.addEventListener('click', () => {
      const i = Number(card.dataset.i);
      if (busy || open.includes(i) || card.classList.contains('is-matched')) return;
      card.classList.add('is-flipped');
      open.push(i);
      if (open.length < 2) return;

      const [a, b] = open;
      if (deck[a] === deck[b]) {
        cards[a].classList.add('is-matched');
        cards[b].classList.add('is-matched');
        score.set(players[turn], score.get(players[turn]) + 1);
        found++;
        open = [];
        paint();
        if (found === PAIRS) finish(container, ctx, players, score);
        return;
      }

      busy = true;
      flipBackId = setTimeout(() => {
        cards[a].classList.remove('is-flipped');
        cards[b].classList.remove('is-flipped');
        open = [];
        busy = false;
        turn = (turn + 1) % players.length;
        paint();
      }, 900);
    }));
  }

  function finish(container, ctx, players, score) {
    const { escapeHtml } = ctx.utils;
    const ranking = [...score].sort((a, b) => b[1] - a[1]);
    if (ctx.players.count() > 0) ranking.forEach(([p, pairs]) => pairs && ctx.scoring.award(p, pairs * POINTS_PER_PAIR));

    flipBackId = setTimeout(() => {
      container.innerHTML = `
        <div class="game-screen">
          <h2>🏆 Todas as cartas encontradas!</h2>
          <p class="chosen-player">${escapeHtml(ranking[0][0])}</p>
          ${GameKit.resultsList(ranking, escapeHtml, 'pares')}
          <button class="game-btn" data-k="again">Jogar outra vez ➔</button>
        </div>
      `;
      container.querySelector('[data-k="again"]').addEventListener('click', () => start(container, ctx));
    }, 700);
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.memoria = { mount: start, unmount: () => clearTimeout(flipBackId) };
})();
