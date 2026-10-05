// ============================================================
// categorias.js — Categorias
// Sorteia uma letra + 4 categorias (sem repetir até esgotar o
// banco). Todos escrevem, em simultâneo, uma palavra por
// categoria que comece pela letra sorteada, contra o relógio.
// No fim o grupo compara respostas em voz alta e marca quem
// teve mais respostas válidas e únicas na ronda.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules.categorias = {
  timeLimit: 45,
  timerId: null,

  cleanup() {
    clearInterval(this.timerId);
  },

  letters: [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'
  ],

  categoryList: [
    'Nome próprio', 'Animal', 'País', 'Comida', 'Filme ou série',
    'Objeto lá de casa', 'Profissão', 'Cor', 'Marca', 'Desporto',
    'Cidade', 'Fruta', 'Instrumento musical', 'Pessoa famosa', 'Bebida',
    'Peça de roupa', 'Emoção', 'Verbo (uma ação)', 'App do telemóvel',
    'Animal de estimação', 'Ferramenta', 'Doce', 'Rio ou lago',
    'Jogo', 'Programa de TV', 'Insulto simpático', 'Coisa que se leva à praia',
    'Planeta ou coisa do espaço', 'Superstição', 'Parte do corpo'
  ],

  render(container) {
    if (Players.count() < 2) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>📝 Categorias</h2>
          <p style="margin-top:1rem;">Precisas de pelo menos <strong>2 jogadores</strong> adicionados no topo da página para jogar.</p>
        </div>
      `;
      return;
    }

    if (!this.letterBag) this.letterBag = createShuffleBag(this.letters);
    if (!this.categoryBag) this.categoryBag = createShuffleBag(this.categoryList);

    const letter = this.letterBag.next();
    const categories = [
      this.categoryBag.next(),
      this.categoryBag.next(),
      this.categoryBag.next(),
      this.categoryBag.next()
    ];
    this.session = { letter, categories };

    container.innerHTML = `
      <div class="game-screen">
        <h2>📝 Categorias</h2>
        <p class="mini-note">Todos escrevem em simultâneo (papel, notas ou em voz alta) uma palavra por categoria que comece pela letra sorteada.</p>
        <p style="font-size:2.2rem; font-weight:bold; color:#2ed573; margin:1rem 0;">Letra: ${letter}</p>
        <div class="option-list">
          ${categories.map(c => `
            <div class="option-row">
              <span style="flex:1; padding:0.5rem; background:#0F1017; border-radius:6px;">${c}</span>
            </div>
          `).join('')}
        </div>
        <div style="font-size:2.5rem; font-weight:bold; color:#ff4757; margin-top:1rem;" id="timer">${this.timeLimit}s</div>
        <button class="game-btn" id="start-categorias">Começar ➔</button>
      </div>
    `;

    container.querySelector('#start-categorias').addEventListener('click', () => this.startTimer(container));
  },

  startTimer(container) {
    clearInterval(this.timerId);
    let timeLeft = this.timeLimit;
    const timerEl = container.querySelector('#timer');
    const startBtn = container.querySelector('#start-categorias');
    startBtn.disabled = true;
    startBtn.textContent = 'A escrever...';

    this.timerId = setInterval(() => {
      timeLeft--;
      timerEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 10) timerEl.style.color = '#ffa502';
      if (timeLeft <= 0) {
        clearInterval(this.timerId);
        this.finish(container);
      }
    }, 1000);
  },

  finish(container) {
    const players = Players.getAll();
    const { letter } = this.session;

    container.innerHTML = `
      <div class="game-screen">
        <h2>⏰ Tempo esgotado!</h2>
        <p style="margin:0.5rem 0 1rem;">Comparem as respostas para <strong style="color:#2ed573;">${letter}</strong> em voz alta. Respostas repetidas entre dois jogadores não pontuam para nenhum dos dois.</p>
        <p class="mini-note">Quem teve mais respostas válidas e únicas nesta ronda?</p>
        <div class="option-list" style="margin-top:1rem;">
          ${players.length === 0
            ? '<p class="mini-note">Adiciona jogadores no topo da página para atribuir pontos.</p>'
            : players.map(p => `
              <div class="option-row">
                <span style="flex:1; padding:0.5rem; background:#0F1017; border-radius:6px;">${escapeHtml(p)}</span>
                <button class="game-btn secondary" data-award="${escapeHtml(p)}" style="margin-top:0;">+30 pts</button>
              </div>
            `).join('')}
        </div>
        <button class="game-btn" id="next-round" style="margin-top:1rem;">Próxima Ronda ➔</button>
      </div>
    `;

    container.querySelectorAll('[data-award]').forEach(btn => {
      btn.addEventListener('click', () => {
        Leaderboard.addPoints(btn.dataset.award, 30);
        btn.disabled = true;
        btn.textContent = '✅ Pontuado';
      });
    });

    container.querySelector('#next-round').addEventListener('click', () => this.render(container));
  }
};
