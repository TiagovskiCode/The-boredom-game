// ============================================================
// roleta.js — Roleta de Decisão
// O grupo escreve opções e uma roleta desenhada em <canvas>
// escolhe uma ao acaso, com animação de rotação.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules.roleta = {
  colors: ['#ff4757', '#2ed573', '#3742fa', '#ffa502', '#eccc68', '#ff6b81', '#7bed9f', '#70a1ff'],
  options: ['Pizza', 'Filme', 'Jogo de tabuleiro', 'Sair de casa'],
  spinning: false,
  currentRotation: 0,

  render(container) {
    container.innerHTML = `
      <div class="game-screen">
        <h2>🎯 Roleta de Decisão</h2>
        <p style="margin:0.5rem 0 1rem;">Escreve as opções e gira a roleta.</p>

        <div class="option-list" id="option-list"></div>
        <div class="option-row">
          <input type="text" id="new-option" placeholder="Nova opção...">
          <button class="game-btn secondary" id="add-option">Adicionar</button>
        </div>

        <div style="display:flex; justify-content:center; margin:1.5rem 0;">
          <div style="position:relative;">
            <canvas id="wheel-canvas" width="280" height="280"></canvas>
            <div style="position:absolute; top:-10px; left:50%; transform:translateX(-50%); font-size:1.8rem;">🔻</div>
          </div>
        </div>

        <div style="text-align:center;">
          <button class="game-btn" id="spin-btn">Girar Roleta ➔</button>
        </div>
        <p class="chosen-player" id="wheel-result"></p>
      </div>
    `;

    this.renderOptionList(container);
    this.drawWheel(container);

    container.querySelector('#add-option').addEventListener('click', () => {
      const input = container.querySelector('#new-option');
      const val = input.value.trim();
      if (val) {
        this.options.push(val);
        input.value = '';
        this.renderOptionList(container);
        this.drawWheel(container);
      }
    });

    container.querySelector('#new-option').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') container.querySelector('#add-option').click();
    });

    container.querySelector('#spin-btn').addEventListener('click', () => this.spin(container));
  },

  renderOptionList(container) {
    const listEl = container.querySelector('#option-list');
    listEl.innerHTML = this.options.map((opt, i) => `
      <div class="option-row">
        <span style="flex:1; padding:0.5rem; background:#0F1017; border-radius:6px;">${opt}</span>
        <button class="game-btn secondary" data-remove="${i}" style="margin-top:0; padding:0.5rem 0.8rem;">✕</button>
      </div>
    `).join('');

    listEl.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.options.splice(Number(btn.dataset.remove), 1);
        this.renderOptionList(container);
        this.drawWheel(container);
      });
    });
  },

  drawWheel(container) {
    const canvas = container.querySelector('#wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 5;
    const n = Math.max(this.options.length, 1);
    const arc = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.currentRotation);
    ctx.translate(-cx, -cy);

    this.options.forEach((opt, i) => {
      const start = i * arc;
      const end = start + arc;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = this.colors[i % this.colors.length];
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#12131C';
      ctx.font = 'bold 12px Segoe UI';
      ctx.fillText(opt.slice(0, 14), radius - 10, 4);
      ctx.restore();
    });

    ctx.restore();
  },

  spin(container) {
    if (this.spinning || this.options.length < 2) {
      if (this.options.length < 2) {
        container.querySelector('#wheel-result').textContent = 'Adiciona pelo menos 2 opções!';
      }
      return;
    }

    this.spinning = true;
    const spinBtn = container.querySelector('#spin-btn');
    spinBtn.disabled = true;

    const n = this.options.length;
    const arc = (2 * Math.PI) / n;
    const winnerIndex = Math.floor(Math.random() * n);

    // Gira várias voltas completas e para com o índice vencedor no topo (seta fixa)
    const extraTurns = 5 * 2 * Math.PI;
    const targetAngle = extraTurns + (2 * Math.PI - (winnerIndex * arc + arc / 2)) + Math.PI / 2;

    const duration = 3200;
    const start = performance.now();
    const startRotation = this.currentRotation % (2 * Math.PI);

    const animate = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cúbico

      this.currentRotation = startRotation + eased * targetAngle;
      this.drawWheel(container);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.spinning = false;
        spinBtn.disabled = false;
        container.querySelector('#wheel-result').textContent = `🏆 ${this.options[winnerIndex]}`;
      }
    };

    requestAnimationFrame(animate);
  }
};
