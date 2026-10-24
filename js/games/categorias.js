(function () {
  const TIME_LIMIT = 45;
  const WARNING_AT = 10;
  const POINTS = 30;
  const CATEGORIES_PER_ROUND = 4;

  const LETTERS = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'
  ];

  const CATEGORIES = [
    'Nome próprio', 'Animal', 'País', 'Comida', 'Filme ou série',
    'Objeto lá de casa', 'Profissão', 'Cor', 'Marca', 'Desporto',
    'Cidade', 'Fruta', 'Instrumento musical', 'Pessoa famosa', 'Bebida',
    'Peça de roupa', 'Emoção', 'Verbo (uma ação)', 'App do telemóvel',
    'Animal de estimação', 'Ferramenta', 'Doce', 'Rio ou lago',
    'Jogo', 'Programa de TV', 'Insulto simpático', 'Coisa que se leva à praia',
    'Planeta ou coisa do espaço', 'Superstição', 'Parte do corpo'
  ];

  let timerId = null;
  let letterBag = null;
  let categoryBag = null;
  let round = null;

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function drawCategories() {
    const picked = [];
    while (picked.length < CATEGORIES_PER_ROUND) {
      const next = categoryBag.next();
      if (!picked.includes(next)) picked.push(next);
    }
    return picked;
  }

  function showRound(container, ctx) {
    const { escapeHtml, createShuffleBag } = ctx.utils;

    if (ctx.players.count() < 2) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>📝 Categorias</h2>
          <p class="game-lead">Precisas de pelo menos <strong>2 jogadores</strong> adicionados na secção "Quem joga hoje?" para jogar.</p>
        </div>
      `;
      return;
    }

    letterBag = letterBag || createShuffleBag(LETTERS);
    categoryBag = categoryBag || createShuffleBag(CATEGORIES);
    round = { letter: letterBag.next(), categories: drawCategories() };

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">Categorias</span>
        <h2>Palavras começadas por</h2>
        <p class="game-letter" aria-label="Letra ${round.letter}">${round.letter}</p>
        <p class="mini-note">Todos escrevem em simultâneo (papel, notas ou em voz alta) uma palavra por categoria que comece pela letra sorteada.</p>
        <div class="option-list">
          ${round.categories.map(c => `
            <div class="option-row">
              <span class="row-label">${escapeHtml(c)}</span>
            </div>
          `).join('')}
        </div>
        <div class="game-timer" id="timer" role="timer">${TIME_LIMIT}s</div>
        <button class="game-btn" id="start-categorias">Começar ➔</button>
      </div>
    `;

    container.querySelector('#start-categorias').addEventListener('click', () => startTimer(container, ctx));
  }

  function startTimer(container, ctx) {
    stopTimer();

    const timerEl = container.querySelector('#timer');
    const startBtn = container.querySelector('#start-categorias');
    const endAt = Date.now() + TIME_LIMIT * 1000;

    startBtn.disabled = true;
    startBtn.textContent = 'A escrever...';

    timerId = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      timerEl.textContent = `${left}s`;
      timerEl.classList.toggle('is-warning', left <= WARNING_AT);

      if (left === 0) {
        stopTimer();
        showResults(container, ctx);
      }
    }, 250);
  }

  function showResults(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const players = ctx.players.getAll();

    container.innerHTML = `
      <div class="game-screen">
        <h2>⏰ Tempo esgotado!</h2>
        <p class="game-lead">Comparem as respostas para <strong class="highlight">${round.letter}</strong> em voz alta. Respostas repetidas entre dois jogadores não pontuam para nenhum dos dois.</p>
        <p class="mini-note">Quem teve mais respostas válidas e únicas nesta ronda?</p>
        <div class="option-list">
          ${players.length === 0
            ? '<p class="mini-note">Adiciona jogadores na secção "Quem joga hoje?" para atribuir pontos.</p>'
            : players.map(p => `
              <div class="option-row">
                <span class="row-label">${escapeHtml(p)}</span>
                <button class="game-btn secondary" data-award="${escapeHtml(p)}">+${POINTS} pts</button>
              </div>
            `).join('')}
        </div>
        <button class="game-btn" id="next-round">Próxima Ronda ➔</button>
      </div>
    `;

    container.querySelectorAll('[data-award]').forEach(btn => {
      btn.addEventListener('click', () => {
        ctx.scoring.award(btn.dataset.award, POINTS);
        btn.disabled = true;
        btn.textContent = '✅ Pontuado';
      });
    });

    container.querySelector('#next-round').addEventListener('click', () => showRound(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.categorias = {
    mount(container, ctx) {
      showRound(container, ctx);
    },
    unmount() {
      stopTimer();
    }
  };
})();
