// ============================================================
// utils.js — Utilitários partilhados entre jogos
// ============================================================

// Escapa caracteres HTML para que texto introduzido pelos jogadores
// (nomes, respostas, opções da roleta) nunca parta o layout nem
// injete HTML quando é inserido via innerHTML.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Cria um "saco" que dá itens ao acaso sem repetir nenhum até
// esgotar a lista toda; aí baralha de novo, evitando repetir
// logo a seguir o último item que saiu.
function createShuffleBag(items) {
  let bag = [];
  let lastItem = null;

  function refill() {
    bag = [...items];
    // baralha (Fisher-Yates)
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    // evita repetir imediatamente o último item da volta anterior
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
