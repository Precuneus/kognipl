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

// Indeks kart stoi na karcie kogni.pl (2026-11-02); tam prowadzą odnośniki do grup i osnów.
export const INDEKS = '/wiki/' + slugify('kogni.pl') + '/';
export const GRUPY = R.grupy.map((g) => g.nazwa);
export const OSNOWY = R.grupy.flatMap((g, gi) => g.osnowy.map((o) => ({ ...o, g: gi })));
const osOf = {};
OSNOWY.forEach((o) => o.rodziny.forEach((r) => { osOf[r] = o.nazwa; }));

// Kolor grupy: base do mózgu i nici, ink do tekstu na ciemnym tle.
// piąty kolor, złoty, mają karty całej wiki, jak Mapa osnów (grupa: wiki, 2026-10-23)
export const BASE = ['#8fa274', '#5f9a96', '#6585b0', '#8577b3', '#c89a3c'];
export const INK = ['#b3c39b', '#8fc4bf', '#9fb7da', '#b4aada', '#f0c060'];

export const NETN = { VIS: 'sieć wzrokowa', SMN: 'sieć czuciowo-ruchowa', DAN: 'sieć grzbietowa uwagi', VAN: 'sieć brzuszna uwagi', SN: 'sieć istotności', CN: 'sieć kontroli', DMN: 'sieć domyślna', LIM: 'sieć limbiczna' };
// Karta każdej sieci (jego, 2026-10-20) nosi jej pełną nazwę jako tytuł.
const NETCARD = Object.fromEntries(Object.entries(NETN).map(([k, v]) => [k, v.charAt(0).toUpperCase() + v.slice(1)]));

const blocks = (body) => strip(body).trim().split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  .map((b) => {
    const f = /^!\[\[([^\]]+?)\.svg\]\]$/.exec(b); if (f) return { fig: f[1] };
    // akapit kursu: wywołanie Obsidiana > [!kurs], na stronie oświetlony snopem Iskry (jego wybór A, 2026-11-09)
    const ku = /^>\s*\[!kurs\][^\n]*\n?/.exec(b);
    if (ku) return { t: b.slice(ku[0].length).replace(/^>\s?/gm, '').replace(/\s*\n\s*/g, ' ').trim(), kurs: true };
    // scena zamykająca jako przykład: wywołanie > [!przykład], na stronie głosem opowieści (jego wybór B, 2026-11-09)
    const pr = /^>\s*\[!przyk(?:ł|l)ad\][^\n]*\n?/.exec(b);
    if (pr) return { t: b.slice(pr[0].length).replace(/^>\s?/gm, '').replace(/\s*\n\s*/g, ' ').trim(), przyklad: true };
    return { t: b.replace(/\s*\n\s*/g, ' ') };
  });

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
    // karta dyscypliny może należeć do innej grupy niż jej osnowa (pole grupa): wtedy bierze kolor tej grupy, a ścieżka prowadzi
    // od grupy, jak na mapie osnów (jego słowo, 2026-10-23: *Review all the connections and make them proper*)
    o, g: f.grupa === 'wiki' ? 4 : f.grupa && GRUPY.indexOf(f.grupa) >= 0 ? GRUPY.indexOf(f.grupa) : home.g, grupa: f.grupa || '', r2, osnowy,
    body: blocks(mod.rawContent()),
    // sieć limbiczna jest ósmą siecią modelu, osobno od domyślnej (jego słowo, 2026-11-09: *i do not add the limbiczna network to the
    // domyslna anymore*; w soczewce z 2026-11-01 leży na osi wartości, w poprzek osi odległości od receptorów)
    nets: (f.sieci || []).map((x) => [x.kod, strip(x['powód'])]),
    nw: strip(f.bez_sieci || ''),
    l: (f['materiały'] || []).map((x) => [x['tytuł'], x.url, x.czas ? String(x.czas) : '']),
    fig: (f.ryciny || []).map((x) => x.replace(/\.svg$/, '')),
    ready: f.stan === 'gotowa',
  };
});

// definicja do dymka terminu (jego słowo, 2026-11-01: *clicking it should open a bubble with 1-2 sentences of explanations and cta in the
// bottom right to open a card in the wiki*): pierwsze jedno albo dwa zdania karty, bez cytowań i bez angielskich nazw
const defOf = (body) => {
  const b = body.find((x) => x.t); if (!b) return '';
  const s = b.t.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, c) => c || a).replace(/\s*\(ang\.[^)]*\)/g, '').replace(/\s*\([^()]*\d{4}[^()]*\)/g, '');
  const z = s.match(/[^.!?]+[.!?](?=\s|$)/g) || [s];
  return (z[0].length < 150 && z[1] ? z[0] + z[1] : z[0]).trim();
};
ALL.forEach((k) => { k.def = defOf(k.body); });
export const KARTY = ALL.filter((k) => k.ready || SZKICE).sort((a, b) => a.h.localeCompare(b.h, 'pl'));
export const WIKI_ON = KARTY.length > 0;

const byName = {};
KARTY.forEach((k) => { byName[k.h] = k; byName[k.stem] = k; });
export const card = (name) => byName[name];
// Rodzina na karcie prowadzi do karty o tej nazwie, gdy taka jest (Predykcja, Interocepcja), a inaczej do akapitu jej osnowy w indeksie.
export const rodzinaUrl = (r, k) => (byName[r] && byName[r] !== k ? byName[r].url : osOf[r] && !byName[r] ? INDEKS + '#' + slugify(osOf[r]) : '');
export const netCard = (kod) => byName[NETCARD[kod]];

// Tekst z [[linkami]] na odcinki: link do karty gotowej, reszta zostaje słowami.
// [[Karta|słowa]] linkuje kartę; {{Osnowa|słowa}} i {{#dyscyplina|słowa}} linkują jej miejsce w indeksie wiki (2026-10-22).
export function segs(t) {
  const out = [];
  const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|\{\{([^}|]+)(?:\|([^}]+))?\}\}/g;
  let last = 0, m;
  while ((m = re.exec(t))) {
    if (m.index > last) out.push({ t: t.slice(last, m.index) });
    if (m[3]) {
      const g = m[3].startsWith('#') ? GRUPY.indexOf(m[3].slice(1)) : -1, o = OSNOWY.find((x) => x.nazwa === m[3]);
      const gi = g >= 0 ? g : o ? o.g : -1;
      out.push(gi >= 0 ? { t: m[4] || m[3].replace(/^#/, ''), url: INDEKS + '#' + slugify(m[3].replace(/^#/, '')), color: INK[gi], label: m[3].replace(/^#/, '') } : { t: m[4] || m[3] });
    } else {
      const k = byName[m[1]];
      out.push(k ? { t: m[2] || m[1], url: k.url, color: INK[k.g], label: k.h, def: k.def } : { t: m[2] || m[1] });
    }
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
