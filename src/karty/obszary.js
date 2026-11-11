// Obszary Atlasu: atlas Allena przyjęty w całości (jego słowa, 2026-11-11: *We adopt allen atlas fully*). Lista to 141 struktur Allen
// Human Reference Atlas 3D 2020 w kolejności objętości, a za nimi grupy, które Allen nazywa w swojej ontologii (formacja hipokampa,
// zakręt obręczy, wyspa i inne), oraz kora okołooczodołowa, czyli cztery zakręty oczodołowe Allena razem, bo tak ją nazywa jej karta.
// Grupa, która sama jest strukturą (wzgórze, podwzgórze, ciało migdałowate), nie dostaje drugiego wpisu. JAK wskazuje grupę struktury,
// więc zaznaczenie grupy zapala jej części, a zaznaczenie części jej grupę na rysunkach, w przekrojach i w mózgu w 3D.
import O from './objetosc.json';

const NAZWY = O.obszary.map((r) => r[1]);
// [nazwa, płat, rodzaj] każdego wpisu, numer wpisu = pozycja + 1; struktura Allena ma numer swojej wartości w objętości
export const OBSZARY = O.obszary.map(([, pl, rodzaj, , plat]) => ({ nazwa: pl, plat, rodzaj }));
const grupy = [];
for (const [, , , g, plat] of O.obszary) if (g && !NAZWY.includes(g) && !grupy.some((x) => x.nazwa === g)) grupy.push({ nazwa: g, plat, rodzaj: 'grupa' });
OBSZARY.push(...grupy);
const numer = (n) => OBSZARY.findIndex((o) => o.nazwa === n) + 1;
export const JAK = [0].concat(OBSZARY.map((o, i) => (i < O.obszary.length && O.obszary[i][3] ? numer(O.obszary[i][3]) : 0)));
export const NAZWA_BIALEJ = 'istota biała przodomózgowia';
export { numer as numerObszaru };
