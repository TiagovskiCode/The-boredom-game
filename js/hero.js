// ============================================================
// hero.js — Carrossel do topo
// 1º slide = apresentação do site; os seguintes = jogos com
// featured: true em data.js. Cada slide muda o texto, a cor do
// hero (--hero-color) e a cor da cena 3D.
// ============================================================

(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const INTERVAL = 7000;
  const copy = document.getElementById('hero-copy');
  const dotsEl = document.getElementById('hero-dots');
  const slot = name => copy.querySelector(`[data-hero="${name}"]`);
  const els = { tag: slot('tag'), title: slot('title'), desc: slot('desc'), meta: slot('meta'), play: slot('play') };
  const hasGsap = !!window.gsap;

  // Último termo do nome na cor do slide: "O <Impostor>"
  function accentLastWord(name) {
    const words = escapeHtml(name).split(' ');
    const last = words.pop();
    return `${words.join(' ')} <span class="text-accent">${last}</span>`;
  }

  const slides = [
    {
      color: '#A6FF3D',
      tag: 'Passatempos para amigos',
      title: 'A noite ainda <span class="text-accent">não acabou.</span>',
      desc: els.desc.textContent,
      meta: '',
      play: 'Começar a noite',
      action: () => (window.Motion ? Motion.scrollTo('#jogadores') : location.assign('#jogadores'))
    },
    ...GAMES_DATA.filter(g => g.featured).map(game => ({
      color: game.color,
      tag: `Em destaque · ${CATEGORY_LABELS[game.categories[0]]}`,
      title: accentLastWord(game.name),
      desc: `${game.tagline} ${game.desc}`,
      meta: [playersLabel(game.minPlayers), game.duration].filter(Boolean).map(t => `<span class="chip">${t}</span>`).join(''),
      play: 'Jogar agora',
      action: () => openGame(game.id)
    }))
  ];

  let index = 0;
  let timer = null;
  let paused = false;

  dotsEl.innerHTML = slides.map((s, i) => `
    <button type="button" class="hero-dot" role="tab" aria-label="Destaque ${i + 1}" aria-selected="${i === 0}" data-dot="${i}"><i></i></button>
  `).join('');
  hero.style.setProperty('--hero-interval', `${INTERVAL}ms`);

  function fill(slide) {
    hero.style.setProperty('--hero-color', slide.color);
    els.tag.textContent = slide.tag;
    els.title.innerHTML = slide.title;
    els.desc.textContent = slide.desc;
    els.meta.innerHTML = slide.meta;
    els.play.textContent = slide.play;
  }

  function paintDots() {
    dotsEl.querySelectorAll('.hero-dot').forEach((dot, i) => {
      dot.setAttribute('aria-selected', String(i === index));
      // Recomeça a barra de progresso do slide ativo
      const bar = dot.querySelector('i');
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
    });
  }

  function goTo(next) {
    const target = (next + slides.length) % slides.length;
    if (target === index) return;
    index = target;
    const slide = slides[index];

    if (window.Scenes && Scenes.hero) {
      Scenes.hero.setTint(slide.color);
      Scenes.hero.kick();
      Scenes.hero.pokeAll();
    }
    paintDots();

    const parts = [...copy.children];
    if (hasGsap) {
      gsap.killTweensOf(parts);
      gsap.to(parts, {
        y: -16, opacity: 0, duration: 0.25, stagger: 0.03, ease: 'power2.in',
        onComplete: () => {
          fill(slide);
          gsap.fromTo(parts, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' });
        }
      });
    } else {
      fill(slide);
    }
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (!paused) timer = setTimeout(() => goTo(index + 1), INTERVAL);
  }

  function setPaused(value) {
    if (paused === value) return;
    paused = value;
    hero.classList.toggle('is-paused', paused);
    if (paused) {
      clearTimeout(timer);
    } else {
      paintDots();
      schedule();
    }
  }

  // ---------- Controlos ----------
  els.play.addEventListener('click', () => slides[index].action());

  hero.querySelectorAll('[data-hero-nav]').forEach(btn => {
    btn.addEventListener('click', () => goTo(index + Number(btn.dataset.heroNav)));
  });

  dotsEl.addEventListener('click', e => {
    const dot = e.target.closest('[data-dot]');
    if (dot) goTo(Number(dot.dataset.dot));
  });

  hero.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
  });

  // Pausa enquanto o rato está no texto ou há foco lá dentro
  copy.addEventListener('pointerenter', () => setPaused(true));
  copy.addEventListener('pointerleave', () => setPaused(false));
  hero.addEventListener('focusin', () => setPaused(true));
  hero.addEventListener('focusout', () => setPaused(false));

  // Não avança quando o hero não está à vista
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => setPaused(!entries[0].isIntersecting), { threshold: 0.3 }).observe(hero);
  }

  schedule();
})();
