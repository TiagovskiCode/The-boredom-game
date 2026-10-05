// ============================================================
// provavel.js — "Quem É Mais Provável?"
// Escolhe uma pergunta ao acaso (sem repetir até esgotar o
// banco) + um jogador ao acaso.
// ============================================================

window.GameModules = window.GameModules || {};

window.GameModules.provavel = {
  questions: [
    'adormecer primeiro numa festa',
    'perder o telemóvel e não dar por isso',
    'chegar atrasado a tudo',
    'gastar o salário todo num dia',
    'ficar famoso nas redes sociais',
    'sobreviver sozinho numa ilha deserta',
    'esquecer-se do aniversário de alguém',
    'ganhar a lotaria e não contar a ninguém',
    'fazer uma asneira numa entrevista de emprego',
    'ser o último a saber de uma novidade do grupo',
    'chorar a ver um anúncio',
    'comer o resto de toda a gente',
    'inventar uma desculpa mal preparada',
    'dormir uma sesta no meio do dia',
    'transformar-se num influencer de fitness',
    'ganhar uma batalha de comida',
    'fazer uma maratona de séries num fim de semana inteiro',
    'ficar preso no elevador e não entrar em pânico',
    'aparecer num reality show',
    'ser expulso de um grupo do WhatsApp',
    'enviar uma mensagem para a pessoa errada',
    'ficar acordado a noite toda a jogar',
    'ganhar dinheiro fácil sem esforço',
    'ter uma crise de riso no pior momento possível',
    'desistir de uma dieta no primeiro dia',
    'perder-se numa cidade nova',
    'apaixonar-se à primeira vista',
    'defender um amigo numa discussão',
    'quebrar algo caro em casa de outra pessoa',
    'inventar uma história inacreditável e ser levado a sério',
    'chegar a casa às 6 da manhã',
    'fazer bricolage e estragar tudo',
    'ser o próximo do grupo a casar',
    'gastar horas a tirar a foto perfeita',
    'esquecer-se de onde estacionou o carro',
    'convencer alguém a fazer uma loucura',
    'organizar uma festa surpresa',
    'sobreviver sem telemóvel durante um dia inteiro',
    'cantar karaoke depois de umas bebidas',
    'roubar comida do prato de outra pessoa',
    'chorar a ver um filme de comédia'
  ],

  render(container) {
    if (!this.bag) this.bag = createShuffleBag(this.questions);

    const question = this.bag.next();
    const player = Players.getRandom();

    container.innerHTML = `
      <div class="game-screen">
        <h2>🤔 Quem É Mais Provável?</h2>
        <p style="margin-top:1rem; font-size:1.2rem;">
          Quem é mais provável que <strong>${question}</strong>?
        </p>
        <p class="chosen-player">🏆 ${player}</p>
        <button class="game-btn" id="next-question">Próxima Pergunta ➔</button>
        <p class="mini-note">Adiciona amigos no topo da página para o sorteio ser mais justo.</p>
      </div>
    `;

    container.querySelector('#next-question').addEventListener('click', () => this.render(container));
  }
};
