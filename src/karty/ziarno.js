// Ziarno na mózgu karty (jego wybór, 2026-11-09: *ziarno, I love it*): kora to pole drobnych ziaren, każde należy w danej chwili
// do jednej sieci i co jakiś czas przechodzi do innej, z wagami sieci w swoim miejscu. Rdzeń sieci trzyma kolor, ośrodek wspólny
// kilku sieciom migocze między nimi (jego słowa: *real multi-membership and the time*). Sieci karty świecą swoim kolorem, reszta
// ziaren to ciepła szarość. Wskazane miejsce pokazuje kody wszystkich sieci, które tam są, najsilniejsza pierwsza, i zapala je
// we wszystkich trzech widokach; klik otwiera kartę najsilniejszej (jego *ok*, 2026-11-09). Bez ruchu (przełącznik animacji albo
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
  const LIT = new Set((mozg.dataset.lit || '').split(',').filter(Boolean));
  const N = NETS.length - 1;
  const URL = JSON.parse(mozg.dataset.karty || '{}'); // karta własnej sieci nie prowadzi do siebie
  const NAZWA = JSON.parse(mozg.dataset.nazwy || '{}');
  const WSP = JSON.parse(mozg.dataset.wspolne || '[]');
  const stoi = cicho();
  const hot = new Set();
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

    const pole = fig.querySelector('.wk-pole');
    const cv = pole.querySelector('.wk-ziarno');
    const kody = pole.querySelector('.wk-kody');
    widoki.push({ fig, pole, cv, kody, FW, FH, VW, VH, k, lab, kora, rdzen, osr, ziarna: [] });
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
    const w = wagi(v, z.i, t);
    let tot = 0;
    for (let n = 0; n < N; n++) tot += w[n];
    if (tot < 0.05) { z.n = -1; return; }
    let u = r() * tot;
    for (let n = 0; n < N; n++) { u -= w[n]; if (u <= 0) { z.n = n; return; } }
    z.n = N - 1;
  }

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
      if (!v.kora[i]) continue;
      const z = { x: jx * v.skala, y: jy * v.skala, i, n: -1 };
      // ziarno w miejscu, które sieć karty dzieli z inną, świeci kolorem każdej sieci tego miejsca
      const tu = wMiejscu(v, i, null);
      z.wsp = tu.some((n) => LIT.has(NETS[n])) ? new Set(tu) : null;
      losuj(v, z, 0, r2);
      v.ziarna.push(z);
    }
  }

  function rysuj(v) {
    const g = v.cv.getContext('2d');
    g.clearRect(0, 0, v.cv.width, v.cv.height);
    const rr = PROMIEN * Math.min(2, devicePixelRatio || 1);
    const grupy = new Map();
    for (const z of v.ziarna) {
      const kod = z.n >= 0 ? NETS[z.n] : null;
      const kolor = kod && (LIT.has(kod) || hot.has(kod) || (z.wsp && z.wsp.has(z.n))) ? KOL[kod] : SZARE;
      if (!grupy.has(kolor)) grupy.set(kolor, []);
      grupy.get(kolor).push(z);
    }
    for (const [kolor, zs] of grupy) {
      g.fillStyle = kolor;
      g.globalAlpha = kolor === SZARE ? 1 : 0.9;
      g.beginPath();
      for (const z of zs) { g.moveTo(z.x + rr, z.y); g.arc(z.x, z.y, rr, 0, 6.2832); }
      g.fill();
    }
    g.globalAlpha = 1;
  }
  const rysujWszystko = () => widoki.forEach(rysuj);

  widoki.forEach(uloz);
  rysujWszystko();
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => { widoki.forEach(uloz); rysujWszystko(); });
    widoki.forEach((v) => ro.observe(v.pole));
  }

  // co jest pod wskaźnikiem; bruzda, linia rysunku, bierze najbliższą korę w promieniu trzech pól mapy (przegląd 2026-11-09: co
  // dziewiąty punkt na korze nie trafiał w nic)
  function podWskaznikiem(v, e, t) {
    const r = v.pole.getBoundingClientRect();
    const fx = Math.floor(((e.clientX - r.left) / r.width) * v.VW / v.k), fy = Math.floor(((e.clientY - r.top) / r.height) * v.VH / v.k);
    let best = -1, bd = 99;
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
      const x = fx + dx, y = fy + dy, d = dx * dx + dy * dy;
      if (x < 0 || y < 0 || x >= v.FW || y >= v.FH || d > 9 || d >= bd) continue;
      if (v.kora[y * v.FW + x]) { best = y * v.FW + x; bd = d; }
    }
    if (best < 0) return [];
    return wMiejscu(v, best, t).map((n) => NETS[n]);
  }
  let ostatni = null;
  // kod i nazwa każdej sieci w miejscu; po stuknięciu palcem kody są linkami do kart, bo palec nie ma wskazania
  function pokaz(v, e, palec) {
    const t = performance.now() / 1000;
    const lista = podWskaznikiem(v, e, t);
    ostatni = { v, e: { clientX: e.clientX, clientY: e.clientY }, lista, palec };
    hot.clear(); lista.forEach((n) => hot.add(n));
    rysujWszystko();
    if (!lista.length) { v.kody.hidden = true; v.pole.style.cursor = ''; return; }
    v.kody.classList.toggle('wk-kody-palec', !!palec);
    v.kody.innerHTML = lista.map((n, j) => {
      const tresc = '<b>' + n + '</b> ' + (NAZWA[n] || '');
      const kl = j ? ' class="wk-kod-dalej"' : '';
      return palec && URL[n] ? '<a href="' + URL[n] + '"' + kl + '>' + tresc + '</a>' : '<span' + kl + '>' + tresc + '</span>';
    }).join('');
    v.kody.hidden = false;
    const r = v.pole.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    v.kody.style.left = v.kody.style.right = '';
    const lewo = x + 14 + v.kody.offsetWidth > r.width; // kody mierzone po wypełnieniu, żeby nie wychodziły za widok
    if (lewo) v.kody.style.right = r.width - x + 14 + 'px'; else v.kody.style.left = x + 14 + 'px';
    v.kody.style.top = Math.max(0, y - 10) + 'px';
    v.pole.style.cursor = lista.some((n) => URL[n]) ? 'pointer' : '';
  }
  function schowaj(v) { ostatni = null; hot.clear(); v.kody.hidden = true; rysujWszystko(); }
  let palec = false;
  widoki.forEach((v) => {
    v.pole.addEventListener('pointerdown', (e) => { palec = e.pointerType === 'touch'; });
    v.pole.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') pokaz(v, e); });
    v.pole.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch' && !(ostatni && ostatni.palec)) schowaj(v); });
    // klik myszą otwiera kartę pierwszego kodu, który prowadzi do innej karty; stuknięcie palcem pokazuje kody sieci w miejscu jako
    // linki (przegląd 2026-11-09: stuknięcie przenosiło od razu, a na karcie własnej sieci przeładowywało ją); Enter idzie za linkiem
    v.pole.addEventListener('click', (e) => {
      if (e.detail === 0 || e.target.closest('.wk-kody')) return;
      if (palec) { e.preventDefault(); pokaz(v, e, true); return; }
      if (!ostatni || ostatni.v !== v) return;
      const pierwsza = ostatni.lista.find((n) => URL[n]);
      e.preventDefault();
      if (!pierwsza) return;
      const url = URL[pierwsza];
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) window.open(url, '_blank', 'noopener');
      else location.href = url;
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
  if ('IntersectionObserver' in window) new IntersectionObserver((es) => { widac = es.some((x) => x.isIntersecting); }).observe(mozg);
  const r3 = los(11);
  setInterval(() => {
    if (!widac || document.hidden) return;
    const t = performance.now() / 1000;
    for (const v of widoki) for (const z of v.ziarna) if (r3() < ZMIANA) losuj(v, z, t, r3);
    if (ostatni && !ostatni.palec) {
      // lista pod nieruchomym wskaźnikiem nadąża za wagami; po stuknięciu stoi, żeby linki nie uciekały spod palca
      const { v, e } = ostatni;
      pokaz(v, e);
    } else if (LIT.size || hot.size) rysujWszystko(); // bez świecącej sieci szare ziarno daje ten sam obraz, więc płótno stoi
  }, TAKT);
}
