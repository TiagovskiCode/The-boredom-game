const Leaderboard = (() => {
  const addPoints = (player, points) => { Store.addPoints(player, points); };
  const getScores = () => Store.getScores();
  const reset = () => Store.resetScores();
  const ensurePlayers = () => {};
  const removePlayer = () => {};

  const rankLabel = index => ['🥇', '🥈', '🥉'][index] || `${index + 1}.`;

  function renderBadge() {
    const label = document.getElementById('leaderboard-label');
    if (!label) return;
    const top = getScores().find(s => s.points > 0);
    label.textContent = top ? `🏆 ${top.player}` : '🏆 Placar';
  }

  function flashPoints(player, points) {
    const toast = document.createElement('div');
    toast.className = 'points-toast';
    toast.setAttribute('role', 'status');
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
          ? '<p class="mini-note">Ainda ninguém pontuou. Joga uma ronda de um jogo com pontos (ex: Blitz ou Teste de Reação)!</p>'
          : `<div class="option-list">
              ${scoresList.map((s, i) => `
                <div class="option-row">
                  <span class="row-label">${rankLabel(i)} ${escapeHtml(s.player)}</span>
                  <span class="row-points">${s.points} pts</span>
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

  Store.subscribe((snap, action, detail) => {
    renderBadge();
    if (action === 'scores:add') flashPoints(detail.player, detail.points);
  });

  renderBadge();

  return { addPoints, getScores, reset, ensurePlayers, removePlayer, renderPanelInto: buildPanel };
})();
