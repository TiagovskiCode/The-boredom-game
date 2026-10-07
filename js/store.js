function createStore({ storage = null, key = 'partyhub_state_v1', now = Date.now } = {}) {
  const VERSION = 1;
  const MAX_NAME = 24;
  const MAX_PLAYS = 200;
  const listeners = new Set();

  const sameName = (a, b) => a.toLowerCase() === b.toLowerCase();
  const cleanName = raw => String(raw ?? '').trim().slice(0, MAX_NAME);

  function emptyState() {
    return {
      players: [],
      scores: new Map(),
      session: { startedAt: now(), plays: [] }
    };
  }

  function sanitize(raw) {
    const next = emptyState();
    if (!raw || typeof raw !== 'object' || raw.version !== VERSION) return next;

    if (Array.isArray(raw.players)) {
      raw.players.forEach(p => {
        const name = typeof p === 'string' ? cleanName(p) : '';
        if (name && !next.players.some(x => sameName(x, name))) next.players.push(name);
      });
    }

    next.players.forEach(p => next.scores.set(p, 0));
    if (Array.isArray(raw.scores)) {
      raw.scores.forEach(entry => {
        if (!Array.isArray(entry)) return;
        const [name, points] = entry;
        if (next.scores.has(name) && Number.isFinite(points)) next.scores.set(name, points);
      });
    }

    const session = raw.session;
    if (session && typeof session === 'object') {
      if (Number.isFinite(session.startedAt)) next.session.startedAt = session.startedAt;
      if (Array.isArray(session.plays)) {
        next.session.plays = session.plays
          .filter(p => p && typeof p.gameId === 'string' && Number.isFinite(p.at))
          .slice(-MAX_PLAYS)
          .map(p => ({ gameId: p.gameId, at: p.at }));
      }
    }

    return next;
  }

  function load() {
    if (!storage) return emptyState();
    try {
      const raw = storage.getItem(key);
      return raw ? sanitize(JSON.parse(raw)) : emptyState();
    } catch (e) {
      return emptyState();
    }
  }

  let state = load();

  function persist() {
    if (!storage) return;
    try {
      storage.setItem(key, JSON.stringify({
        version: VERSION,
        players: state.players,
        scores: [...state.scores],
        session: state.session
      }));
    } catch (e) {}
  }

  function computeScores() {
    const names = new Set([...state.players, ...state.scores.keys()]);
    return [...names]
      .map(player => ({ player, points: state.scores.get(player) || 0 }))
      .sort((a, b) => b.points - a.points);
  }

  function snapshot() {
    return {
      players: [...state.players],
      scores: computeScores(),
      session: {
        startedAt: state.session.startedAt,
        plays: state.session.plays.map(p => ({ ...p }))
      }
    };
  }

  function emit(action, detail) {
    const snap = snapshot();
    listeners.forEach(fn => {
      try {
        fn(snap, action, detail);
      } catch (e) {
        console.error(e);
      }
    });
  }

  function changed(action, detail) {
    persist();
    emit(action, detail);
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function addPlayer(raw) {
    const name = cleanName(raw);
    if (!name || state.players.some(p => sameName(p, name))) return false;
    state.players.push(name);
    state.scores.set(name, 0);
    changed('players:add', { player: name });
    return true;
  }

  function removePlayer(name) {
    const index = state.players.indexOf(name);
    if (index === -1) return false;
    state.players.splice(index, 1);
    state.scores.delete(name);
    changed('players:remove', { player: name });
    return true;
  }

  function addPoints(player, points) {
    if (!player || !Number.isFinite(points) || points === 0) return false;
    state.scores.set(player, (state.scores.get(player) || 0) + points);
    changed('scores:add', { player, points });
    return true;
  }

  function resetScores() {
    state.scores = new Map(state.players.map(p => [p, 0]));
    changed('scores:reset');
  }

  function recordPlay(gameId) {
    state.session.plays.push({ gameId, at: now() });
    if (state.session.plays.length > MAX_PLAYS) {
      state.session.plays = state.session.plays.slice(-MAX_PLAYS);
    }
    changed('session:play', { gameId });
  }

  function newSession({ keepPlayers = true } = {}) {
    const keep = keepPlayers ? [...state.players] : [];
    state = emptyState();
    keep.forEach(p => {
      state.players.push(p);
      state.scores.set(p, 0);
    });
    changed('session:new');
  }

  function reload() {
    state = load();
    emit('sync');
  }

  return {
    key,
    subscribe,
    getState: snapshot,
    getPlayers: () => [...state.players],
    getScores: computeScores,
    getSession: () => snapshot().session,
    addPlayer,
    removePlayer,
    addPoints,
    resetScores,
    recordPlay,
    newSession,
    reload
  };
}

function getSafeStorage() {
  try {
    const storage = window.localStorage;
    const probe = '__partyhub_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch (e) {
    return null;
  }
}

const Store = typeof window !== 'undefined' ? createStore({ storage: getSafeStorage() }) : null;

if (Store) {
  window.addEventListener('storage', e => {
    if (e.key === null || e.key === Store.key) Store.reload();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createStore };
}
