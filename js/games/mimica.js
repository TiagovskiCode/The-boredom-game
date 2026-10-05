// ============================================================
// mimica.js — Mímica
// Um jogador vê a palavra em privado e representa-a sem falar
// nem fazer sons; o resto do grupo tenta adivinhar contra o
// tempo. Cada acerto soma pontos ao Placar global do jogador
// que está a representar.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules.mimica = {
  timeLimit: 60,
  timerId: null,

  words: [
    'Elefante', 'Cozinhar um bolo', 'Professor(a)', 'Nadar', 'Avião',
    'Jogar futebol', 'Bombeiro', 'Guarda-chuva', 'Dançar ballet',
    'Cão a abanar a cauda', 'Tirar uma selfie', 'Motorista de táxi',
    'Escalar uma montanha', 'Robô', 'Fazer surf', 'Cortar o cabelo',
    'Astronauta', 'Pescar', 'Espantalho', 'Jogar xadrez',
    'Padeiro(a)', 'Andar de bicicleta', 'Vampiro', 'Fazer malabarismo',
    'Enfermeiro(a)', 'Tocar guitarra', 'Fantasma', 'Lavar a loiça',
    'DJ numa festa', 'Cavaleiro medieval', 'Fazer ioga',
    'Polícia de trânsito', 'Comer esparguete', 'Super-herói a voar',
    'Fazer canoagem', 'Sereia', 'Apanhar um táxi', 'Pintor(a)',
    'Jogar basquetebol', 'Boxe'
  ],

  render(container) {
    if (Players.count() < 2) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>🎭 Mímica</h2>
          <p style="margin-top:1rem;">Precisas de pelo menos <strong>2 jogadores</strong> adicionados no topo da página para jogar.</p>
        </div>
      `;
      return;
    }

    if (!this.bag) this.bag = createShuffleBag(this.words);

    const player = Players.getRandom();
    this.session = { player, correct: 0, timeLeft: this.timeLimit, word: null };
    this.renderIntro(container);
  },

  renderIntro(container) {
    const { player } = this.session;
    container.innerHTML = `
      <div class="game-screen">
        <h2>🎭 Mímica</h2>
        <p style="margin-top:1rem;">Passa o telemóvel a <strong class="highlight">${player}</strong>.</p>
        <p class="mini-note">Só ${player} deve ver a palavra. Os outros vão tentar adivinhar por mímica, sem falar nem fazer sons.</p>
        <button class="game-btn" id="show-word">Sou ${player}, mostrar a minha palavra</button>
      </div>
    `;
    container.querySelector('#show-word').addEventListener('click', () => this.showWord(container));
  },

  showWord(container) {
    this.session.word = this.bag.next();
    container.innerHTML = `
      <div class="game-screen">
        <h2>🎭 A tua palavra</h2>
        <p class="chosen-player">${this.session.word}</p>
        <p class="mini-note">Quando o resto do grupo estiver pronto para adivinhar, começa o cronómetro.</p>
        <button class="game-btn" id="start-mimica">Começar (${this.timeLimit}s) ➔</button>
      </div>
    `;
    container.querySelector('#start-mimica').addEventListener('click', () => this.startRound(container));
  },

  startRound(container) {
    this.renderPlay(container);
    this.timerId = setInterval(() => {
      this.session.timeLeft--;
      const timerEl = container.querySelector('#timer');
      if (timerEl) {
        timerEl.textContent = `${this.session.timeLeft}s`;
        if (this.session.timeLeft <= 10) timerEl.style.color = '#ffa502';
      }
      if (this.session.timeLeft <= 0) {
        clearInterval(this.timerId);
        this.finish(container);
      }
    }, 1000);
  },

  renderPlay(container) {
    const { word, correct, timeLeft } = this.session;
    container.innerHTML = `
      <div class="game-screen">
        <h2>🎭 A representar: ${word}</h2>
        <div style="font-size:2.5rem; font-weight:bold; color:#ff4757;" id="timer">${timeLeft}s</div>
        <p class="mini-note" style="margin:0.5rem 0 1rem;">Acertos até agora: <strong style="color:#2ed573;">${correct}</strong></p>
        <div style="display:flex; gap:1rem; justify-content:center;">
          <button class="game-btn" id="got-it">✅ Acertaram!</button>
          <button class="game-btn secondary" id="skip-word">⏭️ Passar</button>
        </div>
      </div>
    `;
    const nextWord = () => {
      this.session.word = this.bag.next();
      this.renderPlay(container);
    };
    container.querySelector('#got-it').addEventListener('click', () => { this.session.correct++; nextWord(); });
    container.querySelector('#skip-word').addEventListener('click', nextWord);
  },

  finish(container) {
    const { player, correct } = this.session;
    const points = correct * 15;
    if (points > 0) Leaderboard.addPoints(player, points);

    container.innerHTML = `
      <div class="game-screen">
        <h2>⏰ Tempo esgotado!</h2>
        <p style="margin:1rem 0; font-size:1.2rem;"><strong class="highlight">${player}</strong> acertou <strong style="color:#2ed573;">${correct}</strong> palavra${correct === 1 ? '' : 's'}!</p>
        ${points > 0 ? `<p class="mini-note">+${points} pts adicionados ao Placar global.</p>` : ''}
        <button class="game-btn" id="next-mimica">Próxima Ronda ➔</button>
      </div>
    `;
    container.querySelector('#next-mimica').addEventListener('click', () => this.render(container));
  }
};
