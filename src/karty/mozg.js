// Mózg z boku ze strony startowej dla wiki (jego słowo, 2026-10-23: *Replicate the colors from the brain at the starting page.
// Keep the images uniform*). Mapa etykiet 240×180, jej poprawki (VAN, DOPISY), kolory (COL) i miejsca nazw (KOTWICA) czytane
// wprost ze źródła strony startowej, więc oba rysunki nie mogą się rozejść.
import RAW from '../pages/index.astro?raw';

const grab = (re) => { const m = RAW.match(re); if (!m) throw new Error('mozg.js: brak w index.astro ' + re); return m[1]; };
const lit = (s) => Function('return ' + s.replace(/\/\/[^\n]*/g, ''))();
const MAPA = grab(/const MAPA = '([^']+)'/);
const VAN = lit(grab(/const VAN = (\[[\s\S]*?\]);/));
const DOPISY = lit(grab(/const DOPISY = (\[[\s\S]*?\n\]);/));
const COL = lit(grab(/const COL[^=]*= (\{[^;]*\});/));
const KOTWICA = lit(grab(/const KOTWICA[^=]*= (\{[^;]*\});/));

// etykiety mapy: 1 tkanka poza sieciami, 2–8 sieci strony startowej
export const KOD = { 2: 'VIS', 3: 'SMN', 4: 'DAN', 5: 'CN', 6: 'SN', 7: 'DMN', 8: 'VAN' };
export const KOLOR = Object.fromEntries(Object.entries(KOD).map(([n, kod]) => [kod, COL[n]]));

// ta sama kolejność kroków co w index.astro: przebiegi, owale VAN, dopisy w wielokątach (tylko komórki co najmniej 2 od tła)
const wWielokacie = (x, y, w) => {
  let jest = false;
  for (let i = 0, j = w.length - 2; i < w.length; j = i, i += 2) {
    const [xi, yi, xj, yj] = [w[i], w[i + 1], w[j], w[j + 1]];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) jest = !jest;
  }
  return jest;
};
const SIATKA = (() => {
  const cells = []; let ix = 0;
  for (const tk of MAPA.split(',')) {
    const v = +tk[0], n = parseInt(tk.slice(1), 36);
    if (v > 0) for (let q = ix; q < ix + n; q++) cells.push([q % 240, (q / 240) | 0, v]);
    ix += n;
  }
  for (const cc of cells) for (const [u0, v0, ru, rv, z] of VAN) if (z.includes(cc[2]) && ((cc[0] - u0) / ru) ** 2 + ((cc[1] - v0) / rv) ** 2 <= 1) cc[2] = 8;
  const LABM = new Uint8Array(240 * 180);
  for (const cc of cells) LABM[cc[1] * 240 + cc[0]] = cc[2];
  const odTla = (u, v) => {
    for (let dv = -2; dv <= 2; dv++) for (let du = -2; du <= 2; du++) {
      const x = u + du, y = v + dv;
      if (x < 0 || y < 0 || x >= 240 || y >= 180 || !LABM[y * 240 + x]) return false;
    }
    return true;
  };
  for (const [net, z, w] of DOPISY) for (const cc of cells) if (z.includes(cc[2]) && wWielokacie(cc[0] + .5, cc[1] + .5, w) && (cc[2] !== 1 || odTla(cc[0], cc[1]))) cc[2] = net;
  const S = new Uint8Array(240 * 180);
  for (const cc of cells) S[cc[1] * 240 + cc[0]] = cc[2];
  return S;
})();

// każda etykieta jako jedna ścieżka z poziomych przebiegów
const PATH = {};
for (let y = 0; y < 180; y++) for (let x = 0; x < 240;) {
  const v = SIATKA[y * 240 + x]; let e = x;
  while (e < 240 && SIATKA[y * 240 + e] === v) e++;
  if (v) PATH[v] = (PATH[v] || '') + 'M' + x + ' ' + y + 'h' + (e - x) + 'v1h' + (x - e) + 'z';
  x = e;
}
const BOX = (() => {
  let x0 = 240, x1 = 0, y0 = 180, y1 = 0;
  for (let i = 0; i < SIATKA.length; i++) if (SIATKA[i]) { const x = i % 240, y = (i / 240) | 0; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return [x0 - 2, y0 - 2, x1 - x0 + 5, y1 - y0 + 5];
})();

// Rysunek: sieci z `on` w kolorze ze strony startowej, reszta mózgu przygaszona. `klik` daje każdej sieci klasę nb i data-k
// (mapa na /wiki/), wtedy świecą wszystkie, a CSS przygasza je przy wyborze.
export function mozgSvg(on, { klik = false, label = 'Mózg z boku' } = {}) {
  const lit = new Set(on);
  // krawędzie siatki 240×180 wygładza rozmycie z progiem przezroczystości; zgaszone sieci zostają jaśniejszą szarością,
  // żeby było widać podział kory bez kolorów
  let s = '<svg viewBox="' + BOX.join(' ') + '" class="mozg-svg' + (klik ? ' sieci-svg' : '') + '" role="img" aria-label="' + label + '">'
    + '<defs><filter id="mozg-gladki" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="0.8"/>'
    + '<feComponentTransfer><feFuncA type="table" tableValues="0 0 0.6 1 1"/></feComponentTransfer></filter></defs><g filter="url(#mozg-gladki)">';
  s += '<path d="' + PATH[1] + '" fill="#4a4640"/>';
  for (const [n, kod] of Object.entries(KOD)) {
    if (!PATH[n]) continue;
    const pal = klik || lit.has(kod);
    s += klik
      ? '<path class="nb" data-k="' + kod + '" d="' + PATH[n] + '" style="fill:' + COL[n] + '"/>'
      : '<path d="' + PATH[n] + '" fill="' + (pal ? COL[n] : '#5c5750') + '"/>';
  }
  s += '</g>';
  for (const [n, kod] of Object.entries(KOD)) {
    const K = KOTWICA[n]; if (!K || !(klik || lit.has(kod))) continue;
    s += '<text x="' + K[0] + '" y="' + (K[1] + 3) + '" text-anchor="middle" class="mozg-kod' + (klik ? ' nl' : '') + '" data-k="' + kod + '">' + kod + '</text>';
  }
  return s + '</svg>';
}
