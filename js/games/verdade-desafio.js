// ============================================================
// verdade-desafio.js — Verdade ou Desafio
// Escolhe um jogador ao acaso e deixa-o escolher entre uma
// verdade ou um desafio, sorteados sem repetir até esgotar o
// banco de cada um.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules['verdade-desafio'] = {
  truths: [
    'Qual foi a mentira mais estúpida que já contaste?',
    'Qual é o teu maior medo?',
    'Já gostaste de alguém do grupo? De quem?',
    'Qual foi o momento mais vergonhoso da tua vida?',
    'Qual é o segredo que menos pessoas sabem sobre ti?',
    'Já stalkeaste alguém nas redes sociais? Quem?',
    'Qual é a tua maior insegurança?',
    'Já traíste a confiança de alguém aqui presente?',
    'Qual foi a coisa mais estranha que já fizeste para impressionar alguém?',
    'Já fingiste estar doente para faltar a algo?',
    'Qual é o teu maior arrependimento?',
    'Já leste as mensagens de outra pessoa sem permissão?',
    'Qual foi a pior desculpa que já usaste?',
    'Já disseste "sim" quando querias dizer "não"?',
    'Quem no grupo conhece melhor o teu lado mau?',
    'Já fizeste algo indevido, mesmo que pequeno?',
    'Qual foi a última vez que choraste sozinho(a)?',
    'Já copiaste em algum teste?',
    'Tens algum hábito estranho que ninguém sabe?',
    'Já namoraste com alguém só por pena?',
    'Qual foi a mentira mais elaborada que já contaste aos teus pais?',
    'Já stalkeaste o(a) ex de alguém?',
    'Qual é a coisa mais cara que já compraste por impulso?',
    'Já fingiste gostar de um presente?'
  ],
  dares: [
    'Imita alguém do grupo até adivinharem quem é.',
    'Manda uma mensagem de voz aleatória para o teu último contacto.',
    'Dança 20 segundos sem música.',
    'Deixa alguém do grupo publicar algo no teu telemóvel.',
    'Fala com sotaque durante as próximas 3 rondas.',
    'Faz 10 flexões agora mesmo.',
    'Conta uma anedota má e finge que é a melhor do mundo.',
    'Deixa o grupo escolher a tua foto de perfil por 24h.',
    'Fala como um robô durante 2 minutos.',
    'Deixa alguém desenhar-te algo na cara com maquilhagem lavável.',
    'Faz uma imitação de um animal à escolha do grupo.',
    'Envia um emoji aleatório para os últimos 3 contactos.',
    'Faz uma pose de ioga durante 30 segundos.',
    'Canta os parabéns em voz alta para ninguém.',
    'Deixa o grupo escolher a legenda da tua próxima foto publicada.',
    'Fala só por perguntas durante 3 minutos.',
    'Faz 15 saltos à corda imaginária.',
    'Conta uma história embaraçosa de infância.',
    'Deixa alguém mexer no teu telemóvel durante 1 minuto.',
    'Fala com a boca cheia de água durante 20 segundos.',
    'Faz uma dança robótica.',
    'Manda um áudio a cantar para o grupo da família.',
    'Anda de costas pela sala durante 1 minuto.',
    'Deixa que tirem uma selfie estranha tua agora.'
  ],

  render(container) {
    if (!this.truthBag) this.truthBag = createShuffleBag(this.truths);
    if (!this.dareBag) this.dareBag = createShuffleBag(this.dares);

    const player = Players.getRandom();

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">Verdade ou Desafio</span>
        <h2>É a vez de</h2>
        <p class="chosen-player">${escapeHtml(player)}</p>
        <div class="btn-row">
          <button class="game-btn" id="pick-truth">💬 Verdade</button>
          <button class="game-btn secondary" id="pick-dare">⚡ Desafio</button>
        </div>
      </div>
    `;

    container.querySelector('#pick-truth').addEventListener('click', () => this.showResult(container, player, 'truth'));
    container.querySelector('#pick-dare').addEventListener('click', () => this.showResult(container, player, 'dare'));
  },

  showResult(container, player, type) {
    const text = type === 'truth' ? this.truthBag.next() : this.dareBag.next();
    const label = type === 'truth' ? '💬 Verdade' : '⚡ Desafio';

    container.innerHTML = `
      <div class="game-screen">
        <span class="game-tag">${label} para ${escapeHtml(player)}</span>
        <p class="big-word big-word--text">${text}</p>
        <button class="game-btn" id="next-round">Próxima ronda ➔</button>
      </div>
    `;

    container.querySelector('#next-round').addEventListener('click', () => this.render(container));
  }
};
