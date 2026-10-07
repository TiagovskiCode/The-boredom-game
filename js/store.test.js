const test = require('node:test');
const assert = require('node:assert/strict');
const { createStore } = require('../js/store.js');

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: k => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)); },
    removeItem: k => { data.delete(k); },
    raw: k => data.get(k)
  };
}

function build(initial) {
  const storage = memoryStorage(initial);
  return { storage, store: createStore({ storage, now: () => 1000 }) };
}

test('adiciona jogadores com trim e sem duplicados (ignora maiúsculas)', () => {
  const { store } = build();
  assert.equal(store.addPlayer('  Ana '), true);
  assert.equal(store.addPlayer('ana'), false);
  assert.equal(store.addPlayer('   '), false);
  assert.equal(store.addPlayer(undefined), false);
  assert.deepEqual(store.getPlayers(), ['Ana']);
});

test('corta nomes acima de 24 caracteres', () => {
  const { store } = build();
  store.addPlayer('x'.repeat(40));
  assert.equal(store.getPlayers()[0].length, 24);
});

test('nomes como constructor e __proto__ não corrompem as pontuações', () => {
  const { store } = build();
  store.addPlayer('constructor');
  store.addPlayer('__proto__');
  store.addPoints('constructor', 30);
  store.addPoints('__proto__', 10);
  assert.deepEqual(store.getScores(), [
    { player: 'constructor', points: 30 },
    { player: '__proto__', points: 10 }
  ]);
});

test('novos jogadores aparecem no placar com 0 pontos', () => {
  const { store } = build();
  store.addPlayer('Ana');
  store.addPlayer('Rui');
  assert.deepEqual(store.getScores(), [
    { player: 'Ana', points: 0 },
    { player: 'Rui', points: 0 }
  ]);
});

test('addPoints soma, ordena por pontos e ignora 0, NaN e nome vazio', () => {
  const { store } = build();
  store.addPlayer('Ana');
  store.addPlayer('Rui');
  assert.equal(store.addPoints('Rui', 30), true);
  assert.equal(store.addPoints('Ana', 10), true);
  assert.equal(store.addPoints('Ana', 10), true);
  assert.equal(store.addPoints('Ana', 0), false);
  assert.equal(store.addPoints('Ana', NaN), false);
  assert.equal(store.addPoints('', 5), false);
  assert.deepEqual(store.getScores(), [
    { player: 'Rui', points: 30 },
    { player: 'Ana', points: 20 }
  ]);
});

test('remover jogador apaga também a pontuação', () => {
  const { store } = build();
  store.addPlayer('Ana');
  store.addPoints('Ana', 30);
  assert.equal(store.removePlayer('Ana'), true);
  assert.equal(store.removePlayer('Ana'), false);
  assert.deepEqual(store.getScores(), []);
});

test('resetScores mantém jogadores a zero', () => {
  const { store } = build();
  store.addPlayer('Ana');
  store.addPlayer('Rui');
  store.addPoints('Ana', 30);
  store.resetScores();
  assert.deepEqual(store.getScores(), [
    { player: 'Ana', points: 0 },
    { player: 'Rui', points: 0 }
  ]);
});

test('persiste e recupera o estado', () => {
  const { storage, store } = build();
  store.addPlayer('Ana');
  store.addPlayer('Rui');
  store.addPoints('Rui', 30);
  store.recordPlay('categorias');

  const reopened = createStore({ storage, now: () => 2000 });
  assert.deepEqual(reopened.getPlayers(), ['Ana', 'Rui']);
  assert.deepEqual(reopened.getScores(), [
    { player: 'Rui', points: 30 },
    { player: 'Ana', points: 0 }
  ]);
  assert.deepEqual(reopened.getSession().plays, [{ gameId: 'categorias', at: 1000 }]);
});

test('dados corrompidos ou de outra versão devolvem estado vazio', () => {
  const bad = ['{nao e json', 'null', '[]', JSON.stringify({ version: 99, players: ['Ana'] })];
  bad.forEach(raw => {
    const { store } = build({ partyhub_state_v1: raw });
    assert.deepEqual(store.getPlayers(), []);
  });
});

test('sanitiza dados inválidos dentro de uma versão válida', () => {
  const raw = JSON.stringify({
    version: 1,
    players: ['Ana', 'ana', 5, '', 'Rui'],
    scores: [['Ana', 10], ['Rui', 'muito'], ['Fantasma', 99], 'lixo'],
    session: { startedAt: 'ontem', plays: [{ gameId: 'blitz', at: 5 }, { gameId: 7, at: 1 }, null] }
  });
  const { store } = build({ partyhub_state_v1: raw });
  assert.deepEqual(store.getPlayers(), ['Ana', 'Rui']);
  assert.deepEqual(store.getScores(), [
    { player: 'Ana', points: 10 },
    { player: 'Rui', points: 0 }
  ]);
  assert.deepEqual(store.getSession().plays, [{ gameId: 'blitz', at: 5 }]);
  assert.equal(store.getSession().startedAt, 1000);
});

test('funciona sem storage (modo privado)', () => {
  const store = createStore({ storage: null });
  store.addPlayer('Ana');
  store.addPoints('Ana', 5);
  assert.deepEqual(store.getScores(), [{ player: 'Ana', points: 5 }]);
});

test('storage que lança erro não parte as ações', () => {
  const broken = {
    getItem: () => { throw new Error('bloqueado'); },
    setItem: () => { throw new Error('quota'); }
  };
  const store = createStore({ storage: broken });
  assert.equal(store.addPlayer('Ana'), true);
  assert.deepEqual(store.getPlayers(), ['Ana']);
});

test('subscribe notifica com ação e detalhe, e unsubscribe pára', () => {
  const { store } = build();
  const calls = [];
  const off = store.subscribe((snap, action, detail) => calls.push([action, detail]));
  store.addPlayer('Ana');
  store.addPoints('Ana', 30);
  off();
  store.addPlayer('Rui');
  assert.deepEqual(calls, [
    ['players:add', { player: 'Ana' }],
    ['scores:add', { player: 'Ana', points: 30 }]
  ]);
});

test('um listener que falha não impede os outros', () => {
  const { store } = build();
  const originalError = console.error;
  console.error = () => {};
  let reached = false;
  store.subscribe(() => { throw new Error('boom'); });
  store.subscribe(() => { reached = true; });
  store.addPlayer('Ana');
  console.error = originalError;
  assert.equal(reached, true);
});

test('ações sem efeito não emitem eventos nem escrevem', () => {
  const { storage, store } = build();
  store.addPlayer('Ana');
  const before = storage.raw('partyhub_state_v1');
  let emitted = 0;
  store.subscribe(() => emitted++);
  store.addPlayer('ana');
  store.removePlayer('Rui');
  store.addPoints('Ana', 0);
  assert.equal(emitted, 0);
  assert.equal(storage.raw('partyhub_state_v1'), before);
});

test('reload lê o que outra aba escreveu e emite sync', () => {
  const { storage, store } = build();
  const other = createStore({ storage, now: () => 1000 });
  other.addPlayer('Ana');
  other.addPoints('Ana', 30);

  const actions = [];
  store.subscribe((snap, action) => actions.push(action));
  store.reload();

  assert.deepEqual(actions, ['sync']);
  assert.deepEqual(store.getScores(), [{ player: 'Ana', points: 30 }]);
});

test('newSession limpa pontos e jogadas mas pode manter jogadores', () => {
  const { store } = build();
  store.addPlayer('Ana');
  store.addPoints('Ana', 30);
  store.recordPlay('blitz');
  store.newSession();
  assert.deepEqual(store.getPlayers(), ['Ana']);
  assert.deepEqual(store.getScores(), [{ player: 'Ana', points: 0 }]);
  assert.deepEqual(store.getSession().plays, []);
  store.newSession({ keepPlayers: false });
  assert.deepEqual(store.getPlayers(), []);
});

test('o histórico de jogadas tem tecto de 200', () => {
  const { store } = build();
  for (let i = 0; i < 230; i++) store.recordPlay(`g${i}`);
  const plays = store.getSession().plays;
  assert.equal(plays.length, 200);
  assert.equal(plays[0].gameId, 'g30');
});

test('o snapshot não deixa alterar o estado interno', () => {
  const { store } = build();
  store.addPlayer('Ana');
  const snap = store.getState();
  snap.players.push('Intruso');
  snap.scores.length = 0;
  assert.deepEqual(store.getPlayers(), ['Ana']);
  assert.equal(store.getScores().length, 1);
});
