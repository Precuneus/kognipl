// Ryc. 5 wpisu 28.10: półkula z kropek, która się obraca (jego słowo, 2026-11-02: *make a brain, show the networks, anchor them in the
// streams, show the spiral how it works when predicting and how it works in reverse when surprise occurs*), przerysowana z objętości
// Atlasu (jego słowa, 2026-11-11: *redraw the Ryc 5, make it good quality, show the predictions and surprise, add a graph below
// illustrating the same flow*). Kropki to punkty powierzchni lewej półkuli z szablonu MNI 2009c, każda w kolorze swojej sieci Yeo
// (`rysunki/atlas/objetosc/ryc5.py` w wątku kursu, plik `public/images/2026/ryc5-punkty.bin`). Predykcje płyną złotą falą od sieci
// domyślnej ku receptorom, z przerwą między falami; zaskoczenie biegnie turkusową falą od receptorów po tych samych sieciach w górę,
// a kolejne kliknięcia sięgają wyżej (*more surprises the higher it reaches*). Pod mózgiem ten sam przepływ na osi od receptorów
// do sieci domyślnej: predykcje górnym torem w lewo, zaskoczenie dolnym w prawo, w rytmie fal na mózgu. Sieci istotności na rycinie
// nie ma (jego słowa, 2026-11-11: *remove istotnosci from the picture*): jej kora jest szara, a zaskoczenie nie ma stopnia przy niej.
const NET = [
  null,
  { n: 'wzrokowa', c: [249, 215, 128] },
  { n: 'czuciowo-ruchowa', c: [238, 107, 111] },
  { n: 'grzbietowa uwagi', c: [229, 142, 118] },
  null, // sieć istotności zeszła z ryciny
  { n: 'kontroli', c: [246, 153, 89] },
  { n: 'domyślna', c: [187, 111, 178] },
];
const SZARY = [150, 142, 128];
const ZLOTO = [255, 226, 150]; // predykcja
const TURKUS = [90, 222, 200]; // zaskoczenie
// poziomy na osi grafu, jak w danych: predykcje 3 → 0, zaskoczenie 0 → 3 po tych samych sieciach
const WEZLY = [{ f: 1, z: 0, p: 0 }, { f: 2, z: 0, p: 0 }, { f: 3, z: 1, p: 1 }, { f: 5, z: 2, p: 2 }, { f: 6, z: 3, p: 3 }];
const ZASIEG = [0, 1, 2, 3]; // dokąd sięga zaskoczenie po kolejnych kliknięciach
const FALA_P = 3.4, PRZERWA = 1.1; // s: fala predykcji od domyślnej do receptorów i przerwa po niej
const bell = (x, s) => Math.exp(-(x * x) / (2 * s * s));

async function wczytaj(url) {
  const r = await fetch(url);
  if (!r.ok || !('DecompressionStream' in window)) throw new Error(url);
  const b = new Uint8Array(await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
  const n = new DataView(b.buffer).getUint32(0, true);
  let o = 4;
  const pos = new Int16Array(b.buffer.slice(o, o + n * 6)); o += n * 6;
  const nrm = new Int8Array(b.buffer.slice(o, o + n * 3)); o += n * 3;
  const f = b.slice(o, o + n); o += n;
  const pp = b.slice(o, o + n); o += n;
  const pz = b.slice(o, o + n);
  return { n, pos, nrm, f, pp, pz };
}

export function mozg(root) {
  const cv = root.querySelector('canvas'), btn = root.querySelector('button'), ctx = cv.getContext('2d');
  // bez ruchu, kiedy chce tego system albo przełącznik animacji strony (jego słowa, 2026-11-10: *Animations off should switch off all
  // animations*)
  const reduce = document.documentElement.classList.contains('roj-cicho') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const font = getComputedStyle(root).fontFamily;
  let D = null, W = 0, H = 0, HB = 0, S = 1, FS = 13, narrow = false;
  let yaw = -0.3, pitch = 0.16, drag = null, auto = true, t0 = performance.now(), predStart = 0, visible = true, raf = 0;
  const bursts = [];
  let cx = 0, cy = 0, cz = 0, V1 = null, SPI = [], STR = [];

  function size() {
    const w = root.clientWidth, dpr = Math.min(2, devicePixelRatio || 1);
    narrow = w < 520; W = w; FS = narrow ? 11.5 : 13;
    HB = Math.round(w * (narrow ? 0.86 : 0.6)); // mózg
    H = HB + Math.round(narrow ? w * 0.56 : Math.max(170, w * 0.24)); // pod nim graf
    S = (narrow ? w * 0.9 : Math.min(w * 0.7, HB * 1.45)) / 190; // piksele na milimetr: mózg ma około 180 mm od przodu do tyłu
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  // kamera: z boku lewej półkuli przód stoi po lewej; obrót wokół osi pionowej pokazuje ścianę przyśrodkową
  let F = [1, 0, 0], Rr = [0, -1, 0], U = [0, 0, 1], L = [0, 0, 0];
  function kamera() {
    const ct = Math.cos(yaw), st = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    F = [ct * cp, st * cp, sp]; Rr = [st, -ct, 0];
    U = [Rr[1] * F[2] - Rr[2] * F[1], Rr[2] * F[0] - Rr[0] * F[2], Rr[0] * F[1] - Rr[1] * F[0]];
    L = [F[0] * 0.7 - U[0] * 0.5 - Rr[0] * 0.5, F[1] * 0.7 - U[1] * 0.5 - Rr[1] * 0.5, F[2] * 0.7 - U[2] * 0.5 - Rr[2] * 0.5];
  }
  const P = (x, y, z) => { const a = x - cx, b = y - cy, c = z - cz; return [W / 2 + S * (a * Rr[0] + b * Rr[1] + c * Rr[2]), HB * 0.5 - S * (a * U[0] + b * U[1] + c * U[2]), a * F[0] + b * F[1] + c * F[2]]; };

  function tag(x, y, t, al) {
    ctx.font = '500 ' + FS + 'px ' + font; const w = ctx.measureText(t).width, x0 = al === 'end' ? x - w : al === 'middle' ? x - w / 2 : x;
    ctx.fillStyle = 'rgba(18,17,13,.9)'; ctx.strokeStyle = 'rgba(214,198,166,.42)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(x0 - FS * 0.62, y - FS * 0.95, w + FS * 1.24, FS * 1.5, FS * 0.75); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ebe3d3'; ctx.fillText(t, x0, y + FS * 0.12);
    return w + FS * 1.24;
  }

  // poziomy fal w danej chwili: front predykcji, front i zasięg zaskoczenia, wygaszenie predykcji w czasie zaskoczenia
  function fale(t) {
    while (bursts.length && t - bursts[0].t > 4) bursts.shift();
    let zF = -9, zA = 0, zR = 0, env = 0;
    for (const b of bursts) {
      const dt = t - b.t, R = ZASIEG[b.reach];
      if (reduce) { if (dt < 2.5) { zF = 9; zR = Math.max(zR, R); zA = 1; env = 1; } continue; }
      const front = -0.3 + dt * 2.4; // poziomy na sekundę
      const a = front < R + 0.25 ? 1 : bell(dt - (R + 0.55) / 2.4, 0.45);
      if (a > zA) { zA = a; zF = Math.min(front, R + 0.25); zR = R; }
      env = Math.max(env, a);
    }
    if (bursts.length) { const b = bursts[bursts.length - 1]; predStart = Math.max(predStart, b.t + (ZASIEG[b.reach] + 0.55) / 2.4 + 0.9); }
    let pF = -9, pA = 0;
    if (!reduce && t >= predStart) {
      const tc = (t - predStart) % (FALA_P + PRZERWA);
      if (tc < FALA_P) { pF = 3.35 - (tc / FALA_P) * 3.8; pA = 1 - Math.min(1, env); }
    }
    return { pF, pA, zF, zA, zR };
  }

  const kubly = new Map();
  function rysujMozg(w) {
    const { pos, nrm, f, pp, pz, n } = D;
    kubly.clear();
    const rd = Math.max(1.25, S * 0.62);
    const kot = {}; // kotwice etykiet: środek widocznych kropek każdej sieci
    for (let i = 0; i < n; i++) {
      const nx = nrm[i * 3] / 127, ny = nrm[i * 3 + 1] / 127, nz = nrm[i * 3 + 2] / 127;
      const fac = nx * F[0] + ny * F[1] + nz * F[2];
      if (fac > -0.05) continue; // kropki zwrócone od widza
      const x = pos[i * 3] / 10, y = pos[i * 3 + 1] / 10, z = pos[i * 3 + 2] / 10;
      const q = P(x, y, z), fi = f[i];
      const lam = Math.max(0, -(nx * L[0] + ny * L[1] + nz * L[2]));
      const sh = Math.min(2, Math.floor((0.35 + 0.65 * lam) * 3));
      let typ = 0, g = 0;
      if (fi) {
        if (w.pA > 0.02 && pp[i] < 255) { const v = bell(pp[i] / 80 - w.pF, 0.26) * w.pA; if (v > g) { g = v; typ = 1; } }
        if (w.zA > 0.02 && pz[i] < 255) {
          const lv = pz[i] / 80;
          const v = (lv <= w.zR + 0.05 ? Math.max(bell(lv - w.zF, 0.3), lv <= w.zF ? 0.55 : 0) : 0) * w.zA;
          if (v > g) { g = v; typ = 2; }
        }
        const k = kot[fi] || (kot[fi] = [0, 0, 0, 0]); k[0] += q[0]; k[1] += q[1]; k[2]++;
      }
      const lvl = Math.min(4, Math.round(g * 4));
      const key = fi * 100 + typ * 20 + lvl * 3 + sh;
      let b = kubly.get(key);
      if (!b) { b = []; kubly.set(key, b); }
      b.push(q[0], q[1]);
    }
    for (const [key, a] of kubly) {
      const fi = Math.floor(key / 100), r = key % 100, typ = Math.floor(r / 20), lvl = Math.floor((r % 20) / 3), sh = r % 3;
      const g = lvl / 4, base = fi ? NET[fi].c : SZARY, tint = typ === 1 ? ZLOTO : typ === 2 ? TURKUS : base;
      const mix = typ === 1 ? 0.6 * g : typ === 2 ? 0.75 * g : 0;
      const c = base.map((v, j) => Math.round(v * (1 - mix) + tint[j] * mix));
      const al = Math.min(1, (fi ? 0.5 : 0.16) + g * 0.5) * (0.55 + 0.225 * sh);
      ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + al.toFixed(3) + ')';
      const s = rd * (1 + g * 0.45);
      ctx.beginPath();
      for (let j = 0; j < a.length; j += 2) ctx.rect(a[j] - s / 2, a[j + 1] - s / 2, s, s);
      ctx.fill();
    }
    return kot;
  }

  // linia po powierzchni od strony widza: szlaki wzrokowe od V1 i spirala
  function linia(a, col, lw, dash, alpha) {
    const widac = a.filter((p) => p[3] * F[0] + p[4] * F[1] + p[5] * F[2] < 0).length > a.length / 2;
    ctx.save(); ctx.setLineDash(dash || []); ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = col;
    ctx.globalAlpha = (widac ? 1 : 0.12) * alpha;
    ctx.beginPath(); a.forEach((p, i) => { const q = P(p[0], p[1], p[2]); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.restore();
  }

  function etykiety(kot) {
    const items = [];
    for (const fi in kot) { const k = kot[fi]; if (k[2] > 40) items.push({ t: NET[fi].n, q: [k[0] / k[2], k[1] / k[2]] }); }
    if (V1) { const q = P(V1[0], V1[1], V1[2]); if (V1[3] * F[0] + V1[4] * F[1] + V1[5] * F[2] < 0.2) items.push({ t: 'V1', q }); }
    const gap = FS * 2.1, pad = FS * 0.7;
    const place = (col, x, al, ymin, ymax) => {
      const ys = col.map((o) => Math.max(ymin, Math.min(ymax, o.q[1])));
      for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + gap);
      for (let i = ys.length - 1; i >= 0; i--) { if (ys[i] > ymax) ys[i] = ymax; if (i > 0) ys[i - 1] = Math.min(ys[i - 1], ys[i] - gap); }
      col.forEach((o, i) => {
        const y = ys[i]; ctx.font = '500 ' + FS + 'px ' + font; const w = ctx.measureText(o.t).width, edge = al === 'start' ? x + w + pad : x - w - pad;
        ctx.strokeStyle = 'rgba(235,227,211,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(edge, y - FS * 0.2); ctx.lineTo(o.q[0], o.q[1]); ctx.stroke();
        ctx.fillStyle = '#ebe3d3'; ctx.beginPath(); ctx.arc(o.q[0], o.q[1], 2.2, 0, 6.3); ctx.fill();
        tag(x, y, o.t, al);
      });
    };
    const top = FS * 3.6;
    place(items.filter((o) => o.q[0] < W / 2).sort((a, b) => a.q[1] - b.q[1]), pad + 2, 'start', top, HB - FS * 5.6);
    place(items.filter((o) => o.q[0] >= W / 2).sort((a, b) => a.q[1] - b.q[1]), W - pad - 2, 'end', top, HB - FS * 1.5);
  }

  // graf pod mózgiem: oś od receptorów do sieci domyślnej, predykcje górnym torem w lewo, zaskoczenie dolnym w prawo
  function graf(w) {
    const top = HB + FS * 0.6, h = H - top, m = narrow ? FS * 1.6 : FS * 4.2;
    const xL = m + (narrow ? FS * 3.6 : FS * 6.8), xR = W - m - FS * 1.2, X = (lv) => xL + ((lv + 0.25) / 3.25) * (xR - xL);
    const yP = top + h * 0.2, yN = top + h * 0.5, yZ = top + h * 0.8;
    ctx.save();
    ctx.strokeStyle = 'rgba(214,198,166,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(m, top); ctx.lineTo(W - m, top); ctx.stroke();
    const tor = (y, col, kier, alpha) => {
      ctx.strokeStyle = col; ctx.globalAlpha = alpha; ctx.lineWidth = 1.6; ctx.setLineDash([2, 7]); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(X(-0.25), y); ctx.lineTo(X(3), y); ctx.stroke(); ctx.setLineDash([]);
      for (let lv = 0.25; lv < 3; lv += 0.75) { const x = X(lv), d = kier * FS * 0.42; ctx.beginPath(); ctx.moveTo(x - d, y - FS * 0.36); ctx.lineTo(x + d, y); ctx.lineTo(x - d, y + FS * 0.36); ctx.stroke(); }
      ctx.globalAlpha = 1;
    };
    tor(yP, '#f0c060', -1, 0.55);
    tor(yZ, '#6fb3a8', 1, 0.55);
    // fronty fal jako światło na torach
    const swiatlo = (x, y, rgb, a) => {
      if (a < 0.02) return;
      const gr = ctx.createRadialGradient(x, y, 0, x, y, FS * 1.4);
      gr.addColorStop(0, 'rgba(' + rgb + ',' + (0.95 * a).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(' + rgb + ',0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, FS * 1.4, 0, 6.3); ctx.fill();
    };
    if (w.pA > 0.02 && w.pF > -0.3 && w.pF < 3.3) swiatlo(X(Math.max(-0.25, w.pF)), yP, '255,226,150', w.pA);
    if (w.zA > 0.02 && w.zF > -0.3) swiatlo(X(Math.min(w.zF, w.zR)), yZ, '150,236,220', w.zA);
    // węzły sieci na osi, rozświetlone, kiedy mija je fala
    ctx.strokeStyle = 'rgba(214,198,166,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(-0.25), yN); ctx.lineTo(X(3), yN); ctx.stroke();
    const r = narrow ? FS * 0.55 : FS * 0.7;
    const zajete = [];
    WEZLY.forEach((wz, j) => {
      let g = 0;
      if (wz.p !== null && w.pA > 0.02) g = Math.max(g, bell(wz.p - w.pF, 0.26) * w.pA);
      if (w.zA > 0.02 && wz.z <= w.zR + 0.05) g = Math.max(g, Math.max(bell(wz.z - w.zF, 0.3), wz.z <= w.zF ? 0.55 : 0) * w.zA);
      const x = X(wz.z) + (wz.f === 2 ? r * 1.2 : wz.f === 1 ? -r * 1.2 : 0), c = NET[wz.f].c;
      ctx.fillStyle = 'rgba(' + c.join(',') + ',' + (0.35 + 0.65 * g).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(x, yN, r * (1 + 0.35 * g), 0, 6.3); ctx.fill();
      if (g > 0.05) { ctx.strokeStyle = 'rgba(' + c.join(',') + ',' + (0.6 * g).toFixed(3) + ')'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, yN, r * 1.9, 0, 6.3); ctx.stroke(); }
    });
    // podpisy węzłów pod osią i nad nią na przemian, żeby się nie nakładały
    ctx.font = '500 ' + (FS - 1) + 'px ' + font; ctx.fillStyle = '#cfc8bb'; ctx.textAlign = 'center';
    const pod = [['wzrokowa i czuciowo-ruchowa', 0], ['grzbietowa uwagi', 1], ['kontroli', 2], ['domyślna', 3]];
    pod.forEach(([t, lv], j) => { const y = j % 2 ? yN - r - FS * 0.55 : yN + r + FS * 1.15; ctx.fillText(narrow && t.length > 12 ? t.split(' ')[0] : t, Math.min(W - FS * 3, X(lv)), y); });
    ctx.textAlign = 'left';
    ctx.fillStyle = '#8f877a'; ctx.fillText('receptory', X(-0.25) - ctx.measureText('receptory').width - FS * 0.6, yN + FS * 0.35);
    // nazwy torów
    tag(m - (narrow ? FS * 0.4 : 0), yP + FS * 0.35, 'predykcje', 'start');
    tag(m - (narrow ? FS * 0.4 : 0), yZ + FS * 0.35, 'zaskoczenie', 'start');
    ctx.restore();
  }

  function draw(now) {
    if (!D) return;
    const t = (now - t0) / 1000, w = fale(t);
    kamera();
    ctx.clearRect(0, 0, W, H);
    const kot = rysujMozg(w);
    const lw = Math.max(1.2, S * 0.45);
    for (const s of STR) linia(s.a, s.c, lw, s.d, 0.75);
    linia(SPI, '#ebe3d3', 1, [2, 6], 0.32);
    if (V1) {
      const v = P(V1[0], V1[1], V1[2]), przod = V1[3] * F[0] + V1[4] * F[1] + V1[5] * F[2] < 0.2;
      ctx.globalAlpha = przod ? 1 : 0.2; ctx.strokeStyle = 'rgba(235,227,211,.85)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(v[0], v[1], S * 7, 0, 6.3); ctx.stroke(); ctx.setLineDash([]);
      if (!reduce) for (const b of bursts) { const dt = t - b.t; if (dt < 1.1) { ctx.strokeStyle = 'rgba(111,179,168,' + (0.9 * (1 - dt / 1.1)).toFixed(3) + ')'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(v[0], v[1], S * 7 + dt * S * 30, 0, 6.3); ctx.stroke(); } }
      ctx.globalAlpha = 1;
    }
    etykiety(kot);
    const lvl = bursts.length ? bursts[bursts.length - 1].reach : 0;
    tag(W / 2, FS * 1.6, w.zA > 0.15 ? (lvl >= 3 ? 'zaskoczenie sięga sieci domyślnej' : lvl >= 2 ? 'zaskoczenie sięga sieci kontroli' : 'zaskoczenie sięga uwagi') : 'predykcje płyną od sieci domyślnej ku receptorom', 'middle');
    ctx.font = '500 ' + FS + 'px ' + font;
    STR.forEach((s, i) => { const y = HB - FS * 5 + i * FS * 1.7; ctx.setLineDash(s.d); ctx.strokeStyle = s.c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, y); ctx.lineTo(4 + FS * 2, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#cfc8bb'; ctx.fillText(s.n, 4 + FS * 2.6, y + FS * 0.35); });
    graf(w);
  }
  function loop(now) { if (auto && !reduce) yaw += 0.0025; draw(now); raf = visible ? requestAnimationFrame(loop) : 0; }

  // linie po bocznej powierzchni: dla punktu (y, z) najbardziej boczna kropka zwrócona na bok
  function poBoku(punkty) {
    const { pos, nrm, n } = D;
    return punkty.map(([y, z]) => {
      let best = -1, bd = 1e9;
      for (let i = 0; i < n; i++) {
        if (nrm[i * 3] > -40) continue;
        const d = (pos[i * 3 + 1] / 10 - y) ** 2 + (pos[i * 3 + 2] / 10 - z) ** 2 + 0.02 * (pos[i * 3] / 10 + 80) ** 2;
        if (d < bd) { bd = d; best = i; }
      }
      return [pos[best * 3] / 10 - 1.5, pos[best * 3 + 1] / 10, pos[best * 3 + 2] / 10, nrm[best * 3] / 127, nrm[best * 3 + 1] / 127, nrm[best * 3 + 2] / 127];
    });
  }
  const gesto = (pl, krok) => { const a = []; for (let i = 0; i < pl.length - 1; i++) for (let s = 0; s < 1; s += krok) a.push([pl[i][0] + (pl[i + 1][0] - pl[i][0]) * s, pl[i][1] + (pl[i + 1][1] - pl[i][1]) * s]); a.push(pl[pl.length - 1]); return a; };

  function start() {
    const { pos, n } = D;
    let sx = 0, sy = 0, sz = 0;
    for (let i = 0; i < n; i++) { sx += pos[i * 3]; sy += pos[i * 3 + 1]; sz += pos[i * 3 + 2]; }
    cx = sx / n / 10; cy = sy / n / 10 + 8; cz = sz / n / 10;
    // V1 na biegunie potylicznym, szlaki wzrokowe jak na ryc. 4 i spirala od V1 ku przodowi, w milimetrach MNI (y, z)
    V1 = poBoku([[-100, 2]])[0];
    STR = [
      { n: 'szlak grzbietowy', c: '#f9d780', d: [], a: poBoku(gesto([[-100, 4], [-82, 30], [-62, 52]], 0.12)) },
      { n: 'szlak boczny', c: '#6fb3a8', d: [6, 5], a: poBoku(gesto([[-100, 0], [-72, 2], [-52, 8], [-42, 12]], 0.12)) },
      { n: 'szlak brzuszny', c: '#ee6b6f', d: [], a: poBoku(gesto([[-100, -4], [-80, -14], [-50, -22], [-15, -32]], 0.12)) },
    ];
    const spi = [];
    for (let s = 0; s <= 1; s += 0.006) { const r = 6 + s * 62, a = s * Math.PI * 4.2; spi.push([-96 + s * 70 + r * Math.cos(a) * 0.95, 8 + r * Math.sin(a) * 0.6]); }
    SPI = poBoku(spi.filter(([y, z]) => y > -104 && y < 70 && z > -40 && z < 72));
  }

  // przeciąganie w poziomie obraca, w pionie przewija stronę (touch-action: pan-y)
  cv.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY]; auto = false; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => { if (!drag) return; yaw -= (e.clientX - drag[0]) * 0.01; if (e.pointerType === 'mouse') pitch = Math.max(-0.6, Math.min(0.9, pitch + (e.clientY - drag[1]) * 0.006)); drag = [e.clientX, e.clientY]; if (reduce || !raf) draw(performance.now()); });
  const up = () => { drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  btn.addEventListener('click', () => { const t = (performance.now() - t0) / 1000; const recent = bursts.filter((b) => t - b.t < 2.5).length; bursts.push({ t, reach: Math.min(ZASIEG.length - 1, recent + 1) }); if (!raf) raf = requestAnimationFrame(loop); });
  new ResizeObserver(() => { size(); draw(performance.now()); }).observe(root);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(cv);
  size();
  wczytaj('/images/2026/ryc5-punkty.bin').then((d) => { D = d; start(); draw(performance.now()); if (!raf) raf = requestAnimationFrame(loop); }).catch(() => { btn.hidden = true; });
}
