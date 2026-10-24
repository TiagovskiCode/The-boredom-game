// ============================================================
// eu-nunca.js — Eu Nunca
// Aparece uma frase "Eu nunca…". Quem já fez toca no seu nome.
// O jogo conta as confissões de cada um e, no fim, coroa o mais
// aventureiro da mesa (+20 pts).
// ============================================================

(function () {
  const CROWN_POINTS = 20;

  const STATEMENTS = [
    'Eu nunca adormeci no cinema.',
    'Eu nunca mandei uma mensagem à pessoa errada.',
    'Eu nunca fingi estar ao telefone para evitar alguém.',
    'Eu nunca comi algo que caiu ao chão.',
    'Eu nunca menti sobre a minha idade.',
    'Eu nunca chorei por causa de um filme de animação.',
    'Eu nunca stalkeei um ex nas redes sociais.',
    'Eu nunca me perdi numa cidade nova.',
    'Eu nunca cantei no duche como se fosse um concerto.',
    'Eu nunca saí de casa com a roupa do avesso.',
    'Eu nunca reenviei um presente que recebi.',
    'Eu nunca disse "estou a chegar" ainda em casa.',
    'Eu nunca adormeci numa aula ou reunião.',
    'Eu nunca falei sozinho(a) em voz alta na rua.',
    'Eu nunca vi uma série inteira num fim de semana.',
    'Eu nunca parti um ecrã de telemóvel.',
    'Eu nunca tentei cortar o meu próprio cabelo.',
    'Eu nunca fingi que conhecia uma música.',
    'Eu nunca comi pizza ao pequeno-almoço.',
    'Eu nunca ri num momento completamente inapropriado.',
    'Eu nunca fiquei fechado(a) fora de casa.',
    'Eu nunca me esqueci do nome de alguém logo depois de mo dizerem.',
    'Eu nunca fiz uma direta para acabar um trabalho.',
    'Eu nunca escrevi uma mensagem e apaguei antes de enviar.',
    'Eu nunca entrei na casa de banho errada.',
    'Eu nunca tirei mais de 50 selfies para escolher uma.',
    'Eu nunca dancei sozinho(a) em frente ao espelho.',
    'Eu nunca culpei o cão (ou o gato) por algo que fiz.',
    'Eu nunca apanhei um avião.',
    'Eu nunca andei de mota.',
    'Eu nunca fui a um concerto sozinho(a).',
    'Eu nunca liguei a alguém sem querer com o telemóvel no bolso.',
    'Eu nunca menti num jogo para ganhar.',
    'Eu nunca aprendi uma coreografia do TikTok.',
    'Eu nunca me esqueci de um aniversário importante.'
  ];

  let bag = null;
  let state = null;

  function start(container, ctx) {
    if (ctx.players.count() < 2) {
      container.innerHTML = `
        <div class="game-screen">
          <h2>🙊 Eu Nunca</h2>
          <p class="game-lead">Precisas de pelo menos <strong>2 jogadores</strong> adicionados na secção "Quem joga hoje?" para jogar.</p>
        </div>
      `;
      return;
    }

    bag = bag || ctx.utils.createShuffleBag(STATEMENTS);
    state = {
      players: ctx.players.getAll(),
      tally: new Map(ctx.players.getAll().map(p => [p, 0])),
      round: 0
    };
    showStatement(container, ctx);
  }

  function showStatement(container, ctx) {
    const { escapeHtml } = ctx.utils;
    state.round++;
    const confessed = new Set();

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">🙊 Eu Nunca · Ronda ${state.round}</span>
        <p class="big-word big-word--text">${bag.next()}</p>
        <p class="mini-note">Quem <strong>já fez</strong> toca no seu nome. Sem mentir!</p>
        <div class="player-toggles">
          ${state.players.map(p => `<button class="game-btn secondary small" data-player="${escapeHtml(p)}" aria-pressed="false">${escapeHtml(p)}</button>`).join('')}
        </div>
        <div class="btn-row">
          <button class="game-btn" id="next-statement">Próxima frase ➔</button>
          <button class="game-btn secondary" id="end-game">Ver quem é o mais aventureiro</button>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-player]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.player;
        const on = !confessed.has(name);
        if (on) confessed.add(name);
        else confessed.delete(name);
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', String(on));
      });
    });

    const commit = () => confessed.forEach(name => state.tally.set(name, state.tally.get(name) + 1));

    container.querySelector('#next-statement').addEventListener('click', () => {
      commit();
      showStatement(container, ctx);
    });

    container.querySelector('#end-game').addEventListener('click', () => {
      commit();
      showResults(container, ctx);
    });
  }

  function showResults(container, ctx) {
    const { escapeHtml } = ctx.utils;
    const ranking = [...state.tally].sort((a, b) => b[1] - a[1]);
    const [topName, topCount] = ranking[0];
    const tie = ranking.length > 1 && ranking[1][1] === topCount;
    const hasWinner = topCount > 0 && !tie;

    if (hasWinner) ctx.scoring.award(topName, CROWN_POINTS);

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">${state.round} frase${state.round === 1 ? '' : 's'} depois…</span>
        <h2>${hasWinner ? '👑 O mais aventureiro é' : 'Empate de confissões!'}</h2>
        ${hasWinner ? `<p class="chosen-player">${escapeHtml(topName)}</p><p class="mini-note">+${CROWN_POINTS} pts pela coroa.</p>` : ''}
        <div class="option-list">
          ${ranking.map(([name, count]) => `
            <div class="option-row">
              <span class="row-label">${escapeHtml(name)}</span>
              <span class="row-points">${count} já fiz</span>
            </div>
          `).join('')}
        </div>
        <button class="game-btn" id="restart">Jogar outra vez ➔</button>
      </div>
    `;

    container.querySelector('#restart').addEventListener('click', () => start(container, ctx));
  }

  window.GameModules = window.GameModules || {};
  window.GameModules['eu-nunca'] = {
    mount(container, ctx) {
      start(container, ctx);
    },
    unmount() {
      state = null;
    }
  };
})();
