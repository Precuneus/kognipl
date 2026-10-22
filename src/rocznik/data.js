// Rocznik 2026: the karty in ./2026/karty (one Markdown note per splot, Obsidian-style)
// and ./2026/rocznik.json (osnowy, zajęcia, połączenia) assembled for the views.
import R from './2026/rocznik.json';
import { ALL } from '../karty/data.js';
const SZKICE = typeof process !== 'undefined' && process.env.WIKI_SZKICE === '1';

const notes = import.meta.glob('./2026/karty/*.md', { eager: true });

const MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const COURSE = { Neurokogni: 'n', Intro: 'i' };

export function slugify(t) {
  return t.replace(/ł/g, 'l').replace(/Ł/g, 'L').normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
const unlink = (v) => String(v || '').replace(/^\[\[|\]\]$/g, '');

export const LV = R['poziomy'];
export const GN = R.grupy.map((g) => g.nazwa);
export const BAND = R.grupy.map((g) => g.osnowy.length);
const OSFULL = R.grupy.flatMap((g) => g.osnowy);

export const CL = R['zajęcia'].map((z) => {
  const [, m, d] = z.data.split('-').map(Number);
  return {
    id: z.id, c: COURSE[z.kurs], course: z.kurs, data: z.data,
    short: d + '.' + String(m).padStart(2, '0'), date: d + ' ' + MONTHS[m - 1],
    title: z['tytuł'] || '', held: !!z.odbyte,
    after: (z['po_zajęciach'] || []).map((a) => ({ label: a['tytuł'], url: a.url })),
    url: '/2026/?z=' + z.id,
    opis: (z.opis || []).map((p) => p.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, b) => b || a)),
  };
});

const blocks = (body) => body.trim().split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  .map((b) => { const f = /^!\[\[([^\]]+?)\.svg\]\]$/.exec(b); return f ? { fig: f[1] } : { t: b.replace(/\s*\n\s*/g, ' ') }; });

const order = (s) => [CL.findIndex((c) => c.id === s.cls), OSFULL.findIndex((o) => o.nazwa === s.o)];

// Splot: zajęcia spotykają osnowę. Zajęcia z listą `karty` (jeden zbiór kart, jego decyzja 2026-10-20)
// wiążą węzeł na każdej osnowie, do której należą rodziny ich kart. Nagłówek i opis węzła stoją w `splot`
// zajęć w rocznik.json; okno węzła wylicza karty zakorzenione na tej osnowie, a gdy żadna nie jest, karty jej rodzin.
// Zajęcia bez listy czytają jeszcze stare karty Rocznika z ./2026/karty.
const OLD = Object.entries(notes).map(([file, mod]) => {
  const f = mod.frontmatter;
  const stem = decodeURIComponent(file.split('/').pop().replace(/\.md$/, '')).normalize('NFC');
  const kurs = unlink(f.kurs);
  const cls = CL.find((c) => c.course === kurs && c.data === String(f.data));
  if (!cls) throw new Error('Karta ' + stem + ': brak zajęć ' + kurs + ' ' + f.data);
  const body = blocks(mod.rawContent());
  const title = f['tytuł'] || stem;
  return {
    id: slugify(title), stem, url: '/2026/karty/' + slugify(title) + '/', isOld: true, isNew: false, cards: [],
    cls: cls.id, o: unlink(f.osnowa), dep: (f['głębokość'] || []).map((x) => LV.indexOf(x)),
    m: f['myśl'] || '', i: body.length && body[0].t ? body[0].t : '',
    l: (f['materiały'] || []).map((x) => [x['tytuł'], x.url, x.czas ? String(x.czas) : '']),
    h: title, d: f.opis || '', r2: (f.rodziny || []).map(unlink),
    net: (f.sieci || []).map((x) => x.kod), nets: (f.sieci || []).map((x) => [x.kod, x['powód']]),
    nw: f.bez_sieci || '', fig: (f.ryciny || []).map((x) => x.replace(/\.svg$/, '')), body,
  };
}).filter((s) => !(R['zajęcia'].find((z) => z.id === s.cls) || {}).karty);

const chip = (k, c) => ({
  h: k.h, url: k.ready || SZKICE ? k.url : '', link: !!(k.ready || SZKICE), plain: !(k.ready || SZKICE),
  style: "display:inline-flex;align-items:center;text-decoration:none;font-family:'Inter',sans-serif;font-size:13px;min-height:32px;padding:4px 12px;border-radius:999px;border:1px solid " + (k.ready || SZKICE ? INKG[k.g] + '88' : 'rgba(180,155,100,0.25)') + ';color:' + (k.ready || SZKICE ? INKG[k.g] : '#a09888'),
});
const INKG = ['#b3c39b', '#8fc4bf', '#9fb7da', '#b4aada'];
const NEW = [];
R['zajęcia'].forEach((z) => {
  if (!z.karty) return;
  const cls = CL.find((c) => c.id === z.id);
  const by = {};
  z.karty.forEach((name) => {
    const k = ALL.find((x) => x.stem === name || x.h === name);
    if (!k) throw new Error('Zajęcia ' + z.id + ': brak karty ' + name);
    k.osnowy.forEach((o) => {
      if (!by[o]) {
        const t = (z.splot || {})[o];
        by[o] = { id: z.id + '-' + slugify(o), stem: '', cls: z.id, o, isOld: false, isNew: true, cards: [], homed: [], family: [], r2: [],
          url: cls.url, txt: !!t, h: t ? t.h : o, d: t ? t.d : '', m: '', i: '', l: [], net: [], nets: [], nw: '', fig: [], body: [], dep: [] };
        NEW.push(by[o]);
      }
      const sp = by[o];
      (k.o === o ? sp.homed : sp.family).push(chip(k, cls));
      k.r2.forEach((r) => { if (OSFULL.find((x) => x.nazwa === o).rodziny.indexOf(r) >= 0 && sp.r2.indexOf(r) < 0) sp.r2.push(r); });
    });
  });
  Object.values(by).forEach((sp) => { sp.cards = sp.homed.length ? sp.homed : sp.family; delete sp.homed; delete sp.family; });
});

export const SP = OLD.concat(NEW).sort((a, b) => { const x = order(a), y = order(b); return x[0] - y[0] || x[1] - y[1]; });

for (const s of SP) {
  if (!OSFULL.some((o) => o.nazwa === s.o)) throw new Error('Karta ' + s.h + ': nieznana osnowa ' + s.o);
}

// Połączenia łączą karty; nazwa wskazuje starą kartę Rocznika albo kartę z jednego zbioru.
const byName = {};
for (const s of OLD) { byName[s.h] = [s.id]; byName[s.stem] = [s.id]; }
for (const k of ALL) { const ids = NEW.filter((sp) => sp.cards.some((c) => c.h === k.h)).map((sp) => sp.id); if (ids.length) { byName[k.h] = ids; byName[k.stem] = ids; } }
export const CN = R['połączenia'].map((c) => ({
  t: c['tytuł'], x: c.opis,
  m: c.karty.flatMap((k) => byName[k] || []),
})).filter((c) => c.m.length > 1);

// Opis wątku: akapity w pierwszej osobie, [[link]] zostaje samymi słowami.
export const opisOf = (id) => ((R['zajęcia'].find((z) => z.id === id) || {}).opis || [])
  .map((p) => p.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, b) => b || a));

// Each view reads OS in the shape its board was designed with.
export function viewData(kind) {
  const OS = kind === 'plotno' ? OSFULL.map((o) => o.nazwa)
    : OSFULL.map((o) => [o.nazwa, o.rodziny.join(' · ')]);
  const OP = kind === 'plotno' ? OSFULL.map((o) => [o.opis, o.rodziny]) : undefined;
  return { OS, OP, BAND, GN, LV, CL, SP, CN };
}

export const held = CL.filter((c) => c.held);
export const latest = held[held.length - 1];
export const cardsOf = (clsId) => SP.filter((s) => s.cls === clsId);
export const cardByName = (name) => byName[name];
