// ============================================================
// kit.js — GameKit: motores reutilizáveis para criar jogos
// só com dados. Cada função devolve um módulo { mount, unmount }
// pronto a registar em window.GameModules.
//
//   GameKit.deck(cfg)   cartas ao acaso (perguntas, desafios, adivinhas)
//   GameKit.vote(cfg)   dilemas A ou B, cada jogador escolhe
//   GameKit.timed(cfg)  um jogador, palavras contra o relógio
//   GameKit.quiz(cfg)   perguntas de escolha múltipla à vez
//
// Ver js/games/party-pack.js e js/games/quiz-pack.js.
// ============================================================

const GameKit = (() => {
  const medal = i => ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;

  // Ecrã "faltam jogadores"
  function needPlayers(container, cfg) {
    container.innerHTML = `
      <div class="game-screen">
        <h2>${cfg.emoji} ${cfg.title}</h2>
        <p class="game-lead">Precisas de pelo menos <strong>${cfg.minPlayers} jogadores</strong> adicionados na secção "Quem joga hoje?" para jogar.</p>
      </div>
    `;
  }

  // Cronómetro que atualiza um elemento e chama onEnd no zero. Devolve stop().
  function countdown(el, seconds, onEnd) {
    const endAt = Date.now() + seconds * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      el.textContent = `${left}s`;
      el.classList.toggle('is-warning', left <= Math.min(10, seconds / 3));
      if (left === 0) {
        clearInterval(id);
        onEnd();
      }
    }, 200);
    return () => clearInterval(id);
  }

  // Tabela final de resultados [[nome, valor]] já ordenada
  function resultsList(rows, escapeHtml, suffix = 'pts') {
    return `
      <div class="option-list">
        ${rows.map(([name, value], i) => `
          <div class="option-row">
            <span class="row-label">${medal(i)} ${escapeHtml(name)}</span>
            <span class="row-points">${value} ${suffix}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ----------------------------------------------------------
  // deck — uma carta por ronda.
  // cfg: title, emoji, items (strings ou { text, answer }),
  //      players: 'none' | 'one' | 'pair', seconds (opcional),
  //      points (opcional: botões para dar pontos), note, minPlayers
  // ----------------------------------------------------------
  function deck(cfg) {
    let bag = null;
    let round = 0;
    let stopTimer = () => {};

    function render(container, ctx) {
      stopTimer();
      const { escapeHtml, createShuffleBag, shuffle } = ctx.utils;
      if (ctx.players.count() < (cfg.minPlayers || 0)) return needPlayers(container, cfg);

      bag = bag || createShuffleBag(cfg.items);
      round++;
      const item = bag.next();
      const text = typeof item === 'string' ? item : item.text;
      const answer = typeof item === 'string' ? null : item.answer;
      const people = cfg.players === 'pair' ? shuffle(ctx.players.getAll()).slice(0, 2)
        : cfg.players === 'one' ? [ctx.players.getRandom()] : [];

      container.innerHTML = `
        <div class="game-screen">
          <span class="game-tag">${cfg.emoji} ${cfg.title} · Ronda ${round}</span>
          ${people.length === 1 ? `<p class="mini-note">É a vez de</p><p class="chosen-player">${escapeHtml(people[0])}</p>` : ''}
          ${people.length === 2 ? `<p class="chosen-player">${escapeHtml(people[0])} <span class="mini-note">vs</span> ${escapeHtml(people[1])}</p>` : ''}
          <p class="big-word big-word--text">${text}</p>
          ${answer ? '<button class="game-btn secondary" data-k="reveal">Revelar resposta</button><p class="highlight" data-k="answer" role="status"></p>' : ''}
          ${cfg.seconds ? `<div class="game-timer" data-k="timer">${cfg.seconds}s</div><button class="game-btn secondary" data-k="start">Começar (${cfg.seconds}s)</button>` : ''}
          ${cfg.points && people.length ? `<div class="btn-row">${people.map(p => `<button class="game-btn secondary small" data-award="${escapeHtml(p)}">✅ ${people.length > 1 ? `Ganhou ${escapeHtml(p)}` : 'Conseguiu'} +${cfg.points}</button>`).join('')}</div>` : ''}
          ${cfg.note ? `<p class="mini-note">${cfg.note}</p>` : ''}
          <button class="game-btn" data-k="next">Próxima ➔</button>
        </div>
      `;

      const $ = k => container.querySelector(`[data-k="${k}"]`);
      if (answer) {
        $('reveal').addEventListener('click', e => {
          $('answer').textContent = answer;
          e.currentTarget.disabled = true;
        });
      }
      if (cfg.seconds) {
        $('start').addEventListener('click', e => {
          e.currentTarget.disabled = true;
          stopTimer = countdown($('timer'), cfg.seconds, () => { $('timer').textContent = '⏰ Tempo!'; });
        });
      }
      container.querySelectorAll('[data-award]').forEach(btn => {
        btn.addEventListener('click', () => {
          ctx.scoring.award(btn.dataset.award, cfg.points);
          container.querySelectorAll('[data-award]').forEach(b => { b.disabled = true; });
          btn.classList.add('is-on');
        });
      });
      $('next').addEventListener('click', () => render(container, ctx));
    }

    return {
      mount: (container, ctx) => { round = 0; render(container, ctx); },
      unmount: () => stopTimer()
    };
  }

  // ----------------------------------------------------------
  // vote — dilema "A ou B". Cada jogador escolhe um lado e no
  // fim vê-se como o grupo se dividiu.
  // cfg: title, emoji, items ([a, b]), lead
  // ----------------------------------------------------------
  function vote(cfg) {
    let bag = null;

    function render(container, ctx) {
      const { escapeHtml, createShuffleBag } = ctx.utils;
      bag = bag || createShuffleBag(cfg.items);
      const [a, b] = bag.next();
      const players = ctx.players.getAll();
      const picks = new Map();
      const counts = [0, 0];

      container.innerHTML = `
        <div class="game-screen">
          <span class="game-tag">${cfg.emoji} ${cfg.title}</span>
          <h2>${cfg.lead || 'O que preferes?'}</h2>
          <div class="versus">
            <p class="versus-card" data-side="0">${a}</p>
            <span class="versus-or">ou</span>
            <p class="versus-card" data-side="1">${b}</p>
          </div>
          ${players.length
            ? `<div class="option-list">${players.map(p => `
                <div class="option-row">
                  <span class="row-label">${escapeHtml(p)}</span>
                  <button class="game-btn secondary small" data-vote="0" data-player="${escapeHtml(p)}">A</button>
                  <button class="game-btn secondary small" data-vote="1" data-player="${escapeHtml(p)}">B</button>
                </div>`).join('')}</div>`
            : '<p class="mini-note">Toquem no lado que preferem (um toque por pessoa).</p>'}
          <p class="stat-line" data-k="result" role="status"></p>
          <div class="btn-row">
            ${players.length ? '<button class="game-btn secondary" data-k="reveal">Revelar votos</button>' : ''}
            <button class="game-btn" data-k="next">Próximo dilema ➔</button>
          </div>
        </div>
      `;

      const result = container.querySelector('[data-k="result"]');
      const show = () => {
        const total = counts[0] + counts[1] || 1;
        result.innerHTML = `<span class="chip">A · ${counts[0]} (${Math.round(counts[0] / total * 100)}%)</span><span class="chip">B · ${counts[1]} (${Math.round(counts[1] / total * 100)}%)</span>`;
      };

      if (players.length) {
        container.querySelectorAll('[data-vote]').forEach(btn => {
          btn.addEventListener('click', () => {
            picks.set(btn.dataset.player, Number(btn.dataset.vote));
            btn.parentElement.querySelectorAll('[data-vote]').forEach(x => x.classList.toggle('is-on', x === btn));
          });
        });
        container.querySelector('[data-k="reveal"]').addEventListener('click', () => {
          counts[0] = counts[1] = 0;
          picks.forEach(side => counts[side]++);
          show();
        });
      } else {
        container.querySelectorAll('[data-side]').forEach(card => {
          card.addEventListener('click', () => {
            counts[Number(card.dataset.side)]++;
            show();
          });
        });
      }
      container.querySelector('[data-k="next"]').addEventListener('click', () => render(container, ctx));
    }

    return { mount: render, unmount() {} };
  }

  // ----------------------------------------------------------
  // timed — um jogador de cada vez, palavras contra o relógio,
  // botões Acertou / Passar. Pontos para quem joga.
  // cfg: title, emoji, items, seconds, points, minPlayers,
  //      intro (instrução mostrada antes de começar),
  //      secret (true = só quem joga vê a palavra)
  // ----------------------------------------------------------
  function timed(cfg) {
    let bag = null;
    let turn = -1;
    let stop = () => {};
    let state = null;

    function intro(container, ctx) {
      stop();
      const { escapeHtml, createShuffleBag } = ctx.utils;
      if (ctx.players.count() < (cfg.minPlayers || 1)) return needPlayers(container, cfg);
      bag = bag || createShuffleBag(cfg.items);
      const players = ctx.players.getAll();
      turn = (turn + 1) % players.length;
      state = { player: players[turn], hits: 0 };
      const name = escapeHtml(state.player);

      container.innerHTML = `
        <div class="game-screen">
          <span class="game-tag">${cfg.emoji} ${cfg.title}</span>
          <h2>Joga agora</h2>
          <p class="chosen-player">${name}</p>
          <p class="game-lead">${cfg.intro}</p>
          <button class="game-btn" data-k="go">${cfg.secret ? `Sou ${name}, começar` : 'Começar'} (${cfg.seconds}s) ➔</button>
        </div>
      `;
      container.querySelector('[data-k="go"]').addEventListener('click', () => play(container, ctx));
    }

    function play(container, ctx) {
      container.innerHTML = `
        <div class="game-screen">
          <span class="game-tag">${cfg.emoji} ${cfg.title}</span>
          <p class="big-word" data-k="word">${bag.next()}</p>
          <div class="game-timer" data-k="timer">${cfg.seconds}s</div>
          <p class="mini-note">Acertos: <strong class="text-success" data-k="hits">0</strong></p>
          <div class="btn-row">
            <button class="game-btn" data-k="hit">✅ Acertou</button>
            <button class="game-btn secondary" data-k="skip">⏭️ Passar</button>
          </div>
        </div>
      `;
      const $ = k => container.querySelector(`[data-k="${k}"]`);
      const nextWord = () => { $('word').textContent = bag.next(); };
      $('hit').addEventListener('click', () => {
        state.hits++;
        $('hits').textContent = state.hits;
        nextWord();
      });
      $('skip').addEventListener('click', nextWord);
      stop = countdown($('timer'), cfg.seconds, () => finish(container, ctx));
    }

    function finish(container, ctx) {
      const { escapeHtml } = ctx.utils;
      const points = state.hits * cfg.points;
      if (points > 0) ctx.scoring.award(state.player, points);
      container.innerHTML = `
        <div class="game-screen">
          <h2>⏰ Tempo esgotado!</h2>
          <p class="game-lead"><strong class="highlight">${escapeHtml(state.player)}</strong> conseguiu <strong class="text-success">${state.hits}</strong>.</p>
          <p class="mini-note">${points > 0 ? `+${points} pts no placar da noite.` : 'Sem pontos nesta ronda.'}</p>
          <button class="game-btn" data-k="again">Próximo jogador ➔</button>
        </div>
      `;
      container.querySelector('[data-k="again"]').addEventListener('click', () => intro(container, ctx));
    }

    return { mount: intro, unmount: () => stop() };
  }

  // ----------------------------------------------------------
  // quiz — escolha múltipla, à vez.
  // cfg: title, emoji, questions ([{ q, o: [...], a }]) ou
  //      generate() que devolve uma pergunta nova,
  //      perPlayer (3), seconds (15), points (10)
  // ----------------------------------------------------------
  function quiz(cfg) {
    const perPlayer = cfg.perPlayer || 3;
    const seconds = cfg.seconds || 15;
    const points = cfg.points || 10;
    let bag = null;
    let stop = () => {};
    let state = null;

    function start(container, ctx) {
      stop();
      if (!cfg.generate) bag = bag || ctx.utils.createShuffleBag(cfg.questions);
      const players = ctx.players.count() > 0 ? ctx.players.getAll() : ['Jogador 1'];
      state = { players, total: players.length * perPlayer, asked: 0, score: new Map(players.map(p => [p, 0])) };
      ask(container, ctx);
    }

    function ask(container, ctx) {
      const { escapeHtml } = ctx.utils;
      const player = state.players[state.asked % state.players.length];
      const question = cfg.generate ? cfg.generate() : bag.next();
      state.asked++;

      container.innerHTML = `
        <div class="game-screen">
          <span class="game-tag">${cfg.emoji} ${state.asked}/${state.total} · para ${escapeHtml(player)}</span>
          <h2 class="${question.big ? 'quiz-big' : ''}">${question.q}</h2>
          <div class="quiz-options">
            ${question.o.map((opt, i) => `<button class="quiz-option" data-option="${i}">${opt}</button>`).join('')}
          </div>
          <p class="game-timer" data-k="timer">${seconds}s</p>
        </div>
      `;

      const timerEl = container.querySelector('[data-k="timer"]');
      const buttons = [...container.querySelectorAll('[data-option]')];
      let answered = false;

      function resolve(choice) {
        if (answered) return;
        answered = true;
        stop();
        const correct = choice === question.a;
        buttons.forEach((b, i) => {
          b.disabled = true;
          if (i === question.a) b.classList.add('is-correct');
          else if (i === choice) b.classList.add('is-wrong');
        });
        timerEl.classList.remove('is-warning');
        timerEl.textContent = choice === null ? '⏰ Tempo!' : correct ? `✅ +${points}` : '❌';
        if (correct) {
          state.score.set(player, state.score.get(player) + points);
          if (ctx.players.count() > 0) ctx.scoring.award(player, points);
        }

        const isLast = state.asked >= state.total;
        const next = document.createElement('button');
        next.className = 'game-btn';
        next.textContent = isLast ? 'Ver resultados ➔' : 'Próxima pergunta ➔';
        next.addEventListener('click', () => (isLast ? results(container, ctx) : ask(container, ctx)));
        container.querySelector('.game-screen').appendChild(next);
        next.focus();
      }

      buttons.forEach(btn => btn.addEventListener('click', () => resolve(Number(btn.dataset.option))));
      stop = countdown(timerEl, seconds, () => resolve(null));
    }

    function results(container, ctx) {
      const { escapeHtml } = ctx.utils;
      const ranking = [...state.score].sort((a, b) => b[1] - a[1]);
      container.innerHTML = `
        <div class="game-screen">
          <span class="game-tag">${cfg.emoji} ${cfg.title}</span>
          <h2>🏆 Resultado</h2>
          <p class="chosen-player">${escapeHtml(ranking[0][0])}</p>
          ${resultsList(ranking, escapeHtml)}
          <button class="game-btn" data-k="again">Nova partida ➔</button>
        </div>
      `;
      container.querySelector('[data-k="again"]').addEventListener('click', () => start(container, ctx));
    }

    return { mount: start, unmount: () => stop() };
  }

  return { deck, vote, timed, quiz, needPlayers, countdown, resultsList, medal };
})();
