// ============================================================
// simon.js — Sequência (estilo Simon)
// O jogo mostra uma sequência de cores; repete-a. A cada acerto
// a sequência cresce. 5 pts por cada nível completado.
// ============================================================

(function () {
  const PADS = ['#A6FF3D', '#FF3D7F', '#3DA5FF', '#FFB020'];
  const TONES = [330, 392, 494, 587];
  const POINTS_PER_LEVEL = 5;
  let timers = [];
  let audio = null;
  let state = null;

  function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function clearAll() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function tone(i) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.frequency.value = TONES[i];
      gain.gain.setValueAtTime(0.08, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.35);
      osc.connect(gain).connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + 0.35);
    } catch (e) {
      // sem som, só cores
    }
  }

  function start(container, ctx) {
    clearAll();
    state = { players: ctx.players.count() > 0 ? ctx.players.getAll() : ['Jogador 1'], turn: 0, results: [] };
    ready(container, ctx);
  }

  function ready(container, ctx) {
    const { escapeHtml } = ctx.utils;
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🌈 Sequência · ${state.turn + 1}/${state.players.length}</span>
        <h2>Vez de <span class="highlight">${escapeHtml(state.players[state.turn])}</span></h2>
        <p class="game-lead" data-k="status" role="status">Vê a sequência e repete-a.</p>
        <div class="simon">
          ${PADS.map((c, i) => `<button class="simon-pad" style="--pad:${c}" data-pad="${i}" aria-label="Cor ${i + 1}" disabled></button>`).join('')}
        </div>
        <button class="game-btn" data-k="go">Começar ➔</button>
      </div>
    `;
    container.querySelector('[data-k="go"]').addEventListener('click', e => {
      e.currentTarget.hidden = true;
      round(container, ctx, [Math.floor(Math.random() * 4)]);
    });
  }

  function round(container, ctx, sequence) {
    const pads = [...container.querySelectorAll('[data-pad]')];
    const status = container.querySelector('[data-k="status"]');
    pads.forEach(p => { p.disabled = true; });
    status.textContent = `Nível ${sequence.length} · atenção…`;

    const flash = (i, at) => {
      later(() => { pads[i].classList.add('is-lit'); tone(i); }, at);
      later(() => pads[i].classList.remove('is-lit'), at + 380);
    };
    const gap = Math.max(260, 600 - sequence.length * 25);
    sequence.forEach((i, k) => flash(i, 500 + k * gap));

    later(() => {
      status.textContent = 'A tua vez!';
      pads.forEach(p => { p.disabled = false; });
      let step = 0;
      pads.forEach(pad => {
        pad.onclick = () => {
          const i = Number(pad.dataset.pad);
          flash(i, 0);
          if (i !== sequence[step]) return fail(container, ctx, sequence.length - 1);
          step++;
          if (step === sequence.length) {
            pads.forEach(p => { p.disabled = true; p.onclick = null; });
            later(() => round(container, ctx, [...sequence, Math.floor(Math.random() * 4)]), 600);
          }
        };
      });
    }, 500 + sequence.length * gap);
  }

  function fail(container, ctx, level) {
    clearAll();
    const { escapeHtml } = ctx.utils;
    const name = state.players[state.turn];
    state.results.push([name, level]);
    if (level > 0 && ctx.players.count() > 0) ctx.scoring.award(name, level * POINTS_PER_LEVEL);
    const isLast = state.turn === state.players.length - 1;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">❌ Errou a cor</span>
        <h2>${escapeHtml(name)} chegou ao nível ${level}</h2>
        <p class="mini-note">${level > 0 ? `+${level * POINTS_PER_LEVEL} pts` : 'Sem pontos desta vez.'}</p>
        <button class="game-btn" data-k="next">${isLast ? 'Ver resultados ➔' : 'Próximo jogador ➔'}</button>
      </div>
    `;
    container.querySelector('[data-k="next"]').addEventListener('click', () => {
      if (!isLast) {
        state.turn++;
        return ready(container, ctx);
      }
      const ranking = [...state.results].sort((a, b) => b[1] - a[1]);
      container.innerHTML = `
        <div class="game-screen">
          <h2>🏆 Melhor memória</h2>
          ${GameKit.resultsList(ranking, escapeHtml, 'níveis')}
          <button class="game-btn" data-k="again">Jogar outra vez ➔</button>
        </div>
      `;
      container.querySelector('[data-k="again"]').addEventListener('click', () => start(container, ctx));
    });
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.simon = { mount: start, unmount() { clearAll(); state = null; } };
})();
