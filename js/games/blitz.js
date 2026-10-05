// ============================================================
// blitz.js — Blitz Rápido
// Desafio de listar coisas contra o relógio. Agora é uma corrida:
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
        <h2>⚡ Blitz Rápido</h2>
        <p style="font-size:1.15rem; margin:1rem 0;">${challenge}</p>
        <p class="mini-note">Todos podem responder! Quem escrever a resposta certa mais rápido ganha mais pontos.</p>
        <div style="font-size:2.5rem; font-weight:bold; color:#ff4757;" id="timer">${this.timeLimit}s</div>
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
        <h2>⚡ Blitz Rápido</h2>
        <p style="font-size:1.1rem; margin:0.5rem 0 1rem;">${s.challenge}</p>
        <div style="font-size:2.5rem; font-weight:bold; color:#ff4757;" id="timer">${s.timeLeft}s</div>

        <div class="option-row" style="margin-top:1rem; flex-wrap:wrap;">
          <select id="answer-player" style="padding:0.5rem; border-radius:6px; border:1px solid #3A3D5B; background:#0F1017; color:#fff;">
            ${playerOptions}
          </select>
          <input type="text" id="answer-input" placeholder="Escreve a resposta e Enter...">
          <button class="game-btn secondary" id="submit-answer" style="margin-top:0;">Enviar</button>
        </div>

        <div class="option-list" id="submissions-list" style="margin-top:1rem;"></div>

        <button class="game-btn secondary" id="finish-early" style="margin-top:1rem;">Terminar Ronda ➔</button>
      </div>
    `;

    const timerEl = container.querySelector('#timer');
    const input = container.querySelector('#answer-input');
    const select = container.querySelector('#answer-player');

    const submit = () => this.submitAnswer(container, select.value, input.value);

    container.querySelector('#submit-answer').addEventListener('click', submit);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submit();
    });
    container.querySelector('#finish-early').addEventListener('click', () => this.finishRound(container));

    input.focus();

    this.timerId = setInterval(() => {
      s.timeLeft--;
      timerEl.textContent = `${s.timeLeft}s`;
      if (s.timeLeft <= 5) timerEl.style.color = '#ffa502';
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
        <span style="flex:1; padding:0.5rem; background:#0F1017; border-radius:6px;">
          ${i + 1}º ${escapeHtml(sub.player)}: "${escapeHtml(sub.answer)}"
        </span>
        <span style="padding:0.5rem; color:#2ed573;">${(sub.elapsedMs / 1000).toFixed(1)}s</span>
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
          <p style="margin:1rem 0;">Ninguém respondeu a tempo...</p>
          <button class="game-btn" id="next-blitz">Próxima Ronda ➔</button>
        </div>
      `;
      container.querySelector('#next-blitz').addEventListener('click', () => this.render(container));
      return;
    }

    container.innerHTML = `
      <div class="game-screen">
        <h2>⏰ Tempo esgotado!</h2>
        <p class="mini-note" style="margin-bottom:1rem;">Marca quem respondeu corretamente (o grupo decide).</p>
        <div class="option-list" id="review-list">
          ${sorted.map((sub, i) => `
            <div class="option-row">
              <span style="flex:1; padding:0.5rem; background:#0F1017; border-radius:6px;">
                ${i + 1}º ${escapeHtml(sub.player)}: "${escapeHtml(sub.answer)}" <span style="color:#6B6F94;">(${(sub.elapsedMs / 1000).toFixed(1)}s)</span>
              </span>
              <button class="game-btn secondary" data-correct="${i}" style="margin-top:0;">✔️ Correto</button>
            </div>
          `).join('')}
        </div>
        <button class="game-btn" id="calc-points" style="margin-top:1rem;">Atribuir Pontos ➔</button>
      </div>
    `;

    const correctSet = new Set();
    container.querySelectorAll('[data-correct]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.correct);
        if (correctSet.has(idx)) {
          correctSet.delete(idx);
          btn.textContent = '✔️ Correto';
          btn.style.background = '';
        } else {
          correctSet.add(idx);
          btn.textContent = '✅ Marcado';
          btn.style.background = '#2ed573';
        }
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
        <h2>🏆 Resultado da Ronda</h2>
        <div class="option-list" style="margin-top:1rem;">
          ${sorted.map((sub, i) => `
            <div class="option-row">
              <span style="flex:1; padding:0.5rem; background:#0F1017; border-radius:6px;">
                ${correctSet.has(i) ? '✅' : '❌'} ${escapeHtml(sub.player)}: "${escapeHtml(sub.answer)}"
              </span>
              <span style="padding:0.5rem; color:${correctSet.has(i) ? '#2ed573' : '#6B6F94'};">${(sub.elapsedMs / 1000).toFixed(1)}s</span>
            </div>
          `).join('')}
        </div>
        <p class="mini-note">Pontos já adicionados ao Placar global.</p>
        <button class="game-btn" id="next-blitz" style="margin-top:1rem;">Próxima Ronda ➔</button>
      </div>
    `;
    container.querySelector('#next-blitz').addEventListener('click', () => this.render(container));
  }
};
