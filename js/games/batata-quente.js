// ============================================================
// batata-quente.js — Batata Quente
// Aparece um tema ("Uma marca de carros"). Quem tem o telemóvel
// diz uma resposta e carrega em "Passar". A bomba tem um
// rastilho secreto (15–40s) e o tic-tac acelera. Quem a tiver
// na mão quando rebentar perde; os outros ganham pontos.
// ============================================================

(function () {
  const SURVIVOR_POINTS = 10;
  const MIN_FUSE = 15000;
  const MAX_FUSE = 40000;

  const TOPICS = [
    'Uma marca de carros', 'Um animal', 'Um país', 'Uma fruta', 'Uma cor',
    'Um desporto', 'Uma profissão', 'Um super-herói', 'Uma série ou filme',
    'Uma comida', 'Uma cidade portuguesa', 'Um instrumento musical',
    'Uma app do telemóvel', 'Algo que se leva para a praia', 'Uma peça de roupa',
    'Um jogo de vídeo', 'Uma bebida', 'Algo que há numa cozinha',
    'Uma personagem da Disney', 'Um cantor ou cantora', 'Uma capital europeia',
    'Uma palavra que rime com "ão"', 'Algo que é redondo', 'Uma marca de roupa',
    'Uma coisa que se encontra num escritório', 'Um doce', 'Um planeta ou estrela'
  ];

  let topicBag = null;
  let fuseTimeout = null;
  let tickTimeout = null;
  let audio = null;
  let state = null;

  // ---------- Som (Web Audio, sem ficheiros) ----------
  function beep(freq, duration, volume = 0.08, type = 'square') {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
      osc.connect(gain).connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + duration);
    } catch (e) {
      // sem áudio: o jogo continua só com o visual
    }
  }

  function stopTimers() {
    clearTimeout(fuseTimeout);
    clearTimeout(tickTimeout);
    fuseTimeout = null;
    tickTimeout = null;
  }

  function intro(container, ctx) {
    stopTimers();
    if (ctx.players.count() < 3) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>💣 Batata Quente</h2>
          <p class="game-lead">Precisas de pelo menos <strong>3 jogadores</strong> adicionados na secção "Quem joga hoje?" para jogar.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">💣 Batata Quente</span>
        <h2>Não fiques com a bomba na mão</h2>
        <p class="game-lead">Diz uma resposta para o tema e carrega em <strong>Passar</strong>. O telemóvel segue para o próximo da lista. Ninguém sabe quando rebenta!</p>
        <p class="mini-note">Não vale repetir respostas. Quem hesitar demasiado, o grupo pode obrigar a passar à mesma.</p>
        <button class="game-btn" id="light-fuse">Acender o rastilho 🔥</button>
      </div>
    `;
    container.querySelector('#light-fuse').addEventListener('click', () => play(container, ctx));
  }

  function play(container, ctx) {
    topicBag = topicBag || ctx.utils.createShuffleBag(TOPICS);
    const players = ctx.players.getAll();
    const fuse = MIN_FUSE + Math.random() * (MAX_FUSE - MIN_FUSE);

    state = {
      players,
      holder: Math.floor(Math.random() * players.length),
      topic: topicBag.next(),
      passes: 0,
      startedAt: performance.now(),
      fuse
    };

    renderTurn(container, ctx);
    fuseTimeout = setTimeout(() => explode(container, ctx), fuse);
    tick(container);
  }

  // Tic-tac que acelera à medida que o rastilho encurta
  function tick(container) {
    const elapsed = performance.now() - state.startedAt;
    const left = Math.max(state.fuse - elapsed, 0);
    const ratio = left / state.fuse;
    beep(ratio < 0.25 ? 1200 : 900, 0.05);

    const bomb = container.querySelector('.bomb');
    if (bomb) bomb.classList.toggle('is-fast', ratio < 0.3);

    tickTimeout = setTimeout(() => tick(container), 120 + ratio * 700);
  }

  function renderTurn(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const name = state.players[state.holder];

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">Tema</span>
        <p class="big-word big-word--text">${state.topic}</p>
        <div class="bomb" aria-hidden="true">💣</div>
        <p class="mini-note">Está com a bomba:</p>
        <p class="chosen-player">${escapeHtml(name)}</p>
        <button class="game-btn" id="pass">Disse! Passar ➔</button>
        <p class="mini-note">${state.passes} passe${state.passes === 1 ? '' : 's'} até agora</p>
      </div>
    `;

    container.querySelector('#pass').addEventListener('click', () => {
      state.passes++;
      state.holder = (state.holder + 1) % state.players.length;
      beep(500, 0.08, 0.06, 'triangle');
      renderTurn(container, ctx);
    });
  }

  function explode(container, ctx) {
    stopTimers();
    const { escapeHtml } = ctx.utils;
    const loser = state.players[state.holder];
    const survivors = state.players.filter(p => p !== loser);

    beep(80, 0.8, 0.25, 'sawtooth');
    beep(60, 1, 0.2, 'square');
    if (navigator.vibrate) navigator.vibrate([200, 80, 300]);

    survivors.forEach(p => ctx.scoring.award(p, SURVIVOR_POINTS));

    container.innerHTML = `
      <div class="game-screen is-shaking">
        <p class="boom-text">BOOM!</p>
        <h2>A bomba rebentou nas mãos de</h2>
        <p class="chosen-player">${escapeHtml(loser)}</p>
        <p class="mini-note">Os outros ${survivors.length} jogadores ganham +${SURVIVOR_POINTS} pts. ${state.passes} passes nesta ronda.</p>
        <div class="btn-row">
          <button class="game-btn" id="again">Nova ronda 🔥</button>
        </div>
      </div>
    `;

    container.querySelector('#again').addEventListener('click', () => play(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['batata-quente'] = {
    mount(container, ctx) {
      intro(container, ctx);
    },
    unmount() {
      stopTimers();
      state = null;
    }
  };
})();
