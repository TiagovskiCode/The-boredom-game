// ============================================================
// quiz.js — Quiz Relâmpago
// Perguntas de escolha múltipla, à vez. Cada jogador tem 15s.
// Certa = 10 pts (+5 se responder em menos de 5s).
// Uma partida tem 3 perguntas por jogador.
// ============================================================

(function () {
  const TIME_LIMIT = 15;
  const QUESTIONS_PER_PLAYER = 3;
  const POINTS = 10;
  const FAST_BONUS = 5;
  const FAST_UNDER = 5;

  // a = índice da resposta certa
  const QUESTIONS = [
    { q: 'Qual é o maior planeta do Sistema Solar?', o: ['Saturno', 'Júpiter', 'Neptuno', 'Terra'], a: 1 },
    { q: 'Quantos lados tem um hexágono?', o: ['5', '6', '7', '8'], a: 1 },
    { q: 'Qual é a capital da Austrália?', o: ['Sydney', 'Melbourne', 'Camberra', 'Perth'], a: 2 },
    { q: 'Quem pintou a Mona Lisa?', o: ['Picasso', 'Van Gogh', 'Leonardo da Vinci', 'Miguel Ângelo'], a: 2 },
    { q: 'Qual é o símbolo químico do ouro?', o: ['Ag', 'Au', 'Go', 'Or'], a: 1 },
    { q: 'Em que continente fica o Egito?', o: ['Ásia', 'África', 'Europa', 'Oceânia'], a: 1 },
    { q: 'Quantos minutos tem um dia?', o: ['1240', '1440', '1640', '2400'], a: 1 },
    { q: 'Qual é o oceano maior do mundo?', o: ['Atlântico', 'Índico', 'Pacífico', 'Ártico'], a: 2 },
    { q: 'Qual destes animais é um mamífero?', o: ['Tubarão', 'Golfinho', 'Pinguim', 'Crocodilo'], a: 1 },
    { q: 'Qual é a língua mais falada no Brasil?', o: ['Espanhol', 'Português', 'Inglês', 'Tupi'], a: 1 },
    { q: 'Quantas cores tem o arco-íris?', o: ['5', '6', '7', '8'], a: 2 },
    { q: 'Qual é o metal líquido à temperatura ambiente?', o: ['Mercúrio', 'Chumbo', 'Alumínio', 'Zinco'], a: 0 },
    { q: 'Qual é a capital de Timor-Leste?', o: ['Baucau', 'Díli', 'Maliana', 'Lospalos'], a: 1 },
    { q: 'Quem escreveu "Os Lusíadas"?', o: ['Fernando Pessoa', 'Eça de Queirós', 'Luís de Camões', 'José Saramago'], a: 2 },
    { q: 'Qual é o animal terrestre mais rápido?', o: ['Leão', 'Chita', 'Cavalo', 'Gazela'], a: 1 },
    { q: 'Quantos jogadores tem uma equipa de futebol em campo?', o: ['9', '10', '11', '12'], a: 2 },
    { q: 'Qual é a montanha mais alta do mundo?', o: ['K2', 'Kilimanjaro', 'Evereste', 'Monte Branco'], a: 2 },
    { q: 'O que mede um termómetro?', o: ['Pressão', 'Temperatura', 'Humidade', 'Vento'], a: 1 },
    { q: 'Qual é o país com mais habitantes?', o: ['EUA', 'Índia', 'Rússia', 'Brasil'], a: 1 },
    { q: 'Em que ano chegou o Homem à Lua?', o: ['1959', '1969', '1979', '1989'], a: 1 },
    { q: 'Qual é o resultado de 7 × 8?', o: ['54', '56', '58', '64'], a: 1 },
    { q: 'Qual destes não é um instrumento de cordas?', o: ['Violino', 'Harpa', 'Trompete', 'Violoncelo'], a: 2 },
    { q: 'Qual é a moeda do Japão?', o: ['Yuan', 'Won', 'Iene', 'Rupia'], a: 2 },
    { q: 'Quantos ossos tem o corpo humano adulto?', o: ['186', '206', '226', '256'], a: 1 },
    { q: 'Qual é o maior deserto quente do mundo?', o: ['Gobi', 'Sara', 'Atacama', 'Kalahari'], a: 1 },
    { q: 'Que gás as plantas absorvem do ar?', o: ['Oxigénio', 'Azoto', 'Dióxido de carbono', 'Hélio'], a: 2 },
    { q: 'Quem é o autor de "Harry Potter"?', o: ['J. K. Rowling', 'J. R. R. Tolkien', 'Roald Dahl', 'C. S. Lewis'], a: 0 },
    { q: 'Qual é o rio mais comprido de Portugal?', o: ['Douro', 'Tejo', 'Guadiana', 'Mondego'], a: 1 },
    { q: 'Quantos segundos tem uma hora?', o: ['360', '3600', '6000', '60 000'], a: 1 },
    { q: 'Qual destes países não faz fronteira com Espanha?', o: ['França', 'Portugal', 'Itália', 'Andorra'], a: 2 },
    { q: 'Qual é o planeta conhecido como "planeta vermelho"?', o: ['Vénus', 'Marte', 'Mercúrio', 'Júpiter'], a: 1 },
    { q: 'Em que desporto se faz um "ás"?', o: ['Futebol', 'Ténis', 'Natação', 'Golfe'], a: 1 },
    { q: 'Qual é o maior órgão do corpo humano?', o: ['Fígado', 'Cérebro', 'Pele', 'Pulmões'], a: 2 },
    { q: 'Que cor se obtém misturando azul com amarelo?', o: ['Roxo', 'Laranja', 'Verde', 'Castanho'], a: 2 },
    { q: 'Qual é a capital do Canadá?', o: ['Toronto', 'Otava', 'Vancouver', 'Montreal'], a: 1 },
    { q: 'Quantas patas tem uma aranha?', o: ['6', '8', '10', '12'], a: 1 },
    { q: 'Qual é o ponto de ebulição da água ao nível do mar?', o: ['90 °C', '100 °C', '110 °C', '120 °C'], a: 1 },
    { q: 'Quem inventou a lâmpada elétrica comercial?', o: ['Tesla', 'Edison', 'Newton', 'Bell'], a: 1 },
    { q: 'Qual é o idioma oficial da Argentina?', o: ['Português', 'Espanhol', 'Italiano', 'Inglês'], a: 1 },
    { q: 'Qual destes é um número primo?', o: ['21', '27', '29', '33'], a: 2 }
  ];

  let bag = null;
  let timerId = null;
  let state = null;

  function stopTimer() {
    clearInterval(timerId);
    timerId = null;
  }

  function start(container, ctx) {
    stopTimer();
    bag = bag || ctx.utils.createShuffleBag(QUESTIONS);
    const players = ctx.players.count() > 0 ? ctx.players.getAll() : ['Jogador 1'];
    state = {
      players,
      total: players.length * QUESTIONS_PER_PLAYER,
      asked: 0,
      score: new Map(players.map(p => [p, 0]))
    };
    ask(container, ctx);
  }

  function ask(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const player = state.players[state.asked % state.players.length];
    const question = bag.next();
    state.asked++;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🧠 Pergunta ${state.asked}/${state.total} · para ${escapeHtml(player)}</span>
        <h2>${question.q}</h2>
        <div class="time-bar" aria-hidden="true"><i id="time-fill"></i></div>
        <div class="quiz-options">
          ${question.o.map((opt, i) => `<button class="quiz-option" data-option="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>`).join('')}
        </div>
        <p class="game-timer" id="timer">${TIME_LIMIT}s</p>
      </div>
    `;

    const fill = container.querySelector('#time-fill');
    const timerEl = container.querySelector('#timer');
    const buttons = [...container.querySelectorAll('[data-option]')];
    const startedAt = performance.now();
    let answered = false;

    function resolve(choice) {
      if (answered) return;
      answered = true;
      stopTimer();

      const elapsed = (performance.now() - startedAt) / 1000;
      const correct = choice === question.a;
      const points = correct ? POINTS + (elapsed < FAST_UNDER ? FAST_BONUS : 0) : 0;

      buttons.forEach((b, i) => {
        b.disabled = true;
        if (i === question.a) b.classList.add('is-correct');
        else if (i === choice) b.classList.add('is-wrong');
      });

      if (points > 0) {
        state.score.set(player, state.score.get(player) + points);
        if (ctx.players.count() > 0) ctx.scoring.award(player, points);
      }

      timerEl.classList.remove('is-warning');
      timerEl.textContent = choice === null ? '⏰ Tempo!' : correct ? `✅ +${points}` : '❌';

      const isLast = state.asked >= state.total;
      const next = document.createElement('button');
      next.className = 'game-btn';
      next.textContent = isLast ? 'Ver resultados ➔' : 'Próxima pergunta ➔';
      next.addEventListener('click', () => (isLast ? showResults(container, ctx) : ask(container, ctx)));
      container.querySelector('.game-screen').appendChild(next);
      next.focus();
    }

    buttons.forEach(btn => btn.addEventListener('click', () => resolve(Number(btn.dataset.option))));

    timerId = setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const left = Math.max(0, TIME_LIMIT - elapsed);
      fill.style.transform = `scaleX(${left / TIME_LIMIT})`;
      timerEl.textContent = `${Math.ceil(left)}s`;
      timerEl.classList.toggle('is-warning', left <= 5);
      if (left === 0) resolve(null);
    }, 100);
  }

  function showResults(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const ranking = [...state.score].sort((a, b) => b[1] - a[1]);

    container.innerHTML = `
      <div class="game-screen">
        <h2>🏆 Resultado do quiz</h2>
        <p class="chosen-player">${escapeHtml(ranking[0][0])}</p>
        <div class="option-list">
          ${ranking.map(([name, pts], i) => `
            <div class="option-row">
              <span class="row-label">${['🥇', '🥈', '🥉'][i] || `${i + 1}.`} ${escapeHtml(name)}</span>
              <span class="row-points">${pts} pts</span>
            </div>
          `).join('')}
        </div>
        <p class="mini-note">Os pontos já estão no placar da noite.</p>
        <button class="game-btn" id="restart">Nova partida ➔</button>
      </div>
    `;
    container.querySelector('#restart').addEventListener('click', () => start(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules.quiz = {
    mount(container, ctx) {
      start(container, ctx);
    },
    unmount() {
      stopTimer();
      state = null;
    }
  };
})();
