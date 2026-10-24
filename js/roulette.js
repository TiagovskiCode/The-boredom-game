// ============================================================
// roulette.js — Roleta de jogos (slot machine) + faixa de nomes
// ============================================================

(function () {
  const root = document.getElementById('roulette');
  const track = document.getElementById('ticker-track');

  if (track) {
    const names = GAMES_DATA.map(g => g.name);
    // Duas cópias seguidas: a animação CSS desliza 50% e recomeça sem salto
    track.innerHTML = names.concat(names).map(n => `<span>${escapeHtml(n)}</span>`).join('');
  }

  if (!root) return;

  const slotPrev = root.querySelector('[data-slot="prev"]');
  const slotCur = root.querySelector('[data-slot="cur"]');
  const slotNext = root.querySelector('[data-slot="next"]');
  const hint = root.querySelector('[data-slot="hint"]');
  const spinBtn = root.querySelector('[data-action="spin"]');
  const playBtn = root.querySelector('[data-action="play"]');
  const reduceMotion = prefersReducedMotion();
  const stage = document.getElementById('stage');
  const burst = document.getElementById('burst');
  const hues = ['#A6FF3D', '#FF3D7F', '#3DA5FF', '#FFB020'];
  const shapes = ['▲', '●', '■', '◆'];

  if (burst) {
    burst.innerHTML = Array.from({ length: 16 }, (_, k) => {
      const angle = (k / 16) * Math.PI * 2;
      const radius = k % 2 ? 240 : 170;
      const x = Math.round(Math.cos(angle) * radius);
      const y = Math.round(Math.sin(angle) * radius);
      const hue = hues[k % hues.length];
      return `<span style="--x:${x}px;--y:${y}px;color:${hue};text-shadow:0 0 14px ${hue}">${shapes[k % 4]}</span>`;
    }).join('');
  }

  function celebrate() {
    if (!stage) return;
    stage.classList.remove('is-won');
    void stage.offsetWidth;
    stage.classList.add('is-won');
  }

  let pool = [];
  let index = 0;
  let spinning = false;

  function eligibleGames() {
    const group = Math.max(Players.count(), 1);
    const eligible = GAMES_DATA.filter(g => g.minPlayers <= group);
    return eligible.length ? eligible : GAMES_DATA;
  }

  function at(offset) {
    return pool[(((index + offset) % pool.length) + pool.length) % pool.length];
  }

  function paint() {
    const current = at(0);
    slotPrev.textContent = at(-1).name;
    slotCur.textContent = current.name;
    slotNext.textContent = at(1).name;
    hint.textContent = `${playersLabel(current.minPlayers)} · ${current.desc}`;
    playBtn.textContent = `Jogar ${current.name}`;
    playBtn.dataset.game = current.id;
  }

  function refresh() {
    pool = eligibleGames();
    index = Math.floor(Math.random() * pool.length);
    paint();
  }

  function spin() {
    if (spinning) return;
    pool = eligibleGames();
    spinning = true;
    if (stage) stage.classList.remove('is-won');
    spinBtn.disabled = true;
    playBtn.disabled = true;
    spinBtn.textContent = 'A rodar…';

    const total = reduceMotion ? 1 : 16 + Math.floor(Math.random() * 6);
    let step = 0;

    function tick() {
      step++;
      index = Math.floor(Math.random() * pool.length * 4) + index + 1;
      paint();
      if (step < total) {
        setTimeout(tick, 60 + step * 9);
      } else {
        spinning = false;
        spinBtn.disabled = false;
        playBtn.disabled = false;
        spinBtn.textContent = 'Rodar';
        celebrate();
      }
    }

    tick();
  }

  spinBtn.addEventListener('click', spin);
  playBtn.addEventListener('click', () => openGame(playBtn.dataset.game));

  Store.subscribe((snap, action) => {
    if (!spinning && (action.startsWith('players:') || action === 'session:new' || action === 'sync')) refresh();
  });

  refresh();
})();
