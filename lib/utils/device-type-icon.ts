/**
 * Maps NetAlertX `devType` strings (and similar labels) to compact glyphs for list tiles.
 * Order matters: more specific patterns must come before broader ones.
 */
const RULES: ReadonlyArray<{ match: (t: string) => boolean; glyph: string }> = [
  { match: (t) => /\b(router|gateway)\b/.test(t), glyph: '◈' },
  { match: (t) => /\bfirewall\b/.test(t), glyph: '◆' },
  { match: (t) => /\bswitch\b/.test(t), glyph: '▦' },
  {
    match: (t) =>
      t.includes('access point') ||
      t.includes('access-point') ||
      t === 'ap' ||
      /\bwi-?fi\s+(ap|router)\b/.test(t),
    glyph: '⊛',
  },
  { match: (t) => /\bmodem\b/.test(t), glyph: '▭' },
  { match: (t) => /\b(repeater|extender|mesh)\b/.test(t), glyph: '↻' },
  { match: (t) => /\b(server|nas)\b/.test(t), glyph: '▣' },
  { match: (t) => /\b(vm|container|docker|kubernetes)\b/.test(t), glyph: '◧' },
  { match: (t) => /\b(workstation|desktop|pc)\b/.test(t), glyph: '⎔' },
  { match: (t) => /\b(laptop|notebook|chromebook|macbook|surface)\b/.test(t), glyph: '◫' },
  { match: (t) => /\b(tablet|ipad)\b/.test(t), glyph: '▬' },
  {
    match: (t) =>
      /\b(phone|iphone|mobile|android)\b/.test(t) && !/\btablet\b/.test(t),
    glyph: '▯',
  },
  {
    match: (t) =>
      /\b(tv|television|chromecast|roku|shield|fire\s*tv|appletv|apple\s*tv)\b/.test(t),
    glyph: '▶',
  },
  { match: (t) => /\b(speaker|sonos|soundbar)\b/.test(t), glyph: '♫' },
  { match: (t) => /\b(media|stream|audio)\b/.test(t), glyph: '♪' },
  { match: (t) => /\b(camera|webcam|nvr)\b/.test(t), glyph: '⊙' },
  { match: (t) => /\bprinter\b/.test(t), glyph: '⎙' },
  { match: (t) => /\bscanner\b/.test(t), glyph: '⊔' },
  { match: (t) => /\b(headphone|earbud)\b/.test(t), glyph: '⌂' },
  { match: (t) => /\b(watch|wearable)\b/.test(t), glyph: '○' },
  {
    match: (t) =>
      /\b(console|playstation|xbox|nintendo|steam\s*deck)\b/.test(t) || /\bgaming\b/.test(t),
    glyph: '◇',
  },
  { match: (t) => /\bvacuum\b|roomba|robot\s+vacuum/.test(t), glyph: '▽' },
  { match: (t) => /\bthermostat\b/.test(t), glyph: '◐' },
  { match: (t) => /\b(hub|bridge)\b/.test(t), glyph: '⊕' },
  { match: (t) => /\b(plug|outlet)\b/.test(t), glyph: '⊗' },
  { match: (t) => /\b(light|bulb|lamp)\b/.test(t), glyph: '✶' },
  { match: (t) => /\block\b/.test(t), glyph: '◼' },
  { match: (t) => /\bdoorbell\b/.test(t), glyph: '◉' },
  { match: (t) => /\bdrone\b/.test(t), glyph: '✈' },
  { match: (t) => /\bnic\b|network\s+(interface|card)/.test(t), glyph: '⇄' },
  { match: (t) => /\biot\b|smart\s+device/.test(t), glyph: '◌' },
  { match: (t) => /\bnetwork(ing)?\b/.test(t), glyph: '≋' },
];

const DEFAULT_GLYPH = '●';

export function getDeviceTypeIconGlyph(deviceType?: string | null): string {
  const raw = deviceType?.trim();
  if (!raw) return DEFAULT_GLYPH;

  const t = raw.toLowerCase();
  for (const rule of RULES) {
    if (rule.match(t)) return rule.glyph;
  }
  return DEFAULT_GLYPH;
}
