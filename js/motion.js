// ============================================================
// motion.js — Animações com GSAP
//   • Smooth scroll (ScrollSmoother)
//   • Elementos [data-reveal] entram ao fazer scroll
//   • A cena 3D do hero reage ao scroll
//   • Cartões com [data-tilt] inclinam-se com o rato
// Expõe window.Motion para o resto do site:
//   Motion.scrollTo('#id')  Motion.pause()  Motion.resume()
//   Motion.refresh()
// Se o GSAP não carregar, tudo continua a funcionar sem animação.
// ============================================================

const Motion = (() => {
  const reduceMotion = prefersReducedMotion();
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const headerOffset = () => document.getElementById('site-header').offsetHeight;
  let smoother = null;
  let refreshTimer = null;

  // ---------- Smooth scroll ----------
  function initSmoother() {
    gsap.registerPlugin(ScrollTrigger);
    if (!window.ScrollSmoother || reduceMotion) return;
    gsap.registerPlugin(ScrollSmoother);
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,          // segundos que o conteúdo demora a "apanhar" o scroll
      smoothTouch: 0.1,     // mais leve no telemóvel
      effects: true         // permite data-speed / data-lag no HTML
    });
  }

  // ---------- Entrada do hero ----------
  function intro() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.site-header', { y: -30, opacity: 0, duration: 0.8 })
      .from('#hero-copy > *', { y: 40, opacity: 0, duration: 0.9, stagger: 0.08 }, '-=0.5')
      .from('.hero-arrow, .hero-dots', { opacity: 0, duration: 0.6 }, '-=0.4');
  }

  // ---------- Revelar ao fazer scroll ----------
  function reveals() {
    const els = gsap.utils.toArray('[data-reveal]');
    gsap.set(els, { opacity: 0, y: 40 });
    ScrollTrigger.batch(els, {
      start: 'top 88%',
      once: true,
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform'   // devolve o transform ao CSS (efeito tilt)
      })
    });
  }

  // ---------- Scroll ligado ao 3D e ao texto do hero ----------
  function scrollScenes() {
    const scenes = window.Scenes || {};

    ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: self => scenes.hero && scenes.hero.setScroll(self.progress)
    });

    gsap.to('#hero-copy', {
      yPercent: 25,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    ScrollTrigger.create({
      trigger: '.cta-box',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: self => scenes.cta && scenes.cta.setScroll(self.progress - 0.5)
    });

    // A grelha de jogos inclina-se ligeiramente com a velocidade do scroll
    const skewGrid = gsap.quickTo('#games-grid', 'skewY', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({
      trigger: '#jogos',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: self => skewGrid(gsap.utils.clamp(-3, 3, self.getVelocity() / -400)),
      onLeave: () => skewGrid(0),
      onLeaveBack: () => skewGrid(0)
    });

    // Os números "01 02 03" dos passos sobem a velocidades diferentes
    gsap.utils.toArray('.how-step').forEach((step, i) => {
      gsap.fromTo(step.querySelector('.how-num'), { yPercent: 30 + i * 15 }, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: step, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  // ---------- Inclinação 3D com o rato ----------
  function tilt() {
    if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
    let active = null;

    function reset(el) {
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    }

    document.addEventListener('pointermove', e => {
      const el = e.target instanceof Element ? e.target.closest('[data-tilt]') : null;
      if (active && active !== el) reset(active);
      active = el;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.classList.add('is-tilting');
      el.style.setProperty('--rx', `${((0.5 - py) * 12).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${((px - 0.5) * 14).toFixed(2)}deg`);
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    }, { passive: true });

    document.documentElement.addEventListener('pointerleave', () => {
      if (active) reset(active);
      active = null;
    });
  }

  // ---------- API pública ----------
  function scrollTo(target) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    const isTop = el.id === 'topo' || el.id === 'hero';

    if (smoother) {
      smoother.scrollTo(isTop ? 0 : el, true, `top ${headerOffset() + 8}px`);
    } else if (isTop) {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else {
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function pause() {
    if (smoother) smoother.paused(true);
    else document.body.style.overflow = 'hidden';
  }

  function resume() {
    if (smoother) smoother.paused(false);
    else document.body.style.overflow = '';
  }

  // Recalcula posições depois de o conteúdo mudar de altura (ex: filtros)
  function refresh() {
    if (!hasGsap) return;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
  }

  // ---------- Arranque ----------
  if (hasGsap) {
    initSmoother();
    if (!reduceMotion) {
      intro();
      reveals();
      scrollScenes();
    }
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
  tilt();

  return { scrollTo, pause, resume, refresh };
})();

// const no topo de um script não cria window.Motion; os outros ficheiros testam window.Motion
window.Motion = Motion;
