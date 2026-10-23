// Kolory sieci ze strony startowej dla wiki (jego słowo, 2026-10-23: *Replicate the colors from the brain at the starting page*).
// Czytane wprost ze źródła strony startowej (COL), więc oba miejsca nie mogą się rozejść.
import RAW from '../pages/index.astro?raw';

const m = RAW.match(/const COL[^=]*= (\{[^;]*\});/);
if (!m) throw new Error('mozg.js: brak COL w index.astro');
const COL = Function('return ' + m[1])();
// etykiety mapy strony startowej: 2–8 to sieci
const KOD = { 2: 'VIS', 3: 'SMN', 4: 'DAN', 5: 'CN', 6: 'SN', 7: 'DMN', 8: 'VAN' };
export const KOLOR = Object.fromEntries(Object.entries(KOD).map(([n, kod]) => [kod, COL[n]]));
