// Karty: jeden zbiór kart pojęć dla całej strony (src/karty/*.md), każda pod /wiki/<slug>/.
// Karta jest publiczna, gdy ma `stan: gotowa`; link do karty jeszcze niegotowej zostaje samą nazwą.
// WIKI_SZKICE=1 buduje także szkice, tylko do podglądu przed wypchnięciem.
import R from '../rocznik/2026/rocznik.json';

const notes = import.meta.glob('./*.md', { eager: true });
const SZKICE = typeof process !== 'undefined' && process.env.WIKI_SZKICE === '1';

export function slugify(t) {
  return t.replace(/ł/g, 'l').replace(/Ł/g, 'L').normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
const unlink = (v) => String(v || '').replace(/^\[\[|\]\]$/g, '');
const strip = (t) => String(t || '').replace(/<!--\[s:[^\]]*\]-->/g, '');

export const GRUPY = R.grupy.map((g) => g.nazwa);
export const OSNOWY = R.grupy.flatMap((g, gi) => g.osnowy.map((o) => ({ ...o, g: gi })));
const osOf = {};
OSNOWY.forEach((o) => o.rodziny.forEach((r) => { osOf[r] = o.nazwa; }));

// Kolor grupy: base do mózgu i nici, ink do tekstu na ciemnym tle.
export const BASE = ['#8fa274', '#5f9a96', '#6585b0', '#8577b3'];
export const INK = ['#b3c39b', '#8fc4bf', '#9fb7da', '#b4aada'];

export const NETN = { VIS: 'sieć wzrokowa', SMN: 'sieć czuciowo-ruchowa', DAN: 'sieć grzbietowa uwagi', VAN: 'sieć brzuszna uwagi', SN: 'sieć istotności', CN: 'sieć kontroli', DMN: 'sieć domyślna', LIM: 'sieć limbiczna', 'JĘZ': 'sieć językowa' };
// Karta każdej sieci (jego, 2026-10-20) nosi jej pełną nazwę jako tytuł.
const NETCARD = Object.fromEntries(Object.entries(NETN).map(([k, v]) => [k, v.charAt(0).toUpperCase() + v.slice(1)]));

const blocks = (body) => strip(body).trim().split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  .map((b) => { const f = /^!\[\[([^\]]+?)\.svg\]\]$/.exec(b); return f ? { fig: f[1] } : { t: b.replace(/\s*\n\s*/g, ' ') }; });

export const ALL = Object.entries(notes).map(([file, mod]) => {
  const f = mod.frontmatter;
  const stem = decodeURIComponent(file.split('/').pop().replace(/\.md$/, '')).normalize('NFC');
  const title = f['tytuł'] || stem;
  const o = unlink(f.osnowa);
  const home = OSNOWY.find((x) => x.nazwa === o);
  if (!home) throw new Error('Karta ' + stem + ': nieznana osnowa ' + o);
  const r2 = (f.rodziny || []).map(unlink);
  r2.forEach((r) => { if (!osOf[r]) throw new Error('Karta ' + stem + ': nieznana rodzina ' + r); });
  const osnowy = [o, ...r2.map((r) => osOf[r])].filter((x, i, a) => a.indexOf(x) === i);
  return {
    id: slugify(title), stem, h: title, url: '/wiki/' + slugify(title) + '/',
    o, g: home.g, r2, osnowy,
    body: blocks(mod.rawContent()),
    nets: (f.sieci || []).map((x) => [x.kod, strip(x['powód'])]),
    nw: strip(f.bez_sieci || ''),
    l: (f['materiały'] || []).map((x) => [x['tytuł'], x.url, x.czas ? String(x.czas) : '']),
    fig: (f.ryciny || []).map((x) => x.replace(/\.svg$/, '')),
    ready: f.stan === 'gotowa',
  };
});

export const KARTY = ALL.filter((k) => k.ready || SZKICE).sort((a, b) => a.h.localeCompare(b.h, 'pl'));
export const WIKI_ON = KARTY.length > 0;

const byName = {};
KARTY.forEach((k) => { byName[k.h] = k; byName[k.stem] = k; });
export const card = (name) => byName[name];
export const netCard = (kod) => byName[NETCARD[kod]];

// Tekst z [[linkami]] na odcinki: link do karty gotowej, reszta zostaje słowami.
export function segs(t) {
  const out = [];
  const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let last = 0, m;
  while ((m = re.exec(t))) {
    if (m.index > last) out.push({ t: t.slice(last, m.index) });
    const k = byName[m[1]];
    out.push(k ? { t: m[2] || m[1], url: k.url, color: INK[k.g], label: k.h } : { t: m[2] || m[1] });
    last = re.lastIndex;
  }
  if (last < t.length) out.push({ t: t.slice(last) });
  return out;
}

const text = (k) => k.body.map((b) => b.t || '').join(' ') + ' ' + k.nets.map((n) => n[1]).join(' ');
export const backlinks = (k) => KARTY.filter((x) => x !== k && text(x).indexOf('[[' + k.stem) >= 0);

// Na zajęciach: wątki, które linkują kartę (zajęcia.karty w rocznik.json).
const MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
export const classesOf = (k) => R['zajęcia'].filter((z) => (z.karty || []).indexOf(k.stem) >= 0).map((z) => {
  const [, m, d] = z.data.split('-').map(Number);
  return { label: z.kurs + ' ' + d + ' ' + MONTHS[m - 1] + (z['tytuł'] ? ': ' + z['tytuł'] : ''), url: '/2026/watki/' + z.id + '/', kurs: z.kurs };
});

// Indeks: grupa › osnowa › rodzina › karty; karta stoi przy każdej swojej rodzinie.
export const INDEX = R.grupy.map((g, gi) => ({
  nazwa: g.nazwa, g: gi,
  osnowy: g.osnowy.map((o) => {
    const rodziny = o.rodziny.map((r) => ({ nazwa: r, karty: KARTY.filter((k) => k.r2.indexOf(r) >= 0 || (k.o === o.nazwa && k.r2.length === 0)) }))
      .filter((r) => r.karty.length);
    return { nazwa: o.nazwa, id: slugify(o.nazwa), rodziny, n: rodziny.reduce((s, r) => s + r.karty.length, 0) };
  }),
}));
