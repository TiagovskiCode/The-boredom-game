// ============================================================
// party-pack.js — Jogos de festa feitos com o GameKit (kit.js)
// Para criar um jogo novo deste tipo: junta um bloco aqui com
// o mesmo id que puseres em data.js. Não é preciso mais nada.
// ============================================================

window.GameModules = window.GameModules || {};

// ---------- Prefiro… (dilemas A ou B) ----------
window.GameModules.prefiro = GameKit.vote({
  title: 'Prefiro…',
  emoji: '⚖️',
  items: [
    ['Nunca mais usar telemóvel', 'Nunca mais ver séries'],
    ['Ser invisível', 'Conseguir voar'],
    ['Viver na praia', 'Viver na montanha'],
    ['Saber o futuro', 'Mudar o passado'],
    ['Comer só pizza para sempre', 'Nunca mais comer pizza'],
    ['Ter um dragão', 'Ser um dragão'],
    ['Falar todas as línguas', 'Tocar todos os instrumentos'],
    ['Estar sempre 10 minutos atrasado', 'Estar sempre 20 minutos adiantado'],
    ['Viajar ao espaço', 'Viajar ao fundo do mar'],
    ['Ser muito famoso', 'Ser muito rico mas anónimo'],
    ['Ter um botão de pausa', 'Ter um botão de rebobinar'],
    ['Sem internet um mês', 'Sem açúcar um mês'],
    ['Ler mentes', 'Ser teletransportado'],
    ['Ter sempre frio', 'Ter sempre calor'],
    ['Cantar tudo o que dizes', 'Dançar sempre que andas'],
    ['Viver sem música', 'Viver sem filmes'],
    ['Um gato do tamanho de um cão', 'Um cão do tamanho de um gato'],
    ['Acordar às 5h todos os dias', 'Deitar às 5h todos os dias'],
    ['Nunca mais ter de dormir', 'Nunca mais ter de comer'],
    ['Ser o mais esperto da sala', 'Ser o mais engraçado da sala'],
    ['Viver 200 anos', 'Viver 2 vidas de 80 anos'],
    ['Ganhar o Euromilhões', 'Encontrar o amor da tua vida hoje'],
    ['Ter um chef pessoal', 'Ter um motorista pessoal'],
    ['Ficar preso num elevador com o teu ex', 'Com o teu chefe'],
    ['Só poder sussurrar', 'Só poder gritar'],
    ['Ser um super-herói sem fato', 'Ter o fato sem poderes'],
    ['Conhecer o teu eu do passado', 'Conhecer o teu eu do futuro'],
    ['Ter sempre razão', 'Ser sempre feliz']
  ]
});

// ---------- Conversa a Sério ----------
window.GameModules.conversa = GameKit.deck({
  title: 'Conversa a Sério',
  emoji: '💬',
  players: 'one',
  note: 'Responde com calma. Os outros podem fazer uma pergunta de seguimento.',
  items: [
    'Qual foi o melhor conselho que já recebeste?',
    'O que farias se soubesses que não podias falhar?',
    'Qual é a memória de infância de que mais gostas?',
    'Que pessoa te mudou mais a vida?',
    'O que é que ninguém sabe que te deixa muito feliz?',
    'Se pudesses viver noutro país, qual seria e porquê?',
    'Qual foi o momento em que te sentiste mais orgulhoso(a) de ti?',
    'Que hábito gostavas de ter?',
    'O que dirias ao teu eu de há 10 anos?',
    'Qual é a tua definição de um dia perfeito?',
    'Do que é que tens mais saudades?',
    'Que talento gostavas de ter nascido com?',
    'Qual foi a decisão mais difícil que já tomaste?',
    'O que é que te faz perder a noção do tempo?',
    'Qual é o teu maior sonho ainda por cumprir?',
    'Que livro, filme ou música mudou a tua forma de pensar?',
    'Em que é que mudaste mais nos últimos anos?',
    'O que valorizas mais numa amizade?',
    'Qual foi a maior aventura da tua vida até agora?',
    'Se pudesses jantar com qualquer pessoa, viva ou não, quem seria?',
    'O que é que te acalma num dia mau?',
    'Qual é a coisa mais simpática que um estranho já fez por ti?',
    'Que coisa pequena te deixa sempre de bom humor?',
    'Qual é o teu objetivo para este ano?'
  ]
});

// ---------- Cadeira Quente ----------
window.GameModules['cadeira-quente'] = GameKit.deck({
  title: 'Cadeira Quente',
  emoji: '🪑',
  players: 'one',
  seconds: 30,
  note: 'Tens 30 segundos para responder sem hesitar. Proibido dizer "passo"!',
  items: [
    'Qual é a pessoa do grupo com quem irias numa ilha deserta?',
    'Qual foi a última mentira que contaste?',
    'Qual é o teu pior hábito?',
    'Quem do grupo seria o pior colega de casa?',
    'Qual é a tua comida de conforto vergonhosa?',
    'Qual é a música que ouves em segredo?',
    'Qual foi a tua pior fase de estilo?',
    'De quem do grupo foi a primeira impressão mais errada?',
    'Qual é o teu maior medo irracional?',
    'Qual é a coisa mais infantil que ainda fazes?',
    'Qual foi a pior prenda que já deste?',
    'O que mudavas em ti se pudesses?',
    'Qual foi o teu momento mais azarado?',
    'Que série viste mais vezes?',
    'Qual é o teu crush famoso?',
    'Qual foi a desculpa mais esfarrapada que já deste?',
    'Quem do grupo é mais provável de ficar rico?',
    'Qual foi a última vez que choraste a rir?',
    'Que emoji usas demasiado?',
    'Qual é a tua opinião impopular?'
  ]
});

// ---------- Adivinhas ----------
window.GameModules.adivinhas = GameKit.deck({
  title: 'Adivinhas',
  emoji: '🧩',
  note: 'Quem adivinhar primeiro ganha a ronda. Depois revelem a resposta.',
  items: [
    { text: 'Quanto mais tiras, maior fico. O que sou?', answer: 'Um buraco' },
    { text: 'Tem dentes mas não morde. O que é?', answer: 'Um pente' },
    { text: 'Tem cidades mas não tem casas, tem rios mas não tem água. O que é?', answer: 'Um mapa' },
    { text: 'O que é que sobe mas nunca desce?', answer: 'A idade' },
    { text: 'Quanto mais seca, mais molhada fica. O que é?', answer: 'Uma toalha' },
    { text: 'Tem pescoço mas não tem cabeça. O que é?', answer: 'Uma garrafa' },
    { text: 'O que é que se parte só de dizer o seu nome?', answer: 'O silêncio' },
    { text: 'Tem um olho mas não vê. O que é?', answer: 'Uma agulha' },
    { text: 'O que é que tem mãos mas não bate palmas?', answer: 'Um relógio' },
    { text: 'O que anda com os pés na cabeça?', answer: 'O piolho' },
    { text: 'Quanto mais quente está, mais fresco é. O que é?', answer: 'O pão' },
    { text: 'O que é que tem chaves mas não abre portas?', answer: 'Um teclado (ou um piano)' },
    { text: 'O que é que vai e vem sem sair do lugar?', answer: 'A porta' },
    { text: 'Tem folhas mas não é árvore. O que é?', answer: 'Um livro' },
    { text: 'O que é que está sempre à tua frente mas não consegues ver?', answer: 'O futuro' },
    { text: 'O que é que se apanha mas não se atira?', answer: 'Uma constipação' },
    { text: 'Cai em pé e corre deitada. O que é?', answer: 'A chuva' },
    { text: 'O que é que é teu mas os outros usam mais do que tu?', answer: 'O teu nome' },
    { text: 'O que tem cabeça e cauda mas não tem corpo?', answer: 'Uma moeda' },
    { text: 'O que é que enche uma sala mas não ocupa espaço?', answer: 'A luz' },
    { text: 'Se me tens, queres partilhar-me. Se me partilhas, deixas de me ter. O que sou?', answer: 'Um segredo' },
    { text: 'O que é que corre mas não tem pernas?', answer: 'O rio (ou o tempo)' }
  ]
});

// ---------- História em Cadeia ----------
window.GameModules.historia = GameKit.deck({
  title: 'História em Cadeia',
  emoji: '📖',
  seconds: 90,
  note: 'Cada pessoa acrescenta uma frase e passa ao seguinte. A história tem de acabar quando o tempo acabar!',
  items: [
    'Era uma vez um pinguim que queria ser DJ…',
    'Acordei e o meu gato estava a falar…',
    'No dia em que a internet acabou no mundo inteiro…',
    'O elevador parou entre o 3.º e o 4.º andar e lá dentro estava…',
    'Encontrei um mapa do tesouro dentro de uma pizza…',
    'O professor entrou na sala vestido de astronauta…',
    'A minha avó revelou que era uma espia…',
    'Às 3 da manhã alguém bateu à porta e disse…',
    'O autocarro em vez de parar começou a voar…',
    'Ganhámos uma viagem, mas o destino era…',
    'O frigorífico tinha um portal para outro mundo…',
    'Na festa apareceu um convidado que ninguém conhecia…',
    'Trocámos de corpo com o vizinho do lado…',
    'A estátua da praça piscou-me o olho…',
    'O chef do restaurante era um polvo…'
  ]
});

// ---------- Debate Absurdo ----------
window.GameModules.debate = GameKit.deck({
  title: 'Debate Absurdo',
  emoji: '🎤',
  players: 'pair',
  seconds: 60,
  points: 15,
  note: 'O primeiro defende o "sim", o segundo o "não". 30 segundos cada. O grupo vota em quem convenceu mais.',
  items: [
    'Ananás na pizza devia ser obrigatório.',
    'Os cães são melhores do que os gatos.',
    'O pequeno-almoço é a refeição mais sobrevalorizada.',
    'As meias com sandálias são estilosas.',
    'Devíamos ter fins de semana de 3 dias.',
    'Os filmes são sempre piores do que os livros.',
    'O inverno é a melhor estação do ano.',
    'Toda a gente devia saber cozinhar.',
    'As mensagens de voz deviam ser proibidas.',
    'É melhor ser madrugador do que noctívago.',
    'Os super-heróis deviam pagar os estragos que fazem.',
    'A sopa é uma bebida.',
    'O cachorro-quente é uma sanduíche.',
    'Ver séries dobradas é melhor do que legendadas.',
    'Os pombos são aves subestimadas.',
    'Devia haver uma sesta obrigatória depois do almoço.',
    'Os robôs vão fazer melhor arte do que as pessoas.',
    'O karaoke devia ser desporto olímpico.'
  ]
});

// ---------- Desafios de 30 Segundos ----------
window.GameModules['desafios-30'] = GameKit.deck({
  title: 'Desafios de 30s',
  emoji: '⏲️',
  players: 'one',
  seconds: 30,
  points: 10,
  note: 'O grupo decide se o desafio foi cumprido.',
  items: [
    'Diz 10 animais sem parar.',
    'Equilibra um livro na cabeça e dá uma volta à sala.',
    'Faz 15 agachamentos.',
    'Diz o alfabeto ao contrário até à letra M.',
    'Faz rir alguém do grupo sem tocar nele.',
    'Desenha um gato com a mão que não usas.',
    'Diz 8 capitais europeias.',
    'Fica numa perna só com os olhos fechados.',
    'Canta um refrão sem te enganares na letra.',
    'Faz uma torre com 5 objetos que tenhas à mão.',
    'Diz um trava-línguas três vezes seguidas sem falhar.',
    'Imita 5 animais diferentes.',
    'Conta até 30 em inglês o mais depressa possível.',
    'Diz 10 marcas de carros.',
    'Faz uma prancha durante 30 segundos.',
    'Nomeia todas as pessoas presentes ao contrário (pelo apelido).',
    'Diz 6 palavras que rimem com "ão".',
    'Faz uma vénia, um pino ou uma estrela (à escolha do grupo).'
  ]
});

// ---------- Completa a Frase ----------
window.GameModules['completa-frase'] = GameKit.deck({
  title: 'Completa a Frase',
  emoji: '✍️',
  players: 'one',
  note: 'Completa a frase. Depois, cada pessoa do grupo dá a sua versão e votam na melhor.',
  items: [
    'A coisa mais estranha no meu frigorífico agora é…',
    'Se eu fosse presidente, o primeiro que fazia era…',
    'O meu superpoder inútil seria…',
    'Nunca confies numa pessoa que…',
    'A pior coisa para se dizer num primeiro encontro é…',
    'O meu talento secreto é…',
    'Se os animais falassem, o mais mal-educado seria…',
    'O título da minha autobiografia seria…',
    'A minha playlist do ginásio tem…',
    'O melhor sítio para esconder um segredo é…',
    'Se eu tivesse um restaurante, o prato especial seria…',
    'O emprego mais estranho que eu podia ter era…',
    'O que nunca deve faltar numa festa é…',
    'A minha maior conquista desta semana foi…',
    'Se a minha vida fosse um filme, o vilão seria…',
    'A palavra mais bonita da língua portuguesa é…'
  ]
});

// ---------- Duas Verdades e Uma Mentira ----------
window.GameModules['duas-verdades'] = GameKit.deck({
  title: 'Duas Verdades, Uma Mentira',
  emoji: '🤥',
  players: 'one',
  seconds: 60,
  points: 15,
  note: 'Conta 3 coisas sobre o tema: 2 verdadeiras e 1 falsa. Se ninguém descobrir a mentira, ganhas os pontos.',
  items: [
    'Tema: a tua infância', 'Tema: viagens', 'Tema: comida', 'Tema: escola',
    'Tema: talentos escondidos', 'Tema: medos', 'Tema: a tua família', 'Tema: coisas que já partiste',
    'Tema: pessoas famosas', 'Tema: o teu primeiro emprego', 'Tema: desporto', 'Tema: animais de estimação',
    'Tema: música', 'Tema: vergonhas', 'Tema: aniversários'
  ]
});

// ---------- Imitações ----------
window.GameModules.imitacoes = GameKit.timed({
  title: 'Imitações',
  emoji: '🦜',
  seconds: 60,
  points: 10,
  minPlayers: 2,
  secret: true,
  intro: 'Vais ver quem tens de imitar. Podes fazer vozes e gestos, mas não podes dizer o nome!',
  items: [
    'Um pirata', 'Uma galinha', 'Um robô', 'Um treinador de futebol', 'Um bebé',
    'Um apresentador de telejornal', 'Um vampiro', 'Um professor rabugento', 'Um cão contente',
    'Um cantor de ópera', 'Um polícia', 'Um macaco', 'Uma avó ao telefone', 'Um influencer',
    'Um zombie', 'Um mágico', 'Um cowboy', 'Um bailarino', 'Um empregado de mesa', 'Um leão',
    'Um astronauta sem gravidade', 'Um chefe de cozinha zangado', 'Um gato com sono', 'Um repórter de guerra'
  ]
});

// ---------- Quem Sou Eu? ----------
window.GameModules['quem-sou-eu'] = GameKit.timed({
  title: 'Quem Sou Eu?',
  emoji: '🤔',
  seconds: 60,
  points: 10,
  minPlayers: 2,
  intro: 'Põe o telemóvel na testa com o ecrã virado para o grupo. Os outros dão pistas e tu tentas adivinhar!',
  items: [
    'Cristiano Ronaldo', 'Harry Potter', 'Shrek', 'Mickey Mouse', 'Batman', 'Pikachu',
    'Mona Lisa', 'Pai Natal', 'Super Mario', 'Homem-Aranha', 'Cleópatra', 'Einstein',
    'Elsa (Frozen)', 'Darth Vader', 'Bob Esponja', 'Messi', 'Shakira', 'Napoleão',
    'Tarzan', 'Sherlock Holmes', 'Barbie', 'Chaves', 'Hulk', 'Dora a Exploradora',
    'Yoda', 'Cinderela', 'Michael Jackson', 'Gru (Gru, o Maldisposto)', 'Popeye', 'Rei Leão'
  ]
});

// ---------- Cantarola ----------
window.GameModules.cantarola = GameKit.timed({
  title: 'Cantarola',
  emoji: '🎶',
  seconds: 60,
  points: 10,
  minPlayers: 2,
  secret: true,
  intro: 'Vais ver o nome de músicas. Trauteia a melodia (sem dizer a letra!) até o grupo adivinhar.',
  items: [
    'Parabéns a Você', 'Atirei o Pau ao Gato', 'Jingle Bells', 'Despacito', 'We Will Rock You',
    'Macarena', 'Let It Go (Frozen)', 'O Hino Nacional', 'Happy (Pharrell)', 'Bohemian Rhapsody',
    'Baby Shark', 'Shape of You', 'A Marcha Imperial (Star Wars)', 'Tema do Super Mario',
    'Bella Ciao', 'Thriller', 'Ai Se Eu Te Pego', 'Waka Waka', 'Dancing Queen', 'Tema da Pantera Cor-de-Rosa',
    'Billie Jean', 'Gangnam Style', 'Tema do Titanic', 'Feliz Navidad'
  ]
});

// ---------- Só 3 Palavras ----------
window.GameModules['tres-palavras'] = GameKit.timed({
  title: 'Só 3 Palavras',
  emoji: '3️⃣',
  seconds: 45,
  points: 10,
  minPlayers: 2,
  secret: true,
  intro: 'Descreve cada palavra usando apenas 3 palavras. Nem mais uma!',
  items: [
    'Praia', 'Bicicleta', 'Aniversário', 'Futebol', 'Hospital', 'Chocolate', 'Inverno', 'Pirata',
    'Cinema', 'Avião', 'Floresta', 'Casamento', 'Telemóvel', 'Escola', 'Vulcão', 'Dinossauro',
    'Pizza', 'Natal', 'Montanha', 'Música', 'Fantasma', 'Dentista', 'Gelado', 'Robô', 'Polícia', 'Circo'
  ]
});
