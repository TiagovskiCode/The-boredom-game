// ============================================================
// data.js — Catálogo central de jogos + sistema de favoritos
// Este ficheiro é a "base de dados" do HUB. Não sabe nada sobre
// como os jogos funcionam por dentro, só descreve cada um.
//
// Campos de cada jogo:
//   id          igual à chave em window.GameModules
//   name/desc   texto mostrado nos cartões
//   tagline     frase curta para o carrossel (só se featured)
//   color       cor do poster e do 3D no carrossel
//   categories  'festa' | 'desafio' | 'quiz' | 'duelo' | 'util'
//   minPlayers  mínimo de jogadores na sala
//   featured    aparece no carrossel do topo
// ============================================================

const CATEGORY_LABELS = { festa: 'Festa', desafio: 'Desafio', quiz: 'Quiz', duelo: 'Duelo', util: 'Utilitário' };

const GAMES_DATA = [
  {
    id: 'impostor',
    name: 'O Impostor',
    icon: '🕵️',
    desc: 'Um de vocês não recebe a palavra secreta. Descubram quem é.',
    tagline: 'Todos sabem a palavra. Menos um.',
    color: '#FF3D7F',
    categories: ['festa'],
    minPlayers: 3,
    duration: '~15 min',
    recommended: true,
    featured: true
  },
  {
    id: 'desenha',
    name: 'Desenha e Adivinha',
    icon: '🎨',
    desc: 'Desenha a palavra secreta no ecrã enquanto o grupo tenta adivinhar.',
    tagline: 'O telemóvel vira quadro. Tu viras artista.',
    color: '#3DA5FF',
    categories: ['festa'],
    minPlayers: 2,
    duration: '~10 min',
    recommended: true,
    featured: true
  },
  {
    id: 'batata-quente',
    name: 'Batata Quente',
    icon: '💣',
    desc: 'Diz uma resposta e passa o telemóvel antes que a bomba rebente.',
    tagline: 'Responde. Passa. Reza.',
    color: '#FFB020',
    categories: ['festa'],
    minPlayers: 3,
    duration: '~5 min',
    recommended: true,
    featured: true
  },
  {
    id: 'quiz',
    name: 'Quiz Relâmpago',
    icon: '🧠',
    desc: 'Perguntas de cultura geral à vez, contra o relógio.',
    tagline: 'Quem sabe mais? Descobre-se em 15 segundos.',
    color: '#9B6BFF',
    categories: ['desafio'],
    minPlayers: 1,
    duration: '~10 min',
    recommended: true,
    featured: true
  },
  {
    id: 'provavel',
    name: 'Quem É Mais Provável?',
    icon: '🤔',
    desc: 'Perguntas para descobrir quem no grupo é capaz de quê.',
    color: '#A6FF3D',
    categories: ['festa'],
    minPlayers: 2,
    duration: '~10 min',
    recommended: true
  },
  {
    id: 'verdade-desafio',
    name: 'Verdade ou Desafio',
    icon: '🔥',
    desc: 'O clássico que nunca falha, com perguntas e desafios ao acaso.',
    color: '#FF5A3D',
    categories: ['festa'],
    minPlayers: 2,
    duration: '~15 min',
    recommended: true
  },
  {
    id: 'eu-nunca',
    name: 'Eu Nunca',
    icon: '🙊',
    desc: 'Frases "Eu nunca…" e cada um confessa se já fez. Quem é o mais aventureiro?',
    color: '#FF7AD9',
    categories: ['festa'],
    minPlayers: 2,
    duration: '~10 min',
    recommended: false
  },
  {
    id: 'mimica',
    name: 'Mímica',
    icon: '🎭',
    desc: 'Representa sem falar enquanto o grupo tenta adivinhar contra o tempo.',
    color: '#3DDC84',
    categories: ['festa'],
    minPlayers: 2,
    duration: '~10 min',
    recommended: true
  },
  {
    id: 'palavra-proibida',
    name: 'Palavra Proibida',
    icon: '🚫',
    desc: 'Descreve a palavra secreta sem dizeres as palavras proibidas.',
    color: '#FF4D5E',
    categories: ['festa'],
    minPlayers: 3,
    duration: '~10 min',
    recommended: false
  },
  {
    id: 'categorias',
    name: 'Categorias',
    icon: '📝',
    desc: 'Sorteia uma letra e corre contra o tempo para preencher categorias.',
    color: '#3DE0D0',
    categories: ['festa', 'desafio'],
    minPlayers: 2,
    duration: '~5 min',
    recommended: false
  },
  {
    id: 'blitz',
    name: 'Blitz Rápido',
    icon: '⚡',
    desc: 'Um desafio contra o relógio: quem responde certo mais rápido ganha.',
    color: '#FFE03D',
    categories: ['festa', 'desafio'],
    minPlayers: 1,
    duration: '~2 min',
    recommended: false
  },
  {
    id: 'mais-ou-menos',
    name: 'Mais ou Menos',
    icon: '🃏',
    desc: 'A próxima carta é maior ou menor? Faz a maior sequência do grupo.',
    color: '#5BE1FF',
    categories: ['desafio'],
    minPlayers: 1,
    duration: '~5 min',
    recommended: false
  },
  {
    id: 'cronometro',
    name: 'Cronómetro Cego',
    icon: '⏱️',
    desc: 'Pára o cronómetro nos 10 segundos certos… sem o ver.',
    color: '#C4FF7A',
    categories: ['desafio'],
    minPlayers: 1,
    duration: '~3 min',
    recommended: false
  },
  {
    id: 'reacao',
    name: 'Teste de Reação',
    icon: '💥',
    desc: 'Quem tem os reflexos mais rápidos do grupo? Cuidado com as cores falsas.',
    color: '#FF8A3D',
    categories: ['desafio'],
    minPlayers: 1,
    duration: '~2 min',
    recommended: false
  },
  {
    id: 'roleta',
    name: 'Roleta de Decisão',
    icon: '🎯',
    desc: 'Escrevam opções e deixem a sorte decidir o que vão fazer.',
    color: '#7AA8FF',
    categories: ['util'],
    minPlayers: 1,
    duration: '~1 min',
    recommended: false
  },
  {
    id: 'sorteador',
    name: 'Sorteador',
    icon: '🎲',
    desc: 'Quem começa, ordem de jogo ou equipas equilibradas num toque.',
    color: '#B98CFF',
    categories: ['util'],
    minPlayers: 2,
    duration: '~1 min',
    recommended: false
  },

  // ---------- Festa (js/games/party-pack.js) ----------
  { id: 'prefiro', name: 'Prefiro…', icon: '⚖️', desc: 'Dilemas impossíveis: cada um escolhe um lado e vê-se como o grupo se divide.', color: '#FF9F3D', categories: ['festa'], minPlayers: 1, duration: '~10 min', recommended: true },
  { id: 'conversa', name: 'Conversa a Sério', icon: '💬', desc: 'Perguntas para conhecer melhor quem está à mesa.', color: '#7AD9FF', categories: ['festa'], minPlayers: 2, duration: '~20 min', recommended: false },
  { id: 'cadeira-quente', name: 'Cadeira Quente', icon: '🪑', desc: '30 segundos para responder sem hesitar a perguntas indiscretas.', color: '#FF5A3D', categories: ['festa'], minPlayers: 2, duration: '~10 min', recommended: false },
  { id: 'adivinhas', name: 'Adivinhas', icon: '🧩', desc: 'Adivinhas clássicas: quem descobre primeiro?', color: '#FFD23D', categories: ['festa', 'desafio'], minPlayers: 1, duration: '~10 min', recommended: false },
  { id: 'historia', name: 'História em Cadeia', icon: '📖', desc: 'Uma frase cada um, a partir de um início absurdo.', color: '#C58CFF', categories: ['festa'], minPlayers: 2, duration: '~5 min', recommended: false },
  { id: 'debate', name: 'Debate Absurdo', icon: '🎤', desc: 'Dois jogadores defendem lados opostos de temas ridículos.', color: '#FF3D9A', categories: ['festa', 'duelo'], minPlayers: 2, duration: '~10 min', recommended: false },
  { id: 'desafios-30', name: 'Desafios de 30s', icon: '⏲️', desc: 'Pequenos desafios físicos e mentais contra o relógio.', color: '#3DFFB0', categories: ['festa', 'desafio'], minPlayers: 1, duration: '~10 min', recommended: false },
  { id: 'completa-frase', name: 'Completa a Frase', icon: '✍️', desc: 'Completa frases e o grupo vota na resposta mais criativa.', color: '#9DFF3D', categories: ['festa'], minPlayers: 2, duration: '~10 min', recommended: false },
  { id: 'duas-verdades', name: 'Duas Verdades, Uma Mentira', icon: '🤥', desc: 'Conta três factos sobre ti. Descubram qual é falso.', color: '#FF7A7A', categories: ['festa'], minPlayers: 2, duration: '~15 min', recommended: false },
  { id: 'imitacoes', name: 'Imitações', icon: '🦜', desc: 'Imita personagens sem dizer quem são.', color: '#3DDCA0', categories: ['festa'], minPlayers: 2, duration: '~10 min', recommended: false },
  { id: 'quem-sou-eu', name: 'Quem Sou Eu?', icon: '🤔', desc: 'Telemóvel na testa: adivinha a personagem com as pistas do grupo.', color: '#FFC43D', categories: ['festa'], minPlayers: 2, duration: '~10 min', recommended: true },
  { id: 'cantarola', name: 'Cantarola', icon: '🎶', desc: 'Trauteia músicas famosas até o grupo adivinhar.', color: '#FF6FB5', categories: ['festa'], minPlayers: 2, duration: '~10 min', recommended: false },
  { id: 'tres-palavras', name: 'Só 3 Palavras', icon: '3️⃣', desc: 'Faz o grupo adivinhar usando apenas três palavras.', color: '#6FA8FF', categories: ['festa'], minPlayers: 2, duration: '~10 min', recommended: false },

  // ---------- Quizzes (js/games/quiz-pack.js) ----------
  { id: 'quiz-geografia', name: 'Quiz de Geografia', icon: '🌍', desc: 'Países, rios, montanhas e oceanos.', color: '#3DC9FF', categories: ['quiz'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'quiz-capitais', name: 'Capitais do Mundo', icon: '🏛️', desc: '10 segundos para acertar na capital certa.', color: '#E6C25A', categories: ['quiz'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'quiz-cinema', name: 'Quiz de Cinema', icon: '🎬', desc: 'Filmes, séries e personagens famosas.', color: '#FF4D7A', categories: ['quiz'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'quiz-musica', name: 'Quiz de Música', icon: '🎸', desc: 'Do fado ao pop: quem percebe mais de música?', color: '#B46BFF', categories: ['quiz'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'quiz-desporto', name: 'Quiz de Desporto', icon: '⚽', desc: 'Futebol, ténis, Jogos Olímpicos e muito mais.', color: '#4DDB6A', categories: ['quiz'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'emoji-filmes', name: 'Filmes em Emojis', icon: '🍿', desc: 'Que filme está escondido nestes emojis?', color: '#FFB84D', categories: ['quiz'], minPlayers: 1, duration: '~5 min', recommended: true },
  { id: 'verdadeiro-falso', name: 'Verdadeiro ou Falso', icon: '✅', desc: 'Mitos e factos curiosos. 8 segundos para decidir.', color: '#3DFF8F', categories: ['quiz'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'matematica', name: 'Matemática Relâmpago', icon: '➗', desc: 'Contas de cabeça contra o relógio.', color: '#5AE0FF', categories: ['quiz', 'desafio'], minPlayers: 1, duration: '~3 min', recommended: false },

  // ---------- Tabuleiro, duelos e desafios ----------
  { id: 'jogo-do-galo', name: 'Jogo do Galo', icon: '⭕', desc: 'O clássico 3 em linha, frente a frente no mesmo ecrã.', color: '#A6FF3D', categories: ['duelo'], minPlayers: 1, duration: '~2 min', recommended: false },
  { id: 'quatro-em-linha', name: 'Quatro em Linha', icon: '🔴', desc: 'Larga as peças e faz 4 seguidas antes do adversário.', color: '#FF4D5E', categories: ['duelo'], minPlayers: 1, duration: '~5 min', recommended: true },
  { id: 'memoria', name: 'Memória', icon: '🃏', desc: 'Encontra os pares de cartas. Quem acerta joga outra vez.', color: '#7A8CFF', categories: ['desafio'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'toque-rapido', name: 'Toque Rápido', icon: '👆', desc: '10 segundos para tocar o máximo de vezes possível.', color: '#C4FF3D', categories: ['desafio'], minPlayers: 1, duration: '~2 min', recommended: false },
  { id: 'simon', name: 'Sequência', icon: '🌈', desc: 'Repete a sequência de cores. Cada nível fica mais longo.', color: '#FF5AD9', categories: ['desafio'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'forca', name: 'Forca', icon: '🪢', desc: 'Adivinhem a palavra secreta letra a letra antes de a forca acabar.', color: '#D0D8D4', categories: ['desafio'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'dados-sorte', name: 'Dados da Sorte', icon: '🎲', desc: 'Lança dois dados. A maior soma ganha, duplos dão bónus.', color: '#FFE03D', categories: ['festa'], minPlayers: 1, duration: '~2 min', recommended: false },
  { id: 'pedra-papel-tesoura', name: 'Pedra, Papel, Tesoura', icon: '✊', desc: 'Escolhas em segredo e melhor de três.', color: '#FF8A5A', categories: ['duelo'], minPlayers: 1, duration: '~2 min', recommended: false },
  { id: 'duelo-reflexos', name: 'Duelo de Reflexos', icon: '🤠', desc: 'Ecrã dividido: quem tocar primeiro no verde ganha.', color: '#3DFF6E', categories: ['duelo', 'desafio'], minPlayers: 1, duration: '~2 min', recommended: true },
  { id: 'palavra-encadeada', name: 'Palavra Encadeada', icon: '🔗', desc: 'Cada palavra começa pela última letra da anterior. 10 segundos!', color: '#5AB4FF', categories: ['desafio'], minPlayers: 2, duration: '~5 min', recommended: false },
  { id: 'anagramas', name: 'Anagramas', icon: '🔤', desc: 'Letras baralhadas: quem descobre a palavra primeiro?', color: '#FFCF5A', categories: ['desafio'], minPlayers: 1, duration: '~5 min', recommended: false },
  { id: 'garrafa', name: 'Roda a Garrafa', icon: '🍾', desc: 'A garrafa gira e escolhe quem cumpre o próximo mini-desafio.', color: '#5AFFC8', categories: ['festa', 'util'], minPlayers: 2, duration: '~10 min', recommended: false },
  { id: 'moeda-dados', name: 'Moeda & Dados', icon: '🪙', desc: 'Cara ou coroa e dados virtuais para qualquer jogo.', color: '#E8B730', categories: ['util'], minPlayers: 1, duration: '~1 min', recommended: false }
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

function playersLabel(n) {
  return `mín. ${n} jogador${n > 1 ? 'es' : ''}`;
}
