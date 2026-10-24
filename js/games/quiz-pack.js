// ============================================================
// quiz-pack.js — Quizzes temáticos feitos com GameKit.quiz
// Cada pergunta: { q: 'pergunta', o: [opções], a: índice certo }
// ============================================================

window.GameModules = window.GameModules || {};

// ---------- Geografia ----------
window.GameModules['quiz-geografia'] = GameKit.quiz({
  title: 'Quiz de Geografia',
  emoji: '🌍',
  questions: [
    { q: 'Qual é o maior país do mundo em área?', o: ['Canadá', 'China', 'Rússia', 'EUA'], a: 2 },
    { q: 'Qual é o rio mais comprido do mundo?', o: ['Amazonas', 'Nilo', 'Yangtzé', 'Mississípi'], a: 1 },
    { q: 'Em que país fica Machu Picchu?', o: ['México', 'Chile', 'Peru', 'Bolívia'], a: 2 },
    { q: 'Quantos continentes há?', o: ['5', '6', '7', '8'], a: 2 },
    { q: 'Qual é o país mais pequeno do mundo?', o: ['Mónaco', 'Vaticano', 'São Marino', 'Malta'], a: 1 },
    { q: 'Que país tem a forma de uma bota?', o: ['Grécia', 'Itália', 'Croácia', 'Chile'], a: 1 },
    { q: 'Onde ficam os Açores?', o: ['Mar Mediterrâneo', 'Oceano Atlântico', 'Oceano Índico', 'Mar do Norte'], a: 1 },
    { q: 'Qual destes países não tem costa?', o: ['Suíça', 'Portugal', 'Dinamarca', 'Croácia'], a: 0 },
    { q: 'Em que continente fica a Mongólia?', o: ['Europa', 'África', 'Ásia', 'Oceânia'], a: 2 },
    { q: 'Qual é o maior oceano?', o: ['Atlântico', 'Pacífico', 'Índico', 'Antártico'], a: 1 },
    { q: 'Que cidade é atravessada pelo rio Sena?', o: ['Londres', 'Paris', 'Berlim', 'Madrid'], a: 1 },
    { q: 'Qual é o ponto mais alto de Portugal?', o: ['Serra da Estrela', 'Montanha do Pico', 'Gerês', 'Marão'], a: 1 },
    { q: 'Que país tem mais ilhas?', o: ['Indonésia', 'Filipinas', 'Suécia', 'Japão'], a: 2 },
    { q: 'Em que país fica a cidade de Marraquexe?', o: ['Tunísia', 'Egito', 'Marrocos', 'Argélia'], a: 2 },
    { q: 'Qual é o deserto mais seco do mundo (não polar)?', o: ['Sara', 'Atacama', 'Gobi', 'Namibe'], a: 1 },
    { q: 'Timor-Leste fica em que ilha?', o: ['Bali', 'Timor', 'Java', 'Sumatra'], a: 1 },
    { q: 'Qual é a língua oficial de Angola?', o: ['Francês', 'Inglês', 'Português', 'Espanhol'], a: 2 },
    { q: 'Que país faz fronteira com Portugal?', o: ['França', 'Espanha', 'Marrocos', 'Andorra'], a: 1 }
  ]
});

// ---------- Capitais ----------
window.GameModules['quiz-capitais'] = GameKit.quiz({
  title: 'Capitais do Mundo',
  emoji: '🏛️',
  seconds: 10,
  questions: [
    { q: 'Capital de Itália?', o: ['Milão', 'Roma', 'Nápoles', 'Veneza'], a: 1 },
    { q: 'Capital do Japão?', o: ['Quioto', 'Osaka', 'Tóquio', 'Seul'], a: 2 },
    { q: 'Capital do Brasil?', o: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], a: 2 },
    { q: 'Capital da Turquia?', o: ['Istambul', 'Ancara', 'Esmirna', 'Antália'], a: 1 },
    { q: 'Capital da Suíça?', o: ['Zurique', 'Genebra', 'Berna', 'Basileia'], a: 2 },
    { q: 'Capital de Moçambique?', o: ['Maputo', 'Beira', 'Nampula', 'Luanda'], a: 0 },
    { q: 'Capital de Cabo Verde?', o: ['Mindelo', 'Praia', 'Sal', 'Santa Maria'], a: 1 },
    { q: 'Capital da Noruega?', o: ['Oslo', 'Bergen', 'Estocolmo', 'Helsínquia'], a: 0 },
    { q: 'Capital do Egito?', o: ['Alexandria', 'Cairo', 'Luxor', 'Gizé'], a: 1 },
    { q: 'Capital da Argentina?', o: ['Córdova', 'Buenos Aires', 'Rosário', 'Montevideu'], a: 1 },
    { q: 'Capital da Irlanda?', o: ['Dublin', 'Cork', 'Belfast', 'Galway'], a: 0 },
    { q: 'Capital da Coreia do Sul?', o: ['Busan', 'Pyongyang', 'Seul', 'Incheon'], a: 2 },
    { q: 'Capital de Marrocos?', o: ['Casablanca', 'Rabat', 'Marraquexe', 'Fez'], a: 1 },
    { q: 'Capital da Grécia?', o: ['Atenas', 'Salónica', 'Esparta', 'Creta'], a: 0 },
    { q: 'Capital dos EUA?', o: ['Nova Iorque', 'Washington D.C.', 'Los Angeles', 'Chicago'], a: 1 },
    { q: 'Capital da Polónia?', o: ['Cracóvia', 'Varsóvia', 'Praga', 'Gdansk'], a: 1 },
    { q: 'Capital de Angola?', o: ['Benguela', 'Luanda', 'Huambo', 'Lobito'], a: 1 },
    { q: 'Capital da Índia?', o: ['Mumbai', 'Nova Deli', 'Calcutá', 'Bangalore'], a: 1 }
  ]
});

// ---------- Cinema e Séries ----------
window.GameModules['quiz-cinema'] = GameKit.quiz({
  title: 'Quiz de Cinema',
  emoji: '🎬',
  questions: [
    { q: 'Em que filme aparece a frase "Eu sou o teu pai"?', o: ['Star Trek', 'Star Wars', 'Matrix', 'Alien'], a: 1 },
    { q: 'Como se chama o leão de "O Rei Leão"?', o: ['Mufasa', 'Simba', 'Scar', 'Nala'], a: 1 },
    { q: 'Que ator interpretou Jack em "Titanic"?', o: ['Brad Pitt', 'Leonardo DiCaprio', 'Johnny Depp', 'Tom Cruise'], a: 1 },
    { q: 'Em "Toy Story", como se chama o cowboy?', o: ['Buzz', 'Woody', 'Rex', 'Jessie'], a: 1 },
    { q: 'Que saga tem a escola de Hogwarts?', o: ['Senhor dos Anéis', 'Harry Potter', 'Nárnia', 'Percy Jackson'], a: 1 },
    { q: 'Qual é o verdadeiro nome do Homem de Ferro?', o: ['Bruce Wayne', 'Tony Stark', 'Peter Parker', 'Steve Rogers'], a: 1 },
    { q: 'Que série se passa em Hawkins?', o: ['Dark', 'Stranger Things', 'Riverdale', 'Lost'], a: 1 },
    { q: 'Que cor é a pílula que Neo toma em "Matrix"?', o: ['Azul', 'Vermelha', 'Verde', 'Amarela'], a: 1 },
    { q: 'Quem realizou "Parque Jurássico"?', o: ['James Cameron', 'Steven Spielberg', 'George Lucas', 'Ridley Scott'], a: 1 },
    { q: 'Em "Shrek", o que é a Fiona à noite?', o: ['Dragão', 'Ogre', 'Fada', 'Gata'], a: 1 },
    { q: 'Que série tem a família Dunphy e os Pritchett?', o: ['Friends', 'Uma Família Muito Moderna', 'The Office', 'Seinfeld'], a: 1 },
    { q: 'Como se chama o robô de "WALL-E" que vem do espaço?', o: ['EVE', 'AUTO', 'R2-D2', 'MO'], a: 0 },
    { q: 'Em que série há um trono feito de espadas?', o: ['Vikings', 'A Guerra dos Tronos', 'The Witcher', 'The Crown'], a: 1 },
    { q: 'Que filme da Pixar se passa dentro da cabeça de uma menina?', o: ['Coco', 'Divertida-Mente', 'Soul', 'Up'], a: 1 },
    { q: 'Quem é o inimigo do Batman com cara de palhaço?', o: ['Pinguim', 'Joker', 'Bane', 'Charada'], a: 1 },
    { q: 'Em "Casa de Papel", que artista dá nome às personagens?', o: ['Pintores', 'Cidades', 'Planetas', 'Flores'], a: 1 }
  ]
});

// ---------- Música ----------
window.GameModules['quiz-musica'] = GameKit.quiz({
  title: 'Quiz de Música',
  emoji: '🎸',
  questions: [
    { q: 'Quem canta "Shape of You"?', o: ['Justin Bieber', 'Ed Sheeran', 'Shawn Mendes', 'Harry Styles'], a: 1 },
    { q: 'Que banda cantou "Bohemian Rhapsody"?', o: ['The Beatles', 'Queen', 'ABBA', 'U2'], a: 1 },
    { q: 'Quantas cordas tem uma guitarra clássica?', o: ['4', '5', '6', '7'], a: 2 },
    { q: 'Que país venceu a Eurovisão de 2017 com "Amar pelos Dois"?', o: ['Espanha', 'Portugal', 'Itália', 'Suécia'], a: 1 },
    { q: 'Quem é conhecido como o "Rei do Pop"?', o: ['Elvis Presley', 'Michael Jackson', 'Prince', 'Freddie Mercury'], a: 1 },
    { q: 'O fado é típico de que país?', o: ['Brasil', 'Espanha', 'Portugal', 'Cabo Verde'], a: 2 },
    { q: 'Que cantora tem a música "Bad Romance"?', o: ['Rihanna', 'Lady Gaga', 'Beyoncé', 'Katy Perry'], a: 1 },
    { q: 'Quantos membros tinham os Beatles?', o: ['3', '4', '5', '6'], a: 1 },
    { q: 'Que instrumento tocava Mozart principalmente?', o: ['Violino', 'Piano', 'Flauta', 'Harpa'], a: 1 },
    { q: 'Quem canta "Despacito" com Daddy Yankee?', o: ['Maluma', 'Luis Fonsi', 'J Balvin', 'Bad Bunny'], a: 1 },
    { q: 'Que fadista é chamada a "Rainha do Fado"?', o: ['Mariza', 'Amália Rodrigues', 'Ana Moura', 'Dulce Pontes'], a: 1 },
    { q: 'Que grupo sueco cantou "Dancing Queen"?', o: ['Roxette', 'ABBA', 'Ace of Base', 'Europe'], a: 1 },
    { q: 'Que cantor canta "Blinding Lights"?', o: ['Drake', 'The Weeknd', 'Bruno Mars', 'Post Malone'], a: 1 },
    { q: 'Quantas notas musicais há (dó, ré, mi…)?', o: ['5', '6', '7', '8'], a: 2 },
    { q: 'A morna é um estilo musical de onde?', o: ['Angola', 'Cabo Verde', 'Brasil', 'Moçambique'], a: 1 }
  ]
});

// ---------- Desporto ----------
window.GameModules['quiz-desporto'] = GameKit.quiz({
  title: 'Quiz de Desporto',
  emoji: '⚽',
  questions: [
    { q: 'Quantos jogadores tem uma equipa de basquetebol em campo?', o: ['4', '5', '6', '7'], a: 1 },
    { q: 'Que país ganhou o Euro 2016?', o: ['França', 'Alemanha', 'Portugal', 'Espanha'], a: 2 },
    { q: 'Em que desporto se usa um "taco" e um "buraco"?', o: ['Hóquei', 'Golfe', 'Críquete', 'Polo'], a: 1 },
    { q: 'De quantos em quantos anos há Jogos Olímpicos de verão?', o: ['2', '3', '4', '5'], a: 2 },
    { q: 'Quantos sets ganha quem vence um jogo de voleibol?', o: ['2', '3', '4', '5'], a: 1 },
    { q: 'Em que desporto se faz um "touchdown"?', o: ['Râguebi', 'Futebol americano', 'Basebol', 'Andebol'], a: 1 },
    { q: 'Quanto mede uma maratona?', o: ['21 km', '42,195 km', '50 km', '30 km'], a: 1 },
    { q: 'Que tenista ganhou mais títulos em Roland Garros?', o: ['Federer', 'Djokovic', 'Nadal', 'Murray'], a: 2 },
    { q: 'Quantos minutos dura um jogo de futebol (sem descontos)?', o: ['80', '90', '100', '120'], a: 1 },
    { q: 'Que país inventou o judo?', o: ['China', 'Coreia', 'Japão', 'Tailândia'], a: 2 },
    { q: 'Que cor é a camisola do líder da Volta a França?', o: ['Verde', 'Amarela', 'Vermelha', 'Branca'], a: 1 },
    { q: 'Em que clube começou Cristiano Ronaldo como profissional?', o: ['Benfica', 'Sporting', 'FC Porto', 'Nacional'], a: 1 },
    { q: 'Quantos anéis tem o símbolo olímpico?', o: ['4', '5', '6', '7'], a: 1 },
    { q: 'Em que desporto existe o "xeque-mate"?', o: ['Damas', 'Xadrez', 'Bilhar', 'Póquer'], a: 1 },
    { q: 'Qual é a distância da prova mais curta de velocidade olímpica?', o: ['50 m', '100 m', '200 m', '60 m'], a: 1 }
  ]
});

// ---------- Filmes em Emojis ----------
window.GameModules['emoji-filmes'] = GameKit.quiz({
  title: 'Filmes em Emojis',
  emoji: '🍿',
  questions: [
    { q: '🦁👑', o: ['Madagáscar', 'O Rei Leão', 'Zootrópolis', 'Tarzan'], a: 1, big: true },
    { q: '🚢🧊💔', o: ['Titanic', 'Moana', 'Piratas das Caraíbas', 'Frozen'], a: 0, big: true },
    { q: '🧙‍♂️💍🌋', o: ['Harry Potter', 'O Senhor dos Anéis', 'O Hobbit', 'Nárnia'], a: 1, big: true },
    { q: '🦖🏝️🚙', o: ['Parque Jurássico', 'Godzilla', 'A Idade do Gelo', 'King Kong'], a: 0, big: true },
    { q: '👻🚫📞', o: ['Casper', 'Caça-Fantasmas', 'Coco', 'Os Outros'], a: 1, big: true },
    { q: '🐠🔍', o: ['À Procura de Nemo', 'A Pequena Sereia', 'Tubarão', 'Aquaman'], a: 0, big: true },
    { q: '❄️👸⛄', o: ['Branca de Neve', 'Frozen', 'Cinderela', 'Enredados'], a: 1, big: true },
    { q: '🕷️👨', o: ['Batman', 'Homem-Aranha', 'Venom', 'Formiga'], a: 1, big: true },
    { q: '🏠🎈👴', o: ['Up: Altamente', 'Carros', 'Ratatui', 'Valente'], a: 0, big: true },
    { q: '🐀👨‍🍳🇫🇷', o: ['Ratatui', 'Stuart Little', 'Chef', 'O Cozinheiro'], a: 0, big: true },
    { q: '🤖❤️🌱', o: ['Transformers', 'WALL-E', 'Robôs', 'Exterminador'], a: 1, big: true },
    { q: '🧸🤠🚀', o: ['Toy Story', 'Os Incríveis', 'Carros', 'Monstros e Companhia'], a: 0, big: true },
    { q: '🦈🏖️', o: ['Tubarão', 'Moana', 'Baywatch', 'Nemo'], a: 0, big: true },
    { q: '💀🎸🌼🇲🇽', o: ['Coco', 'Encanto', 'Viva', 'O Livro da Vida'], a: 0, big: true },
    { q: '🧞‍♂️🪔🐒', o: ['Aladino', 'Mogli', 'Tarzan', 'Hércules'], a: 0, big: true },
    { q: '👽📞🏠🚲', o: ['E.T.', 'Alien', 'Independence Day', 'Encontros Imediatos'], a: 0, big: true }
  ]
});

// ---------- Verdadeiro ou Falso ----------
window.GameModules['verdadeiro-falso'] = GameKit.quiz({
  title: 'Verdadeiro ou Falso',
  emoji: '✅',
  seconds: 8,
  perPlayer: 4,
  questions: [
    { q: 'Os polvos têm três corações.', o: ['Verdadeiro', 'Falso'], a: 0 },
    { q: 'A Grande Muralha da China vê-se a olho nu da Lua.', o: ['Verdadeiro', 'Falso'], a: 1 },
    { q: 'O mel nunca se estraga.', o: ['Verdadeiro', 'Falso'], a: 0 },
    { q: 'Os morcegos são cegos.', o: ['Verdadeiro', 'Falso'], a: 1 },
    { q: 'A banana é uma baga.', o: ['Verdadeiro', 'Falso'], a: 0 },
    { q: 'Os humanos só usam 10% do cérebro.', o: ['Verdadeiro', 'Falso'], a: 1 },
    { q: 'Vénus é o planeta mais quente do Sistema Solar.', o: ['Verdadeiro', 'Falso'], a: 0 },
    { q: 'Os peixes-dourados só têm 3 segundos de memória.', o: ['Verdadeiro', 'Falso'], a: 1 },
    { q: 'O coração de uma baleia-azul pesa mais do que um carro pequeno.', o: ['Verdadeiro', 'Falso'], a: 0 },
    { q: 'O raio nunca cai duas vezes no mesmo sítio.', o: ['Verdadeiro', 'Falso'], a: 1 },
    { q: 'Os flamingos são cor-de-rosa por causa do que comem.', o: ['Verdadeiro', 'Falso'], a: 0 },
    { q: 'Napoleão era muito baixo para a época.', o: ['Verdadeiro', 'Falso'], a: 1 },
    { q: 'Há mais estrelas no universo do que grãos de areia na Terra.', o: ['Verdadeiro', 'Falso'], a: 0 },
    { q: 'O tomate é um legume.', o: ['Verdadeiro', 'Falso'], a: 1 },
    { q: 'Os cangurus não conseguem andar para trás.', o: ['Verdadeiro', 'Falso'], a: 0 },
    { q: 'A água conduz bem a eletricidade quando é totalmente pura.', o: ['Verdadeiro', 'Falso'], a: 1 },
    { q: 'Portugal é o país mais antigo da Europa com as mesmas fronteiras.', o: ['Verdadeiro', 'Falso'], a: 0 },
    { q: 'Os camelos guardam água nas bossas.', o: ['Verdadeiro', 'Falso'], a: 1 }
  ]
});

// ---------- Matemática Relâmpago (perguntas geradas) ----------
window.GameModules.matematica = GameKit.quiz({
  title: 'Matemática Relâmpago',
  emoji: '➗',
  seconds: 8,
  perPlayer: 5,
  points: 5,
  generate() {
    const rnd = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
    const ops = [
      () => { const a = rnd(12, 99), b = rnd(12, 99); return [`${a} + ${b}`, a + b]; },
      () => { const a = rnd(40, 120), b = rnd(5, 39); return [`${a} − ${b}`, a - b]; },
      () => { const a = rnd(3, 12), b = rnd(3, 12); return [`${a} × ${b}`, a * b]; },
      () => { const b = rnd(2, 12), r = rnd(2, 12); return [`${b * r} ÷ ${b}`, r]; }
    ];
    const [text, answer] = ops[rnd(0, ops.length - 1)]();
    const options = new Set([answer]);
    while (options.size < 4) {
      const wrong = answer + rnd(-10, 10);
      if (wrong >= 0) options.add(wrong);
    }
    const list = [...options].sort(() => Math.random() - 0.5);
    return { q: `${text} = ?`, o: list.map(String), a: list.indexOf(answer), big: true };
  }
});
