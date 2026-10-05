// ============================================================
// reacao.js — Teste de Reação
// Cada jogador, à vez, recebe uma cor-alvo. O ecrã vai piscando
// várias cores (algumas a tentar enganar) até a cor-alvo
// aparecer — só aí é que deves clicar. Clicar na cor errada ou
// não clicar a tempo faz-te perder a ronda. No fim, o mais
// rápido a acertar ganha mais pontos no Placar global.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules.reacao = {
  colors: [
    { name: 'vermelho', hex: '#ff4757' },
    { name: 'verde', hex: '#2ed573' },
    { name: 'azul', hex: '#3742fa' },
    { name: 'laranja', hex: '#ffa502' },
    { name: 'amarelo', hex: '#eccc68' },
    { name: 'rosa', hex: '#ff6b81' },
    { name: 'roxo', hex: '#a55eea' }
  ],

  results: [],
  flashTimeoutId: null,

  render(container) {
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
        <h2>💥 Teste de Reação</h2>
        <p style="margin-top:1rem;">Vez de: <strong class="highlight">${player}</strong></p>
        <p style="margin:0.5rem 0 1rem; font-size:1.1rem;">
          Clica quando aparecer <strong style="color:${target.hex};">${target.name.toUpperCase()}</strong>. Cuidado com as cores falsas 😏
        </p>
        <div id="reaction-zone" style="
          margin-top:0.5rem; height:200px; border-radius:12px;
          background:#2B2D42; display:flex; align-items:center; justify-content:center;
          font-size:1.3rem; font-weight:bold; cursor:pointer; user-select:none; color:#fff;
          transition:background 0.05s;">
          Clica para começar
        </div>
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
          finish('falhou', null); // passou a cor-alvo e não clicou
          return;
        }
        zone.style.background = '#2B2D42';
        zone.textContent = '';
        this.flashTimeoutId = setTimeout(doFlash, 250 + Math.random() * 200);
      }, flashDuration);
    };

    zone.addEventListener('click', () => {
      if (!started) {
        started = true;
        zone.style.background = '#2B2D42';
        zone.textContent = 'Prepara-te...';
        this.flashTimeoutId = setTimeout(doFlash, 900);
        return;
      }

      if (resolved) return;

      if (awaiting && currentColor && currentColor.name === target.name) {
        const reactionMs = Math.round(performance.now() - flashStart);
        finish('acertou', reactionMs);
      } else {
        finish('errado', null); // clicou numa cor falsa ou fora de tempo
      }
    });
  },

  showTurnResult(container, status, reactionMs) {
    const zone = container.querySelector('#reaction-zone');
    if (zone) {
      zone.style.background = status === 'acertou' ? '#2ed573' : '#ff4757';
      zone.textContent = status === 'acertou'
        ? `${reactionMs} ms`
        : (status === 'errado' ? 'Cor errada!' : 'Não clicaste a tempo!');
    }
    setTimeout(() => this.nextTurn(container), 1200);
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
        <div class="option-list" style="margin-top:1rem;">
          ${rows.map(r => `
            <div class="option-row">
              <span style="flex:1; padding:0.5rem; background:#0F1017; border-radius:6px;">
                ${r.rankIcon || '❌'} ${r.player}
              </span>
              <span style="padding:0.5rem;">
                ${r.status === 'acertou' ? `${r.reactionMs} ms` : (r.status === 'errado' ? 'Cor errada' : 'Sem clique')}
              </span>
            </div>
          `).join('')}
        </div>
        <p class="mini-note">Pontos já adicionados ao Placar global.</p>
        <button class="game-btn" id="restart-reaction">Jogar Outra Vez ➔</button>
      </div>
    `;

    container.querySelector('#restart-reaction').addEventListener('click', () => this.render(container));
  }
};
