// ============================================================
// reacao.js — Teste de Reação
// Cada jogador, à vez, recebe uma cor-alvo. O ecrã vai piscando
// várias cores (algumas a tentar enganar) até a cor-alvo
// aparecer — só aí é que deves tocar. Tocar na cor errada ou
// não tocar a tempo faz-te perder a ronda. No fim, o mais
// rápido a acertar ganha mais pontos no placar.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules.reacao = {
  colors: [
    { name: 'vermelho', hex: '#FF4D5E' },
    { name: 'verde', hex: '#3DDC84' },
    { name: 'azul', hex: '#3D6BFF' },
    { name: 'laranja', hex: '#FF8A3D' },
    { name: 'amarelo', hex: '#FFE03D' },
    { name: 'rosa', hex: '#FF7AD9' },
    { name: 'roxo', hex: '#9B6BFF' }
  ],
  idleColor: '#1A1F24',

  results: [],
  flashTimeoutId: null,
  nextTurnId: null,

  cleanup() {
    clearTimeout(this.flashTimeoutId);
    clearTimeout(this.nextTurnId);
  },

  render(container) {
    this.cleanup();
    this.results = [];
    this.playerQueue = Players.count() > 0 ? Players.getAll() : ['Jogador 1'];
    this.currentIndex = 0;
    this.renderTurn(container);
  },

  renderTurn(container) {
    clearTimeout(this.flashTimeoutId);

    const player = this.playerQueue[this.currentIndex];
    const target = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.target = target;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">💥 Teste de Reação · ${this.currentIndex + 1}/${this.playerQueue.length}</span>
        <h2>Vez de <span class="highlight">${escapeHtml(player)}</span></h2>
        <p class="game-lead">
          Toca quando aparecer <strong style="color:${target.hex}">${target.name.toUpperCase()}</strong>. Cuidado com as cores falsas 😏
        </p>
        <div id="reaction-zone" class="reaction-zone" role="button" tabindex="0">Toca para começar</div>
      </div>
    `;

    const zone = container.querySelector('#reaction-zone');

    let started = false;
    let resolved = false;
    let awaiting = false;   // true enquanto a zona mostra uma cor
    let currentColor = null;
    let flashStart = 0;
    let flashIndex = 0;
    const targetFlashIndex = 3 + Math.floor(Math.random() * 4); // aparece entre o 4º e o 7º flash

    const finish = (status, reactionMs) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(this.flashTimeoutId);
      this.results.push({ player, status, reactionMs });
      this.showTurnResult(container, status, reactionMs);
    };

    const doFlash = () => {
      const isTarget = flashIndex === targetFlashIndex;
      const decoyPool = this.colors.filter(c => c.name !== target.name);
      const color = isTarget ? target : decoyPool[Math.floor(Math.random() * decoyPool.length)];
      flashIndex++;

      currentColor = color;
      awaiting = true;
      flashStart = performance.now();

      zone.style.background = color.hex;
      zone.textContent = isTarget ? '' : color.name.toUpperCase();

      const flashDuration = 550 + Math.random() * 250;

      this.flashTimeoutId = setTimeout(() => {
        awaiting = false;
        if (isTarget) {
          finish('falhou', null); // passou a cor-alvo e não tocou
          return;
        }
        zone.style.background = this.idleColor;
        zone.textContent = '';
        this.flashTimeoutId = setTimeout(doFlash, 250 + Math.random() * 200);
      }, flashDuration);
    };

    const onHit = () => {
      if (!started) {
        started = true;
        zone.style.background = this.idleColor;
        zone.textContent = 'Prepara-te...';
        this.flashTimeoutId = setTimeout(doFlash, 900);
        return;
      }

      if (resolved) return;

      if (awaiting && currentColor && currentColor.name === target.name) {
        const reactionMs = Math.round(performance.now() - flashStart);
        finish('acertou', reactionMs);
      } else {
        finish('errado', null); // tocou numa cor falsa ou fora de tempo
      }
    };

    // pointerdown reage mais depressa do que click (sobretudo no telemóvel)
    zone.addEventListener('pointerdown', onHit);
    zone.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onHit();
      }
    });
  },

  showTurnResult(container, status, reactionMs) {
    const zone = container.querySelector('#reaction-zone');
    if (zone) {
      zone.style.background = status === 'acertou' ? '#3DDC84' : '#FF4D5E';
      zone.textContent = status === 'acertou'
        ? `${reactionMs} ms`
        : (status === 'errado' ? 'Cor errada!' : 'Não tocaste a tempo!');
    }
    this.nextTurnId = setTimeout(() => this.nextTurn(container), 1200);
  },

  nextTurn(container) {
    this.currentIndex++;
    if (this.currentIndex < this.playerQueue.length) {
      this.renderTurn(container);
    } else {
      this.renderLeaderboard(container);
    }
  },

  renderLeaderboard(container) {
    const success = this.results.filter(r => r.status === 'acertou').sort((a, b) => a.reactionMs - b.reactionMs);
    const failed = this.results.filter(r => r.status !== 'acertou');

    const pointsByRank = [50, 35, 20];
    success.forEach((r, i) => Leaderboard.addPoints(r.player, pointsByRank[i] || 10));

    const rows = [
      ...success.map((r, i) => ({
        ...r,
        rankIcon: i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`
      })),
      ...failed
    ];

    container.innerHTML = `
      <div class="game-screen">
        <h2>🏆 Resultados</h2>
        <div class="option-list">
          ${rows.map(r => `
            <div class="option-row">
              <span class="row-label">${r.rankIcon || '❌'} ${escapeHtml(r.player)}</span>
              <span class="row-points ${r.status === 'acertou' ? '' : 'is-muted'}">
                ${r.status === 'acertou' ? `${r.reactionMs} ms` : (r.status === 'errado' ? 'Cor errada' : 'Sem toque')}
              </span>
            </div>
          `).join('')}
        </div>
        <p class="mini-note">Pontos já adicionados ao placar da noite.</p>
        <button class="game-btn" id="restart-reaction">Jogar outra vez ➔</button>
      </div>
    `;

    container.querySelector('#restart-reaction').addEventListener('click', () => this.render(container));
  }
};
