// ============================================================
// leaderboard.js — Placar global (estilo Kahoot)
// Guarda pontos por jogador durante a sessão atual (não
// persiste ao recarregar a página, tal como Players) e mostra
// um painel acessível a partir do botão no cabeçalho.
// ============================================================

const Leaderboard = (() => {
  let scores = {}; // { nomeJogador: pontos }

  function addPoints(player, points) {
    if (!player || !points) return;
    scores[player] = (scores[player] || 0) + points;
    renderBadge();
    flashPoints(player, points);
  }

  function getScores() {
    return Object.entries(scores)
      .map(([player, points]) => ({ player, points }))
      .sort((a, b) => b.points - a.points);
  }

  function reset() {
    scores = {};
    renderBadge();
  }

  // Garante que jogadores novos aparecem no placar com 0 pontos
  function ensurePlayers(playerNames) {
    (playerNames || []).forEach(p => {
      if (!(p in scores)) scores[p] = 0;
    });
    renderBadge();
  }

  // Remove a pontuação de um jogador que saiu da sessão, para não
  // continuar a contar para "Pontos totais" nem aparecer como líder
  function removePlayer(name) {
    delete scores[name];
    renderBadge();
  }

  function renderBadge() {
    const label = document.getElementById('leaderboard-label');
    if (!label) return;
    const top = getScores().find(s => s.points > 0);
    label.textContent = top ? `🏆 ${top.player}` : '🏆 Placar';
  }

  function flashPoints(player, points) {
    const toast = document.createElement('div');
    toast.className = 'points-toast';
    toast.textContent = `+${points} ${player}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 1700);
  }

  function buildPanel(target) {
    const scoresList = getScores();

    target.innerHTML = `
      <div class="game-screen">
        <h2>🏆 Placar</h2>
        ${scoresList.length === 0
          ? '<p class="mini-note" style="margin-top:1rem;">Ainda ninguém pontuou. Joga uma ronda de um jogo com pontos (ex: Blitz ou Teste de Reação)!</p>'
          : `<div class="option-list" style="margin-top:1rem;">
              ${scoresList.map((s, i) => `
                <div class="option-row">
                  <span style="flex:1; padding:0.5rem; background:#0F1017; border-radius:6px;">
                    ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} ${escapeHtml(s.player)}
                  </span>
                  <span style="padding:0.5rem; font-weight:bold; color:#2ed573;">${s.points} pts</span>
                </div>
              `).join('')}
            </div>`
        }
        <button class="game-btn secondary" id="reset-leaderboard">Reiniciar Placar</button>
      </div>
    `;

    target.querySelector('#reset-leaderboard').addEventListener('click', () => {
      if (confirm('Reiniciar o placar de todos os jogadores?')) {
        reset();
        buildPanel(target);
      }
    });
  }

  return { addPoints, getScores, reset, ensurePlayers, removePlayer, renderPanelInto: buildPanel };
})();
