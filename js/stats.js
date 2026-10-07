(function () {
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function render(snap) {
    const total = snap.scores.reduce((sum, s) => sum + s.points, 0);
    const top = snap.scores[0];

    setText('stat-players', snap.players.length);
    setText('stat-players-mini', snap.players.length);
    setText('stat-total-points', total);
    setText('stat-leader', top && top.points > 0 ? top.player : '—');
  }

  setText('stat-game-count', GAMES_DATA.length);
  render(Store.getState());
  Store.subscribe(render);
})();
