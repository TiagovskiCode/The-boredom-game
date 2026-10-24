// Animações (smooth scroll, 3D, entradas) estão sempre ligadas.
// Para as desligar, abre o site com ?motion=off no endereço.
const MOTION_OFF = /[?&]motion=off\b/.test(location.search);
if (MOTION_OFF) document.documentElement.classList.add('motion-off');

function prefersReducedMotion() {
  return MOTION_OFF;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createShuffleBag(items) {
  let bag = [];
  let lastItem = null;

  function refill() {
    bag = shuffle(items);
    if (bag.length > 1 && bag[bag.length - 1] === lastItem) {
      [bag[bag.length - 1], bag[bag.length - 2]] = [bag[bag.length - 2], bag[bag.length - 1]];
    }
  }

  function next() {
    if (bag.length === 0) refill();
    const item = bag.pop();
    lastItem = item;
    return item;
  }

  function reset() {
    bag = [];
    lastItem = null;
  }

  return { next, reset };
}
