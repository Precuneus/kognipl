// Połączenia w Atlasie (jego słowa, 2026-11-18: *I want the connections on the atlas, not the landing page*, potem *ok, start preparing
// the first option*): macierze HCP z ENIGMA Toolbox (Larivière i in. 2021) w 400 parcelach Schaefera i siedmiu strukturach pod korą na
// półkulę. Każde pole siatki Atlasu i każdy punkt powierzchni 3D nosi parcelę, w której leży; każda parcela ma partnerów włókien i to,
// jak blisko jej aktywność idzie z aktywnością każdej innej. Plik liczy `polaczenia.py` w potoku rysunków Atlasu; wczytuje się raz, kiedy
// czytelnik pierwszy raz otworzy tryb Połączenia, a przekroje i mózg w 3D biorą tę samą obietnicę.
let obietnica = null;

async function gz(url) {
  const r = await fetch(url);
  if (!r.ok || !('DecompressionStream' in window)) throw new Error(url);
  return new Uint8Array(await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
}

export function wczytajPolaczenia(url) {
  if (obietnica) return obietnica;
  obietnica = Promise.all([gz(url), fetch(url.replace(/\.bin$/, '.json')).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))]).then(([b, meta]) => {
    const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
    const NV = dv.getUint32(0, true), nv = dv.getUint32(4, true), ne = dv.getUint32(8, true), NP = dv.getUint32(12, true);
    let o = 16;
    const kopia16 = (n, T) => { const a = new T(b.buffer.slice(b.byteOffset + o, b.byteOffset + o + n * 2)); o += n * 2; return a; };
    const cen10 = kopia16(NP * 3, Int16Array), ei = kopia16(ne, Uint16Array), ej = kopia16(ne, Uint16Array);
    const bajty = (n) => { const a = b.subarray(o, o + n); o += n; return a; };
    const ew = bajty(ne), L = bajty(NV), R = bajty(NV), wierz = bajty(nv), fc = bajty(NP * NP);
    const cen = new Float32Array(NP * 3);
    for (let i = 0; i < NP * 3; i++) cen[i] = cen10[i] / 10;
    // partnerzy włókien każdej parceli: [indeks, siła 0..1]
    const wlokna = Array.from({ length: NP }, () => []);
    for (let e = 0; e < ne; e++) { const w = ew[e] / 255; wlokna[ei[e]].push([ej[e], w]); wlokna[ej[e]].push([ei[e], w]); }
    const sasiad = Array.from({ length: NP }, () => new Map());
    wlokna.forEach((xs, i) => xs.forEach(([j, w]) => sasiad[i].set(j, w)));
    return { NV, nv, NP, cen, L, R, wierz, fc, wlokna, sasiad, meta };
  });
  return obietnica;
}

// indeks w macierzy wartości kanału półkuli: 1..200 parcela kory, 201..207 struktura pod korą
export const indeks = (v, h) => (!v ? -1 : v <= 200 ? h * 200 + v - 1 : 400 + h * 7 + v - 201);

// plaster parcel: jak plaster objętości, z prawą półkulą z kanału prawego (Atlas rysuje prawą półkulę jako odbicie lewej, a parcele
// prawej półkuli to parcele prawej półkuli w miejscach tego odbicia); wartość to indeks w macierzy + 1, 0 bez parceli
export function plasterParcel(D, O, p, mm) {
  const [NX, NY, NZ] = O.wymiar, k = O.krok;
  const idx = (os, n, v) => Math.max(0, Math.min(n - 1, Math.round((v - O.poczatek[os]) / k)));
  if (p === 'strzalkowy') {
    const xi = idx(0, NX, -Math.abs(mm)), W = NY, H = NZ, out = new Uint16Array(W * H), h = mm > 0 ? 1 : 0, ch = h ? D.R : D.L;
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) out[r * W + c] = indeks(ch[((NY - 1 - c) * NZ + (NZ - 1 - r)) * NX + xi], h) + 1;
    return { W, H, v: out };
  }
  const W = 2 * NX - 1, H = p === 'czolowy' ? NZ : NY;
  const i = p === 'czolowy' ? idx(1, NY, mm) : idx(2, NZ, mm);
  const out = new Uint16Array(W * H);
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
    const h = c < NX ? 0 : 1, xi = c < NX ? c : 2 * (NX - 1) - c;
    const yi = p === 'czolowy' ? i : NY - 1 - r, zi = p === 'czolowy' ? NZ - 1 - r : i;
    out[r * W + c] = indeks((h ? D.R : D.L)[(yi * NZ + zi) * NX + xi], h) + 1;
  }
  return { W, H, v: out };
}

// barwy trybu: aktywność razem z zaznaczoną parcelą od szarości do ciepłej bieli w ośmiu stopniach (przekroje i ściany cięć), partner
// włókien w białej obwódce, jak białe łuki w 3D
export const RAZEM = Array.from({ length: 8 }, (_, j) => { const t = j / 7, m = (a, b) => Math.round(a + (b - a) * t); return 'rgba(' + m(226, 246) + ',' + m(221, 231) + ',' + m(212, 207) + ',' + (0.13 + 0.82 * t).toFixed(2) + ')'; });
export const KREM = '#f6e7cf';
export const BIALE = 'rgba(250,248,242,0.95)';

// jak blisko aktywność dwóch parcel idzie razem, 0..1 na skali barwy: z (ujemne zero) od 0,08 do 0,58
export const razem = (D, a, b) => { const z = (D.fc[a * D.NP + b] / 255) * D.meta.skala_razem; return Math.max(0, Math.min(1, (z - 0.08) / 0.5)); };
