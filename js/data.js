// ============================================================
// data.js — Catálogo central de jogos + sistema de favoritos
// Este ficheiro é a "base de dados" do HUB. Não sabe nada sobre
// como os jogos funcionam por dentro, só descreve cada um.
// ============================================================

const GAMES_DATA = [
  {
    id: 'provavel',
    name: 'Quem É Mais Provável?',
    icon: '🤔',
    desc: 'Perguntas para descobrir quem no grupo é capaz de quê.',
    categories: ['festa'],
    minPlayers: 2,
    recommended: true
  },
  {
    id: 'roleta',
    name: 'Roleta de Decisão',
    icon: '🎯',
    desc: 'Escrevam opções e deixem a sorte decidir o que vão fazer.',
    categories: ['util'],
    minPlayers: 1,
    recommended: false
  },
  {
    id: 'impostor',
    name: 'O Impostor',
    icon: '🕵️',
    desc: 'Um de vocês não recebe a palavra secreta. Descubram quem é.',
    categories: ['festa'],
    minPlayers: 3,
    recommended: true
  },
  {
    id: 'verdade-desafio',
    name: 'Verdade ou Desafio',
    icon: '🔥',
    desc: 'O clássico que nunca falha, com perguntas e desafios ao acaso.',
    categories: ['festa'],
    minPlayers: 2,
    recommended: true
  },
  {
    id: 'blitz',
    name: 'Blitz Rápido',
    icon: '⚡',
    desc: 'Um desafio contra o relógio antes que o tempo se esgote.',
    categories: ['festa'],
    minPlayers: 1,
    recommended: false
  },
  {
    id: 'reacao',
    name: 'Teste de Reação',
    icon: '💥',
    desc: 'Quem tem os reflexos mais rápidos do grupo?',
    categories: ['util'],
    minPlayers: 1,
    recommended: false
  },
  {
    id: 'categorias',
    name: 'Categorias',
    icon: '📝',
    desc: 'Sorteia uma letra e corre contra o tempo para preencher categorias.',
    categories: ['festa'],
    minPlayers: 2,
    recommended: true
  },
  {
    id: 'mimica',
    name: 'Mímica',
    icon: '🎭',
    desc: 'Representa sem falar enquanto o grupo tenta adivinhar contra o tempo.',
    categories: ['festa'],
    minPlayers: 2,
    recommended: true
  },
  {
    id: 'palavra-proibida',
    name: 'Palavra Proibida',
    icon: '🚫',
    desc: 'Descreve a palavra secreta sem dizeres as palavras proibidas.',
    categories: ['festa'],
    minPlayers: 3,
    recommended: false
  }
];

// ---------- Favoritos (persistem no browser via localStorage) ----------
const FAVORITES_KEY = 'partyhub_favorites';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function isFavorite(gameId) {
  return getFavorites().includes(gameId);
}

function toggleFavorite(gameId) {
  const favs = getFavorites();
  const idx = favs.indexOf(gameId);
  if (idx === -1) {
    favs.push(gameId);
  } else {
    favs.splice(idx, 1);
  }
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  } catch (e) {
    // modo privado ou quota esgotada: o favorito só dura esta sessão
  }
  return favs;
}
