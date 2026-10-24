// ============================================================
// desenha.js — Desenha e Adivinha
// O artista vê a palavra em privado e desenha-a no ecrã (dedo
// ou rato). Os outros tentam adivinhar em 60s. Se acertarem,
// o artista ganha 15 pts e quem adivinhou ganha 10 pts.
// O papel de artista roda pelo grupo.
// ============================================================

(function () {
  const TIME_LIMIT = 60;
  const ARTIST_POINTS = 15;
  const GUESSER_POINTS = 10;
  const COLORS = ['#0A0C0D', '#FF3D7F', '#3DA5FF', '#3DDC84', '#FFB020'];

  const WORDS = [
    'Casa', 'Gato', 'Bicicleta', 'Sol', 'Árvore', 'Peixe', 'Guitarra', 'Avião',
    'Gelado', 'Óculos', 'Relógio', 'Castelo', 'Foguetão', 'Cogumelo', 'Ponte',
    'Pizza', 'Caracol', 'Farol', 'Tubarão', 'Robô', 'Coroa', 'Vulcão', 'Barco',
    'Arco-íris', 'Cacto', 'Dragão', 'Comboio', 'Ananás', 'Fantasma', 'Lâmpada',
    'Chávena de café', 'Boneco de neve', 'Telemóvel', 'Escada', 'Tenda', 'Baleia',
    'Pinguim', 'Martelo', 'Bolo de aniversário', 'Guarda-chuva', 'Montanha', 'Abelha'
  ];

  let wordBag = null;
  let timerId = null;
  let artistIndex = -1;
  let state = null;

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function needPlayers(container) {
    container.innerHTML = `
      <div class="game-screen">
        <h2>🎨 Desenha e Adivinha</h2>
        <p class="game-lead">Precisas de pelo menos <strong>2 jogadores</strong> adicionados na secção "Quem joga hoje?" para jogar.</p>
      </div>
    `;
  }

  function intro(container, ctx) {
    stopTimer();
    if (ctx.players.count() < 2) return needPlayers(container);

    const { escapeHtml } = ctx.utils;
    const players = ctx.players.getAll();
    artistIndex = (artistIndex + 1) % players.length;
    wordBag = wordBag || ctx.utils.createShuffleBag(WORDS);
    state = { players, artist: players[artistIndex], word: wordBag.next(), timeLeft: TIME_LIMIT };
    const artist = escapeHtml(state.artist);

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🎨 Desenha e Adivinha</span>
        <h2>O artista desta ronda é</h2>
        <p class="chosen-player">${artist}</p>
        <p class="mini-note">Só ${artist} deve ver a palavra. Nada de letras ou números no desenho!</p>
        <button class="game-btn" id="show-word">Sou ${artist}, mostrar a palavra</button>
      </div>
    `;
    container.querySelector('#show-word').addEventListener('click', () => showWord(container, ctx));
  }

  function showWord(container, ctx) {
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">Desenha isto</span>
        <p class="big-word">${state.word}</p>
        <p class="mini-note">Memoriza a palavra. Quando carregares em começar, ela desaparece e tens ${TIME_LIMIT}s.</p>
        <button class="game-btn" id="start-drawing">Começar a desenhar ➔</button>
      </div>
    `;
    container.querySelector('#start-drawing').addEventListener('click', () => draw(container, ctx));
  }

  function draw(container, ctx) {
    container.innerHTML = `
      <div class="game-screen">
        <div class="game-timer" id="timer">${TIME_LIMIT}s</div>
        <div class="draw-board"><canvas id="draw-canvas"></canvas></div>
        <div class="draw-tools" role="toolbar" aria-label="Cores">
          ${COLORS.map((c, i) => `<button class="swatch ${i === 0 ? 'is-active' : ''}" style="--swatch:${c}" data-color="${c}" aria-label="Cor ${i + 1}"></button>`).join('')}
          <button class="game-btn secondary small" id="clear-board">Limpar</button>
        </div>
        <div class="btn-row">
          <button class="game-btn" id="guessed">✅ Adivinharam!</button>
          <button class="game-btn secondary" id="give-up">Desistir</button>
        </div>
      </div>
    `;

    const canvas = container.querySelector('#draw-canvas');
    const pad = setupCanvas(canvas);

    container.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('[data-color]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        pad.setColor(btn.dataset.color);
      });
    });
    container.querySelector('#clear-board').addEventListener('click', pad.clear);
    container.querySelector('#guessed').addEventListener('click', () => {
      stopTimer();
      pickGuesser(container, ctx);
    });
    container.querySelector('#give-up').addEventListener('click', () => {
      stopTimer();
      reveal(container, ctx, false);
    });

    const timerEl = container.querySelector('#timer');
    const endAt = Date.now() + TIME_LIMIT * 1000;
    timerId = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      timerEl.textContent = `${left}s`;
      timerEl.classList.toggle('is-warning', left <= 10);
      if (left === 0) {
        stopTimer();
        reveal(container, ctx, false);
      }
    }, 250);
  }

  // Quadro de desenho com pointer events (rato, dedo e caneta)
  function setupCanvas(canvas) {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const g = canvas.getContext('2d');
    g.scale(ratio, ratio);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.lineWidth = 5;
    g.strokeStyle = COLORS[0];

    let drawing = false;
    const point = e => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    canvas.addEventListener('pointerdown', e => {
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      const p = point(e);
      g.beginPath();
      g.moveTo(p.x, p.y);
      g.lineTo(p.x + 0.1, p.y + 0.1);
      g.stroke();
    });
    canvas.addEventListener('pointermove', e => {
      if (!drawing) return;
      const p = point(e);
      g.lineTo(p.x, p.y);
      g.stroke();
    });
    const end = () => { drawing = false; };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);

    return {
      setColor(c) { g.strokeStyle = c; },
      clear() { g.clearRect(0, 0, canvas.width, canvas.height); }
    };
  }

  function pickGuesser(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const guessers = state.players.filter(p => p !== state.artist);

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">Era "${state.word}"</span>
        <h2>Quem adivinhou primeiro?</h2>
        <div class="player-toggles">
          ${guessers.map(p => `<button class="game-btn secondary" data-guesser="${escapeHtml(p)}">${escapeHtml(p)}</button>`).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-guesser]').forEach(btn => {
      btn.addEventListener('click', () => {
        ctx.scoring.award(state.artist, ARTIST_POINTS);
        ctx.scoring.award(btn.dataset.guesser, GUESSER_POINTS);
        reveal(container, ctx, true, btn.dataset.guesser);
      });
    });
  }

  function reveal(container, ctx, success, guesser) {
    const { escapeHtml } = ctx.utils;
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">${success ? '🎉 Acertaram!' : '⏰ Ninguém adivinhou'}</span>
        <p class="big-word">${state.word}</p>
        ${success
          ? `<p class="game-lead"><strong class="highlight">${escapeHtml(state.artist)}</strong> +${ARTIST_POINTS} pts · <strong class="highlight">${escapeHtml(guesser)}</strong> +${GUESSER_POINTS} pts</p>`
          : '<p class="mini-note">Sem pontos nesta ronda. Fica para a próxima obra-prima.</p>'}
        <button class="game-btn" id="next-artist">Próximo artista ➔</button>
      </div>
    `;
    container.querySelector('#next-artist').addEventListener('click', () => intro(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.desenha = {
    mount(container, ctx) {
      intro(container, ctx);
    },
    unmount() {
      stopTimer();
      state = null;
    }
  };
})();
