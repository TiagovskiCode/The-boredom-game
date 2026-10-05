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
    'Delegacia de polícia', 'Universidade', 'Templo budista',
    'Feira de artesanato', 'Sala de cinema em casa', 'Barbearia',
    'Salão de beleza'
  ],

  render(container) {
    if (Players.count() < 3) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>🕵️ O Impostor</h2>
          <p style="margin-top:1rem;">Precisas de pelo menos <strong>3 jogadores</strong> adicionados no topo da página para jogar.</p>
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
    const name = players[current];

    container.innerHTML = `
      <div class="game-screen">
        <h2>🕵️ O Impostor</h2>
        <p style="margin-top:1rem;">Passa o telemóvel a <strong class="highlight">${name}</strong>.</p>
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
        <h2>🕵️ A tua carta</h2>
        ${isImpostor
          ? `<p style="margin:1.5rem 0; font-size:1.3rem;">Tu és o <strong class="highlight">IMPOSTOR</strong> 🎭</p>
             <p class="mini-note">Não sabes a palavra. Finge que sabes e tenta não ser apanhado.</p>`
          : `<p style="margin:1.5rem 0; font-size:1.3rem;">A palavra secreta é:</p>
             <p class="chosen-player">${word}</p>
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
    container.innerHTML = `
      <div class="game-screen">
        <h2>🕵️ Toda a gente já viu a sua carta!</h2>
        <p style="margin:1rem 0;">Agora discutam à vez, descrevendo a palavra sem a dizer. No fim, votem em quem acham que é o impostor.</p>
        <button class="game-btn" id="new-round">Nova Ronda ➔</button>
      </div>
    `;
    container.querySelector('#new-round').addEventListener('click', () => this.render(container));
  }
};
