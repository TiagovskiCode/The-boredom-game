// ============================================================
// blitz.js — Blitz Rápido
// Desafio de listar coisas contra o relógio. É uma corrida:
// os jogadores escrevem a resposta e submetem com Enter; no fim,
// o grupo marca quem acertou e quem respondeu certo mais rápido
// ganha mais pontos.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules.blitz = {
  timeLimit: 20,
  timerId: null,

  cleanup() {
    clearInterval(this.timerId);
  },

  challenges: [
    'Nomeia 3 filmes de terror',
    'Nomeia 3 marcas de carros',
    'Nomeia 3 países de África',
    'Nomeia 3 super-heróis',
    'Nomeia 3 personagens da Disney',
    'Nomeia 3 fast-foods',
    'Nomeia 3 cantores/cantoras',
    'Nomeia 3 séries da Netflix',
    'Nomeia 3 comidas timorenses',
    'Nomeia 3 emojis que usas mais',
    'Nomeia 3 desportos',
    'Nomeia 3 objetos redondos',
    'Nomeia 3 profissões',
    'Nomeia 3 animais que voam',
    'Nomeia 3 cores',
    'Nomeia 3 marcas de telemóvel',
    'Nomeia 3 ilhas do mundo',
    'Nomeia 3 instrumentos musicais',
    'Nomeia 3 bebidas',
    'Nomeia 3 jogos de vídeo',
    'Nomeia 3 personagens de desenhos animados',
    'Nomeia 3 doces timorenses',
    'Nomeia 3 aplicações do telemóvel',
    'Nomeia 3 marcas de roupa',
    'Nomeia 3 capitais do mundo',
    'Nomeia 3 frutas tropicais',
    'Nomeia 3 séries de anime',
    'Nomeia 3 tipos de dança',
    'Nomeia 3 utensílios de cozinha',
    'Nomeia 3 feriados'
  ],

  render(container) {
    clearInterval(this.timerId);
    if (!this.bag) this.bag = createShuffleBag(this.challenges);

    const challenge = this.bag.next();

    this.session = {
      challenge,
      startTime: null,
      timeLeft: this.timeLimit,
      submissions: [], // { player, answer, elapsedMs }
      finished: false
    };

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">⚡ Blitz Rápido</span>
        <h2>${challenge}</h2>
        <p class="mini-note">Todos podem responder! Quem escrever a resposta certa mais rápido ganha mais pontos.</p>
        <div class="game-timer" id="timer">${this.timeLimit}s</div>
        <button class="game-btn" id="start-blitz">Começar ➔</button>
      </div>
    `;

    container.querySelector('#start-blitz').addEventListener('click', () => this.startRound(container));
  },

  startRound(container) {
    const s = this.session;
    s.startTime = Date.now();

    const players = Players.getAll();
    const playerOptions = players.length > 0
      ? players.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('')
      : `<option value="Jogador 1">Jogador 1</option>`;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">⚡ Blitz Rápido</span>
        <h2>${s.challenge}</h2>
        <div class="game-timer" id="timer">${s.timeLeft}s</div>

        <div class="answer-form">
          <select id="answer-player" class="game-select" aria-label="Quem responde">${playerOptions}</select>
          <input type="text" id="answer-input" class="game-input" placeholder="Escreve a resposta e Enter..." autocomplete="off">
          <button class="game-btn secondary" id="submit-answer">Enviar</button>
        </div>

        <div class="option-list" id="submissions-list"></div>

        <button class="game-btn secondary" id="finish-early">Terminar ronda ➔</button>
      </div>
    `;

    const timerEl = container.querySelector('#timer');
    const input = container.querySelector('#answer-input');
    const select = container.querySelector('#answer-player');

    const submit = () => this.submitAnswer(container, select.value, input.value);

    container.querySelector('#submit-answer').addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) submit();
    });
    container.querySelector('#finish-early').addEventListener('click', () => this.finishRound(container));

    input.focus();

    this.timerId = setInterval(() => {
      s.timeLeft--;
      timerEl.textContent = `${s.timeLeft}s`;
      timerEl.classList.toggle('is-warning', s.timeLeft <= 5);
      if (s.timeLeft <= 0) {
        clearInterval(this.timerId);
        this.finishRound(container);
      }
    }, 1000);
  },

  submitAnswer(container, player, answerRaw) {
    const s = this.session;
    if (s.finished) return;

    const answer = (answerRaw || '').trim();
    if (!answer) return;
    if (s.submissions.some(sub => sub.player === player)) return; // já respondeu

    s.submissions.push({
      player,
      answer,
      elapsedMs: Date.now() - s.startTime
    });

    this.renderSubmissions(container);

    const select = container.querySelector('#answer-player');
    const opt = select && Array.from(select.options).find(o => o.value === player);
    if (opt) opt.remove();

    const input = container.querySelector('#answer-input');
    input.value = '';
    input.focus();

    const totalPlayers = Math.max(Players.count(), 1);
    if (s.submissions.length >= totalPlayers) {
      clearInterval(this.timerId);
      this.finishRound(container);
    }
  },

  renderSubmissions(container) {
    const list = container.querySelector('#submissions-list');
    if (!list) return;

    const sorted = [...this.session.submissions].sort((a, b) => a.elapsedMs - b.elapsedMs);

    list.innerHTML = sorted.map((sub, i) => `
      <div class="option-row">
        <span class="row-label">${i + 1}º ${escapeHtml(sub.player)}: "${escapeHtml(sub.answer)}"</span>
        <span class="row-points">${(sub.elapsedMs / 1000).toFixed(1)}s</span>
      </div>
    `).join('');
  },

  finishRound(container) {
    clearInterval(this.timerId);
    this.session.finished = true;

    const sorted = [...this.session.submissions].sort((a, b) => a.elapsedMs - b.elapsedMs);

    if (sorted.length === 0) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>⏰ Tempo esgotado!</h2>
          <p class="game-lead">Ninguém respondeu a tempo...</p>
          <button class="game-btn" id="next-blitz">Próxima ronda ➔</button>
        </div>
      `;
      container.querySelector('#next-blitz').addEventListener('click', () => this.render(container));
      return;
    }

    container.innerHTML = `
      <div class="game-screen">
        <h2>⏰ Tempo esgotado!</h2>
        <p class="mini-note">Marca quem respondeu corretamente (o grupo decide).</p>
        <div class="option-list" id="review-list">
          ${sorted.map((sub, i) => `
            <div class="option-row">
              <span class="row-label">${i + 1}º ${escapeHtml(sub.player)}: "${escapeHtml(sub.answer)}" <span class="row-meta">(${(sub.elapsedMs / 1000).toFixed(1)}s)</span></span>
              <button class="game-btn secondary small" data-correct="${i}" aria-pressed="false">✔️ Correto</button>
            </div>
          `).join('')}
        </div>
        <button class="game-btn" id="calc-points">Atribuir pontos ➔</button>
      </div>
    `;

    const correctSet = new Set();
    container.querySelectorAll('[data-correct]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.correct);
        const on = !correctSet.has(idx);
        if (on) correctSet.add(idx);
        else correctSet.delete(idx);
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', String(on));
        btn.textContent = on ? '✅ Marcado' : '✔️ Correto';
      });
    });

    container.querySelector('#calc-points').addEventListener('click', () => {
      const pointsByRank = [30, 20, 15, 10];
      const correctSorted = [...correctSet].sort((a, b) => a - b); // idx já reflete a ordem por velocidade
      correctSorted.forEach((idx, rank) => {
        Leaderboard.addPoints(sorted[idx].player, pointsByRank[rank] || 10);
      });
      this.showFinalSummary(container, sorted, correctSet);
    });
  },

  showFinalSummary(container, sorted, correctSet) {
    container.innerHTML = `
      <div class="game-screen">
        <h2>🏆 Resultado da ronda</h2>
        <div class="option-list">
          ${sorted.map((sub, i) => `
            <div class="option-row">
              <span class="row-label">${correctSet.has(i) ? '✅' : '❌'} ${escapeHtml(sub.player)}: "${escapeHtml(sub.answer)}"</span>
              <span class="row-points ${correctSet.has(i) ? '' : 'is-muted'}">${(sub.elapsedMs / 1000).toFixed(1)}s</span>
            </div>
          `).join('')}
        </div>
        <p class="mini-note">Pontos já adicionados ao placar da noite.</p>
        <button class="game-btn" id="next-blitz">Próxima ronda ➔</button>
      </div>
    `;
    container.querySelector('#next-blitz').addEventListener('click', () => this.render(container));
  }
};
