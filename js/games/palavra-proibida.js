// ============================================================
// palavra-proibida.js — Palavra Proibida
// Um jogador vê, em privado, uma palavra secreta e 4 palavras
// proibidas que não pode usar para a descrever. O resto do
// grupo tenta adivinhar contra o tempo. Acertos somam pontos,
// faltas (dizer uma palavra proibida) descontam.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules['palavra-proibida'] = {
  timeLimit: 45,
  timerId: null,

  cleanup() {
    clearInterval(this.timerId);
  },

  cards: [
    { word: 'Praia', forbidden: ['Areia', 'Mar', 'Sol', 'Água'] },
    { word: 'Futebol', forbidden: ['Bola', 'Golo', 'Campo', 'Jogador'] },
    { word: 'Natal', forbidden: ['Presente', 'Árvore', 'Pai Natal', 'Dezembro'] },
    { word: 'Telemóvel', forbidden: ['Ligar', 'Ecrã', 'Aplicação', 'Bateria'] },
    { word: 'Café', forbidden: ['Bebida', 'Quente', 'Chávena', 'Manhã'] },
    { word: 'Casamento', forbidden: ['Noiva', 'Noivo', 'Igreja', 'Anel'] },
    { word: 'Cinema', forbidden: ['Filme', 'Ecrã', 'Pipocas', 'Bilhete'] },
    { word: 'Escola', forbidden: ['Professor', 'Aluno', 'Aula', 'Livro'] },
    { word: 'Aniversário', forbidden: ['Bolo', 'Velas', 'Presente', 'Festa'] },
    { word: 'Chuva', forbidden: ['Guarda-chuva', 'Molhado', 'Nuvem', 'Água'] },
    { word: 'Carro', forbidden: ['Roda', 'Condução', 'Estrada', 'Motor'] },
    { word: 'Cão', forbidden: ['Ladrar', 'Osso', 'Coleira', 'Animal de estimação'] },
    { word: 'Netflix', forbidden: ['Série', 'Filme', 'Streaming', 'Ecrã'] },
    { word: 'Piscina', forbidden: ['Água', 'Nadar', 'Verão', 'Fato de banho'] },
    { word: 'Hospital', forbidden: ['Médico', 'Doente', 'Enfermeiro', 'Cama'] },
    { word: 'Avião', forbidden: ['Voar', 'Céu', 'Aeroporto', 'Piloto'] },
    { word: 'Restaurante', forbidden: ['Comida', 'Mesa', 'Ementa', 'Empregado'] },
    { word: 'Instagram', forbidden: ['Foto', 'Rede social', 'Seguidor', 'Story'] },
    { word: 'Verão', forbidden: ['Calor', 'Praia', 'Sol', 'Férias'] },
    { word: 'Bebé', forbidden: ['Chorar', 'Fralda', 'Pequeno', 'Leite'] },
    { word: 'Guitarra', forbidden: ['Corda', 'Música', 'Tocar', 'Instrumento'] },
    { word: 'Montanha', forbidden: ['Alto', 'Escalar', 'Pico', 'Neve'] },
    { word: 'Panela', forbidden: ['Cozinhar', 'Cozinha', 'Comida', 'Tampa'] },
    { word: 'Óculos', forbidden: ['Ver', 'Olhos', 'Lentes', 'Vista'] },
    { word: 'WhatsApp', forbidden: ['Mensagem', 'Chamada', 'Telemóvel', 'Grupo'] }
  ],

  render(container) {
    clearInterval(this.timerId);
    if (Players.count() < 3) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>🚫 Palavra Proibida</h2>
          <p class="game-lead">Precisas de pelo menos <strong>3 jogadores</strong> adicionados na secção "Quem joga hoje?" para jogar.</p>
        </div>
      `;
      return;
    }

    if (!this.bag) this.bag = createShuffleBag(this.cards);

    const player = Players.getRandom();
    this.session = { player, card: null, correct: 0, fouls: 0, timeLeft: this.timeLimit };
    this.renderIntro(container);
  },

  renderIntro(container) {
    const player = escapeHtml(this.session.player);
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🚫 Palavra Proibida</span>
        <h2>Passa o telemóvel a</h2>
        <p class="chosen-player">${player}</p>
        <p class="mini-note">Só ${player} deve ver as cartas. Os outros vão tentar adivinhar pelas pistas.</p>
        <button class="game-btn" id="show-card">Sou ${player}, estou pronto(a)</button>
      </div>
    `;
    container.querySelector('#show-card').addEventListener('click', () => this.showCard(container));
  },

  showCard(container) {
    this.session.card = this.bag.next();
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🚫 Palavra Proibida</span>
        <h2>Tens ${this.timeLimit} segundos</h2>
        <p class="game-lead">Descreve o máximo de palavras que conseguires sem dizer as proibidas. Se disseres uma, carrega em "Disse proibida".</p>
        <button class="game-btn" id="start-pp">Começar (${this.timeLimit}s) ➔</button>
      </div>
    `;
    container.querySelector('#start-pp').addEventListener('click', () => this.startRound(container));
  },

  startRound(container) {
    this.renderPlay(container);
    this.timerId = setInterval(() => {
      this.session.timeLeft--;
      const timerEl = container.querySelector('#timer');
      if (timerEl) {
        timerEl.textContent = `${this.session.timeLeft}s`;
        timerEl.classList.toggle('is-warning', this.session.timeLeft <= 10);
      }
      if (this.session.timeLeft <= 0) {
        clearInterval(this.timerId);
        this.finish(container);
      }
    }, 1000);
  },

  renderPlay(container) {
    const { card, correct, fouls, timeLeft } = this.session;
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">Descreve</span>
        <p class="big-word">${card.word}</p>
        <div class="word-chips" aria-label="Palavras proibidas">${card.forbidden.map(w => `<span>${w}</span>`).join('')}</div>
        <div class="game-timer ${timeLeft <= 10 ? 'is-warning' : ''}" id="timer">${timeLeft}s</div>
        <p class="stat-line"><span class="chip">✅ ${correct} acertos</span><span class="chip">🚫 ${fouls} falta${fouls === 1 ? '' : 's'}</span></p>
        <div class="btn-row">
          <button class="game-btn" id="got-it">✅ Acertaram!</button>
          <button class="game-btn secondary" id="skip-card">⏭️ Passar</button>
          <button class="game-btn danger" id="foul-card">🚫 Disse proibida</button>
        </div>
      </div>
    `;
    const nextCard = () => {
      this.session.card = this.bag.next();
      this.renderPlay(container);
    };
    container.querySelector('#got-it').addEventListener('click', () => { this.session.correct++; nextCard(); });
    container.querySelector('#skip-card').addEventListener('click', nextCard);
    container.querySelector('#foul-card').addEventListener('click', () => { this.session.fouls++; nextCard(); });
  },

  finish(container) {
    const { player, correct, fouls } = this.session;
    const points = Math.max(correct * 15 - fouls * 5, 0);
    if (points > 0) Leaderboard.addPoints(player, points);

    container.innerHTML = `
      <div class="game-screen">
        <h2>⏰ Tempo esgotado!</h2>
        <p class="game-lead"><strong class="highlight">${escapeHtml(player)}</strong> fez adivinhar <strong class="text-success">${correct}</strong> e teve <strong class="text-danger">${fouls}</strong> falta${fouls === 1 ? '' : 's'}.</p>
        ${points > 0 ? `<p class="mini-note">+${points} pts adicionados ao placar da noite.</p>` : '<p class="mini-note">Sem pontos nesta ronda.</p>'}
        <button class="game-btn" id="next-pp">Próxima ronda ➔</button>
      </div>
    `;
    container.querySelector('#next-pp').addEventListener('click', () => this.render(container));
  }
};
