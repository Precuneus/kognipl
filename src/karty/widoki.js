// Mózg w Atlasie, jedynym miejscu, gdzie strona rysuje mózg (2026-11-10: *lets make an "Atlas" subpage, next to the wiki*, potem
// *lets remove the graphics of the sieci mozgowe from the wiki*). Wszystko liczy się z jednej objętości: mózg w 3D (`mozg3d.js`)
// i trzy płaskie przekroje (`ziarno.js`). Trzy rysunki z boku, od środka i od dołu zeszły ze strony (jego słowa, 2026-11-11: *the
// locations on the lateral view are off... Maybe we can remove the lateral, medial and verntral old views? And... add a 3rd cut on the
// 3d brain, from lateral to medial to lateral?*); z `mozg-widoki.json` zostały kolejność sieci i sieci wspólne.
import D from './mozg-widoki.json';
import O from './objetosc.json';
import { NETN, netCard, card, slugify, kartaObszaru } from './data.js';
import { OBSZARY, JAK, wGrupie } from './obszary.js';

export const DANE = D;
export const OBJ = O;
// Przekroje z objętości (jego słowa, 2026-11-11: *Slices drawn from a volume onto the same 2D page ... i want this*, potem *cannot we use
// 141 and 17 as they are? lets do it*): szablon MNI 2009c, 141 struktur Allena i 17 sieci Yeo w jednej przestrzeni, cięte w przeglądarce.
// Przekrój czołowy startuje przez ciała suteczkowate, poziomy przez jądra podstawy, strzałkowy przez lewą ścianę przyśrodkową, tam gdzie
// płaszczyzna przecina najwięcej kory z siecią Yeo (2026-11-11: 4353 pola przy x −4,5 mm wobec 3900 przy −6 i 2691 przy −1,5)
export const CIECIE = { czolowy: -10, poziomy: 6, strzalkowy: -4.5 };
// ramka objętości w milimetrach: przekrój i tor suwaka cięcia obejmują ją całą, z móżdżkiem i pniem (audyt 2026-11-16: przekrój poziomy
// stawał na −48 mm, granicy samego kresomózgowia, kiedy ściana w 3D szła przez móżdżek)
const [NX_, NY_, NZ_] = O.wymiar, K_ = O.krok, [X0_, Y0_, Z0_] = O.poczatek;
export const RAMA = { x: [X0_ - K_ / 2, X0_ + (2 * NX_ - 1.5) * K_], y: [Y0_ - K_ / 2, Y0_ + (NY_ - 0.5) * K_], z: [Z0_ - K_ / 2, Z0_ + (NZ_ - 0.5) * K_] };
export const ZAKRES = { czolowy: RAMA.y, poziomy: RAMA.z, strzalkowy: RAMA.x };

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
  'zakręt potyliczny dolny', 'zakręt potyliczny górny', 'klinek', 'zakręt językowaty', 'biegun potyliczny', 'zakręt obręczy', 'wyspa',
  'ciało modzelowate', 'jądro ogoniaste', 'wzgórze', 'skorupa', 'gałka blada', 'przedmurze', 'ciało migdałowate', 'hipokamp', 'komora boczna',
  'komora trzecia', 'okolica suteczkowata podwzgórza', 'pasmo wzrokowe', 'sklepienie', 'śródmózgowie', 'podwzgórze', 'istota biała przodomózgowia'];
// jądra z podręcznika, częste mimo braku kart
const CZESTE = ['istota czarna', 'istota czarna, część zbita', 'istota czarna, część siatkowata', 'pole brzuszne nakrywki', 'jądro półleżące',
  'jądro niskowzgórzowe', 'móżdżek', 'jądra przednie wzgórza', 'jądro przyśrodkowo-grzbietowe wzgórza', 'poduszka wzgórza', 'jądro brzuszne boczne wzgórza',
  'jądro brzuszne tylno-boczne wzgórza', 'jądro brzuszne tylno-przyśrodkowe wzgórza', 'ciało kolankowate boczne', 'ciało kolankowate przyśrodkowe',
  'jądro podstawno-boczne ciała migdałowatego', 'jądra środkowe ciała migdałowatego'];
// inne nazwy grup listy, do szukania (przegląd 2026-11-16: *zwoje podstawy* nic nie znajdowało)
export const GRUPY_INNE = { 'jądra podstawy': ['zwoje podstawy', 'basal ganglia', 'prążkowie', 'striatum'], 'międzymózgowie': ['diencephalon'], 'pień mózgu': ['brainstem'] };
export const PLATY = ['płat czołowy', 'płat ciemieniowy', 'płat skroniowy', 'płat potyliczny', 'płat limbiczny', 'płat wyspowy'];
// widok Płaty (jego słowa, 2026-11-11: *we should add płaty to the views*): płaty w barwach ryc. 2 wpisu 28.10 (rysunek płatów z Wikimedia
// Commons: czołowy niebieski, ciemieniowy żółty, skroniowy zielony, potyliczny różowy), w głębokich odcieniach, odrębnych od jasnych barw
// sieci strony (przegląd 2026-11-11: jasne płaty nosiły barwy LIM, DMN, SMN i CN); limbiczny i wyspowy, których na ryc. 2 nie ma, w barwach
// spoza obu rodzin
export const PLAT_KOL = { 'płat czołowy': '#4f86c9', 'płat ciemieniowy': '#c9a43a', 'płat skroniowy': '#4f9e52', 'płat potyliczny': '#c4506f', 'płat limbiczny': '#8762c4', 'płat wyspowy': '#a8743c' };
// struktury bez płata w układach, które nazywa ontologia Allena; część grupy idzie za swoją grupą
const POD_KORA = [
  ['jądra podstawy', ['jądro ogoniaste', 'skorupa', 'skorupa, część brzuszno-tylna', 'gałka blada', 'gałka blada brzuszna', 'jądro półleżące', 'przedmurze', 'jądro niskowzgórzowe']],
  ['międzymózgowie', ['wzgórze', 'podwzgórze']],
  ['ciało migdałowate i podstawa przodomózgowia', ['ciało migdałowate', 'rozszerzone ciało migdałowate', 'podstawa przodomózgowia', 'jądra przegrody', 'jądro łożyskowe prążka krańcowego']],
  ['istota biała', ['istota biała przodomózgowia', 'ciało modzelowate', 'spoidło przednie', 'sklepienie', 'pęczek suteczkowo-wzgórzowy', 'pasmo wzrokowe', 'promienistość wzrokowa', 'istota biała tyłomózgowia']],
  ['komory', ['komora boczna', 'komora trzecia', 'komora czwarta', 'kanał środkowy rdzenia przedłużonego']],
  ['pień mózgu', ['śródmózgowie', 'część podstawna mostu', 'nakrywka mostu', 'piramida rdzenia przedłużonego', 'nakrywka rdzenia przedłużonego', 'jądro dolne oliwki', 'konar środkowy móżdżku', 'konar dolny móżdżku']],
  // móżdżek jako całość, grupa Allena (CB), z częściami za nią; trzy konary móżdżku razem w pniu, gdzie Allen stawia górny przy śródmózgowiu
  // (przegląd 2026-11-11: nie było jednej odpowiedzi na pytanie o sieci móżdżku, a konary stały w dwóch grupach)
  ['móżdżek', ['móżdżek', 'robak móżdżku', 'część przyrobakowa móżdżku', 'część boczna półkuli móżdżku', 'jądra głębokie móżdżku']],
  ['węchomózgowie i kora bezziarnista', ['opuszka węchowa', 'jądro węchowe przednie', 'kora gruszkowata', 'pasmo węchowe', 'kora wyspowa bezziarnista czołowa', 'kora wyspowa bezziarnista skroniowa', 'próg wyspy']],
];
// Szukanie obszaru (jego słowo, 2026-11-11: *add the search*): obok polskiej nazwy obszar znajduje się po nazwie angielskiej i po
// skrócie, którego używają podręczniki i karty (OFC, ACC, Broca, Heschl, V1 jak na kartach: klinek, zakręt językowaty, biegun potyliczny)
export const ALIASY = {
  'gałka blada, część wewnętrzna': ['globus pallidus internus', 'GPi'],
  'gałka blada, część zewnętrzna': ['globus pallidus externus', 'GPe'],
  'jądro przyśrodkowo-grzbietowe wzgórza': ['mediodorsal nucleus', 'MD', 'jądro grzbietowo-przyśrodkowe'],
  'poduszka wzgórza': ['pulvinar'],
  'ciało kolankowate boczne': ['lateral geniculate nucleus', 'LGN'],
  'ciało kolankowate przyśrodkowe': ['medial geniculate nucleus', 'MGN'],
  // jądra CIT168 (2026-11-15): nazwy angielskie i skróty autorów atlasu
  'istota czarna, część zbita': ['substantia nigra pars compacta', 'SNc'],
  'istota czarna, część siatkowata': ['substantia nigra pars reticulata', 'SNr'],
  'pole brzuszne nakrywki': ['ventral tegmental area', 'VTA', 'brzuszna część nakrywki śródmózgowia'],
  'jądro przyramienne barwnikowe': ['parabrachial pigmented nucleus', 'PBP', 'jądro okołoramienne barwnikowe'],
  'gałka blada brzuszna': ['ventral pallidum', 'VeP', 'pallidum brzuszne'],
  'rozszerzone ciało migdałowate': ['extended amygdala', 'EXA'],
  'ciało suteczkowate': ['mammillary body', 'corpus mamillare', 'ciała suteczkowate'],
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
  // V1 leży wzdłuż bruzdy ostrogowej na klinku i zakręcie językowatym i sięga bieguna; Allen nie ma osobnej V1 (przegląd 2026-11-11:
  // „kora wzrokowa pierwszorzędowa” przy całym obszarze uczyła, że cały klinek to V1)
  'biegun potyliczny': ['occipital pole', 'V1 wzdłuż bruzdy ostrogowej', 'bruzda ostrogowa'],
  'klinek': ['cuneus', 'V1 wzdłuż bruzdy ostrogowej', 'bruzda ostrogowa'],
  // zakręt językowaty, nazwa anatomiczna gyrus lingualis (jego słowo, 2026-11-11: *jezykowaty ok*); dawna nazwa strony zostaje do szukania
  'zakręt językowaty': ['zakręt językowy', 'lingual gyrus', 'V1 wzdłuż bruzdy ostrogowej', 'bruzda ostrogowa'],
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
  'móżdżek': ['cerebellum'],
  'robak móżdżku': ['vermis'],
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
  const ile = (i) => new Set([i].concat(REG.map((_, j) => j + 1).filter((j) => wGrupie(JAK, j, i))).flatMap((j) => (karty[j] || []).map((x) => x[1]))).size + (REG[i - 1][1] ? 1 : 0);
  const klucz = (i) => { const k = KLUCZOWE.indexOf(REG[i - 1][0]); return k < 0 ? 1000 + i : k; };
  const porzadek = (a, b) => ile(b) - ile(a) || klucz(a) - klucz(b);
  const numery = REG.map((_, j) => j + 1);
  const gdzie = (i) => { const [n, , plat] = REG[i - 1]; return plat || (POD_KORA.find(([, xs]) => xs.includes(n)) || ['inne pod korą'])[0]; };
  const grupy = new Map([...PLATY, ...POD_KORA.map(([g]) => g), 'inne pod korą'].map((g) => [g, []]));
  numery.filter((i) => !JAK[i]).forEach((i) => grupy.get(gdzie(i)).push(i));
  // część stoi za swoją grupą, a jej części za nią
  const zCzesciami = (i) => [i, ...numery.filter((j) => JAK[j] === i).sort(porzadek).flatMap(zCzesciami)];
  // obszar częsty (jego słowa, 2026-11-16: *group the regions on the list... from the common in the section at the top... and the secondary
  // obscure regions in a block below*): jeden z 40 obszarów rysunków, obszar z kartą albo z kartami, które w nim leżą, albo jądro
  // z podręcznika (CZESTE); reszta schodzi do bloku pod nim, w tych samych grupach, część z nazwą swojej grupy
  const czesty = (i) => KLUCZOWE.includes(REG[i - 1][0]) || CZESTE.includes(REG[i - 1][0]) || ile(i) > 0;
  return [...grupy].filter(([, xs]) => xs.length).map(([g, xs]) => [g + (GRUPY_INNE[g] ? '|' + GRUPY_INNE[g].join('|') : ''), xs.sort(porzadek).flatMap(zCzesciami).map((i) => [REG[i - 1][0], i, ALIASY[REG[i - 1][0]] || [], czesty(i), JAK[i] ? REG[JAK[i] - 1][0] : ''])]);
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
// suwak cięcia stoi w figurze przekroju, zaraz przy obrazie, a podpis pod nim (render 2026-11-16: podpis między mózgiem a suwakiem
// przypisywał suwak przekrojowi niżej); pionowy suwak stoi obok obrazu
export function zywy(p, os = '') {
  const [W, H] = wymiarPrzekroju(p);
  const pole = '<div class="wk-pole"><canvas class="wk-ziarno" aria-hidden="true"></canvas>'
    + '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true"><path class="wk-linie-zywe" d=""/></svg>'
    + '<div class="wk-kody" aria-hidden="true" hidden></div></div>';
  const srodek = !os ? pole : os === 'z' ? '<div class="at-przy">' + pole + ciecie(os) + '</div>' : pole + ciecie(os);
  return '<figure class="wk-widok wk-widok-' + p + ' wk-zywy" data-objetosc="' + p + '" data-vb="' + W + ' ' + H + '" data-k="' + O.krok + '">'
    + srodek + '<figcaption>' + PRZEKROJ[p][0] + '</figcaption></figure>';
}
// położenie płaskiego przekroju: ukryte pole, które czyta `ziarno.js`; ustawiają je suwaki cięć (`ciecia.js`) i obszar wybrany z listy
const NAZWA_CIECIA = { czolowy: 'czołowy', poziomy: 'poziomy', strzalkowy: 'strzałkowy' };
export function suwak(p) {
  const [lo, hi] = ZAKRES[p];
  return '<input type="range" class="at-suwak" data-p="' + p + '" min="' + lo.toFixed(1) + '" max="' + hi.toFixed(1) + '" step="0.5" value="' + CIECIE[p] + '" tabindex="-1" aria-hidden="true">';
}
// cięcie z obu stron (jego słowa, 2026-11-16: *make maybe 3 brains right to the 3d brain. And each brain... has a suwak to cut in either
// direction. So I can slice from top and from bottom on one suwak; from left and from right on the second, and from front and from back
// on the third*, potem *execute as on the drawing*): dwie gałki na jednym torze, mózg zostaje między nimi. Suwak stoi przy przekroju, na
// którym jego oś leży w płaszczyźnie: góra i dół pionowo przy czołowym, lewa i prawa pod poziomym, lewa po lewej (*lewa / prawa. swap
// it*), przód i tył pod strzałkowym, przód po lewej jak w przekroju. Zakres to cały mózg z móżdżkiem i pniem, więc gałka na końcu nic nie
// tnie; przekrój przy osi, której płaszczyzna jest prostopadła, pokazuje ścianę gałki przesuniętej ostatnio (`ciecia.js`). Za końcem
// wyłącznik chowa przekrój, przy którym stoi suwak (jego słowa, 2026-11-11: *we want a switch on/off button next to each*)
// tor suwaka to ramka przekroju, przy którym stoi, więc gałka stoi naprzeciw swojej złotej linii (audyt 2026-11-16)
export const OSIE = {
  z: { koniec: ['góra', 'dół'], zakres: RAMA.z, przy: 'poziomy', stoi: 'czolowy', ciecie: ['od góry', 'od dołu'], wymiar: 'wysokości' },
  x: { koniec: ['lewa', 'prawa'], zakres: RAMA.x, przy: 'strzalkowy', stoi: 'poziomy', ciecie: ['od lewej', 'od prawej'], wymiar: 'szerokości' },
  y: { koniec: ['przód', 'tył'], zakres: RAMA.y, przy: 'czolowy', stoi: 'strzalkowy', ciecie: ['od przodu', 'od tyłu'], wymiar: 'długości' },
};
export function ciecie(os) {
  const o = OSIE[os], [a, b] = o.koniec, pion = os === 'z';
  const gal = (i) => '<span class="at-gal" role="slider" tabindex="0" data-i="' + i + '" aria-orientation="' + (pion ? 'vertical' : 'horizontal') + '" aria-label="Cięcie ' + o.ciecie[i] + '"></span>';
  return '<div class="at-cie at-cie-' + os + '" data-os="' + os + '" data-lo="' + o.zakres[0] + '" data-hi="' + o.zakres[1] + '" data-plaster="' + o.przy + '" data-domysl="' + CIECIE[o.przy] + '" data-wymiar="' + o.wymiar + '">'
    + '<span class="at-koniec" aria-hidden="true">' + a + '</span>'
    + '<div class="at-tor"><span class="at-zostaje" aria-hidden="true"></span>' + gal(0) + gal(1) + '</div>'
    + '<span class="at-koniec" aria-hidden="true">' + b + '</span>'
    + '<button type="button" class="at-wl" data-p="' + o.stoi + '" role="switch" aria-checked="true" aria-label="Płaski przekrój ' + NAZWA_CIECIA[o.stoi] + '"><span class="at-wl-tor" aria-hidden="true"></span><span class="at-podpis" aria-hidden="true"></span></button></div>';
}
// dane obszarów dla skryptów Atlasu: struktura Allena ma w objętości numer swojego wpisu, JAK wskazuje jej grupę
export function regionyAtlasu(REG) {
  return { REG, A2R: [0].concat(O.obszary.map((_, i) => i + 1)), JAK, RODZAJ: [''].concat(O.obszary.map((r) => r[2])), NAZWY: [''].concat(O.obszary.map((r) => r[1])) };
}
