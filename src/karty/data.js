// Karty: jeden zbiór kart pojęć dla całej strony (src/karty/*.md), każda pod /wiki/<slug>/.
// Karta jest publiczna, gdy ma `stan: gotowa`; link do karty jeszcze niegotowej zostaje samą nazwą.
// WIKI_SZKICE=1 buduje także szkice, tylko do podglądu przed wypchnięciem.
import D from './dyscypliny.json';
import { OBSZARY, numerObszaru } from './obszary.js';

const notes = import.meta.glob('./*.md', { eager: true });
const SZKICE = typeof process !== 'undefined' && process.env.WIKI_SZKICE === '1';

export function slugify(t) {
  return t.replace(/ł/g, 'l').replace(/Ł/g, 'L').normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
const unlink = (v) => String(v || '').replace(/^\[\[|\]\]$/g, '');
const strip = (t) => String(t || '').replace(/<!--\[s:[^\]]*\]-->/g, '');

// Indeks kart stoi na karcie kogni.pl (2026-11-02). Karta należy do dyscypliny, nazwanej wprost, i do rodzin w niej; osnowy, tematy
// zajęć z Płótna, odeszły z wiki (jego słowo, 2026-11-24: *we remove the osnowa. we use disciplines and call them directly*).
export const INDEKS = '/wiki/' + slugify('kogni.pl') + '/';
export const GRUPY = D.dyscypliny.map((g) => g.nazwa);
const famOf = {};
D.dyscypliny.forEach((g, gi) => g.rodziny.forEach((r) => { famOf[r] = gi; }));

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
  const d = String(f.dyscyplina || '');
  const g = d === 'wiki' ? 4 : GRUPY.indexOf(d);
  if (g < 0) throw new Error('Karta ' + stem + ': nieznana dyscyplina ' + d);
  const r2 = (f.rodziny || []).map(unlink);
  r2.forEach((r) => { if (famOf[r] === undefined) throw new Error('Karta ' + stem + ': nieznana rodzina ' + r); });
  return {
    id: slugify(title), stem, h: title, url: '/wiki/' + slugify(title) + '/',
    // kolor i ścieżka karty idą od jej dyscypliny; karta samej dyscypliny i karty całej wiki stoją pod Wiki
    g, d, r2,
    body: blocks(mod.rawContent()),
    // sieć limbiczna jest ósmą siecią modelu, osobno od domyślnej (jego słowo, 2026-11-09: *i do not add the limbiczna network to the
    // domyslna anymore*; w soczewce z 2026-11-01 leży na osi wartości, w poprzek osi odległości od receptorów)
    nets: (f.sieci || []).map((x) => [x.kod, strip(x['powód'])]),
    nw: strip(f.bez_sieci || ''),
    l: (f['materiały'] || []).map((x) => [x['tytuł'], x.url, x.czas ? String(x.czas) : '']),
    fig: (f.ryciny || []).map((x) => x.replace(/\.svg$/, '')),
    // obszary Atlasu, w których leży miejsce karty (zmiana, bodziec, aktywność), każdy oparty na zdaniu karty; Atlas wymienia kartę przy
    // zaznaczonym obszarze (2026-11-11)
    obszary: (f.obszary || []).map((n) => { const i = numerObszaru(n); if (!i) throw new Error('Karta ' + stem + ': nieznany obszar ' + n); return i; }),
    ready: f.stan === 'gotowa',
  };
});

// definicja do dymka terminu (jego słowo, 2026-11-01: *clicking it should open a bubble with 1-2 sentences of explanations and cta in the
// bottom right to open a card in the wiki*): pierwsze jedno albo dwa zdania karty, bez cytowań i bez angielskich nazw
const defOf = (body) => {
  const b = body.find((x) => x.t); if (!b) return '';
  const s = b.t.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, c) => c || a).replace(/\{\{#?([^}|]+)(?:\|([^}]+))?\}\}/g, (_, a, c) => c || a).replace(/\s*\(ang\.[^)]*\)/g, '').replace(/\s*\([^()]*\d{4}[^()]*\)/g, '');
  // kropka bez spacji po niej (kogni.pl, 0,1 s zapisane 0.1) nie kończy zdania (audyt 2026-11-16: opis karty kogni.pl zaczynał się od „pl”)
  const z = s.match(/(?:[^.!?]|[.!?](?!\s|$))+[.!?](?=\s|$)/g) || [s];
  return (z[0].length < 150 && z[1] ? z[0] + z[1] : z[0]).trim();
};
ALL.forEach((k) => { k.def = defOf(k.body); });
export const KARTY = ALL.filter((k) => k.ready || SZKICE).sort((a, b) => a.h.localeCompare(b.h, 'pl'));
export const WIKI_ON = KARTY.length > 0;

const byName = {};
KARTY.forEach((k) => { byName[k.h] = k; byName[k.stem] = k; });
export const card = (name) => byName[name];
// Rodzina na karcie prowadzi do karty o tej nazwie, gdy taka jest (Predykcja, Interocepcja), a inaczej do swojego akapitu w indeksie.
export const rodzinaUrl = (r, k) => (byName[r] && byName[r] !== k ? byName[r].url : famOf[r] !== undefined && !byName[r] ? INDEKS + '#' + slugify(r) : '');
// Dyscyplina nazwana wprost prowadzi do swojej karty (jego słowo, 2026-11-24: *call them directly*).
export const dyscyplinaUrl = (gi) => { const k = GRUPY[gi] && byName[GRUPY[gi].charAt(0).toUpperCase() + GRUPY[gi].slice(1)]; return k ? k.url : INDEKS + '#' + slugify(GRUPY[gi] || ''); };
export const netCard = (kod) => byName[NETCARD[kod]];

// Anatomia stoi w Atlasie, wiki zostaje dla pojęć i przypadków (jego słowa, 2026-11-10: *I want to move the anatomy (networks/regions)
// to the atlas page, and keep wiki for the conceptual things / cases etc... linking back and forth*, potem 2026-11-11: *ok, execute*).
// Do Atlasu idą karty, które Atlas zaznacza: karta każdej sieci, karta obszaru z listy obszarów i dwa przeglądy, Sieci wielkoskalowe
// bez zaznaczenia w trybie Sieci i Płaty mózgu bez zaznaczenia w trybie Obszary. Każda ma w Atlasie własną stronę z tym zaznaczeniem i
// kartą pod widokami, a jej adres w wiki przekierowuje tam; `url` karty prowadzi już do Atlasu, więc każdy link do niej też.
export const KARTA_OBSZARU = { 'istota biała przodomózgowia': 'Istota szara i istota biała' };
export const kartaObszaru = (n) => byName[KARTA_OBSZARU[n] || n.charAt(0).toUpperCase() + n.slice(1)];
export const ATLAS = [];
const doAtlasu = (k, s) => { if (k) { k.wiki = k.url; k.url = s.sciezka; k.atlas = s; } ATLAS.push({ k: k || null, ...s }); };
doAtlasu(byName['Sieci wielkoskalowe'], { sciezka: '/atlas/', tryb: 'sieci' });
doAtlasu(byName['Płaty mózgu'], { sciezka: '/atlas/' + slugify('Płaty mózgu') + '/', tryb: 'platy' });
Object.keys(NETN).forEach((kod) => { const k = netCard(kod); if (k) doAtlasu(k, { sciezka: '/atlas/' + k.id + '/', tryb: 'sieci', siec: kod }); });
OBSZARY.forEach(({ nazwa }, i) => { const k = kartaObszaru(nazwa); if (k && !k.atlas) doAtlasu(k, { sciezka: '/atlas/' + k.id + '/', tryb: 'obszary', obszar: i + 1 }); });
// adresy Atlasu dla skryptu: sieć i obszar ze swoją kartą, oba przeglądy
export const STRONY = {
  sieci: '/atlas/', obszary: ATLAS[1].sciezka, platy: ATLAS[1].sciezka,
  siec: Object.fromEntries(ATLAS.filter((s) => s.siec).map((s) => [s.siec, s.sciezka])),
  obszar: Object.fromEntries(ATLAS.filter((s) => s.obszar).map((s) => [s.obszar, s.sciezka])),
};

// Tekst z [[linkami]] na odcinki: link do karty gotowej, reszta zostaje słowami.
// [[Karta|słowa]] linkuje kartę; {{#dyscyplina|słowa}} linkuje kartę dyscypliny; {{Rodzina|słowa}} jej akapit w indeksie.
export function segs(t) {
  const out = [];
  const re = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|\{\{([^}|]+)(?:\|([^}]+))?\}\}/g;
  let last = 0, m;
  while ((m = re.exec(t))) {
    if (m.index > last) out.push({ t: t.slice(last, m.index) });
    if (m[3]) {
      const g = m[3].startsWith('#') ? GRUPY.indexOf(m[3].slice(1)) : -1, fam = famOf[m[3]];
      out.push(g >= 0 ? { t: m[4] || m[3].slice(1), url: dyscyplinaUrl(g), color: INK[g], label: m[3].slice(1) }
        : fam !== undefined ? { t: m[4] || m[3], url: INDEKS + '#' + slugify(m[3]), color: INK[fam], label: m[3] } : { t: m[4] || m[3] });
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


// Indeks: dyscyplina › rodzina › karty; karta stoi przy każdej swojej rodzinie, karta bez rodziny przy swojej dyscyplinie.
export const INDEX = D.dyscypliny.map((g, gi) => ({
  nazwa: g.nazwa, g: gi, id: slugify(g.nazwa),
  rodziny: g.rodziny.map((r) => ({ nazwa: r, id: slugify(r), karty: KARTY.filter((k) => k.r2.indexOf(r) >= 0) })).filter((r) => r.karty.length),
  luzem: KARTY.filter((k) => k.g === gi && k.r2.length === 0),
}));
