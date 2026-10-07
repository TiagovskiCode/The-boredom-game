(function () {
  const root = document.getElementById('roulette');
  const track = document.getElementById('ticker-track');

  if (track) {
    const names = GAMES_DATA.map(g => g.name);
    track.innerHTML = names.concat(names).map(n => `<span>${escapeHtml(n)}</span>`).join('');
  }

  if (!root) return;

  const slotPrev = root.querySelector('[data-slot="prev"]');
  const slotCur = root.querySelector('[data-slot="cur"]');
  const slotNext = root.querySelector('[data-slot="next"]');
  const hint = root.querySelector('[data-slot="hint"]');
  const spinBtn = root.querySelector('[data-action="spin"]');
  const playBtn = root.querySelector('[data-action="play"]');
  const reduceMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.getElementById('stage');
  const burst = document.getElementById('burst');
  const hues = ['#00E5FF', '#FF2E88', '#39FF14', '#8A5CFF', '#FFD60A', '#FF5A1F'];
  const shapes = ['▲', '●', '■', '◆'];

  if (burst) {
    burst.innerHTML = Array.from({ length: 14 }, (_, k) => {
      const angle = (k / 14) * Math.PI * 2;
      const radius = k % 2 ? 230 : 160;
      const x = Math.round(Math.cos(angle) * radius);
      const y = Math.round(Math.sin(angle) * radius);
      return `<span style="--x:${x}px;--y:${y}px;color:${hues[k % 6]};text-shadow:0 0 14px ${hues[k % 6]}">${shapes[k % 4]}</span>`;
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
    slotCur.style.color = hues[GAMES_DATA.indexOf(current) % hues.length];
    slotNext.textContent = at(1).name;
    hint.textContent = `mín. ${current.minPlayers} jogador${current.minPlayers > 1 ? 'es' : ''} · ${current.desc}`;
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
