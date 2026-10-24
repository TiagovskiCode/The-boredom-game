// ============================================================
// nav.js — Header (estado ao fazer scroll), menu mobile,
// link ativo, barra de progresso e links internos (#âncoras)
// ============================================================

(function () {
  const header = document.getElementById('site-header');
  const bar = document.getElementById('scroll-progress');
  const menuToggle = document.getElementById('menu-toggle');
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('game-search');
  const links = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const targets = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;

  // ---------- Header + barra de progresso ----------
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    if (bar) bar.style.transform = `scaleX(${progress})`;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();

  // ---------- Menu mobile ----------
  function setMenu(open) {
    header.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  menuToggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) setMenu(false);
  });

  // ---------- Links internos passam pelo smooth scroll ----------
  document.addEventListener('click', e => {
    const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    const href = link.getAttribute('href');
    const target = href.length > 1 && document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    setMenu(false);
    if (window.Motion) Motion.scrollTo(target);
    else target.scrollIntoView();
    history.replaceState(null, '', href);
  });

  // ---------- Botão de pesquisa do header ----------
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      if (window.Motion) Motion.scrollTo('#jogos');
      setTimeout(() => searchInput.focus({ preventScroll: true }), 700);
    });
  }

  // ---------- Link ativo conforme a secção visível ----------
  if ('IntersectionObserver' in window && targets.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => {
          if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    targets.forEach(t => observer.observe(t));
  }
})();
