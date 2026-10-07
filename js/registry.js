const GameRegistry = (() => {
  function adapt(mod) {
    if (!mod) return null;

    if (typeof mod.mount === 'function') {
      return {
        legacy: false,
        mount: (container, ctx) => mod.mount(container, ctx),
        unmount: () => {
          if (typeof mod.unmount === 'function') mod.unmount();
        }
      };
    }

    if (typeof mod.render === 'function') {
      return {
        legacy: true,
        mount: container => mod.render(container),
        unmount: () => {
          if (typeof mod.cleanup === 'function') mod.cleanup();
        }
      };
    }

    return null;
  }

  function resolve(gameId) {
    return adapt(window.GameModules && window.GameModules[gameId]);
  }

  function createContext(gameId, close) {
    return Object.freeze({
      gameId,
      close,
      players: Object.freeze({
        getAll: Players.getAll,
        count: Players.count,
        getRandom: Players.getRandom,
        getRandomMany: Players.getRandomMany
      }),
      scoring: Object.freeze({
        award: (name, points) => Store.addPoints(name, points),
        scores: () => Store.getScores()
      }),
      utils: Object.freeze({ escapeHtml, createShuffleBag, shuffle })
    });
  }

  function audit() {
    const modules = window.GameModules || {};
    const ids = GAMES_DATA.map(g => g.id);

    ids.forEach(id => {
      if (!resolve(id)) console.warn(`[GameRegistry] "${id}" está no catálogo mas não tem módulo válido.`);
    });

    Object.keys(modules).forEach(id => {
      if (!ids.includes(id)) console.warn(`[GameRegistry] o módulo "${id}" não está no catálogo (data.js).`);
    });

    const legacy = ids.filter(id => {
      const mod = resolve(id);
      return mod && mod.legacy;
    });
    if (legacy.length) {
      console.info(`[GameRegistry] módulos ainda no formato antigo (render/cleanup): ${legacy.join(', ')}`);
    }
  }

  return { resolve, createContext, audit };
})();
