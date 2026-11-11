// Ziarno na mózgu karty (jego wybór, 2026-11-09: *ziarno, I love it*): kora to pole drobnych ziaren, każde należy w danej chwili
// do jednej sieci i co jakiś czas przechodzi do innej, z wagami sieci w swoim miejscu. Rdzeń sieci trzyma kolor, ośrodek wspólny
// kilku sieciom migocze między nimi (jego słowa: *real multi-membership and the time*). Sieci karty świecą swoim kolorem, reszta
// ziaren to ciepła szarość. Wskazane miejsce pokazuje kody wszystkich sieci, które tam są, najsilniejsza pierwsza, i zapala je
// we wszystkich widokach; klik wpisuje obszar i sieci miejsca nad tytuł karty i nie przenosi (2026-11-10). Bez ruchu (przełącznik animacji albo
// ustawienie systemu) ziarno losuje się raz i stoi.
// Przegląd 2026-11-09: wspólne są tylko miejsca, których sieci nazywa span (`wspolne` w `mozg-widoki.json`), sieci dzielą je po
// równo, bo żaden span nie podaje wag. W przekrojach z objętości (2026-11-11) wspólna jest też sieć Yeo, którą span dzieli między
// dwie sieci strony (istotności i brzuszna uwagi). Ziarno zmienia sieć na brzegach sieci i w miejscach wspólnych. Świecą też sieci,
// z którymi świecąca sieć dzieli miejsce, w tym miejscu.
const ODSTEP = 3.5; // odstęp ziaren w pikselach ekranu
const PROMIEN = 1.4;
const ZMIANA = 0.1; // część ziaren losowana na nowo w każdym takcie, więc ziarno zmienia się mniej więcej raz na sekundę
const TAKT = 100; // ms
// sieć jest w miejscu, kiedy jej udział przekracza 1/7, jak u Yeo i in. 2014 (s:yeo2014-association-multi-network-sensorimotor-isolated)
const PROG = 1 / 7;
const SZARE = 'rgba(226,221,212,0.13)';
const JASNE = 'rgba(226,221,212,0.42)'; // obszar pod wskaźnikiem w trybie obszarów
const ZLOTE = '#f0c060'; // zaznaczony obszar, kolor Iskry i fokusu

function cicho() {
  if (document.documentElement.classList.contains('roj-cicho')) return true;
  let z = null;
  try { z = localStorage.getItem('kogni-animacje'); } catch (e) {}
  return z ? z === 'off' : matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// rozmycie pudełkowe trzy razy z rzędu, bliskie gaussowskiemu
function rozmyj(a, W, H, r) {
  let s = a;
  const t = new Float32Array(a.length);
  for (let p = 0; p < 3; p++) {
    const o = new Float32Array(a.length);
    for (let y = 0; y < H; y++) {
      let acc = 0;
      for (let x = -r; x < W + r; x++) {
        if (x + r < W) acc += s[y * W + x + r];
        if (x - r - 1 >= 0) acc -= s[y * W + x - r - 1];
        if (x >= 0 && x < W) t[y * W + x] = acc / (2 * r + 1);
      }
    }
    for (let x = 0; x < W; x++) {
      let acc = 0;
      for (let y = -r; y < H + r; y++) {
        if (y + r < H) acc += t[(y + r) * W + x];
        if (y - r - 1 >= 0) acc -= t[(y - r - 1) * W + x];
        if (y >= 0 && y < H) o[y * W + x] = acc / (2 * r + 1);
      }
    }
    s = o;
  }
  return s;
}

// stały generator liczb, żeby ziarno bez ruchu wyglądało tak samo przy każdym otwarciu
function los(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// --- przekroje z objętości (2026-11-11): objętość to cztery pola na siatce lewej półkuli co 1,5 mm (tkanka, istota biała, struktura
// Allena, sieć Yeo), w kolejności y, z, x; przekrój bierze płaszczyznę i odbija ją w linii środkowej, jak dotąd przekroje Cartera
async function wczytajObjetosc(url) {
  const r = await fetch(url);
  if (!r.ok || !('DecompressionStream' in window)) throw new Error('objetosc');
  return new Uint8Array(await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
}
function plaster(vol, O, pole, p, mm) {
  // czołowy: stałe y, kolumny x obu półkul, wiersze z od góry; poziomy: stałe z, wiersze y od przodu; strzałkowy: stałe x (półkula
  // prawa to odbicie lewej), kolumny y od przodu, wiersze z od góry
  const [NX, NY, NZ] = O.wymiar, NV = NX * NY * NZ, f = pole * NV, k = O.krok;
  const idx = (os, n, v) => Math.max(0, Math.min(n - 1, Math.round((v - O.poczatek[os]) / k)));
  if (p === 'strzalkowy') {
    const xi = idx(0, NX, -Math.abs(mm)), W = NY, H = NZ, out = new Uint8Array(W * H);
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) out[r * W + c] = vol[f + ((NY - 1 - c) * NZ + (NZ - 1 - r)) * NX + xi];
    return { W, H, v: out };
  }
  const W = 2 * NX - 1, H = p === 'czolowy' ? NZ : NY;
  const i = p === 'czolowy' ? idx(1, NY, mm) : idx(2, NZ, mm);
  const out = new Uint8Array(W * H);
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
    const xi = c < NX ? c : 2 * (NX - 1) - c;
    const yi = p === 'czolowy' ? i : NY - 1 - r, zi = p === 'czolowy' ? NZ - 1 - r : i;
    out[r * W + c] = vol[f + (yi * NZ + zi) * NX + xi];
  }
  return { W, H, v: out };
}
// linia, na której pole przechodzi przez próg, odcinkami po komórkach siatki (marching squares), w jednostkach rysunku
function kontur(a, W, H, prog, k, x0 = 0, y0 = 0, x1 = W - 1, y1 = H - 1) {
  let d = '';
  const P = (x, y) => (x * k + k / 2).toFixed(1) + ' ' + (y * k + k / 2).toFixed(1);
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const v0 = a[y * W + x], v1 = a[y * W + x + 1], v2 = a[(y + 1) * W + x + 1], v3 = a[(y + 1) * W + x];
    const c = (v0 > prog ? 8 : 0) | (v1 > prog ? 4 : 0) | (v2 > prog ? 2 : 0) | (v3 > prog ? 1 : 0);
    if (c === 0 || c === 15) continue;
    const t = (u, w) => (prog - u) / (w - u);
    const g = [x + t(v0, v1), y], pr = [x + 1, y + t(v1, v2)], dl = [x + t(v3, v2), y + 1], l = [x, y + t(v0, v3)];
    const seg = { 1: [l, dl], 2: [dl, pr], 3: [l, pr], 4: [g, pr], 5: [l, g, dl, pr], 6: [g, dl], 7: [l, g], 8: [l, g], 9: [g, dl], 10: [g, pr, l, dl], 11: [g, pr], 12: [l, pr], 13: [dl, pr], 14: [l, dl] }[c];
    for (let s = 0; s < seg.length; s += 2) d += 'M' + P(...seg[s]) + 'L' + P(...seg[s + 1]);
  }
  return d;
}

export async function ziarno() {
  const mozg = document.querySelector('.wk-brain[data-ziarno]');
  if (!mozg) return;
  const KOL = JSON.parse(mozg.dataset.kolory);
  const NETS = JSON.parse(mozg.dataset.kolejnosc); // numer w mapie − 1, ostatni to kora bez sieci
  const N = NETS.length - 1;
  const URL = JSON.parse(mozg.dataset.karty || '{}'); // karta własnej sieci nie prowadzi do siebie
  const NAZWA = JSON.parse(mozg.dataset.nazwy || '{}');
  const WSP = JSON.parse(mozg.dataset.wspolne || '[]');
  const REG = JSON.parse(mozg.dataset.regiony || '[]'); // [nazwa, karta obszaru, płat, karta płatów, adres]; numer w mapie obszarów − 1
  // Atlas (jego słowa, 2026-11-10: *lets make an "Atlas" subpage, next to the wiki ... The view should be modified to click different
  // regions (and a switch region/network) and clicking should switch to the marked region/network*): przełącznik Sieci i Obszary,
  // klik zaznacza sieć albo obszar we wszystkich widokach naraz, drugi klik w to samo zdejmuje zaznaczenie; na karcie widoki tylko
  // pokazują, a sieci karty prowadzą do atlasu linkiem pod listą
  const ATLAS = mozg.hasAttribute('data-atlas');
  const KARTY_SIECI = JSON.parse(mozg.dataset.kartySieci || '{}');
  // karty obszaru: karty, których miejsce leży w tym obszarze (pole `obszary` karty), numer obszaru jak w mapie obszarów
  const KARTY_OBSZARU = JSON.parse(mozg.dataset.kartyObszaru || '{}');
  // strony Atlasu (2026-11-11, jego *ok, execute* na anatomię w Atlasie): sieć i obszar z własną kartą mają adres /atlas/<karta>/,
  // przeglądy /atlas/ i /atlas/platy-mozgu/; START to zaznaczenie strony, na której stoi czytelnik
  const STRONY = JSON.parse(mozg.dataset.strony || '{"siec":{},"obszar":{}}');
  const START = JSON.parse(mozg.dataset.start || '{}');
  const BIALA = REG.findIndex((r) => r[0] === 'istota biała przodomózgowia') + 1;
  const WSZYSTKIE = NETS.slice(0, N - 0).filter((n) => n !== 'X');
  const LIT = new Set((mozg.dataset.lit || '').split(',').filter(Boolean));
  // przekroje z objętości: 141 struktur Allena i 17 sieci Yeo takie, jakie są; JAK wskazuje obszar rysunku, którego częścią jest
  // struktura, więc zaznaczenie jednego zapala drugi
  const OBJ = ATLAS && mozg.dataset.objetosc ? JSON.parse(mozg.dataset.objetosc) : null;
  const JAK = OBJ ? OBJ.JAK : [];
  const trafia = (zr, n) => !!zr && !!n && (zr === n || JAK[zr] === n || (!!JAK[n] && JAK[n] === zr));
  const objetosc = OBJ && mozg.querySelector('.wk-zywy') ? wczytajObjetosc(OBJ.url).catch(() => null) : null;
  const stoi = cicho();
  const hot = new Set();
  let tryb = 'sieci', wybor = null, hotReg = 0;
  const widoki = [];

  // przekroje z objętości: mapy sieci i obszarów, linie i etykiety liczone z plastra, na nowo przy każdym przesunięciu cięcia
  const vol = objetosc ? await objetosc : null;
  const zywe = {};
  const czeka = {};
  if (vol) for (const fig of mozg.querySelectorAll('.wk-zywy')) {
    const [VW, VH] = fig.dataset.vb.split(' ').map(Number);
    const pole = fig.querySelector('.wk-pole');
    const v = { fig, pole, cv: pole.querySelector('.wk-ziarno'), kody: pole.querySelector('.wk-kody'), VW, VH, k: OBJ.krok, ziarna: [], zywy: fig.dataset.objetosc, sciezka: pole.querySelector('.wk-linie-zywe') };
    zywe[v.zywy] = v;
    widoki.push(v);
  } else mozg.querySelectorAll('.wk-zywy').forEach((f) => { f.hidden = true; });
  // położenie cięcia; z kodu (wybór obszaru) przesuwa też suwak
  function ustaw(p, mm, zKodu) {
    const s = mozg.querySelector('.at-suwak[data-p="' + p + '"]'), v = zywe[p];
    if (!s || !v) return;
    mm = Math.max(Number(s.min), Math.min(Number(s.max), Math.round(mm * 2) / 2));
    if (zKodu) { s.value = String(mm); s.dispatchEvent(new Event('input')); return; }
    const bylo = czeka[p] !== undefined;
    czeka[p] = mm;
    if (bylo) return;
    requestAnimationFrame(() => {
      const m = czeka[p]; delete czeka[p];
      if (Math.abs(m - v.mm) < 0.01) return;
      plastry(v, m); uloz(v); wspolnota(v); tagi(); rysuj(v);
      mozg.dispatchEvent(new CustomEvent('atlas-ciecie', { detail: { p, mm: m } }));
    });
  }
  // obszar wybrany z listy, z adresu albo z linku: trzy cięcia przechodzą przez jego punkt najbliższy środkowi, więc obszar widać we
  // wszystkich przekrojach i na ścianach wycięcia w 3D (przegląd Atlasu 2026-11-11: kora oczodołowo-czołowa i hipokamp nie leżały
  // w żadnym przekroju, a student przesuwał trzy suwaki na ślepo); klik w przekroju cięć nie rusza, bo obszar już tam widać
  const PUNKT = new Map();
  function doObszaru(n) {
    if (!vol || !n) return;
    if (!PUNKT.has(n)) {
      const [NX, NY, NZ] = OBJ.wymiar, NV = NX * NY * NZ, k = OBJ.krok, [X0, Y0, Z0] = OBJ.poczatek, pola = [];
      let sx = 0, sy = 0, sz = 0;
      for (let i = 0; i < NV; i++) {
        const a = vol[2 * NV + i];
        if (!a || !trafia(OBJ.A2R[a], n)) continue;
        const xi = i % NX, t = (i / NX) | 0, zi = t % NZ, yi = (t / NZ) | 0;
        pola.push(xi, yi, zi); sx += xi; sy += yi; sz += zi;
      }
      const c = pola.length / 3;
      let p = null;
      if (c) {
        let bd = Infinity;
        for (let j = 0; j < pola.length; j += 3) {
          const d = (pola[j] - sx / c) ** 2 + (pola[j + 1] - sy / c) ** 2 + (pola[j + 2] - sz / c) ** 2;
          if (d < bd) { bd = d; p = [X0 + pola[j] * k, Y0 + pola[j + 1] * k, Z0 + pola[j + 2] * k]; }
        }
      }
      PUNKT.set(n, p);
    }
    const p = PUNKT.get(n);
    if (!p) return;
    ustaw('strzalkowy', p[0], true); ustaw('czolowy', p[1], true); ustaw('poziomy', p[2], true);
  }
  function plastry(v, mm) {
    v.mm = mm;
    const T = plaster(vol, OBJ, 0, v.zywy, mm), B = plaster(vol, OBJ, 1, v.zywy, mm), A = plaster(vol, OBJ, 2, v.zywy, mm), Y = plaster(vol, OBJ, 3, v.zywy, mm);
    const FW = T.W, FH = T.H, L = FW * FH;
    const lab = new Uint8Array(L), kora = new Float32Array(L), rv = new Uint8Array(L), dwie = new Uint8Array(L);
    for (let i = 0; i < L; i++) {
      const a = A.v[i], rodz = OBJ.RODZAJ[a];
      if (T.v[i] > 127 && a && rodz !== 'komora') rv[i] = OBJ.A2R[a];
      if (T.v[i] > 127 && B.v[i] < 128 && rodz === 'kora') {
        kora[i] = 1;
        const fam = Y.v[i] ? OBJ.sieci[Y.v[i] - 1][1] : [];
        lab[i] = fam.length ? NETS.indexOf(fam[0]) + 1 : N + 1;
        if (fam.length > 1) dwie[i] = NETS.indexOf(fam[1]) + 1;
      }
    }
    const rdzen = [];
    for (let n = 0; n < N; n++) {
      const a = new Float32Array(L);
      for (let i = 0; i < L; i++) a[i] = lab[i] === n + 1 || dwie[i] === n + 1 ? 1 : 0;
      const b = rozmyj(a, FW, FH, 1);
      for (let i = 0; i < L; i++) b[i] *= kora[i];
      rdzen.push(b);
    }
    for (const { sieci: [a, b] } of WSP) {
      const X = rdzen[NETS.indexOf(a)], Z = rdzen[NETS.indexOf(b)];
      for (let i = 0; i < L; i++) Z[i] = Math.max(Z[i], X[i]);
    }
    Object.assign(v, { FW, FH, lab, kora, rdzen, reg: { W: FW, H: FH, v: rv }, yeo: Y.v, allen: A.v });
    // linie: brzeg mózgu, granica istoty szarej i białej, brzegi jąder i komór, każde po rozmyciu do gładkiej krawędzi
    let d = kontur(T.v, FW, FH, 127.5, OBJ.krok) + kontur(B.v, FW, FH, 127.5, OBJ.krok);
    const bb = new Map();
    for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) {
      const a = A.v[y * FW + x], rodz = OBJ.RODZAJ[a];
      if (!a || (rodz !== 'gleb' && rodz !== 'komora')) continue;
      const b = bb.get(a) || [x, y, x, y];
      bb.set(a, [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)]);
    }
    for (const [a, [x0, y0, x1, y1]] of bb) {
      const X0 = Math.max(0, x0 - 2), Y0 = Math.max(0, y0 - 2), X1 = Math.min(FW - 1, x1 + 2), Y1 = Math.min(FH - 1, y1 + 2);
      const f = new Float32Array(L);
      for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
        let s = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = y + dy, xx = x + dx; if (yy >= 0 && xx >= 0 && yy < FH && xx < FW && A.v[yy * FW + xx] === a) s++; }
        f[y * FW + x] = s / 9;
      }
      d += kontur(f, FW, FH, 0.5, OBJ.krok, X0, Y0, X1, Y1);
    }
    v.sciezka.setAttribute('d', d);
    etykietyPrzekroju(v);
  }
  // etykiety sieci w przekroju: każda sieć z dość dużą korą dostaje znacznik w miejscu najdalszym od swojego brzegu, bez nakładania się
  function etykietyPrzekroju(v) {
    v.pole.querySelectorAll('.wk-nl').forEach((x) => x.remove());
    const { FW, FH } = v, L = FW * FH, r = v.pole.getBoundingClientRect();
    const sx = r.width ? r.width / FW : 3, sy = r.height ? r.height / FH : 3;
    const zajete = [];
    const kand = [];
    for (let n = 0; n < N; n++) {
      const dist = new Float32Array(L);
      let ile = 0;
      for (let i = 0; i < L; i++) if (v.rdzen[n][i] > 0.5) { dist[i] = 1e9; ile++; }
      if (ile < 25) continue;
      for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) { const i = y * FW + x; if (!dist[i]) continue; dist[i] = Math.min(dist[i], (x ? dist[i - 1] : 0) + 1, (y ? dist[i - FW] : 0) + 1); }
      for (let y = FH - 1; y >= 0; y--) for (let x = FW - 1; x >= 0; x--) { const i = y * FW + x; if (!dist[i]) continue; dist[i] = Math.min(dist[i], (x < FW - 1 ? dist[i + 1] : 0) + 1, (y < FH - 1 ? dist[i + FW] : 0) + 1); }
      const kol = [];
      // znacznik staje tylko tam, gdzie sieć jest dość gruba, żeby go objąć: na wąskim ekranie mniej znaczników, żaden nie zakrywa
      // małej sieci, którą nazywa (przegląd 2026-11-09)
      const min = 10 / Math.min(sx, sy);
      for (let i = 0; i < L; i++) if (dist[i] >= Math.max(2, min)) kol.push([dist[i], i]);
      kol.sort((a, b) => b[0] - a[0]);
      kand.push([ile, NETS[n], kol]);
    }
    kand.sort((a, b) => b[0] - a[0]);
    for (const [, kod, kol] of kand) {
      const w = (kod.length * 8 + 16) / sx, h = 22 / sy;
      const miejsce = kol.find(([, i]) => { const x = i % FW, y = (i / FW) | 0; return x - w / 2 > 0 && x + w / 2 < FW && !zajete.some(([zx, zy, zw, zh]) => Math.abs(zx - x) < (zw + w) / 2 && Math.abs(zy - y) < (zh + h) / 2); });
      if (!miejsce) continue;
      const x = miejsce[1] % FW, y = (miejsce[1] / FW) | 0;
      zajete.push([x, y, w, h]);
      const s = document.createElement('span');
      s.className = 'wk-nl'; s.setAttribute('aria-hidden', 'true'); s.dataset.k = kod; s.textContent = kod;
      s.style.left = ((x + 0.5) / FW * 100).toFixed(2) + '%'; s.style.top = ((y + 0.5) / FH * 100).toFixed(2) + '%';
      v.pole.appendChild(s);
    }
  }
  for (const p in zywe) { const s = mozg.querySelector('.at-suwak[data-p="' + p + '"]'); plastry(zywe[p], s ? Number(s.value) : 0); }
  // bez objętości Atlas nie ma przekrojów, ale wybór z list i karty zaznaczenia działają dalej
  if (!widoki.length && !ATLAS) return;

  const Wg = new Float32Array(N);
  function wagi(v, i) {
    for (let n = 0; n < N; n++) Wg[n] = v.rdzen[n][i];
    return Wg;
  }
  // sieci, które są w miejscu (udział ponad PROG), najsilniejsza pierwsza
  function wMiejscu(v, i) {
    const w = wagi(v, i);
    let tot = 0;
    for (let n = 0; n < N; n++) tot += w[n];
    if (tot < 0.05) return [];
    const out = [];
    for (let n = 0; n < N; n++) if (w[n] / tot > PROG) out.push([n, w[n] / tot]);
    return out.sort((a, b) => b[1] - a[1]).map(([n]) => n);
  }
  function losuj(v, z, r) {
    if (!z.k) { z.n = -1; return; }
    const w = wagi(v, z.i);
    let tot = 0;
    for (let n = 0; n < N; n++) tot += w[n];
    if (tot < 0.05) { z.n = -1; return; }
    let u = r() * tot;
    for (let n = 0; n < N; n++) { u -= w[n]; if (u <= 0) { z.n = n; return; } }
    z.n = N - 1;
  }
  // ziarno w miejscu, które świecąca sieć dzieli z inną, świeci kolorem każdej sieci tego miejsca
  const wspolnota = (v) => { for (const z of v.ziarna) z.wsp = z.tu && z.tu.some((n) => LIT.has(NETS[n])) ? new Set(z.tu) : null; };
  const regPola = (v, fx, fy) => (v.reg ? v.reg.v[Math.min(v.reg.H - 1, Math.floor((fy / v.FH) * v.reg.H)) * v.reg.W + Math.min(v.reg.W - 1, Math.floor((fx / v.FW) * v.reg.W))] : 0);

  function uloz(v) {
    const r = v.pole.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    v.cv.width = Math.round(r.width * dpr); v.cv.height = Math.round(r.height * dpr);
    v.skala = (r.width / v.VW) * dpr; // piksele płótna na jednostkę rysunku
    const krok = (ODSTEP * dpr) / v.skala; // odstęp w jednostkach rysunku
    const r2 = los(7 + v.FW);
    v.ziarna = [];
    for (let y = krok / 2; y < v.VH; y += krok) for (let x = krok / 2; x < v.VW; x += krok) {
      const jx = x + (r2() - 0.5) * krok * 0.7, jy = y + (r2() - 0.5) * krok * 0.7;
      const fx = Math.floor(jx / v.k), fy = Math.floor(jy / v.k);
      if (fx < 0 || fy < 0 || fx >= v.FW || fy >= v.FH) continue;
      const i = fy * v.FW + fx;
      const kk = v.kora[i] > 0, rr = regPola(v, fx, fy);
      if (!kk && !rr) continue;
      const z = { x: jx * v.skala, y: jy * v.skala, i, n: -1, k: kk, r: rr, tu: kk ? wMiejscu(v, i) : null, wsp: null };
      losuj(v, z, r2);
      v.ziarna.push(z);
    }
    wspolnota(v);
  }

  function rysuj(v) {
    const g = v.cv.getContext('2d');
    g.clearRect(0, 0, v.cv.width, v.cv.height);
    const rr = PROMIEN * Math.min(2, devicePixelRatio || 1);
    const wybranyReg = wybor && wybor.typ === 'obszar' ? wybor.n : 0;
    const grupy = new Map();
    for (const z of v.ziarna) {
      let kolor;
      if (tryb === 'obszary') {
        // istota biała ma ziarno tylko wtedy, gdy ją zaznaczono, inaczej zalałaby przekroje
        const wyb = trafia(z.r, wybranyReg);
        if (!z.r || ((z.r === BIALA || JAK[z.r] === BIALA) && !wyb)) continue;
        kolor = wyb ? ZLOTE : trafia(z.r, hotReg) ? JASNE : SZARE;
      } else {
        if (!z.k) continue;
        const kod = z.n >= 0 ? NETS[z.n] : null;
        kolor = kod && (LIT.has(kod) || hot.has(kod) || (z.wsp && z.wsp.has(z.n))) ? KOL[kod] : SZARE;
      }
      if (!grupy.has(kolor)) grupy.set(kolor, []);
      grupy.get(kolor).push(z);
    }
    for (const [kolor, zs] of grupy) {
      g.fillStyle = kolor;
      g.globalAlpha = kolor === SZARE || kolor === JASNE ? 1 : 0.9;
      g.beginPath();
      for (const z of zs) { g.moveTo(z.x + rr, z.y); g.arc(z.x, z.y, rr, 0, 6.2832); }
      g.fill();
    }
    g.globalAlpha = 1;
  }
  const rysujWszystko = () => widoki.forEach(rysuj);

  // co jest pod wskaźnikiem; bruzda, linia rysunku, bierze najbliższą korę w promieniu trzech pól mapy (przegląd 2026-11-09: co
  // dziewiąty punkt na korze nie trafiał w nic)
  function pole(v, e) {
    const r = v.pole.getBoundingClientRect();
    return [Math.floor(((e.clientX - r.left) / r.width) * v.VW / v.k), Math.floor(((e.clientY - r.top) / r.height) * v.VH / v.k)];
  }
  const komorka = (v, e) => { const [fx, fy] = pole(v, e); return Math.max(0, Math.min(v.FH - 1, fy)) * v.FW + Math.max(0, Math.min(v.FW - 1, fx)); };
  // sieć Yeo pod wskaźnikiem: najbliższa kora w promieniu trzech pól, jak przy sieciach
  function yeoPod(v, e) {
    const [fx, fy] = pole(v, e);
    for (let r = 0; r <= 3; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const x = fx + dx, y = fy + dy;
      if (x < 0 || y < 0 || x >= v.FW || y >= v.FH) continue;
      const i = y * v.FW + x;
      if (v.kora[i] && v.yeo[i]) return OBJ.sieci[v.yeo[i] - 1][0];
    }
    return '';
  }
  // najbliższe pole kory w promieniu trzech pól; wskazanie i klik biorą to samo pole, więc klik zaznacza sieci, które pokazało
  // wskazanie (przegląd Atlasu 2026-11-11: wskazanie mówiło VAN i SN, a klik w linię bruzdy zaznaczał samą VAN)
  function koraPod(v, e) {
    const [fx, fy] = pole(v, e);
    let best = -1, bd = 99;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const x = fx + dx, y = fy + dy, d = dx * dx + dy * dy;
      if (x < 0 || y < 0 || x >= v.FW || y >= v.FH || d > 9 || d >= bd) continue;
      if (v.kora[y * v.FW + x]) { best = y * v.FW + x; bd = d; }
    }
    return best;
  }
  function podWskaznikiem(v, e) {
    const best = koraPod(v, e);
    if (best < 0) return [];
    return wMiejscu(v, best).map((n) => NETS[n]);
  }
  // numer obszaru anatomicznego pod wskaźnikiem; linia rysunku bierze najbliższy obszar w promieniu trzech pól mapy
  function obszarPod(v, e) {
    if (!v.reg) return 0;
    const [fx, fy] = pole(v, e);
    let best = 0, bd = 99;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const x = fx + dx, y = fy + dy, d = dx * dx + dy * dy;
      if (x < 0 || y < 0 || x >= v.FW || y >= v.FH || d > 9 || d >= bd) continue;
      const n = regPola(v, x, y);
      if (n && REG[n - 1]) { best = n; bd = d; }
    }
    return best;
  }
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  let ostatni = null;
  function postaw(v, e, html) {
    v.kody.innerHTML = html;
    v.kody.hidden = false;
    const r = v.pole.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    v.kody.style.left = v.kody.style.right = '';
    // kody mierzone po wypełnieniu: stoją na prawo od wskaźnika, a gdzie tam brak miejsca na ekranie, na lewo, i nigdy poza ekranem
    // (przegląd Atlasu 2026-11-11: podpis przekroju czołowego wychodził za lewy brzeg)
    const w = v.kody.offsetWidth, E = document.documentElement.clientWidth;
    const L = e.clientX + 14 + w <= E - 4 ? x + 14 : e.clientX - 14 - w >= 4 ? x - 14 - w : 4 - r.left;
    v.kody.style.left = L + 'px';
    v.kody.style.top = Math.max(0, y - 10) + 'px';
  }
  // pod wskaźnikiem: w trybie sieci kod i nazwa każdej sieci miejsca, w trybie obszarów nazwa obszaru i jego płat, zawsze jako tekst
  // (jego słowa, 2026-11-10: *clicking itself should not redirect*)
  function pokaz(v, e, palec) {
    ostatni = { v, e: { clientX: e.clientX, clientY: e.clientY }, palec };
    if (tryb === 'obszary') {
      const n = obszarPod(v, e);
      if (n !== hotReg) { hotReg = n; rysujWszystko(); }
      if (!n) { v.kody.hidden = true; v.pole.style.cursor = ''; return; }
      const o = REG[n - 1];
      const st = v.zywy ? OBJ.NAZWY[v.allen[komorka(v, e)]] : '';
      postaw(v, e, '<span><b>' + esc(st || o[0]) + '</b>' + (o[2] ? ' ' + esc(o[2]) : '') + '</span>');
      v.pole.style.cursor = ATLAS ? 'pointer' : '';
      return;
    }
    const lista = podWskaznikiem(v, e);
    ostatni.lista = lista;
    hot.clear(); lista.forEach((n) => hot.add(n));
    rysujWszystko();
    // w przekroju z objętości pierwsza linia nazywa sieć Yeo pod wskaźnikiem, także skroniowo-ciemieniową bez grupy
    const yeo = v.zywy ? yeoPod(v, e) : '';
    if (!lista.length && !yeo) { v.kody.hidden = true; v.pole.style.cursor = ''; return; }
    postaw(v, e, (yeo ? '<span class="wk-kod-yeo">' + esc(yeo) + '</span>' : '') + lista.map((n, j) => '<span' + (j ? ' class="wk-kod-dalej"' : '') + '><b>' + n + '</b> ' + (NAZWA[n] || '') + '</span>').join(''));
    v.pole.style.cursor = ATLAS ? 'pointer' : '';
  }
  function schowaj(v) { ostatni = null; hot.clear(); hotReg = 0; v.kody.hidden = true; rysujWszystko(); }

  // --- atlas: przełącznik, zaznaczenie, panel nad tytułem, adres
  const tu = ATLAS ? document.querySelector('.wk-tu') : null;
  const karty = ATLAS ? document.querySelector('.at-karty') : null;
  const przyciski = ATLAS ? [...document.querySelectorAll('.at-tryb [data-tryb]')] : [];
  // listy wyboru klawiaturą i czytnikiem ekranu, jedna w każdym trybie: obszary w trybie Obszary (audyt Atlasu, 2026-11-10), sieci
  // w trybie Sieci, odkąd rysunek z boku z linkami sieci zszedł ze strony (2026-11-11)
  const listy = ATLAS ? [...document.querySelectorAll('.at-lista')] : [];
  const wybierajSiec = ATLAS ? document.querySelector('.at-lista[data-tryb="sieci"] select') : null;
  const szukaj = ATLAS ? document.querySelector('#at-szukaj') : null;
  const wyniki = ATLAS ? document.querySelector('#at-wyniki') : null;
  const link = (url, html) => (url ? '<a href="' + esc(url) + '">' + html + '</a>' : '<span>' + html + '</span>');
  const kodHtml = (n) => '<b style="color:' + KOL[n] + '">' + n + '</b> ' + esc(NAZWA[n] || '');
  // przy kilku sieciach i przy obszarze sam kod, nazwa dla czytnika ekranu: wiersz zaznaczenia mieści się w dwóch liniach (przegląd
  // Atlasu 2026-11-11: długie zaznaczenie zajmowało trzy do pięciu linii i spychało mózg)
  const kodKrotki = (n) => '<b style="color:' + KOL[n] + '">' + n + '</b><span class="sr-only"> ' + esc(NAZWA[n] || '') + '</span>';
  // sieci obszaru: te, które zajmują co najmniej 15 % jego kory w całej objętości; sieć Yeo wspólna dwóm sieciom strony liczy się
  // w obu
  const SIECI_OBSZARU = new Map();
  function sieciObszaru(n) {
    if (!vol) return [];
    if (SIECI_OBSZARU.has(n)) return SIECI_OBSZARU.get(n);
    const [NX, NY, NZ] = OBJ.wymiar, NV = NX * NY * NZ, c = new Float64Array(N);
    let tot = 0;
    for (let i = 0; i < NV; i++) {
      const a = vol[2 * NV + i];
      if (!a || OBJ.RODZAJ[a] !== 'kora' || vol[i] <= 127 || vol[NV + i] >= 128 || !trafia(OBJ.A2R[a], n)) continue;
      const y = vol[3 * NV + i];
      for (const k of y ? OBJ.sieci[y - 1][1] : []) { c[NETS.indexOf(k)]++; tot++; }
    }
    const wyn = tot ? [...c].map((x, i) => [NETS[i], x / tot]).filter(([, s]) => s >= 0.15).sort((a, b) => b[1] - a[1]).map(([k]) => k) : [];
    SIECI_OBSZARU.set(n, wyn);
    return wyn;
  }
  function tagi() {
    mozg.querySelectorAll('.wk-nl').forEach((t) => { t.style.display = tryb === 'sieci' && LIT.has(t.dataset.k) ? '' : 'none'; });
  }
  function panel() {
    if (!tu) return;
    // wiersz nad tytułem ma zawsze swoją wysokość, pusty bez zaznaczenia, więc widoki nie skaczą (audyt Atlasu, 2026-11-10)
    if (!wybor) { tu.innerHTML = ''; if (karty) karty.hidden = true; return; }
    if (wybor.typ === 'siec') {
      tu.innerHTML = wybor.kody.map((n) => link(URL[n], (wybor.kody.length > 1 ? kodKrotki : kodHtml)(n))).join(' · ');
      const lista = [];
      wybor.kody.forEach((n) => (KARTY_SIECI[n] || []).forEach((x) => { if (!lista.some((y) => y[1] === x[1])) lista.push([x[0], x[1], n]); }));
      if (karty) {
        karty.querySelector('.wk-chips').innerHTML = lista.sort((a, b) => a[0].localeCompare(b[0], 'pl')).map(([h, u, n]) => '<a href="' + esc(u) + '" class="wk-chip" style="--c:' + KOL[n] + '">' + esc(h) + '</a>').join('');
        karty.hidden = !lista.length;
      }
    } else {
      const o = REG[wybor.n - 1];
      const czesci = [link(o[1], esc(o[0]))];
      const nad = JAK[wybor.n] ? REG[JAK[wybor.n] - 1] : null;
      if (nad) czesci.push(link(nad[1], esc(nad[0])));
      if (o[2]) czesci.push(link(o[3], esc(o[2])));
      sieciObszaru(wybor.n).forEach((n) => czesci.push(link(URL[n], kodKrotki(n))));
      tu.innerHTML = czesci.join(' · ');
      // karty grupy to jej własne i karty jej części (śródmózgowie i wzgórek górny); część bez kart pokazuje karty swojej grupy
      const zCzesci = [wybor.n].concat(REG.map((_, j) => j + 1).filter((j) => JAK[j] === wybor.n)).flatMap((j) => KARTY_OBSZARU[j] || []);
      const lista = (zCzesci.length ? zCzesci : KARTY_OBSZARU[JAK[wybor.n]] || []).filter((x, j, a) => a.findIndex((y) => y[1] === x[1]) === j);
      if (karty) {
        karty.querySelector('.wk-chips').innerHTML = lista.map(([h, u, c]) => '<a href="' + esc(u) + '" class="wk-chip" style="--c:' + c + '">' + esc(h) + '</a>').join('');
        karty.hidden = !lista.length;
      }
    }
    tu.hidden = false;
  }
  // strona zaznaczenia: sieć albo obszar z kartą ma swoją stronę, brak zaznaczenia przegląd trybu, reszta adres /atlas/#siec-…
  // albo /atlas/#obszar-…; zaznaczenie zmienia adres bez nowego wpisu w historii, jak dotąd
  const stronaWyboru = (w, t) => (!w ? (t === 'obszary' ? STRONY.obszary : STRONY.sieci) : w.typ === 'siec' ? (w.kody.length === 1 ? STRONY.siec[w.kody[0]] : '') : STRONY.obszar[w.n]) || '';
  const kartyWyboru = (w, t) => (w && w.typ === 'siec' && w.kody.length > 1 ? w.kody.map((n) => STRONY.siec[n]).filter(Boolean) : [stronaWyboru(w, t)].filter(Boolean));
  function adres() {
    const p = stronaWyboru(wybor, tryb);
    const h = p ? '' : wybor.typ === 'siec' ? '#siec-' + wybor.kody.map((n) => n.toLowerCase()).join('+') : '#obszar-' + REG[wybor.n - 1][4];
    history.replaceState(null, '', (p || STRONY.sieci || location.pathname) + h);
  }
  function ustawTryb(t) {
    tryb = t;
    przyciski.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tryb === t)));
    mozg.classList.toggle('at-obszary', t === 'obszary');
    listy.forEach((l) => l.classList.toggle('at-lista-off', l.dataset.tryb !== t));
  }
  function wybierz(w, bezAdresu, przewin) {
    wybor = w;
    LIT.clear();
    (w && w.typ === 'siec' ? w.kody : WSZYSTKIE).forEach((n) => LIT.add(n));
    widoki.forEach(wspolnota);
    tagi(); panel(); if (!bezAdresu) adres();
    if (szukaj && document.activeElement !== szukaj) szukaj.value = w && w.typ === 'obszar' ? REG[w.n - 1][0] : '';
    // kilka sieci naraz (z karty wiki) lista nazywa kodami (przegląd Atlasu 2026-11-11: lista mówiła *wybierz sieć* nad pięcioma
    // zaznaczonymi sieciami)
    if (wybierajSiec) {
      const wiele = wybierajSiec.querySelector('option[value="wiele"]'), kilka = w && w.typ === 'siec' && w.kody.length > 1;
      if (wiele) wiele.textContent = kilka ? w.kody.join(' · ') : '';
      wybierajSiec.value = !w || w.typ !== 'siec' ? '' : kilka ? 'wiele' : w.kody[0];
    }
    rysujWszystko();
    // karta zaznaczenia staje pod widokami: wczytuje ją strona Atlasu (jego słowa, 2026-11-10: *below the brains the card of this
    // network/region should be visible. And then below the other cards*)
    // stan zostaje też na siatce, żeby mózg w 3D, który wczytuje się dłużej, zaczął od bieżącego zaznaczenia
    if (ATLAS) {
      const nazwa = !w ? '' : w.typ === 'obszar' ? REG[w.n - 1][0] : w.kody.join(' · ');
      const detail = { karty: kartyWyboru(w, tryb), przewin: !!przewin, tryb, lit: [...LIT], wybor: w, nazwa };
      mozg.__stan = detail;
      mozg.dispatchEvent(new CustomEvent('atlas-wybor', { detail }));
    }
  }
  const tenSam = (a, b) => a && b && a.typ === b.typ && (a.typ === 'obszar' ? a.n === b.n : a.kody.join() === b.kody.join());
  function kliknij(v, e) {
    let w = null;
    if (tryb === 'obszary') { const n = obszarPod(v, e); if (!n) return; w = { typ: 'obszar', n }; }
    else {
      const lista = podWskaznikiem(v, e);
      if (!lista.length) return;
      const i = v.zywy ? koraPod(v, e) : -1;
      const fam = i >= 0 && v.yeo[i] ? OBJ.sieci[v.yeo[i] - 1][1] : [];
      w = { typ: 'siec', kody: fam.length > 1 ? fam.slice() : [lista[0]] };
    }
    wybierz(tenSam(w, wybor) ? null : w);
  }

  widoki.forEach(uloz);
  if (ATLAS) {
    // adres #siec-dmn, #siec-sn+dmn albo #obszar-wyspa otwiera atlas z tym zaznaczeniem (linki z kart)
    // zaznaczenie z adresu: #siec-… albo #obszar-… z linku, inaczej strona karty albo przegląd; undefined, gdy adres nie jest Atlasem
    const zeStrony = (sciezka, hash) => {
      let h = '';
      try { h = decodeURIComponent(hash); } catch (e) {} // zepsuty adres niczego nie zaznacza (audyt Atlasu, 2026-11-10)
      const ms = /^#siec-([a-z+]+)$/.exec(h), mo = /^#obszar-([a-z0-9-]+)$/.exec(h);
      if (sciezka === STRONY.sieci && (ms || mo)) {
        if (ms) { const kody = ms[1].split('+').map((x) => x.toUpperCase()).filter((x) => WSZYSTKIE.includes(x)); if (kody.length) return { w: { typ: 'siec', kody }, t: 'sieci' }; }
        if (mo) { const n = REG.findIndex((r) => r[4] === mo[1]) + 1; if (n) return { w: { typ: 'obszar', n }, t: 'obszary' }; }
        return { w: null, t: 'sieci' };
      }
      if (sciezka === STRONY.sieci) return { w: null, t: 'sieci' };
      if (sciezka === STRONY.obszary) return { w: null, t: 'obszary' };
      const kod = Object.keys(STRONY.siec).find((n) => STRONY.siec[n] === sciezka);
      if (kod) return { w: { typ: 'siec', kody: [kod] }, t: 'sieci' };
      const n = Object.keys(STRONY.obszar).find((x) => STRONY.obszar[x] === sciezka);
      if (n) return { w: { typ: 'obszar', n: Number(n) }, t: 'obszary' };
      return undefined;
    };
    const zAdresu = () => {
      const z = zeStrony(location.pathname, location.hash) || { w: null, t: START.tryb || 'sieci' };
      ustawTryb(z.t); hotReg = 0;
      wybierz(z.w, true);
      if (z.w && z.w.typ === 'obszar') doObszaru(z.w.n);
    };
    // link do strony Atlasu w samym Atlasie, z karty pod widokami, z listy kart albo z wiersza nad tytułem, zaznacza na miejscu i
    // zmienia kartę bez przeładowania; link z karty albo z listy kart przewija do nowej karty. Nasłuch na oknie, po dymku terminu:
    // pierwsze stuknięcie w termin otwiera dymek i wtedy link czeka
    addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank') return;
      const u = new globalThis.URL(a.href, location.href);
      if (u.origin !== location.origin) return;
      const z = zeStrony(u.pathname, u.hash);
      if (!z) return;
      e.preventDefault();
      if (z.t !== tryb) ustawTryb(z.t);
      hotReg = 0;
      wybierz(z.w, false, !!a.closest('.at-karta, .at-karty, .td'));
      if (z.w && z.w.typ === 'obszar') doObszaru(z.w.n);
    });
    zAdresu();
    // wstecz, dalej i link do Atlasu z samego Atlasu zmieniają tylko adres: zaznaczenie idzie za nim
    addEventListener('hashchange', zAdresu);
    // klik w mózg w 3D zaznacza jak klik w przekroju: drugi klik w to samo zdejmuje zaznaczenie; karta wczytuje się bez przewijania
    mozg.addEventListener('atlas-klik', (e) => { const w = e.detail; hotReg = 0; wybierz(tenSam(w, wybor) ? null : w); });
    // wstecz po zmianie ścieżki na miejscu wraca do wpisu z innym adresem bez zdarzenia hashchange (przegląd Atlasu 2026-11-11)
    addEventListener('popstate', zAdresu);
    if (szukaj && wyniki) {
      // szukanie obszaru: wpisane słowa muszą wystąpić w nazwie, w innej nazwie albo w nazwie grupy, bez względu na wielkość liter
      // i polskie znaki; najpierw nazwy, które zaczynają się od wpisanego słowa, potem inne nazwy, potem reszta, w kolejności listy
      const LISTA = JSON.parse(szukaj.dataset.lista || '[]');
      const plasko = (t) => t.toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const WPISY = LISTA.flatMap(([g, xs]) => xs.map(([n, i, inne]) => ({ n, i, g, inne, pn: plasko(n), pi: inne.map(plasko), pg: plasko(g) })));
      let aktywny = -1, widac = [];
      const otworz = (tak) => { wyniki.hidden = !tak; szukaj.setAttribute('aria-expanded', String(tak)); if (!tak) { szukaj.removeAttribute('aria-activedescendant'); aktywny = -1; } };
      const opcja = (x, pod, wybrany) => '<li role="option" id="at-w-' + x.i + '" data-n="' + x.i + '" aria-selected="' + wybrany + '">' + esc(x.n) + (pod ? ' <span class="at-w-pod">' + esc(pod) + '</span>' : '') + '</li>';
      const pokazWyniki = () => {
        const q = plasko(szukaj.value.trim()), teraz = wybor && wybor.typ === 'obszar' ? wybor.n : 0;
        let html = '';
        if (!q || (teraz && szukaj.value === REG[teraz - 1][0])) {
          // puste pole albo nazwa zaznaczenia: cała lista w grupach, z wierszem bez zaznaczenia na początku
          widac = (teraz ? [{ i: 0, n: 'bez zaznaczenia' }] : []).concat(WPISY);
          if (teraz) html += '<li role="option" id="at-w-0" data-n="0" aria-selected="false" class="at-w-bez">bez zaznaczenia</li>';
          LISTA.forEach(([g]) => { html += '<li role="presentation" class="at-w-grupa">' + esc(g) + '</li>' + WPISY.filter((x) => x.g === g).map((x) => opcja(x, '', x.i === teraz)).join(''); });
        } else {
          const slowa = q.split(/\s+/);
          const pasuje = (x) => slowa.every((s) => x.pn.includes(s) || x.pi.some((a) => a.includes(s)) || x.pg.includes(s));
          const ranga = (x) => (x.pn.startsWith(q) || x.pn.includes(' ' + q) ? 0 : x.pi.some((a) => a.startsWith(q) || a.includes(' ' + q)) ? 1 : 2);
          widac = WPISY.filter(pasuje).map((x, k) => [ranga(x), k, x]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([, , x]) => x).slice(0, 12);
          html = widac.length ? widac.map((x) => { const inna = x.inne.find((a, k) => x.pi[k].includes(slowa[0])); return opcja(x, inna && !x.pn.includes(slowa[0]) ? inna : x.g, x.i === teraz); }).join('') : '<li role="presentation" class="at-w-nic">nic nie pasuje</li>';
        }
        wyniki.innerHTML = html;
        otworz(true);
        aktywny = -1;
        const zaz = wyniki.querySelector('[aria-selected="true"]');
        if (zaz) zaz.scrollIntoView({ block: 'nearest' }); else wyniki.scrollTop = 0;
      };
      const zaznaczAktywny = (k) => {
        const el = wyniki.querySelectorAll('[role="option"]');
        if (!el.length) return;
        aktywny = (k + el.length) % el.length;
        el.forEach((o, j) => o.classList.toggle('at-w-akt', j === aktywny));
        szukaj.setAttribute('aria-activedescendant', el[aktywny].id);
        el[aktywny].scrollIntoView({ block: 'nearest' });
      };
      const wez = (n) => {
        otworz(false);
        if (!n) { wybierz(null); szukaj.value = ''; return; }
        if (tryb !== 'obszary') ustawTryb('obszary');
        hotReg = 0;
        wybierz({ typ: 'obszar', n });
        szukaj.value = REG[n - 1][0];
        doObszaru(n);
      };
      szukaj.addEventListener('focus', () => { szukaj.select(); pokazWyniki(); });
      // po wyborze fokus zostaje w polu, więc klik w pole otwiera listę jeszcze raz
      szukaj.addEventListener('click', () => { if (wyniki.hidden) { szukaj.select(); pokazWyniki(); } });
      szukaj.addEventListener('input', pokazWyniki);
      szukaj.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (wyniki.hidden) pokazWyniki(); zaznaczAktywny(aktywny + (e.key === 'ArrowDown' ? 1 : -1)); }
        else if (e.key === 'Enter') {
          e.preventDefault();
          const el = wyniki.querySelectorAll('[role="option"]'), o = el[aktywny] || (szukaj.value.trim() ? el[0] : null);
          if (o) wez(Number(o.dataset.n));
        } else if (e.key === 'Escape') { otworz(false); szukaj.value = wybor && wybor.typ === 'obszar' ? REG[wybor.n - 1][0] : ''; }
      });
      // klik w wynik nie zabiera fokusu polu, więc lista nie znika przed wyborem
      wyniki.addEventListener('mousedown', (e) => e.preventDefault());
      wyniki.addEventListener('click', (e) => { const o = e.target.closest('[role="option"]'); if (o) wez(Number(o.dataset.n)); });
      szukaj.addEventListener('blur', () => { otworz(false); szukaj.value = wybor && wybor.typ === 'obszar' ? REG[wybor.n - 1][0] : ''; });
    }
    if (wybierajSiec) wybierajSiec.addEventListener('change', () => { const k = wybierajSiec.value; if (k !== 'wiele') wybierz(k ? { typ: 'siec', kody: [k] } : null); });
    przyciski.forEach((b) => b.addEventListener('click', () => { if (b.dataset.tryb === tryb) return; ustawTryb(b.dataset.tryb); hotReg = 0; wybierz(null); }));
  }
  rysujWszystko();
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => { widoki.forEach((v) => { uloz(v); if (v.zywy) etykietyPrzekroju(v); }); tagi(); rysujWszystko(); });
    widoki.forEach((v) => ro.observe(v.pole));
  }

  let palec = false;
  widoki.forEach((v) => {
    v.pole.addEventListener('pointerdown', (e) => { palec = e.pointerType === 'touch'; });
    v.pole.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') pokaz(v, e); });
    v.pole.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch' && !(ostatni && ostatni.palec)) schowaj(v); });
    // klik nie przenosi: w atlasie zaznacza sieć albo obszar (jego słowa, 2026-11-10: *clicking itself should not redirect*)
    v.pole.addEventListener('click', (e) => {
      if (e.target.closest('.wk-kody')) return;
      e.preventDefault();
      if (palec) pokaz(v, e, true);
      if (ATLAS) kliknij(v, e);
    });
  });
  // stuknięcie poza mózgiem chowa kody
  document.addEventListener('click', (e) => {
    if (ostatni && ostatni.palec && !e.target.closest('.wk-pole')) schowaj(ostatni.v);
  });

  // wyłącznik za końcem suwaka chowa płaski przekrój tego cięcia (jego słowa, 2026-11-11: *these 2d views should disappear, not the part
  // of the 3d view. I want to zoom to the brain and do not have these 3 x 2d images obscuring the view*); mózg w 3D bierze zwolnione
  // miejsce, a cięcie i jego suwak działają dalej
  mozg.querySelectorAll('.at-wl').forEach((b) => b.addEventListener('click', () => {
    const wl = b.getAttribute('aria-checked') !== 'true';
    b.setAttribute('aria-checked', String(wl));
    const f = mozg.querySelector('.wk-zywy.wk-widok-' + b.dataset.p);
    if (f) f.classList.toggle('at-bez', !wl);
  }));
  // czytnik ekranu słyszy położenie cięcia słowami (audyt Atlasu, 2026-11-11: sama liczba nie mówi, gdzie leży cięcie): strzałkowe
  // od linii środkowej, w której objętość jest odbita, czołowe i poziome jako część drogi między końcami suwaka
  const opisz = (s) => {
    const v = Number(s.value), lo = Number(s.min), hi = Number(s.max), czesc = Math.round(((hi - v) / (hi - lo)) * 100) + '% ';
    const t = s.dataset.p === 'strzalkowy' ? (v === 0 ? 'linia środkowa' : (v < 0 ? 'lewa' : 'prawa') + ' półkula, ' + String(Math.abs(v)).replace('.', ',') + ' mm od linii środkowej')
      : s.dataset.p === 'czolowy' ? czesc + 'drogi od przodu do tyłu' : czesc + 'drogi od góry do dołu';
    s.setAttribute('aria-valuetext', t);
  };
  mozg.querySelectorAll('.at-suwak').forEach((s) => { opisz(s); s.addEventListener('input', () => opisz(s)); });
  // cięcie przesuwa suwak na osi mózgu w 3D; przekrój liczy się na nowo raz na klatkę
  if (vol) mozg.querySelectorAll('.at-suwak').forEach((s) => s.addEventListener('input', () => ustaw(s.dataset.p, Number(s.value))));

  if (stoi) return;
  let widac = true;
  // timer stoi, kiedy żaden widok nie jest na ekranie
  const naEkranie = new Set();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { es.forEach((x) => (x.isIntersecting ? naEkranie.add(x.target) : naEkranie.delete(x.target))); widac = naEkranie.size > 0; });
    widoki.forEach((v) => io.observe(v.fig));
  }
  const r3 = los(11);
  setInterval(() => {
    if (!widac || document.hidden || tryb !== 'sieci') return; // w trybie obszarów kolor ziarna nie zależy od sieci, więc płótno stoi
    for (const v of widoki) for (const z of v.ziarna) if (z.k && r3() < ZMIANA) losuj(v, z, r3);
    if (ostatni && !ostatni.palec) {
      // lista pod nieruchomym wskaźnikiem nadąża za wagami; po stuknięciu stoi
      const { v, e } = ostatni;
      pokaz(v, e);
    } else if (LIT.size || hot.size) rysujWszystko(); // bez świecącej sieci szare ziarno daje ten sam obraz, więc płótno stoi
  }, TAKT);
}
