// ============================================================
// mais-ou-menos.js — Mais ou Menos
// À vez, cada jogador vê uma carta e aposta se a próxima é
// MAIOR ou MENOR. Cartas iguais contam como acerto. Quando
// falha, a vez passa e ganha 5 pts por cada acerto seguido.
// ============================================================

(function () {
  const POINTS_PER_HIT = 5;
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const SUITS = [
    { symbol: '♠', red: false },
    { symbol: '♥', red: true },
    { symbol: '♦', red: true },
    { symbol: '♣', red: false }
  ];

  let state = null;

  function newDeck(shuffle) {
    const deck = [];
    SUITS.forEach(suit => RANKS.forEach((rank, i) => deck.push({ rank, value: i + 1, suit })));
    return shuffle(deck);
  }

  function draw(ctx) {
    if (state.deck.length === 0) state.deck = newDeck(ctx.utils.shuffle);
    return state.deck.pop();
  }

  function cardHtml(card) {
    return `
      <div class="playing-card ${card.suit.red ? 'is-red' : ''}" aria-label="${card.rank} de ${card.suit.symbol}">
        <span>${card.rank}</span>
        <b>${card.suit.symbol}</b>
        <span>${card.rank}</span>
      </div>
    `;
  }

  function start(container, ctx) {
    const players = ctx.players.count() > 0 ? ctx.players.getAll() : ['Jogador 1'];
    state = {
      players,
      turn: 0,
      deck: newDeck(ctx.utils.shuffle),
      results: [],
      streak: 0,
      card: null
    };
    state.card = draw(ctx);
    renderTurn(container, ctx);
  }

  function renderTurn(container, ctx, feedback = '') {
    const { escapeHtml } = ctx.utils;
    const name = state.players[state.turn];

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🃏 Mais ou Menos · ${state.turn + 1}/${state.players.length}</span>
        <h2>Vez de <span class="highlight">${escapeHtml(name)}</span></h2>
        <div class="card-table">
          ${cardHtml(state.card)}
          <div class="playing-card is-back" aria-hidden="true"><b>?</b></div>
        </div>
        <p class="stat-line"><span class="chip">🔥 Sequência: ${state.streak}</span><span class="chip">${state.deck.length} cartas no baralho</span></p>
        <p class="mini-note" role="status">${feedback || 'A próxima carta é maior ou menor? Iguais contam como acerto.'}</p>
        <div class="btn-row">
          <button class="game-btn" data-guess="up">▲ Maior</button>
          <button class="game-btn secondary" data-guess="down">▼ Menor</button>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-guess]').forEach(btn => {
      btn.addEventListener('click', () => guess(container, ctx, btn.dataset.guess));
    });
  }

  function guess(container, ctx, direction) {
    const previous = state.card;
    const next = draw(ctx);
    const hit = next.value === previous.value || (direction === 'up' ? next.value > previous.value : next.value < previous.value);
    state.card = next;

    if (hit) {
      state.streak++;
      renderTurn(container, ctx, `✅ Acertaste! Saiu ${next.rank}${next.suit.symbol}. Continua…`);
      return;
    }

    endTurn(container, ctx, previous, next);
  }

  function endTurn(container, ctx, previous, next) {
    const { escapeHtml } = ctx.utils;
    const name = state.players[state.turn];
    const points = state.streak * POINTS_PER_HIT;
    state.results.push({ name, streak: state.streak });
    if (points > 0) ctx.scoring.award(name, points);

    const isLast = state.turn === state.players.length - 1;

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">❌ Falhaste</span>
        <div class="card-table">
          ${cardHtml(previous)}
          ${cardHtml(next)}
        </div>
        <h2>${escapeHtml(name)} fez ${state.streak} seguida${state.streak === 1 ? '' : 's'}</h2>
        <p class="mini-note">${points > 0 ? `+${points} pts adicionados ao placar.` : 'Sem pontos desta vez.'}</p>
        <button class="game-btn" id="continue">${isLast ? 'Ver resultados ➔' : `Passar a ${escapeHtml(state.players[state.turn + 1])} ➔`}</button>
      </div>
    `;

    container.querySelector('#continue').addEventListener('click', () => {
      if (isLast) {
        showResults(container, ctx);
        return;
      }
      state.turn++;
      state.streak = 0;
      state.card = draw(ctx);
      renderTurn(container, ctx);
    });
  }

  function showResults(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const ranking = [...state.results].sort((a, b) => b.streak - a.streak);

    container.innerHTML = `
      <div class="game-screen">
        <h2>🏆 Maiores sequências</h2>
        <div class="option-list">
          ${ranking.map((r, i) => `
            <div class="option-row">
              <span class="row-label">${['🥇', '🥈', '🥉'][i] || `${i + 1}.`} ${escapeHtml(r.name)}</span>
              <span class="row-points">${r.streak} seguidas</span>
            </div>
          `).join('')}
        </div>
        <button class="game-btn" id="restart">Jogar outra vez ➔</button>
      </div>
    `;
    container.querySelector('#restart').addEventListener('click', () => start(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['mais-ou-menos'] = {
    mount(container, ctx) {
      start(container, ctx);
    },
    unmount() {
      state = null;
    }
  };
})();
