// ============================================================
// roleta.js — Roleta de Decisão
// O grupo escreve opções e uma roleta desenhada em <canvas>
// escolhe uma ao acaso, com animação de rotação.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules.roleta = {
  colors: ['#A6FF3D', '#FF3D7F', '#3DA5FF', '#FFB020', '#9B6BFF', '#3DE0D0', '#FF7AD9', '#FF8A3D'],
  options: ['Pizza', 'Filme', 'Jogo de tabuleiro', 'Sair de casa'],
  spinning: false,
  currentRotation: 0,
  rafId: null,

  cleanup() {
    cancelAnimationFrame(this.rafId);
    this.spinning = false;
  },

  render(container) {
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🎯 Roleta de Decisão</span>
        <h2>Deixa a sorte decidir</h2>
        <p class="mini-note">Escreve as opções e gira a roleta.</p>

        <div class="option-list" id="option-list"></div>
        <div class="answer-form">
          <input type="text" id="new-option" class="game-input" placeholder="Nova opção..." maxlength="40" autocomplete="off">
          <button class="game-btn secondary" id="add-option">Adicionar</button>
        </div>

        <div class="wheel-wrap">
          <canvas id="wheel-canvas" width="560" height="560"></canvas>
          <div class="wheel-pointer" aria-hidden="true"></div>
        </div>

        <button class="game-btn" id="spin-btn">Girar roleta ➔</button>
        <p class="chosen-player" id="wheel-result" role="status"></p>
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

    container.querySelector('#new-option').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.isComposing) container.querySelector('#add-option').click();
    });

    container.querySelector('#spin-btn').addEventListener('click', () => this.spin(container));
  },

  renderOptionList(container) {
    const listEl = container.querySelector('#option-list');
    listEl.innerHTML = this.options.map((opt, i) => `
      <div class="option-row">
        <span class="row-label">${escapeHtml(opt)}</span>
        <button class="game-btn secondary small" data-remove="${i}" aria-label="Remover ${escapeHtml(opt)}">✕</button>
      </div>
    `).join('');

    listEl.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.spinning) return;
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
    const radius = cx - 6;
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
      ctx.strokeStyle = '#07090A';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0A1200';
      ctx.font = '700 26px "Barlow Condensed", sans-serif';
      ctx.fillText(opt.slice(0, 16), radius - 20, 9);
      ctx.restore();
    });

    // Centro
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#07090A';
    ctx.fill();

    ctx.restore();
  },

  spin(container) {
    const resultEl = container.querySelector('#wheel-result');
    if (this.spinning) return;
    if (this.options.length < 2) {
      resultEl.textContent = 'Adiciona pelo menos 2 opções!';
      return;
    }

    this.spinning = true;
    resultEl.textContent = '';
    const spinBtn = container.querySelector('#spin-btn');
    spinBtn.disabled = true;

    const n = this.options.length;
    const arc = (2 * Math.PI) / n;
    const winnerIndex = Math.floor(Math.random() * n);

    // Gira várias voltas completas e para com o vencedor por baixo da seta (topo = -90°)
    const startRotation = this.currentRotation % (2 * Math.PI);
    const landing = -Math.PI / 2 - (winnerIndex * arc + arc / 2);
    const delta = 5 * 2 * Math.PI + ((landing - startRotation) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

    const duration = 3600;
    const start = performance.now();

    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4); // ease-out

      this.currentRotation = startRotation + eased * delta;
      this.drawWheel(container);

      if (t < 1) {
        this.rafId = requestAnimationFrame(animate);
      } else {
        this.spinning = false;
        spinBtn.disabled = false;
        resultEl.textContent = `🏆 ${this.options[winnerIndex]}`;
      }
    };

    this.rafId = requestAnimationFrame(animate);
  }
};
