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
// Lista obszarów do wyboru (jego słowa, 2026-11-11: *sort the regions on the list better. At the beginning they should be key regions in
// key lobes*): płaty od przodu do tyłu, potem płat limbiczny i wyspa, a za nimi struktury pod korą w swoich układach. W każdej grupie
// pierwszy jest obszar z najwięcej kartami, które w nim leżą, i własną (ważność to liczba połączeń, design), przy równej liczbie obszar z KLUCZOWYCH,
// czyli 40 obszarów, które Atlas rysował z rysunków kolokwium do przyjęcia atlasu Allena, w ich kolejności i w nazwach Allena, na końcu
// reszta w kolejności objętości. Część grupy Allena (głowa hipokampa, zakręty oczodołowe) stoi zaraz za swoją grupą.
const KLUCZOWE = ['zakręt czołowy górny', 'zakręt czołowy środkowy', 'zakręt czołowy dolny', 'zakręt przedśrodkowy', 'kora okołooczodołowa',
  'zakręt prosty', 'płacik okołośrodkowy, część przednia', 'płacik okołośrodkowy, część tylna', 'zakręt zaśrodkowy', 'płacik ciemieniowy górny',
  'zakręt nadbrzeżny', 'zakręt kątowy', 'przedklinek', 'zakręt skroniowy górny', 'zakręt skroniowy środkowy', 'zakręt skroniowy dolny',
  'biegun skroniowy', 'zakręt wrzecionowaty, część skroniowa', 'zakręt wrzecionowaty, część potyliczna', 'zakręt przyhipokampowy',
  'zakręt potyliczny dolny', 'zakręt potyliczny górny', 'klinek', 'zakręt językowy', 'biegun potyliczny', 'zakręt obręczy', 'wyspa',
  'ciało modzelowate', 'jądro ogoniaste', 'wzgórze', 'skorupa', 'gałka blada', 'przedmurze', 'ciało migdałowate', 'hipokamp', 'komora boczna',
  'komora trzecia', 'okolica suteczkowata podwzgórza', 'pasmo wzrokowe', 'sklepienie', 'śródmózgowie', 'podwzgórze', 'istota biała przodomózgowia'];
const PLATY = ['płat czołowy', 'płat ciemieniowy', 'płat skroniowy', 'płat potyliczny', 'płat limbiczny', 'płat wyspowy'];
// struktury bez płata w układach, które nazywa ontologia Allena; część grupy idzie za swoją grupą
const POD_KORA = [
  ['jądra podstawy', ['jądro ogoniaste', 'skorupa', 'skorupa, część brzuszno-tylna', 'gałka blada', 'jądro półleżące', 'przedmurze', 'jądro niskowzgórzowe']],
  ['międzymózgowie', ['wzgórze', 'podwzgórze']],
  ['ciało migdałowate i podstawa przodomózgowia', ['ciało migdałowate', 'podstawa przodomózgowia', 'jądra przegrody', 'jądro łożyskowe prążka krańcowego']],
  ['istota biała', ['istota biała przodomózgowia', 'ciało modzelowate', 'spoidło przednie', 'sklepienie', 'pęczek suteczkowo-wzgórzowy', 'pasmo wzrokowe', 'promienistość wzrokowa', 'istota biała tyłomózgowia']],
  ['komory', ['komora boczna', 'komora trzecia', 'komora czwarta', 'kanał środkowy rdzenia przedłużonego']],
  ['pień mózgu', ['śródmózgowie', 'część podstawna mostu', 'nakrywka mostu', 'piramida rdzenia przedłużonego', 'nakrywka rdzenia przedłużonego', 'jądro dolne oliwki']],
  ['móżdżek', ['robak móżdżku', 'część przyrobakowa móżdżku', 'część boczna półkuli móżdżku', 'jądra głębokie móżdżku', 'konar dolny móżdżku', 'konar środkowy móżdżku']],
  ['węchomózgowie i kora bezziarnista', ['opuszka węchowa', 'jądro węchowe przednie', 'kora gruszkowata', 'pasmo węchowe', 'kora wyspowa bezziarnista czołowa', 'kora wyspowa bezziarnista skroniowa', 'próg wyspy']],
];
// Szukanie obszaru (jego słowo, 2026-11-11: *add the search*): obok polskiej nazwy obszar znajduje się po nazwie angielskiej i po
// skrócie, którego używają podręczniki i karty (OFC, ACC, Broca, Heschl, V1 jak na kartach: klinek, zakręt językowy, biegun potyliczny)
export const ALIASY = {
  'kora okołooczodołowa': ['OFC', 'orbitofrontal cortex', 'kora oczodołowo-czołowa'],
  'zakręt czołowy górny': ['superior frontal gyrus', 'SFG'],
  'zakręt czołowy środkowy': ['middle frontal gyrus', 'MFG'],
  'zakręt czołowy dolny': ['inferior frontal gyrus', 'IFG'],
  'zakręt czołowy dolny, część trójkątna': ['pars triangularis', 'Broca', 'ośrodek Broki'],
  'zakręt czołowy dolny, część wieczkowa': ['pars opercularis', 'Broca', 'ośrodek Broki'],
  'zakręt przedśrodkowy': ['precentral gyrus', 'M1', 'kora ruchowa pierwszorzędowa'],
  'zakręt prosty': ['gyrus rectus'],
  'biegun czołowy': ['frontal pole'],
  'płacik okołośrodkowy, część przednia': ['paracentral lobule'],
  'płacik okołośrodkowy, część tylna': ['paracentral lobule'],
  'zakręt zaśrodkowy': ['postcentral gyrus', 'S1', 'kora somatosensoryczna pierwszorzędowa'],
  'płacik ciemieniowy górny': ['superior parietal lobule', 'SPL'],
  'zakręt nadbrzeżny': ['supramarginal gyrus', 'SMG'],
  'zakręt kątowy': ['angular gyrus'],
  'przedklinek': ['precuneus'],
  'zakręt skroniowy górny': ['superior temporal gyrus', 'STG', 'Wernicke', 'ośrodek Wernickego'],
  'zakręt skroniowy środkowy': ['middle temporal gyrus', 'MTG'],
  'zakręt skroniowy dolny': ['inferior temporal gyrus', 'ITG'],
  'zakręt skroniowy poprzeczny (Heschla)': ['Heschl', 'transverse temporal gyrus', 'A1', 'kora słuchowa pierwszorzędowa'],
  'płaszczyzna skroniowa': ['planum temporale', 'Wernicke', 'ośrodek Wernickego'],
  'biegun skroniowy': ['temporal pole'],
  'zakręt wrzecionowaty, część skroniowa': ['fusiform gyrus', 'FFA'],
  'zakręt wrzecionowaty, część potyliczna': ['fusiform gyrus', 'FFA'],
  'biegun potyliczny': ['occipital pole', 'V1', 'kora wzrokowa pierwszorzędowa'],
  'klinek': ['cuneus', 'V1', 'kora wzrokowa pierwszorzędowa'],
  'zakręt językowy': ['lingual gyrus', 'V1', 'kora wzrokowa pierwszorzędowa'],
  'zakręt potyliczny dolny': ['inferior occipital gyrus'],
  'zakręt potyliczny górny': ['superior occipital gyrus'],
  'zakręt obręczy': ['cingulate gyrus'],
  'zakręt obręczy, część przednia': ['anterior cingulate', 'ACC'],
  'zakręt obręczy, część tylna': ['posterior cingulate', 'PCC'],
  'hipokamp': ['hippocampus', 'formacja hipokampa'],
  'zakręt przyhipokampowy': ['parahippocampal gyrus', 'PHG'],
  'wyspa': ['insula', 'kora wyspy'],
  'ciało migdałowate': ['amygdala'],
  'wzgórze': ['thalamus'],
  'podwzgórze': ['hypothalamus'],
  'okolica suteczkowata podwzgórza': ['ciała suteczkowate', 'mammillary bodies'],
  'poduszka wzgórza': ['pulvinar'],
  'ciało kolankowate boczne': ['lateral geniculate nucleus', 'LGN'],
  'ciało kolankowate przyśrodkowe': ['medial geniculate nucleus', 'MGN'],
  'jądro ogoniaste': ['caudate nucleus', 'prążkowie', 'striatum'],
  'skorupa': ['putamen', 'prążkowie', 'striatum', 'jądro soczewkowate'],
  'gałka blada': ['globus pallidus', 'jądro soczewkowate'],
  'jądro półleżące': ['nucleus accumbens', 'prążkowie brzuszne'],
  'jądro niskowzgórzowe': ['subthalamic nucleus', 'STN'],
  'przedmurze': ['claustrum'],
  'istota czarna': ['substantia nigra'],
  'jądro czerwienne': ['red nucleus'],
  'wzgórek górny': ['superior colliculus'],
  'wzgórek dolny': ['inferior colliculus'],
  'śródmózgowie': ['midbrain', 'mesencephalon'],
  'część podstawna mostu': ['pons', 'most'],
  'nakrywka mostu': ['pons', 'most'],
  'piramida rdzenia przedłużonego': ['medulla oblongata', 'rdzeń przedłużony'],
  'nakrywka rdzenia przedłużonego': ['medulla oblongata', 'rdzeń przedłużony'],
  'robak móżdżku': ['vermis', 'cerebellum'],
  'część boczna półkuli móżdżku': ['cerebellum', 'półkula móżdżku'],
  'ciało modzelowate': ['corpus callosum'],
  'sklepienie': ['fornix'],
  'spoidło przednie': ['anterior commissure'],
  'pasmo wzrokowe': ['optic tract'],
  'promienistość wzrokowa': ['optic radiation'],
  'istota biała przodomózgowia': ['white matter', 'istota biała'],
  'komora boczna': ['lateral ventricle'],
  'komora trzecia': ['third ventricle'],
  'komora czwarta': ['fourth ventricle'],
  'opuszka węchowa': ['olfactory bulb'],
  'kora gruszkowata': ['piriform cortex'],
};
// REG: obszary jak z `regiony()`, numer = pozycja + 1; karty: numer obszaru → karty, które w nim leżą; wpis listy to [nazwa, numer,
// inne nazwy do szukania]
export function listaObszarow(REG, karty) {
  // karty w obszarze i w jego częściach, każda raz, i jego własna karta
  const ile = (i) => new Set([i].concat(REG.map((_, j) => j + 1).filter((j) => JAK[j] === i)).flatMap((j) => (karty[j] || []).map((x) => x[1]))).size + (REG[i - 1][1] ? 1 : 0);
  const klucz = (i) => { const k = KLUCZOWE.indexOf(REG[i - 1][0]); return k < 0 ? 1000 + i : k; };
  const porzadek = (a, b) => ile(b) - ile(a) || klucz(a) - klucz(b);
  const numery = REG.map((_, j) => j + 1);
  const gdzie = (i) => { const [n, , plat] = REG[i - 1]; return plat || (POD_KORA.find(([, xs]) => xs.includes(n)) || ['inne pod korą'])[0]; };
  const grupy = new Map([...PLATY, ...POD_KORA.map(([g]) => g), 'inne pod korą'].map((g) => [g, []]));
  numery.filter((i) => !JAK[i]).forEach((i) => grupy.get(gdzie(i)).push(i));
  return [...grupy].filter(([, xs]) => xs.length).map(([g, xs]) => [g, xs.sort(porzadek).flatMap((i) => [i, ...numery.filter((j) => JAK[j] === i).sort(porzadek)]).map((i) => [REG[i - 1][0], i, ALIASY[REG[i - 1][0]] || []])]);
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
// bo w widoku startowym lewa półkula stoi bliżej i niżej, a prawa wychodzi za nią w lewo; końce nazwane. Za końcem suwaka wyłącznik
// cięcia (jego słowa, 2026-11-11: *we want a switch on/off button next to each*, potem *these 2d views should disappear, not the part
// of the 3d view*): wyłączony chowa płaski przekrój tego cięcia
const NAZWA_CIECIA = { czolowy: 'czołowy', poziomy: 'poziomy', strzalkowy: 'strzałkowy' };
const KONCE = { czolowy: ['przód', 'tył', ' dir="rtl"'], poziomy: ['góra', 'dół', ''], strzalkowy: ['prawa', 'lewa', ' dir="rtl"'] };
export function suwak(p) {
  const [lo, hi] = ZAKRES[p], [a, b, dir] = KONCE[p];
  return '<div class="at-os at-os-' + p + '"><span aria-hidden="true">' + a + '</span>'
    + '<input type="range" class="at-suwak" data-p="' + p + '"' + dir + ' min="' + lo.toFixed(1) + '" max="' + hi.toFixed(1) + '" step="0.5" value="' + CIECIE[p] + '" aria-label="Położenie ' + PRZEKROJ[p][1] + '">'
    + '<span aria-hidden="true">' + b + '</span>'
    + '<button type="button" class="at-wl" data-p="' + p + '" role="switch" aria-checked="true" aria-label="Płaski przekrój ' + NAZWA_CIECIA[p] + '"><span class="at-wl-tor" aria-hidden="true"></span><span class="at-podpis" aria-hidden="true"></span></button></div>';
}
// dane obszarów dla skryptów Atlasu: struktura Allena ma w objętości numer swojego wpisu, JAK wskazuje jej grupę
export function regionyAtlasu(REG) {
  return { REG, A2R: [0].concat(O.obszary.map((_, i) => i + 1)), JAK, RODZAJ: [''].concat(O.obszary.map((r) => r[2])), NAZWY: [''].concat(O.obszary.map((r) => r[1])) };
}
