// ============================================================
// palavra-encadeada.js — Palavra Encadeada
// Cada palavra tem de começar pela última letra da anterior.
// Escreve-a em 10 segundos ou estás fora. Não vale repetir.
// O último a ficar em jogo ganha 20 pts.
// ============================================================

(function () {
  const SECONDS = 10;
  const POINTS = 20;
  const STARTERS = ['CASA', 'PRAIA', 'GATO', 'MESA', 'LIVRO', 'FESTA', 'BOLA', 'NOITE', 'SAPATO', 'JANELA'];
  const clean = text => text.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z]/g, '');
  let stop = () => {};
  let state = null;

  function start(container, ctx) {
    stop();
    if (ctx.players.count() < 2) return GameKit.needPlayers(container, { emoji: '🔗', title: 'Palavra Encadeada', minPlayers: 2 });
    const first = STARTERS[Math.floor(Math.random() * STARTERS.length)];
    state = { alive: ctx.utils.shuffle(ctx.players.getAll()), turn: 0, last: first, used: new Set([first]), chain: [first] };
    turn(container, ctx);
  }

  function turn(container, ctx, message = '') {
    stop();
    const { escapeHtml } = ctx.utils;
    const name = state.alive[state.turn];
    const letter = state.last.slice(-1);

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🔗 Palavra Encadeada · ${state.alive.length} em jogo</span>
        <p class="mini-note">${state.chain.slice(-4).join(' → ')}</p>
        <h2>${escapeHtml(name)}, uma palavra começada por</h2>
        <p class="game-letter">${letter}</p>
        <div class="game-timer" data-k="timer">${SECONDS}s</div>
        <div class="answer-form">
          <input class="game-input" data-k="input" placeholder="${letter}…" autocomplete="off" autocapitalize="characters" enterkeyhint="send">
          <button class="game-btn" data-k="send">Enviar</button>
        </div>
        <p class="mini-note text-danger" data-k="msg" role="status">${message}</p>
      </div>
    `;

    const input = container.querySelector('[data-k="input"]');
    const msg = container.querySelector('[data-k="msg"]');
    input.focus();

    const submit = () => {
      const word = clean(input.value);
      if (word.length < 2) return;
      if (word[0] !== letter) { msg.textContent = `Tem de começar por ${letter}!`; return; }
      if (state.used.has(word)) { msg.textContent = 'Essa já foi dita!'; return; }
      state.used.add(word);
      state.chain.push(word);
      state.last = word;
      state.turn = (state.turn + 1) % state.alive.length;
      turn(container, ctx);
    };

    container.querySelector('[data-k="send"]').addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) submit(); });

    stop = GameKit.countdown(container.querySelector('[data-k="timer"]'), SECONDS, () => {
      const out = state.alive.splice(state.turn, 1)[0];
      if (state.alive.length === 1) return winner(container, ctx);
      state.turn %= state.alive.length;
      turn(container, ctx, `⏰ ${out} ficou sem tempo e saiu do jogo!`);
    });
  }

  function winner(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const champ = state.alive[0];
    ctx.scoring.award(champ, POINTS);
    container.innerHTML = `
      <div class="game-screen">
        <h2>🏆 Último em pé</h2>
        <p class="chosen-player">${escapeHtml(champ)}</p>
        <p class="mini-note">+${POINTS} pts · corrente de ${state.chain.length} palavras</p>
        <p class="mini-note">${state.chain.join(' → ')}</p>
        <button class="game-btn" data-k="again">Jogar outra vez ➔</button>
      </div>
    `;
    container.querySelector('[data-k="again"]').addEventListener('click', () => start(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['palavra-encadeada'] = { mount: start, unmount() { stop(); state = null; } };
})();
