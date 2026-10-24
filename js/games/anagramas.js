// ============================================================
// anagramas.js — Anagramas
// Aparecem letras baralhadas. Quem disser primeiro a palavra
// certa ganha 10 pts. 30 segundos por palavra.
// ============================================================

(function () {
  const SECONDS = 30;
  const POINTS = 10;
  const WORDS = [
    'PRAIA', 'ESCOLA', 'JANELA', 'CADEIRA', 'LARANJA', 'CAMISOLA', 'TOMATE', 'BANANA', 'PLANETA',
    'GIRAFA', 'COELHO', 'CINEMA', 'MÚSICA', 'TECLADO', 'ESTRELA', 'FLORESTA', 'GALINHA', 'CAMIÃO',
    'PIZZA', 'TESOURA', 'CHAVEIRO', 'PANELA', 'RELÓGIO', 'FOGUETE', 'MOCHILA', 'SORVETE', 'BATATA', 'ABÓBORA'
  ];
  let bag = null;
  let stop = () => {};

  function scramble(word, shuffle) {
    const letters = [...word.normalize('NFD').replace(/[̀-ͯ]/g, '')];
    let mixed;
    do { mixed = shuffle(letters).join(''); } while (mixed === letters.join(''));
    return mixed;
  }

  function round(container, ctx) {
    stop();
    const { escapeHtml, createShuffleBag, shuffle } = ctx.utils;
    bag = bag || createShuffleBag(WORDS);
    const word = bag.next();
    const players = ctx.players.getAll();

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🔤 Anagramas</span>
        <h2>Que palavra é esta?</h2>
        <p class="anagram">${[...scramble(word, shuffle)].map(l => `<span>${l}</span>`).join('')}</p>
        <div class="game-timer" data-k="timer">${SECONDS}s</div>
        ${players.length ? `<p class="mini-note">Quem acertou primeiro?</p>
          <div class="player-toggles">${players.map(p => `<button class="game-btn secondary small" data-winner="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join('')}</div>` : ''}
        <p class="highlight" data-k="answer" role="status"></p>
        <div class="btn-row">
          <button class="game-btn secondary" data-k="reveal">Revelar</button>
          <button class="game-btn" data-k="next">Próxima ➔</button>
        </div>
      </div>
    `;

    const answer = container.querySelector('[data-k="answer"]');
    const reveal = text => {
      stop();
      answer.textContent = text;
      container.querySelectorAll('[data-winner]').forEach(b => { b.disabled = true; });
    };

    container.querySelectorAll('[data-winner]').forEach(btn => btn.addEventListener('click', () => {
      ctx.scoring.award(btn.dataset.winner, POINTS);
      btn.classList.add('is-on');
      reveal(`✅ ${word} · +${POINTS} pts para ${btn.dataset.winner}`);
    }));
    container.querySelector('[data-k="reveal"]').addEventListener('click', () => reveal(`Era: ${word}`));
    container.querySelector('[data-k="next"]').addEventListener('click', () => round(container, ctx));
    stop = GameKit.countdown(container.querySelector('[data-k="timer"]'), SECONDS, () => reveal(`⏰ Era: ${word}`));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.anagramas = { mount: round, unmount: () => stop() };
})();
