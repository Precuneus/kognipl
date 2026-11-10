// Ziarno na mózgu karty (jego wybór, 2026-11-09: *ziarno, I love it*): kora to pole drobnych ziaren, każde należy w danej chwili
// do jednej sieci i co jakiś czas przechodzi do innej, z wagami sieci w swoim miejscu. Rdzeń sieci trzyma kolor, ośrodek wspólny
// kilku sieciom migocze między nimi (jego słowa: *real multi-membership and the time*). Sieci karty świecą swoim kolorem, reszta
// ziaren to ciepła szarość. Wskazane miejsce pokazuje kody wszystkich sieci, które tam są, najsilniejsza pierwsza, i zapala je
// we wszystkich widokach; klik wpisuje obszar i sieci miejsca nad tytuł karty i nie przenosi (2026-11-10). Bez ruchu (przełącznik animacji albo
// ustawienie systemu) ziarno losuje się raz i stoi.
// Przegląd 2026-11-09: wspólne są tylko miejsca, których sieci nazywa span (`huby` i `wspolne` w `mozg-widoki.json`), sieci dzielą
// je po równo, bo żaden span nie podaje wag, a w czasie zmienia się tylko ośrodek, którego span mówi o zmianie z zadaniem
// (`czas`); rdzenie stoją. Na karcie świecą też sieci, z którymi jej sieć dzieli miejsce, w tym miejscu.
const ODSTEP = 3.5; // odstęp ziaren w pikselach ekranu
const PROMIEN = 1.4;
const ZMIANA = 0.1; // część ziaren losowana na nowo w każdym takcie, więc ziarno zmienia się mniej więcej raz na sekundę
const TAKT = 100; // ms
const OMEGA = (2 * Math.PI) / 15; // ośrodek ze zmianą w czasie przechodzi między sieciami w okresie około 15 s; tempa nie podaje żaden span
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

function wczytaj(src) {
  return new Promise((ok, zle) => { const i = new Image(); i.onload = () => ok(i); i.onerror = zle; i.src = src; });
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
  const BIALA = REG.findIndex((r) => r[0] === 'istota biała') + 1;
  const WSZYSTKIE = NETS.slice(0, N - 0).filter((n) => n !== 'X');
  const LIT = new Set((mozg.dataset.lit || '').split(',').filter(Boolean));
  const stoi = cicho();
  const hot = new Set();
  let tryb = 'sieci', wybor = null, hotReg = 0;
  const widoki = [];

  for (const fig of mozg.querySelectorAll('.wk-widok[data-pole]')) {
    const [VW, VH] = fig.dataset.vb.split(' ').map(Number);
    const k = Number(fig.dataset.k);
    const huby = JSON.parse(fig.dataset.huby || '[]');
    let img;
    try { img = await wczytaj(fig.dataset.pole); } catch (e) { continue; }
    const FW = img.width, FH = img.height;
    const c = document.createElement('canvas'); c.width = FW; c.height = FH;
    const cx = c.getContext('2d'); cx.drawImage(img, 0, 0);
    const px = cx.getImageData(0, 0, FW, FH).data;
    const lab = new Uint8Array(FW * FH);
    for (let i = 0; i < lab.length; i++) lab[i] = Math.round(px[i * 4] / 20);
    const kora = new Float32Array(FW * FH);
    for (let i = 0; i < lab.length; i++) kora[i] = lab[i] > 0 ? 1 : 0;
    // rdzeń każdej sieci: jej obszar z miękką krawędzią, tylko na korze
    const rdzen = [];
    for (let n = 0; n < N; n++) {
      const a = new Float32Array(FW * FH);
      for (let i = 0; i < a.length; i++) a[i] = lab[i] === n + 1 ? 1 : 0;
      const b = rozmyj(a, FW, FH, 2);
      for (let i = 0; i < b.length; i++) b[i] *= kora[i];
      rdzen.push(b);
    }
    // obszar wspólny całej sieci: obszar pierwszej sieci należy też do drugiej, po równo (Girn i in. 2024: kora oczodołowo-czołowa
    // i przednia skroniowa to część rozszerzonej sieci domyślnej)
    for (const { sieci: [a, b] } of WSP) {
      const A = rdzen[NETS.indexOf(a)], B = rdzen[NETS.indexOf(b)];
      for (let i = 0; i < A.length; i++) B[i] = Math.max(B[i], A[i]);
    }
    // ośrodki wspólne kilku sieciom: w środku ośrodka każda jego sieć ma ten sam udział, ku brzegowi wraca rdzeń
    const osr = huby.map(({ xy: [hx, hy], r: hr, sieci, czas }, h) => {
      const g = new Float32Array(FW * FH);
      const X = hx / k, Y = hy / k, R = hr / k;
      for (let y = 0; y < FH; y++) for (let x = 0; x < FW; x++) {
        const d = ((x - X) ** 2 + (y - Y) ** 2) / (R * R);
        g[y * FW + x] = d < 9 ? Math.exp(-d * 1.4) * kora[y * FW + x] : 0;
      }
      return { g, sieci: sieci.map((n) => NETS.indexOf(n)), czas: !!czas, faza: h * 1.7 };
    });
    // mapa obszarów anatomicznych tej samej siatki co mapa sieci: wartość piksela to numer obszaru (tylko atlas jej używa)
    let reg = null;
    if (ATLAS && fig.dataset.obszary) {
      try {
        const ri = await wczytaj(fig.dataset.obszary);
        const rc = document.createElement('canvas'); rc.width = ri.width; rc.height = ri.height;
        const rx = rc.getContext('2d'); rx.drawImage(ri, 0, 0);
        const rp = rx.getImageData(0, 0, ri.width, ri.height).data;
        reg = { W: ri.width, H: ri.height, v: new Uint8Array(ri.width * ri.height) };
        for (let i = 0; i < reg.v.length; i++) reg.v[i] = rp[i * 4];
      } catch (e) {}
    }
    const pole = fig.querySelector('.wk-pole');
    const cv = pole.querySelector('.wk-ziarno');
    const kody = pole.querySelector('.wk-kody');
    widoki.push({ fig, pole, cv, kody, FW, FH, VW, VH, k, lab, kora, rdzen, osr, reg, ziarna: [] });
  }
  if (!widoki.length) return;

  const Wg = new Float32Array(N);
  // t === null: udziały bez ruchu, średnie w czasie
  function wagi(v, i, t) {
    for (let n = 0; n < N; n++) Wg[n] = v.rdzen[n][i];
    for (const o of v.osr) {
      const g = o.g[i];
      if (!g) continue;
      for (let n = 0; n < N; n++) Wg[n] *= 1 - g;
      const m = o.sieci.length;
      o.sieci.forEach((n, j) => {
        const fala = o.czas && t !== null && !stoi ? 1 + 0.6 * Math.sin(OMEGA * t + o.faza + (j * 2 * Math.PI) / m) : 1;
        Wg[n] += (g / m) * fala;
      });
    }
    return Wg;
  }
  // sieci, które są w miejscu (udział ponad PROG), najsilniejsza pierwsza
  function wMiejscu(v, i, t) {
    const w = wagi(v, i, t);
    let tot = 0;
    for (let n = 0; n < N; n++) tot += w[n];
    if (tot < 0.05) return [];
    const out = [];
    for (let n = 0; n < N; n++) if (w[n] / tot > PROG) out.push([n, w[n] / tot]);
    return out.sort((a, b) => b[1] - a[1]).map(([n]) => n);
  }
  function losuj(v, z, t, r) {
    if (!z.k) { z.n = -1; return; }
    const w = wagi(v, z.i, t);
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
      const z = { x: jx * v.skala, y: jy * v.skala, i, n: -1, k: kk, r: rr, tu: kk ? wMiejscu(v, i, null) : null, wsp: null };
      losuj(v, z, 0, r2);
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
        if (!z.r || (z.r === BIALA && wybranyReg !== BIALA)) continue;
        kolor = z.r === wybranyReg ? ZLOTE : z.r === hotReg ? JASNE : SZARE;
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
  function podWskaznikiem(v, e, t) {
    const [fx, fy] = pole(v, e);
    let best = -1, bd = 99;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const x = fx + dx, y = fy + dy, d = dx * dx + dy * dy;
      if (x < 0 || y < 0 || x >= v.FW || y >= v.FH || d > 9 || d >= bd) continue;
      if (v.kora[y * v.FW + x]) { best = y * v.FW + x; bd = d; }
    }
    if (best < 0) return [];
    return wMiejscu(v, best, t).map((n) => NETS[n]);
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
    const lewo = x + 14 + v.kody.offsetWidth > r.width; // kody mierzone po wypełnieniu, żeby nie wychodziły za widok
    if (lewo) v.kody.style.right = r.width - x + 14 + 'px'; else v.kody.style.left = x + 14 + 'px';
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
      postaw(v, e, '<span><b>' + esc(o[0]) + '</b>' + (o[2] ? ' ' + esc(o[2]) : '') + '</span>');
      v.pole.style.cursor = ATLAS ? 'pointer' : '';
      return;
    }
    const lista = podWskaznikiem(v, e, performance.now() / 1000);
    ostatni.lista = lista;
    hot.clear(); lista.forEach((n) => hot.add(n));
    rysujWszystko();
    if (!lista.length) { v.kody.hidden = true; v.pole.style.cursor = ''; return; }
    postaw(v, e, lista.map((n, j) => '<span' + (j ? ' class="wk-kod-dalej"' : '') + '><b>' + n + '</b> ' + (NAZWA[n] || '') + '</span>').join(''));
    v.pole.style.cursor = ATLAS ? 'pointer' : '';
  }
  function schowaj(v) { ostatni = null; hot.clear(); hotReg = 0; v.kody.hidden = true; rysujWszystko(); }

  // --- atlas: przełącznik, zaznaczenie, panel nad tytułem, adres
  const tu = ATLAS ? document.querySelector('.wk-tu') : null;
  const karty = ATLAS ? document.querySelector('.at-karty') : null;
  const przyciski = ATLAS ? [...document.querySelectorAll('.at-tryb [data-tryb]')] : [];
  // lista obszarów: wybór obszaru klawiaturą i czytnikiem ekranu, widoczna w trybie Obszary (audyt Atlasu, 2026-11-10)
  const lista = ATLAS ? document.querySelector('.at-lista') : null;
  const wybieraj = lista ? lista.querySelector('select') : null;
  const link = (url, html) => (url ? '<a href="' + esc(url) + '">' + html + '</a>' : '<span>' + html + '</span>');
  const kodHtml = (n) => '<b style="color:' + KOL[n] + '">' + n + '</b> ' + esc(NAZWA[n] || '');
  // sieci obszaru: te, które zajmują co najmniej 15 % jego kory we wszystkich widokach
  function sieciObszaru(n) {
    const c = new Float64Array(N); let tot = 0;
    for (const v of widoki) {
      if (!v.reg) continue;
      for (let y = 0; y < v.FH; y++) for (let x = 0; x < v.FW; x++) {
        if (regPola(v, x, y) !== n) continue;
        const l = v.lab[y * v.FW + x];
        if (l > 0 && l <= N && NETS[l - 1] !== 'X') { c[l - 1]++; tot++; }
      }
    }
    if (!tot) return [];
    return [...c].map((x, i) => [NETS[i], x / tot]).filter(([, s]) => s >= 0.15).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  }
  function tagi() {
    mozg.querySelectorAll('.wk-nl').forEach((t) => { t.style.display = tryb === 'sieci' && LIT.has(t.dataset.k) ? '' : 'none'; });
  }
  function panel() {
    if (!tu) return;
    // wiersz nad tytułem ma zawsze swoją wysokość, pusty bez zaznaczenia, więc widoki nie skaczą (audyt Atlasu, 2026-11-10)
    if (!wybor) { tu.innerHTML = ''; if (karty) karty.hidden = true; return; }
    if (wybor.typ === 'siec') {
      tu.innerHTML = wybor.kody.map((n) => link(URL[n], kodHtml(n))).join(' · ');
      const lista = [];
      wybor.kody.forEach((n) => (KARTY_SIECI[n] || []).forEach((x) => { if (!lista.some((y) => y[1] === x[1])) lista.push([x[0], x[1], n]); }));
      if (karty) {
        karty.querySelector('.wk-chips').innerHTML = lista.sort((a, b) => a[0].localeCompare(b[0], 'pl')).map(([h, u, n]) => '<a href="' + esc(u) + '" class="wk-chip" style="--c:' + KOL[n] + '">' + esc(h) + '</a>').join('');
        karty.hidden = !lista.length;
      }
    } else {
      const o = REG[wybor.n - 1];
      const czesci = [link(o[1], esc(o[0]))];
      if (o[2]) czesci.push(link(o[3], esc(o[2])));
      sieciObszaru(wybor.n).forEach((n) => czesci.push(link(URL[n], kodHtml(n))));
      tu.innerHTML = czesci.join(' · ');
      if (karty) karty.hidden = true;
    }
    tu.hidden = false;
  }
  function adres() {
    const h = !wybor ? '' : wybor.typ === 'siec' ? '#siec-' + wybor.kody.map((n) => n.toLowerCase()).join('+') : '#obszar-' + REG[wybor.n - 1][4];
    history.replaceState(null, '', location.pathname + location.search + h);
  }
  function ustawTryb(t) {
    tryb = t;
    przyciski.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tryb === t)));
    mozg.classList.toggle('at-obszary', t === 'obszary');
    if (lista) lista.classList.toggle('at-lista-off', t !== 'obszary');
  }
  function wybierz(w, bezAdresu) {
    wybor = w;
    LIT.clear();
    (w && w.typ === 'siec' ? w.kody : WSZYSTKIE).forEach((n) => LIT.add(n));
    widoki.forEach(wspolnota);
    tagi(); panel(); if (!bezAdresu) adres();
    if (wybieraj) wybieraj.value = w && w.typ === 'obszar' ? String(w.n) : '';
    rysujWszystko();
  }
  const tenSam = (a, b) => a && b && a.typ === b.typ && (a.typ === 'obszar' ? a.n === b.n : a.kody.join() === b.kody.join());
  function kliknij(v, e) {
    let w = null;
    if (tryb === 'obszary') { const n = obszarPod(v, e); if (!n) return; w = { typ: 'obszar', n }; }
    else { const lista = podWskaznikiem(v, e, performance.now() / 1000); if (!lista.length) return; w = { typ: 'siec', kody: [lista[0]] }; }
    wybierz(tenSam(w, wybor) ? null : w);
  }

  widoki.forEach(uloz);
  if (ATLAS) {
    // adres #siec-dmn, #siec-sn+dmn albo #obszar-wyspa otwiera atlas z tym zaznaczeniem (linki z kart)
    const zAdresu = () => {
      let h = '';
      try { h = decodeURIComponent(location.hash); } catch (e) {} // zepsuty adres niczego nie zaznacza (audyt Atlasu, 2026-11-10)
      let w = null;
      const ms = /^#siec-([a-z+]+)$/.exec(h), mo = /^#obszar-([a-z0-9-]+)$/.exec(h);
      if (ms) { const kody = ms[1].split('+').map((x) => x.toUpperCase()).filter((x) => WSZYSTKIE.includes(x)); if (kody.length) w = { typ: 'siec', kody }; }
      if (mo) { const n = REG.findIndex((r) => r[4] === mo[1]) + 1; if (n) w = { typ: 'obszar', n }; }
      ustawTryb(w && w.typ === 'obszar' ? 'obszary' : 'sieci'); hotReg = 0;
      wybierz(w, true);
    };
    zAdresu();
    // wstecz, dalej i link do Atlasu z samego Atlasu zmieniają tylko adres: zaznaczenie idzie za nim
    addEventListener('hashchange', zAdresu);
    if (wybieraj) wybieraj.addEventListener('change', () => { const n = Number(wybieraj.value); wybierz(n ? { typ: 'obszar', n } : null); });
    przyciski.forEach((b) => b.addEventListener('click', () => { if (b.dataset.tryb === tryb) return; ustawTryb(b.dataset.tryb); hotReg = 0; wybierz(null); }));
  }
  rysujWszystko();
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => { widoki.forEach(uloz); rysujWszystko(); });
    widoki.forEach((v) => ro.observe(v.pole));
  }

  let palec = false;
  widoki.forEach((v) => {
    v.pole.addEventListener('pointerdown', (e) => { palec = e.pointerType === 'touch'; });
    v.pole.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') pokaz(v, e); });
    v.pole.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch' && !(ostatni && ostatni.palec)) schowaj(v); });
    // klik nie przenosi: w atlasie zaznacza sieć albo obszar, na karcie nic nie robi; Enter z klawiatury na obszarze sieci w atlasie
    // zaznacza tę sieć, na karcie idzie za linkiem do karty sieci
    v.pole.addEventListener('click', (e) => {
      if (e.target.closest('.wk-kody')) return;
      if (e.detail === 0) {
        const a = e.target.closest('.wk-nb');
        if (ATLAS && a) { e.preventDefault(); if (tryb !== 'sieci') ustawTryb('sieci'); const w = { typ: 'siec', kody: [a.dataset.k] }; wybierz(tenSam(w, wybor) ? null : w); }
        return;
      }
      e.preventDefault();
      // link obszaru kliknięty myszą nie trzyma fokusu: fokus jest dla klawiatury i zapalałby sieć linku do następnego kliknięcia
      const a = document.activeElement;
      if (a && a.classList && a.classList.contains('wk-nb') && v.pole.contains(a)) a.blur();
      if (palec) pokaz(v, e, true);
      if (ATLAS) kliknij(v, e);
    });
  });
  // stuknięcie poza mózgiem chowa kody
  document.addEventListener('click', (e) => {
    if (ostatni && ostatni.palec && !e.target.closest('.wk-pole')) schowaj(ostatni.v);
  });
  // fokus z klawiatury zapala sieć swojego linku
  mozg.querySelectorAll('.wk-nb').forEach((a) => {
    a.addEventListener('focus', () => { hot.clear(); hot.add(a.dataset.k); rysujWszystko(); });
    a.addEventListener('blur', () => { hot.clear(); rysujWszystko(); });
  });

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
    const t = performance.now() / 1000;
    for (const v of widoki) for (const z of v.ziarna) if (z.k && r3() < ZMIANA) losuj(v, z, t, r3);
    if (ostatni && !ostatni.palec) {
      // lista pod nieruchomym wskaźnikiem nadąża za wagami; po stuknięciu stoi
      const { v, e } = ostatni;
      pokaz(v, e);
    } else if (LIT.size || hot.size) rysujWszystko(); // bez świecącej sieci szare ziarno daje ten sam obraz, więc płótno stoi
  }, TAKT);
}
