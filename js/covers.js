const GameCovers = (() => {
  const open = '<svg viewBox="0 0 320 140" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" role="presentation" focusable="false">';
  const label = (x, y, size, text, extra = '') =>
    `<text x="${x}" y="${y}" text-anchor="middle" font-family="Orbitron, sans-serif" font-weight="900" font-size="${size}" fill="currentColor" stroke="none" ${extra}>${text}</text>`;

  const covers = {
    provavel: open +
      '<circle cx="90" cy="68" r="16"/><path d="M62 118c0-16 12-26 28-26s28 10 28 26"/>' +
      '<circle cx="230" cy="68" r="16"/><path d="M202 118c0-16 12-26 28-26s28 10 28 26"/>' +
      '<circle cx="160" cy="62" r="20" fill="currentColor" fill-opacity=".25"/><path d="M128 122c0-18 14-30 32-30s32 12 32 30"/>' +
      '<circle cx="160" cy="62" r="32" stroke-dasharray="4 9"/>' +
      label(160, 26, 28, '?') + '</svg>',

    roleta: open +
      '<circle cx="160" cy="76" r="50"/><circle cx="160" cy="76" r="9" fill="currentColor"/>' +
      '<path d="M160 26v100M110 76h100M125 41l70 70M195 41l-70 70" stroke-width="3" stroke-opacity=".7"/>' +
      '<path d="M148 8l12 24 12-24z" fill="currentColor"/></svg>',

    impostor: open +
      '<rect x="62" y="40" width="44" height="76" rx="22"/><rect x="78" y="56" width="28" height="14" rx="7"/>' +
      '<rect x="214" y="40" width="44" height="76" rx="22"/><rect x="230" y="56" width="28" height="14" rx="7"/>' +
      '<rect x="134" y="26" width="52" height="92" rx="26" fill="currentColor" fill-opacity=".25"/>' +
      '<rect x="152" y="44" width="34" height="16" rx="8" fill="currentColor" stroke="none"/>' +
      '<path d="M134 96l52 0" stroke-dasharray="3 7"/></svg>',

    'verdade-desafio': open +
      '<rect x="40" y="26" width="112" height="68" rx="14"/><path d="M66 94l-8 20 28-20"/>' +
      '<rect x="168" y="46" width="112" height="68" rx="14" fill="currentColor" fill-opacity=".22"/><path d="M254 114l8 18-26-18"/>' +
      label(96, 76, 40, 'V') + label(224, 96, 40, 'D') + '</svg>',

    blitz: open +
      '<circle cx="160" cy="70" r="58" stroke-dasharray="12 9" stroke-opacity=".7"/>' +
      '<path d="M178 14L112 82h40l-10 44 66-70h-42z" fill="currentColor" fill-opacity=".9"/></svg>',

    reacao: open +
      '<circle cx="160" cy="70" r="58" stroke-opacity=".35"/><circle cx="160" cy="70" r="38" stroke-opacity=".65"/><circle cx="160" cy="70" r="18"/>' +
      '<circle cx="160" cy="70" r="6" fill="currentColor"/>' +
      '<path d="M160 4v26M160 110v26M94 70h26M200 70h26" stroke-width="3"/></svg>',

    categorias: open +
      label(94, 108, 92, 'A') +
      '<path d="M178 36h96M178 62h72M178 88h96M178 114h56" stroke-width="5"/>' +
      '<rect x="162" y="29" width="8" height="8" fill="currentColor" stroke="none"/><rect x="162" y="55" width="8" height="8" fill="currentColor" stroke="none"/><rect x="162" y="81" width="8" height="8" fill="currentColor" stroke="none"/><rect x="162" y="107" width="8" height="8" fill="currentColor" stroke="none"/></svg>',

    mimica: open +
      '<circle cx="120" cy="64" r="38"/><path d="M104 54q7-8 14 0M132 54q7-8 14 0M104 78q16 18 32 0"/>' +
      '<circle cx="204" cy="78" r="36" fill="currentColor" fill-opacity=".22"/><path d="M190 70q7 8 14 0M214 70q7 8 14 0M190 100q14-14 28 0"/></svg>',

    'palavra-proibida': open +
      label(160, 88, 38, 'ABC', 'fill-opacity=".55"') +
      '<circle cx="160" cy="70" r="52" stroke-width="7"/><path d="M123 107L197 33" stroke-width="7"/></svg>'
  };

  function get(gameId, fallback) {
    return covers[gameId] || `<span class="cover-fallback">${fallback || ''}</span>`;
  }

  return { get };
})();
