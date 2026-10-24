// ============================================================
// forca.js — Forca
// Uma palavra secreta (escrita por um jogador ou ao acaso).
// O grupo escolhe letras; 6 erros e a forca fica completa.
// Se o grupo falhar, quem escreveu a palavra ganha 15 pts.
// ============================================================

(function () {
  const MAX_ERRORS = 6;
  const POINTS = 15;
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const WORDS = [
    'CHOCOLATE', 'ELEFANTE', 'GUITARRA', 'BICICLETA', 'TELEMOVEL', 'ABACAXI', 'AVENTURA',
    'MONTANHA', 'PIRATA', 'DINOSSAURO', 'FUTEBOL', 'ASTRONAUTA', 'BORBOLETA', 'CASTELO',
    'PINGUIM', 'VULCAO', 'FANTASMA', 'COMPUTADOR', 'MORANGO', 'AEROPORTO', 'CARACOL', 'GIRASSOL'
  ];

  // "Avião" → "AVIAO": acentos não contam como letras diferentes
  const clean = text => text.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Z ]/g, '');

  function menu(container, ctx) {
    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🪢 Forca</span>
        <h2>De onde vem a palavra?</h2>
        <div class="answer-form">
          ${ctx.players.count() > 0 ? `<select class="game-select" data-k="author" aria-label="Quem escreve">${ctx.players.getAll().map(p => `<option value="${ctx.utils.escapeHtml(p)}">${ctx.utils.escapeHtml(p)}</option>`).join('')}</select>` : ''}
          <input type="password" class="game-input" data-k="word" placeholder="Escreve uma palavra secreta…" maxlength="20" autocomplete="off">
          <button class="game-btn secondary" data-k="custom">Usar esta</button>
        </div>
        <p class="mini-note">Escreve sem ninguém ver (fica escondida). Ou então:</p>
        <button class="game-btn" data-k="random">Palavra ao acaso 🎲</button>
      </div>
    `;
    const input = container.querySelector('[data-k="word"]');
    const useCustom = () => {
      const word = clean(input.value).trim();
      const author = container.querySelector('[data-k="author"]');
      if (word.length >= 3) play(container, ctx, word, author ? author.value : null);
      else input.focus();
    };
    container.querySelector('[data-k="custom"]').addEventListener('click', useCustom);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') useCustom(); });
    container.querySelector('[data-k="random"]').addEventListener('click', () => {
      play(container, ctx, WORDS[Math.floor(Math.random() * WORDS.length)], null);
    });
  }

  function play(container, ctx, word, author) {
    const guessed = new Set();
    let errors = 0;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🪢 Forca</span>
        <svg class="hangman" viewBox="0 0 120 120" aria-hidden="true">
          <path d="M10 112h60M30 112V10h50v14" class="hangman-base"/>
          <circle cx="80" cy="34" r="10" data-part="0"/>
          <path d="M80 44v30" data-part="1"/>
          <path d="M80 52l-14 12" data-part="2"/>
          <path d="M80 52l14 12" data-part="3"/>
          <path d="M80 74l-12 18" data-part="4"/>
          <path d="M80 74l12 18" data-part="5"/>
        </svg>
        <p class="hangman-word" data-k="word"></p>
        <p class="mini-note" data-k="lives"></p>
        <div class="letter-keys">
          ${LETTERS.map(l => `<button class="letter-key" data-letter="${l}">${l}</button>`).join('')}
        </div>
        <div data-k="end"></div>
      </div>
    `;

    const wordEl = container.querySelector('[data-k="word"]');
    const livesEl = container.querySelector('[data-k="lives"]');
    const parts = [...container.querySelectorAll('[data-part]')];

    const paint = () => {
      wordEl.textContent = [...word].map(ch => (ch === ' ' || guessed.has(ch) ? ch : '_')).join(' ');
      livesEl.textContent = `Erros: ${errors} de ${MAX_ERRORS}`;
      parts.forEach((p, i) => p.classList.toggle('is-shown', i < errors));
    };
    paint();

    container.querySelectorAll('[data-letter]').forEach(key => key.addEventListener('click', () => {
      const letter = key.dataset.letter;
      key.disabled = true;
      guessed.add(letter);
      if (word.includes(letter)) key.classList.add('is-good');
      else { key.classList.add('is-bad'); errors++; }
      paint();

      const won = [...word].every(ch => ch === ' ' || guessed.has(ch));
      if (won || errors >= MAX_ERRORS) end(container, ctx, word, author, won);
    }));
  }

  function end(container, ctx, word, author, won) {
    const { escapeHtml } = ctx.utils;
    container.querySelectorAll('[data-letter]').forEach(k => { k.disabled = true; });
    if (!won && author) ctx.scoring.award(author, POINTS);
    container.querySelector('[data-k="end"]').innerHTML = `
      <h2>${won ? '🎉 Descobriram!' : `💀 A palavra era ${word}`}</h2>
      ${!won && author ? `<p class="mini-note">+${POINTS} pts para ${escapeHtml(author)}, que escolheu a palavra.</p>` : ''}
      <button class="game-btn" data-k="again">Nova palavra ➔</button>
    `;
    container.querySelector('[data-k="again"]').addEventListener('click', () => menu(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.forca = { mount: menu, unmount() {} };
})();
