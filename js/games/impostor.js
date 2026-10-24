// ============================================================
// impostor.js — O Impostor
// Todos recebem a mesma palavra secreta, exceto um jogador (o
// impostor). Passa o telemóvel de mão em mão para cada um ver
// a sua carta em privado. Palavras sorteadas sem repetir até
// esgotar o banco.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules.impostor = {
  words: [
    'Praia', 'Aeroporto', 'Casamento', 'Hospital', 'Escola',
    'Restaurante', 'Concerto', 'Supermercado', 'Piscina', 'Cinema',
    'Acampamento', 'Estádio de futebol', 'Biblioteca', 'Mercado noturno',
    'Casino', 'Igreja', 'Feira', 'Estação de comboio', 'Museu',
    'Ginásio', 'Parque de diversões', 'Farmácia', 'Zoológico',
    'Praça central', 'Padaria', 'Aeroclube', 'Hotel', 'Porto de pesca',
    'Esquadra da polícia', 'Universidade', 'Templo budista',
    'Feira de artesanato', 'Sala de cinema em casa', 'Barbearia',
    'Salão de beleza'
  ],

  render(container) {
    if (Players.count() < 3) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>🕵️ O Impostor</h2>
          <p class="game-lead">Precisas de pelo menos <strong>3 jogadores</strong> adicionados na secção "Quem joga hoje?" para jogar.</p>
        </div>
      `;
      return;
    }

    if (!this.bag) this.bag = createShuffleBag(this.words);

    const players = Players.getAll();
    const word = this.bag.next();
    const impostorIndex = Math.floor(Math.random() * players.length);

    this.session = { players, word, impostorIndex, current: 0, phase: 'reveal' };
    this.renderReveal(container);
  },

  renderReveal(container) {
    const { players, current } = this.session;
    const name = escapeHtml(players[current]);

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">Carta ${current + 1} de ${players.length}</span>
        <h2>Passa o telemóvel a</h2>
        <p class="chosen-player">${name}</p>
        <p class="mini-note">Só ${name} deve ver o ecrã. Os outros, desviem o olhar!</p>
        <button class="game-btn" id="show-card">Sou ${name}, mostrar a minha carta</button>
      </div>
    `;

    container.querySelector('#show-card').addEventListener('click', () => this.showCard(container));
  },

  showCard(container) {
    const { players, word, impostorIndex, current } = this.session;
    const isImpostor = current === impostorIndex;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">A tua carta</span>
        ${isImpostor
          ? `<p class="big-word big-word--danger">Impostor 🎭</p>
             <p class="mini-note">Não sabes a palavra. Finge que sabes e tenta não ser apanhado.</p>`
          : `<p class="game-lead">A palavra secreta é:</p>
             <p class="big-word">${word}</p>
             <p class="mini-note">Descreve-a sem a dizeres diretamente e tenta descobrir quem é o impostor.</p>`
        }
        <button class="game-btn" id="next-player">Ok, escondi a carta ➔</button>
      </div>
    `;

    container.querySelector('#next-player').addEventListener('click', () => {
      this.session.current++;
      if (this.session.current < players.length) {
        this.renderReveal(container);
      } else {
        this.renderStart(container);
      }
    });
  },

  renderStart(container) {
    const starter = escapeHtml(Players.getRandom());
    container.innerHTML = `
      <div class="game-screen">
        <h2>🕵️ Toda a gente já viu a sua carta!</h2>
        <p class="game-lead">Agora discutam à vez, descrevendo a palavra sem a dizer. No fim, votem em quem acham que é o impostor.</p>
        <p class="mini-note">Começa a descrever:</p>
        <p class="chosen-player">${starter}</p>
        <div class="btn-row">
          <button class="game-btn secondary" id="reveal-impostor">Revelar o impostor</button>
          <button class="game-btn" id="new-round">Nova ronda ➔</button>
        </div>
        <p class="highlight" id="impostor-answer" role="status"></p>
      </div>
    `;
    container.querySelector('#reveal-impostor').addEventListener('click', e => {
      const { players, impostorIndex, word } = this.session;
      container.querySelector('#impostor-answer').textContent = `O impostor era ${players[impostorIndex]} · a palavra era "${word}"`;
      e.currentTarget.disabled = true;
    });
    container.querySelector('#new-round').addEventListener('click', () => this.render(container));
  }
};
