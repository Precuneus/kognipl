// Widoki mózgu w Atlasie, jedynym miejscu, gdzie strona rysuje mózg (2026-11-10: *lets make an "Atlas" subpage, next to the wiki*, potem
// *lets remove the graphics of the sieci mozgowe from the wiki*). Ziarno rysuje `src/karty/ziarno.js` na płótnie pod liniami, z mapy sieci `<plik>-sieci.png`, mapy obszarów `<plik>-obszary.png`
// i ośrodków `huby` z `mozg-widoki.json`; wielokąty obszarów sieci zostają linkami dla klawiatury i czytnika ekranu.
import D from './mozg-widoki.json';
import O from './objetosc.json';
import { NETN, netCard, card, slugify, kartaObszaru } from './data.js';

export const DANE = D;
export const OBJ = O;
// Przekroje z objętości (jego słowa, 2026-11-11: *Slices drawn from a volume onto the same 2D page ... i want this*, potem *cannot we use
// 141 and 17 as they are? lets do it*): szablon MNI 2009c, 141 struktur Allena i 17 sieci Yeo w jednej przestrzeni, cięte w przeglądarce.
// Linia cięcia na widoku z boku leży tam, gdzie jej płaszczyzna przecina mózg: kora tego rysunku sięga od x 40 do 956 i od y 12 do 552
// jednostek (mapa obszarów), a kora objętości od przodu do tyłu i od góry do dołu mózgu (`mozg` w `objetosc.json`); przekrój startuje
// przez ciała suteczkowate i przez jądra podstawy
export const CIECIE = { czolowy: -10, poziomy: 6 };
export const BOK = { x: [40, 956], y: [12, 552] };
export const naBoku = {
  czolowy: (y) => BOK.x[0] + ((O.mozg.przod - y) / (O.mozg.przod - O.mozg.tyl)) * (BOK.x[1] - BOK.x[0]),
  poziomy: (z) => BOK.y[0] + ((O.mozg.gora - z) / (O.mozg.gora - O.mozg.dol)) * (BOK.y[1] - BOK.y[0]),
};
export const ZAKRES = { czolowy: [O.mozg.tyl + 3, O.mozg.przod - 3], poziomy: [O.mozg.dol + 3, O.mozg.gora - 3] };
// oba rysunki Cartera pokazują lewą półkulę, więc podpis ją nazywa (przegląd 2026-11-09); przekroje pokazują obie półkule, druga to
// odbicie pierwszej w linii środkowej (jego słowa, 2026-11-10: *I'd like the view on the both hemispheres on the sections*)
export const PODPIS = {
  lateral: ['z boku, lewa półkula', 'lewej półkuli z boku'],
  medial: ['od środka, lewa półkula', 'lewej półkuli od środka'],
  ventral: ['od dołu', 'mózgu od dołu'],
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
    // przeciągnięta linia przesuwa swój przekrój (2026-11-11); uchwyt jest szerszy od linii, żeby trafił w nią palec
    + (ciecia ? ['czolowy', 'poziomy'].map((p) => {
      const c = naBoku[p](CIECIE[p]);
      const [x1, y1, x2, y2] = p === 'czolowy' ? [c, 6.9, c, 563.4] : [32.7, c, 966.1, c];
      const xy = ' x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"';
      return '<line class="wk-ciecie wk-ciecie-' + p + '"' + xy + '/><line class="wk-chwyt" data-p="' + p + '"' + xy + '/>';
    }).join('') : '')
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

// Przekrój z objętości: płótno ziarna, linie rysowane w przeglądarce z szablonu i suwak położenia, który przesuwa też linię cięcia na
// widoku z boku; ramka ma stałe wymiary całego mózgu, więc przekrój nie zmienia rozmiaru przy przesuwaniu
const PRZEKROJ = { czolowy: ['w przekroju czołowym', 'przekroju czołowego'], poziomy: ['w przekroju poziomym', 'przekroju poziomego'] };
export function wymiarPrzekroju(p) {
  const [NX, NY, NZ] = O.wymiar, s = O.krok;
  return [(2 * NX - 1) * s, (p === 'czolowy' ? NZ : NY) * s];
}
export function zywy(p) {
  const [W, H] = wymiarPrzekroju(p), [lo, hi] = ZAKRES[p];
  return '<figure class="wk-widok wk-widok-' + p + ' wk-zywy" data-objetosc="' + p + '" data-vb="' + W + ' ' + H + '" data-k="' + O.krok + '">'
    + '<div class="wk-pole"><canvas class="wk-ziarno" aria-hidden="true"></canvas>'
    + '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true"><path class="wk-linie-zywe" d=""/></svg>'
    + '<div class="wk-kody" aria-hidden="true" hidden></div></div><figcaption>' + PRZEKROJ[p][0] + '</figcaption>'
    + '<input type="range" class="at-suwak" data-p="' + p + '" min="' + lo.toFixed(1) + '" max="' + hi.toFixed(1) + '" step="0.5" value="' + CIECIE[p] + '" aria-label="Położenie ' + PRZEKROJ[p][1] + '">'
    + '</figure>';
}
// obszary Atlasu: 40 obszarów rysunków i struktury Allena takie, jakie są; struktura o nazwie obszaru rysunku jest tym obszarem, część
// grupy, którą Allen nazywa jak obszar rysunku (głowa hipokampa w formacji hipokampa), ma własny wpis i wskazuje ten obszar (JAK)
export function regionyAtlasu(REG) {
  const nr = (n) => REG.findIndex((r) => r[0] === n) + 1;
  const platy = card('Płaty mózgu');
  const out = REG.slice(), A2R = [0], JAK = new Array(REG.length + 1).fill(0);
  for (const [, pl, kind, jak, plat] of O.obszary) {
    const sam = nr(pl);
    if (sam) { A2R.push(sam); continue; }
    out.push([pl, '', plat, plat && platy ? platy.url : '', slugify(pl)]);
    A2R.push(out.length);
    JAK.push(jak ? nr(jak) : 0);
  }
  return { REG: out, A2R, JAK, RODZAJ: [''].concat(O.obszary.map((r) => r[2])), NAZWY: [''].concat(O.obszary.map((r) => r[1])) };
}
