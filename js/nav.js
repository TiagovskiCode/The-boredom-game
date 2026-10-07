(function () {
  const header = document.querySelector('.site-header');
  const bar = document.getElementById('scroll-progress');
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')].filter(a => a.getAttribute('href').length > 1);
  const targets = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;
  let current = null;

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    if (bar) bar.style.transform = `scaleX(${progress})`;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
    ticking = false;
  }

  function markCurrent() {
    links.forEach(a => {
      if (current && a.getAttribute('href') === `#${current}`) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();

  if ('IntersectionObserver' in window && targets.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) current = entry.target.id;
        else if (current === entry.target.id) current = null;
      });
      markCurrent();
    }, { rootMargin: '-35% 0px -55% 0px' });

    targets.forEach(t => observer.observe(t));
  }
})();
