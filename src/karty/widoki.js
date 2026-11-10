// Widoki mózgu w Atlasie, jedynym miejscu, gdzie strona rysuje mózg (2026-11-10: *lets make an "Atlas" subpage, next to the wiki*, potem
// *lets remove the graphics of the sieci mozgowe from the wiki*). Ziarno rysuje `src/karty/ziarno.js` na płótnie pod liniami, z mapy sieci `<plik>-sieci.png`, mapy obszarów `<plik>-obszary.png`
// i ośrodków `huby` z `mozg-widoki.json`; wielokąty obszarów sieci zostają linkami dla klawiatury i czytnika ekranu.
import D from './mozg-widoki.json';
import { NETN, netCard, card, slugify, kartaObszaru } from './data.js';

export const DANE = D;
// oba rysunki Cartera pokazują lewą półkulę, więc podpis ją nazywa (przegląd 2026-11-09); przekroje pokazują obie półkule, druga to
// odbicie pierwszej w linii środkowej (jego słowa, 2026-11-10: *I'd like the view on the both hemispheres on the sections*)
export const PODPIS = {
  lateral: ['z boku, lewa półkula', 'lewej półkuli z boku'],
  medial: ['od środka, lewa półkula', 'lewej półkuli od środka'],
  ventral: ['od dołu', 'mózgu od dołu'],
  coronal: ['w przekroju czołowym', 'mózgu w przekroju czołowym'],
  horizontal: ['w przekroju poziomym', 'mózgu w przekroju poziomym'],
};
const IMG = '/images/mozg-widoki/';
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// v: klucz widoku; k: karta, na której stoi (jej sieć nie jest linkiem do niej samej); lit: sieci świecące od początku;
// tab: widok, przez który idzie klawiatura (jeden na stronie); ciecia: linie przekrojów na widoku z boku (tylko tam, gdzie są przekroje)
export function widok(v, { k = null, lit = new Set(), tab = false, ciecia = false } = {}) {
  const d = D[v], [W, H] = d.vb, f = d.plik, [cap, gdzie] = PODPIS[v];
  const swieci = [...lit].map((n) => NETN[n]).filter(Boolean);
  const sieci = d.sieci.map((n) => {
    const polys = d.obszary.filter(([m]) => m === n).map(([, p]) => p);
    // etykieta stoi w obszarze sieci, w miejscu wybranym przy generowaniu rysunków tak, żeby żadne dwie etykiety widoku się nie
    // nakładały i żadna nie wychodziła poza rysunek; jest elementem strony, więc ma 12 px w każdym widoku (przegląd 2026-11-09)
    const [cx, cy] = d.etykiety[n];
    const to = netCard(n);
    const body = polys.map((p) => '<polygon class="wk-hit" points="' + p.map((q) => q.join(',')).join(' ') + '"/>').join('');
    const tag = '<span class="wk-nl" aria-hidden="true" data-k="' + n + '" style="left:' + (cx / W * 100).toFixed(2) + '%;top:' + (cy / H * 100).toFixed(2) + '%' + (lit.has(n) ? '' : ';display:none') + '">' + n + '</span>';
    return {
      // obszar sieci tej karty nie jest linkiem do niej samej (przegląd 2026-11-09); klawiatura idzie przez jeden widok strony
      shape: to && to !== k ? '<a href="' + to.url + '" class="wk-nb" data-k="' + n + '"' + (tab ? '' : ' tabindex="-1"') + '><title>' + NETN[n] + '</title>' + body + '</a>' : '<g>' + body + '</g>',
      tag,
    };
  });
  // widoki nie są rycinami opisu, tylko mapą sieci, więc nie noszą numeru „Ryc.”
  return '<figure class="wk-widok wk-widok-' + f + '" data-pole="' + IMG + f + '-sieci.png" data-obszary="' + IMG + f + '-obszary.png" data-k="' + d.pole.k + '" data-vb="' + W + ' ' + H + '" data-huby="' + esc(JSON.stringify(d.huby)) + '">'
    + '<div class="wk-pole"><canvas class="wk-ziarno" aria-hidden="true"></canvas>'
    + '<svg viewBox="0 0 ' + W + ' ' + H + '"' + (tab ? ' role="group" aria-label="Sieci mózgowe na ' + gdzie + (swieci.length ? ', zaznaczona: ' + swieci.join(', ') : '') + '"' : ' aria-hidden="true"') + '>'
    + sieci.map((s) => s.shape).join('')
    + '<image href="' + IMG + f + '.webp" width="' + W + '" height="' + H + '" class="wk-linie"/>'
    // płaszczyzny przekrojów na widoku z boku: przerywana linia mówi, gdzie leży cięcie, bez słów; świeci, kiedy wskaźnik jest na
    // swoim przekroju
    + (ciecia ? Object.entries(d.ciecia || {}).map(([p, [x1, y1, x2, y2]]) => '<line class="wk-ciecie wk-ciecie-' + p + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>').join('') : '')
    + '</svg>' + sieci.map((s) => s.tag).join('') + '<div class="wk-kody" aria-hidden="true" hidden></div></div><figcaption>' + cap + '</figcaption></figure>';
}

// Obszary anatomiczne atlasu: nazwa prowadzi do swojej karty, jeśli taka jest, płat do karty Płaty mózgu, istota biała do karty
// Istota szara i istota biała; adres #obszar-<nazwa> otwiera atlas z obszarem bez karty
export function regiony(k = null) {
  const platy = card('Płaty mózgu');
  const url = (n) => { const c = kartaObszaru(n); return c && c !== k ? c.url : ''; };
  return (D.regiony || []).map(([n, plat]) => [n, url(n), plat, plat && platy && platy !== k ? platy.url : '', slugify(n)]);
}
// karty każdej sieci, w kolejności alfabetu, bez karty samej sieci
export function kartySieci(KARTY) {
  return Object.fromEntries(Object.keys(NETN).map((kod) => {
    const own = netCard(kod);
    return [kod, KARTY.filter((x) => x !== own && x.nets.some((n) => n[0] === kod)).map((x) => [x.h, x.url])];
  }));
}
