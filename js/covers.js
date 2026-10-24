// ============================================================
// covers.js — Arte vetorial (SVG) de cada jogo
// Desenhada com stroke="currentColor": a cor vem do CSS
// (--card-color), por isso a mesma arte serve qualquer tema.
// ============================================================

const GameCovers = (() => {
  const open = '<svg viewBox="0 0 320 140" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" role="presentation" focusable="false">';
  const label = (x, y, size, text, extra = '') =>
    `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-weight="800" font-size="${size}" fill="currentColor" stroke="none" ${extra}>${text}</text>`;

  const covers = {
    provavel: open +
      '<circle cx="90" cy="68" r="16"/><path d="M62 118c0-16 12-26 28-26s28 10 28 26"/>' +
      '<circle cx="230" cy="68" r="16"/><path d="M202 118c0-16 12-26 28-26s28 10 28 26"/>' +
      '<circle cx="160" cy="62" r="20" fill="currentColor" fill-opacity=".25"/><path d="M128 122c0-18 14-30 32-30s32 12 32 30"/>' +
      '<circle cx="160" cy="62" r="32" stroke-dasharray="4 9"/>' +
      label(160, 28, 30, '?') + '</svg>',

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
      label(96, 76, 44, 'V') + label(224, 96, 44, 'D') + '</svg>',

    blitz: open +
      '<circle cx="160" cy="70" r="58" stroke-dasharray="12 9" stroke-opacity=".7"/>' +
      '<path d="M178 14L112 82h40l-10 44 66-70h-42z" fill="currentColor" fill-opacity=".9"/></svg>',

    reacao: open +
      '<circle cx="160" cy="70" r="58" stroke-opacity=".35"/><circle cx="160" cy="70" r="38" stroke-opacity=".65"/><circle cx="160" cy="70" r="18"/>' +
      '<circle cx="160" cy="70" r="6" fill="currentColor"/>' +
      '<path d="M160 4v26M160 110v26M94 70h26M200 70h26" stroke-width="3"/></svg>',

    categorias: open +
      label(94, 110, 100, 'A') +
      '<path d="M178 36h96M178 62h72M178 88h96M178 114h56" stroke-width="5"/>' +
      '<rect x="162" y="29" width="8" height="8" fill="currentColor" stroke="none"/><rect x="162" y="55" width="8" height="8" fill="currentColor" stroke="none"/><rect x="162" y="81" width="8" height="8" fill="currentColor" stroke="none"/><rect x="162" y="107" width="8" height="8" fill="currentColor" stroke="none"/></svg>',

    mimica: open +
      '<circle cx="120" cy="64" r="38"/><path d="M104 54q7-8 14 0M132 54q7-8 14 0M104 78q16 18 32 0"/>' +
      '<circle cx="204" cy="78" r="36" fill="currentColor" fill-opacity=".22"/><path d="M190 70q7 8 14 0M214 70q7 8 14 0M190 100q14-14 28 0"/></svg>',

    'palavra-proibida': open +
      label(160, 88, 42, 'ABC', 'fill-opacity=".55"') +
      '<circle cx="160" cy="70" r="52" stroke-width="7"/><path d="M123 107L197 33" stroke-width="7"/></svg>',

    'eu-nunca': open +
      '<rect x="96" y="22" width="128" height="96" rx="18"/>' +
      '<path d="M128 56q8-10 16 0M176 56q8-10 16 0"/>' +
      '<path d="M136 90h48" stroke-width="6"/>' +
      '<path d="M60 40l-18-10M60 70H38M60 100l-18 10M260 40l18-10M260 70h22M260 100l18 10" stroke-opacity=".6"/>' +
      label(160, 136, 18, 'EU NUNCA…', 'letter-spacing="3"') + '</svg>',

    'batata-quente': open +
      '<circle cx="150" cy="80" r="46" fill="currentColor" fill-opacity=".2"/>' +
      '<path d="M182 46q14-16 30-12"/>' +
      '<path d="M218 26l6-10M226 36l12-2M214 40l-2 12" stroke-width="3"/>' +
      '<circle cx="134" cy="66" r="8" fill="currentColor" stroke="none" fill-opacity=".6"/>' +
      '<path d="M70 120q20-10 40 0M210 120q20-10 40 0" stroke-opacity=".5"/></svg>',

    'mais-ou-menos': open +
      '<rect x="78" y="22" width="70" height="98" rx="10" transform="rotate(-10 113 71)"/>' +
      '<rect x="160" y="22" width="70" height="98" rx="10" fill="currentColor" fill-opacity=".22" transform="rotate(8 195 71)"/>' +
      label(112, 86, 44, 'A') + label(196, 86, 44, '?') +
      '<path d="M268 52l12-14 12 14M268 92l12 14 12-14" stroke-width="5"/></svg>',

    desenha: open +
      '<rect x="58" y="20" width="160" height="104" rx="12"/>' +
      '<path d="M80 100q20-50 40-20t40-30 30 20" stroke-width="5"/>' +
      '<path d="M228 112l46-70 14 9-46 70-18 8z" fill="currentColor" fill-opacity=".25"/>' +
      '<path d="M266 54l14 9"/></svg>',

    cronometro: open +
      '<circle cx="160" cy="78" r="50"/><path d="M150 18h20M160 18v10M200 38l10-10"/>' +
      '<path d="M160 78V48" stroke-width="5"/><path d="M160 78l22 14" stroke-width="5"/>' +
      '<circle cx="160" cy="78" r="5" fill="currentColor"/>' +
      label(70, 92, 34, '10') + label(250, 92, 34, '00', 'fill-opacity=".5"') + '</svg>',

    quiz: open +
      '<path d="M122 52a38 38 0 1 1 52 36c-8 4-14 10-14 20v6"/>' +
      '<circle cx="160" cy="130" r="5" fill="currentColor" stroke="none"/>' +
      '<rect x="40" y="40" width="40" height="28" rx="8" stroke-opacity=".6"/><rect x="240" y="40" width="40" height="28" rx="8" stroke-opacity=".6"/>' +
      '<rect x="40" y="82" width="40" height="28" rx="8" stroke-opacity=".6"/><rect x="240" y="82" width="40" height="28" rx="8" fill="currentColor" fill-opacity=".35"/></svg>',

    sorteador: open +
      '<rect x="80" y="40" width="64" height="64" rx="12" transform="rotate(-14 112 72)"/>' +
      '<rect x="176" y="36" width="64" height="64" rx="12" fill="currentColor" fill-opacity=".2" transform="rotate(12 208 68)"/>' +
      '<circle cx="100" cy="62" r="5" fill="currentColor" stroke="none"/><circle cx="124" cy="82" r="5" fill="currentColor" stroke="none"/>' +
      '<circle cx="196" cy="52" r="5" fill="currentColor" stroke="none"/><circle cx="208" cy="68" r="5" fill="currentColor" stroke="none"/><circle cx="220" cy="84" r="5" fill="currentColor" stroke="none"/></svg>',

    // ---------- Festa ----------
    prefiro: open +
      '<path d="M160 20v100M110 120h100M100 40h120"/><path d="M100 40l-22 44h44zM220 40l-22 44h44z" fill="currentColor" fill-opacity=".2"/>' +
      label(100, 76, 22, 'A') + label(220, 76, 22, 'B') + '</svg>',

    conversa: open +
      '<rect x="60" y="24" width="120" height="66" rx="18"/><path d="M90 90l-8 20 26-20"/>' +
      '<rect x="150" y="56" width="110" height="60" rx="18" fill="currentColor" fill-opacity=".22"/><path d="M230 116l10 16-26-16"/>' +
      '<path d="M86 50h68M86 66h44M176 80h60M176 94h36" stroke-width="3"/></svg>',

    'cadeira-quente': open +
      '<path d="M120 24v60h80V24M112 84h96M124 84v42M196 84v42M120 54h80"/>' +
      '<path d="M150 118q-14-18 2-30 2 12 10 12 4-14-4-26 26 12 18 44" fill="currentColor" fill-opacity=".35"/></svg>',

    adivinhas: open +
      '<path d="M110 30h40v20a12 12 0 1 0 0 24v20h-40v-20a12 12 0 1 1 0-24z" fill="currentColor" fill-opacity=".22"/>' +
      '<path d="M150 30h40v20a12 12 0 1 1 0 24v20h-40"/>' + label(250, 100, 60, '?') + '</svg>',

    historia: open +
      '<path d="M60 30q50-12 100 6v90q-50-18-100-6zM260 30q-50-12-100 6v90q50-18 100-6z"/>' +
      '<path d="M80 54h60M80 74h60M80 94h40M180 54h60M180 74h60" stroke-width="3" stroke-opacity=".7"/></svg>',

    debate: open +
      '<rect x="146" y="14" width="28" height="48" rx="14" fill="currentColor" fill-opacity=".25"/><path d="M134 50a26 26 0 0 0 52 0M160 76v24M140 100h40"/>' +
      label(70, 92, 44, 'SIM') + label(250, 92, 44, 'NÃO', 'fill-opacity=".5"') + '</svg>',

    'desafios-30': open +
      '<circle cx="160" cy="76" r="50"/><path d="M160 76l-26-26" stroke-width="5"/><path d="M146 16h28M160 16v10"/>' +
      label(160, 92, 34, '30', 'fill-opacity=".85"') + '</svg>',

    'completa-frase': open +
      label(130, 84, 40, 'A…', 'fill-opacity=".6"') +
      '<path d="M178 92h70" stroke-dasharray="6 8"/><path d="M226 40l30 30-44 44-36 8 8-36z" fill="currentColor" fill-opacity=".25"/></svg>',

    'duas-verdades': open +
      '<rect x="40" y="36" width="70" height="70" rx="14"/><rect x="125" y="36" width="70" height="70" rx="14"/><rect x="210" y="36" width="70" height="70" rx="14" fill="currentColor" fill-opacity=".25"/>' +
      '<path d="M60 72l10 10 20-22M145 72l10 10 20-22M232 52l26 36M258 52l-26 36" stroke-width="5"/></svg>',

    imitacoes: open +
      '<path d="M90 40q40-20 80 0v40q-40 30-80 0z" fill="currentColor" fill-opacity=".22"/><path d="M110 58h10M140 58h10M114 80q16 10 32 0"/>' +
      '<path d="M190 60q40-20 70 0v34q-35 26-70 0z"/><path d="M206 74h10M234 74h10M210 98q16-10 32 0"/></svg>',

    'quem-sou-eu': open +
      '<circle cx="160" cy="84" r="34"/><path d="M110 132c0-20 22-30 50-30s50 10 50 30"/>' +
      '<rect x="126" y="12" width="68" height="40" rx="8" fill="currentColor" fill-opacity=".3"/>' + label(160, 44, 30, '?') + '</svg>',

    cantarola: open +
      '<path d="M120 106V36l90-16v70"/><circle cx="104" cy="106" r="16" fill="currentColor" fill-opacity=".35"/><circle cx="194" cy="90" r="16" fill="currentColor" fill-opacity=".35"/>' +
      '<path d="M240 40q14 14 0 28M256 30q24 24 0 48" stroke-opacity=".6"/></svg>',

    'tres-palavras': open +
      '<rect x="40" y="46" width="70" height="44" rx="10"/><rect x="125" y="46" width="70" height="44" rx="10"/><rect x="210" y="46" width="70" height="44" rx="10"/>' +
      label(75, 78, 26, '1') + label(160, 78, 26, '2') + label(245, 78, 26, '3') + '</svg>',

    // ---------- Quizzes ----------
    'quiz-geografia': open +
      '<circle cx="160" cy="70" r="54"/><path d="M106 70h108M160 16c-30 30-30 78 0 108M160 16c30 30 30 78 0 108" stroke-width="3"/>' +
      '<path d="M128 44q14 10 30 2t24 12-10 26-26 18" fill="currentColor" fill-opacity=".3" stroke="none"/></svg>',

    'quiz-capitais': open +
      '<path d="M100 48l60-30 60 30zM104 48h112M112 116h96M100 126h120"/><path d="M122 56v56M146 56v56M174 56v56M198 56v56" stroke-width="6"/></svg>',

    'quiz-cinema': open +
      '<rect x="80" y="50" width="160" height="72" rx="8"/><path d="M80 50l150-34 6 24L86 74" fill="currentColor" fill-opacity=".25"/>' +
      '<path d="M120 42l12 20M160 32l12 20M200 24l12 20" stroke-width="3"/></svg>',

    'quiz-musica': open +
      '<path d="M120 112c-30 0-34-40-6-46l36-8 70-40 10 14-62 44 4 30c4 20-20 30-36 18" fill="currentColor" fill-opacity=".2"/>' +
      '<circle cx="128" cy="96" r="10"/><path d="M196 34l18 26"/></svg>',

    'quiz-desporto': open +
      '<circle cx="160" cy="70" r="54"/><path d="M160 46l22 16-8 26h-28l-8-26z" fill="currentColor" fill-opacity=".5"/>' +
      '<path d="M160 46V18M182 62l26-10M174 88l16 22M146 88l-16 22M138 62l-26-10" stroke-width="3"/></svg>',

    'emoji-filmes': open +
      '<circle cx="110" cy="70" r="40"/><circle cx="96" cy="60" r="5" fill="currentColor"/><circle cx="124" cy="60" r="5" fill="currentColor"/><path d="M92 82q18 16 36 0"/>' +
      '<path d="M190 40h70l-8 84h-54z" fill="currentColor" fill-opacity=".25"/><path d="M190 40q8-16 18-4 10-16 22 0 12-14 22 4"/></svg>',

    'verdadeiro-falso': open +
      '<circle cx="100" cy="70" r="44" fill="currentColor" fill-opacity=".2"/><path d="M78 72l16 16 30-34" stroke-width="7"/>' +
      '<circle cx="220" cy="70" r="44"/><path d="M200 50l40 40M240 50l-40 40" stroke-width="7"/></svg>',

    matematica: open +
      label(90, 90, 64, '7×8') + '<path d="M196 70h30M196 82h30" stroke-width="6"/>' + label(266, 94, 56, '?', 'fill-opacity=".5"') + '</svg>',

    // ---------- Tabuleiro, duelos e desafios ----------
    'jogo-do-galo': open +
      '<path d="M130 20v100M190 20v100M100 50h120M100 90h120"/>' +
      '<path d="M108 28l14 14M122 28l-14 14M168 100l14 14M182 100l-14 14" stroke-width="5"/>' +
      '<circle cx="160" cy="70" r="11" stroke-width="5"/><circle cx="205" cy="35" r="10" stroke-width="5"/></svg>',

    'quatro-em-linha': open +
      '<rect x="80" y="20" width="160" height="110" rx="12"/>' +
      [0, 1, 2, 3].map(r => [0, 1, 2, 3, 4].map(c => `<circle cx="${104 + c * 28}" cy="${42 + r * 26}" r="9" ${(r === 3 - c + 1 && c < 4) || (r === 3 && c < 2) ? 'fill="currentColor"' : 'stroke-opacity=".4"'}/>`).join('')).join('') + '</svg>',

    memoria: open +
      '<rect x="60" y="30" width="56" height="80" rx="10" fill="currentColor" fill-opacity=".25"/><rect x="132" y="30" width="56" height="80" rx="10"/><rect x="204" y="30" width="56" height="80" rx="10" fill="currentColor" fill-opacity=".25"/>' +
      label(88, 82, 34, '★') + label(160, 82, 34, '?', 'fill-opacity=".4"') + label(232, 82, 34, '★') + '</svg>',

    'toque-rapido': open +
      '<circle cx="160" cy="70" r="30" fill="currentColor" fill-opacity=".3"/><circle cx="160" cy="70" r="46" stroke-opacity=".5"/><circle cx="160" cy="70" r="62" stroke-opacity=".25"/>' +
      '<path d="M160 70l26 50M186 120l-14 4" stroke-width="5"/></svg>',

    simon: open +
      '<path d="M156 66V20a46 46 0 0 0-46 46z" fill="currentColor" fill-opacity=".8"/><path d="M164 66V20a46 46 0 0 1 46 46z" fill="currentColor" fill-opacity=".3"/>' +
      '<path d="M156 74v46a46 46 0 0 1-46-46z" fill="currentColor" fill-opacity=".3"/><path d="M164 74v46a46 46 0 0 0 46-46z" fill="currentColor" fill-opacity=".55"/></svg>',

    forca: open +
      '<path d="M90 126h80M110 126V16h70v18"/><circle cx="180" cy="46" r="12"/><path d="M180 58v34M180 68l-16 14M180 68l16 14M180 92l-12 22M180 92l12 22"/>' +
      '<path d="M220 112h16M244 112h16M268 112h16" stroke-width="5"/></svg>',

    'dados-sorte': open +
      '<rect x="80" y="36" width="70" height="70" rx="14" transform="rotate(-12 115 71)"/>' +
      '<rect x="170" y="36" width="70" height="70" rx="14" fill="currentColor" fill-opacity=".2" transform="rotate(10 205 71)"/>' +
      '<circle cx="104" cy="58" r="6" fill="currentColor" stroke="none"/><circle cx="126" cy="84" r="6" fill="currentColor" stroke="none"/>' +
      '<circle cx="192" cy="56" r="6" fill="currentColor" stroke="none"/><circle cx="218" cy="56" r="6" fill="currentColor" stroke="none"/><circle cx="192" cy="86" r="6" fill="currentColor" stroke="none"/><circle cx="218" cy="86" r="6" fill="currentColor" stroke="none"/></svg>',

    'pedra-papel-tesoura': open +
      '<circle cx="80" cy="76" r="30" fill="currentColor" fill-opacity=".25"/>' +
      '<rect x="135" y="40" width="50" height="66" rx="6"/><path d="M147 58h26M147 72h26M147 86h16" stroke-width="3"/>' +
      '<circle cx="226" cy="98" r="12"/><circle cx="256" cy="98" r="12"/><path d="M232 88l26-56M250 88l-26-56"/></svg>',

    'duelo-reflexos': open +
      '<rect x="40" y="24" width="112" height="96" rx="14"/><rect x="168" y="24" width="112" height="96" rx="14" fill="currentColor" fill-opacity=".3"/>' +
      '<path d="M224 40l-18 34h20l-14 30 30-40h-20l12-24z" fill="currentColor"/>' + label(96, 86, 40, '1') + '</svg>',

    'palavra-encadeada': open +
      '<rect x="40" y="52" width="80" height="40" rx="20"/><rect x="120" y="52" width="80" height="40" rx="20" fill="currentColor" fill-opacity=".25"/><rect x="200" y="52" width="80" height="40" rx="20"/>' +
      label(80, 80, 20, 'CASA') + label(160, 80, 20, 'AVIÃO') + label(240, 80, 20, 'OVO') + '</svg>',

    anagramas: open +
      ['R', 'A', 'P', 'I', 'A'].map((l, i) => `<rect x="${48 + i * 46}" y="${44 + (i % 2) * 14}" width="38" height="44" rx="8" ${i === 2 ? 'fill="currentColor" fill-opacity=".25"' : ''}/>` + label(67 + i * 46, 76 + (i % 2) * 14, 28, l)).join('') + '</svg>',

    garrafa: open +
      '<circle cx="160" cy="70" r="60" stroke-dasharray="6 10" stroke-opacity=".6"/>' +
      '<path d="M128 102l40-40 6-16 10-4 4 4-4 10-16 6-40 40z" fill="currentColor" fill-opacity=".35"/>' +
      '<circle cx="160" cy="10" r="6" fill="currentColor"/><circle cx="220" cy="70" r="6" fill="currentColor"/><circle cx="100" cy="70" r="6" fill="currentColor"/><circle cx="160" cy="130" r="6" fill="currentColor"/></svg>',

    'moeda-dados': open +
      '<ellipse cx="116" cy="70" rx="44" ry="44" fill="currentColor" fill-opacity=".25"/><ellipse cx="116" cy="70" rx="30" ry="30"/>' +
      '<rect x="182" y="40" width="64" height="64" rx="12"/><circle cx="200" cy="58" r="5" fill="currentColor" stroke="none"/><circle cx="214" cy="72" r="5" fill="currentColor" stroke="none"/><circle cx="228" cy="86" r="5" fill="currentColor" stroke="none"/></svg>'
  };

  function get(gameId, fallback) {
    return covers[gameId] || `<span class="cover-fallback">${fallback || ''}</span>`;
  }

  return { get };
})();
