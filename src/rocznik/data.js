// Rocznik 2026: the karty in ./2026/karty (one Markdown note per splot, Obsidian-style)
// and ./2026/rocznik.json (osnowy, zajęcia, połączenia) assembled for the views.
import R from './2026/rocznik.json';

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
    url: '/2026/watki/' + z.id + '/',
  };
});

const blocks = (body) => body.trim().split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)
  .map((b) => { const f = /^!\[\[([^\]]+?)\.svg\]\]$/.exec(b); return f ? { fig: f[1] } : { t: b.replace(/\s*\n\s*/g, ' ') }; });

const order = (s) => [CL.findIndex((c) => c.id === s.cls), OSFULL.findIndex((o) => o.nazwa === s.o)];

export const SP = Object.entries(notes).map(([file, mod]) => {
  const f = mod.frontmatter;
  const stem = decodeURIComponent(file.split('/').pop().replace(/\.md$/, '')).normalize('NFC');
  const kurs = unlink(f.kurs);
  const cls = CL.find((c) => c.course === kurs && c.data === String(f.data));
  if (!cls) throw new Error('Karta ' + stem + ': brak zajęć ' + kurs + ' ' + f.data);
  const body = blocks(mod.rawContent());
  const title = f['tytuł'] || stem;
  return {
    id: slugify(title), stem, url: '/2026/karty/' + slugify(title) + '/',
    cls: cls.id, o: unlink(f.osnowa), dep: (f['głębokość'] || []).map((x) => LV.indexOf(x)),
    m: f['myśl'] || '', i: body.length && body[0].t ? body[0].t : '',
    l: (f['materiały'] || []).map((x) => [x['tytuł'], x.url, x.czas ? String(x.czas) : '']),
    h: title, d: f.opis || '', r2: (f.rodziny || []).map(unlink),
    net: (f.sieci || []).map((x) => x.kod), nets: (f.sieci || []).map((x) => [x.kod, x['powód']]),
    nw: f.bez_sieci || '', fig: (f.ryciny || []).map((x) => x.replace(/\.svg$/, '')), body,
  };
}).sort((a, b) => { const x = order(a), y = order(b); return x[0] - y[0] || x[1] - y[1]; });

for (const s of SP) {
  if (!OSFULL.some((o) => o.nazwa === s.o)) throw new Error('Karta ' + s.h + ': nieznana osnowa ' + s.o);
}

const byName = {};
for (const s of SP) { byName[s.h] = s; byName[s.stem] = s; }
export const CN = R['połączenia'].map((c) => ({
  t: c['tytuł'], x: c.opis,
  m: c.karty.map((k) => { if (!byName[k]) throw new Error('Połączenie ' + c['tytuł'] + ': brak karty ' + k); return byName[k].id; }),
}));

// Each view reads OS in the shape its board was designed with.
export function viewData(kind) {
  const OS = kind === 'plotno' ? OSFULL.map((o) => o.nazwa)
    : kind === 'osnowy' ? OSFULL.map((o) => [o.nazwa, o.opis, o.rodziny])
    : OSFULL.map((o) => [o.nazwa, o.rodziny.join(' · ')]);
  const OP = kind === 'plotno' ? OSFULL.map((o) => [o.opis, o.rodziny]) : undefined;
  return { OS, OP, BAND, GN, LV, CL, SP, CN };
}

export const held = CL.filter((c) => c.held);
export const latest = held[held.length - 1];
export const cardsOf = (clsId) => SP.filter((s) => s.cls === clsId);
export const cardByName = (name) => byName[name];
