// Mózg w Atlasie, jedynym miejscu, gdzie strona rysuje mózg (2026-11-10: *lets make an "Atlas" subpage, next to the wiki*, potem
// *lets remove the graphics of the sieci mozgowe from the wiki*). Wszystko liczy się z jednej objętości: mózg w 3D (`mozg3d.js`)
// i trzy płaskie przekroje (`ziarno.js`). Trzy rysunki z boku, od środka i od dołu zeszły ze strony (jego słowa, 2026-11-11: *the
// locations on the lateral view are off... Maybe we can remove the lateral, medial and verntral old views? And... add a 3rd cut on the
// 3d brain, from lateral to medial to lateral?*); z `mozg-widoki.json` zostały kolejność sieci i sieci wspólne.
import D from './mozg-widoki.json';
import O from './objetosc.json';
import { NETN, netCard, card, slugify, kartaObszaru } from './data.js';
import { OBSZARY, JAK } from './obszary.js';

export const DANE = D;
export const OBJ = O;
// Przekroje z objętości (jego słowa, 2026-11-11: *Slices drawn from a volume onto the same 2D page ... i want this*, potem *cannot we use
// 141 and 17 as they are? lets do it*): szablon MNI 2009c, 141 struktur Allena i 17 sieci Yeo w jednej przestrzeni, cięte w przeglądarce.
// Przekrój czołowy startuje przez ciała suteczkowate, poziomy przez jądra podstawy, strzałkowy przez lewą ścianę przyśrodkową, tam gdzie
// płaszczyzna przecina najwięcej kory z siecią Yeo (2026-11-11: 4353 pola przy x −4,5 mm wobec 3900 przy −6 i 2691 przy −1,5)
export const CIECIE = { czolowy: -10, poziomy: 6, strzalkowy: -4.5 };
export const ZAKRES = {
  czolowy: [O.mozg.tyl + 3, O.mozg.przod - 3],
  poziomy: [O.mozg.dol + 3, O.mozg.gora - 3],
  strzalkowy: [-O.mozg.bok + 3, O.mozg.bok - 3],
};

// Obszary Atlasu (struktury Allena i ich grupy, `obszary.js`): nazwa prowadzi do swojej karty, jeśli taka jest, płat do karty Płaty
// mózgu; adres #obszar-<nazwa> otwiera Atlas z obszarem bez karty
export function regiony(k = null) {
  const platy = card('Płaty mózgu');
  const url = (n) => { const c = kartaObszaru(n); return c && c !== k ? c.url : ''; };
  return OBSZARY.map(({ nazwa, plat }) => [nazwa, url(nazwa), plat, plat && platy && platy !== k ? platy.url : '', slugify(nazwa)]);
}
// karty każdej sieci, w kolejności alfabetu, bez karty samej sieci
export function kartySieci(KARTY) {
  return Object.fromEntries(Object.keys(NETN).map((kod) => {
    const own = netCard(kod);
    return [kod, KARTY.filter((x) => x !== own && x.nets.some((n) => n[0] === kod)).map((x) => [x.h, x.url])];
  }));
}

// Przekrój z objętości: płótno ziarna i linie rysowane w przeglądarce z szablonu; cięcie przesuwają suwaki na osiach mózgu w 3D; ramka
// ma stałe wymiary całego mózgu, więc przekrój nie zmienia rozmiaru przy przesuwaniu. Czołowy i poziomy pokazują obie półkule, strzałkowy
// jedną płaszczyznę, przód po lewej, jak mózg w 3D
const PRZEKROJ = {
  czolowy: ['w przekroju czołowym', 'przekroju czołowego'],
  poziomy: ['w przekroju poziomym', 'przekroju poziomego'],
  strzalkowy: ['w przekroju strzałkowym', 'przekroju strzałkowego'],
};
export function wymiarPrzekroju(p) {
  const [NX, NY, NZ] = O.wymiar, s = O.krok;
  if (p === 'strzalkowy') return [NY * s, NZ * s];
  return [(2 * NX - 1) * s, (p === 'czolowy' ? NZ : NY) * s];
}
export function zywy(p) {
  const [W, H] = wymiarPrzekroju(p);
  return '<figure class="wk-widok wk-widok-' + p + ' wk-zywy" data-objetosc="' + p + '" data-vb="' + W + ' ' + H + '" data-k="' + O.krok + '">'
    + '<div class="wk-pole"><canvas class="wk-ziarno" aria-hidden="true"></canvas>'
    + '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true"><path class="wk-linie-zywe" d=""/></svg>'
    + '<div class="wk-kody" aria-hidden="true" hidden></div></div><figcaption>' + PRZEKROJ[p][0] + '</figcaption></figure>';
}
// suwak cięcia na osi mózgu w 3D: czołowy biegnie od przodu do tyłu, poziomy od góry do dołu, strzałkowy od prawej półkuli do lewej,
// bo w widoku startowym lewa półkula stoi bliżej i niżej, a prawa wychodzi za nią w lewo; końce nazwane
const KONCE = { czolowy: ['przód', 'tył', ' dir="rtl"'], poziomy: ['góra', 'dół', ''], strzalkowy: ['prawa', 'lewa', ' dir="rtl"'] };
export function suwak(p) {
  const [lo, hi] = ZAKRES[p], [a, b, dir] = KONCE[p];
  return '<div class="at-os at-os-' + p + '"><span aria-hidden="true">' + a + '</span>'
    + '<input type="range" class="at-suwak" data-p="' + p + '"' + dir + ' min="' + lo.toFixed(1) + '" max="' + hi.toFixed(1) + '" step="0.5" value="' + CIECIE[p] + '" aria-label="Położenie ' + PRZEKROJ[p][1] + '">'
    + '<span aria-hidden="true">' + b + '</span></div>';
}
// dane obszarów dla skryptów Atlasu: struktura Allena ma w objętości numer swojego wpisu, JAK wskazuje jej grupę
export function regionyAtlasu(REG) {
  return { REG, A2R: [0].concat(O.obszary.map((_, i) => i + 1)), JAK, RODZAJ: [''].concat(O.obszary.map((r) => r[2])), NAZWY: [''].concat(O.obszary.map((r) => r[1])) };
}
