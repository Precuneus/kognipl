// Ryc. 5 wpisu 28.10: półkula z kropek, która się obraca (jego słowo, 2026-11-02: *make a brain, show the networks, anchor them in the
// streams, show the spiral how it works when predicting and how it works in reverse when surprise occurs*). Sieci leżą na swoich obszarach
// rdzeniowych (Uddin i in. 2019, Yeo i in. 2011), szlaki wzrokowe jak na ryc. 4. Predykcje płyną zachodzącą falą od sieci domyślnej ku
// receptorom, z dłuższą przerwą po sieciach przy receptorach (*the top down series should be continuous, overlapping. And the pause between
// v1/smn and dmn bigger*). Przycisk wywołuje wybuch zaskoczenia, a kolejne kliknięcia sięgają wyżej (*more surprises the higher it reaches*);
// świecą tylko sieci (*make the networks light up, without the white areas*).
const NET = [
  { n: 'wzrokowa', c: [249, 215, 128], l: 0 },
  { n: 'czuciowo-ruchowa', c: [238, 107, 111], l: 0 },
  { n: 'grzbietowa uwagi', c: [229, 142, 118], l: 1 },
  { n: 'kontroli', c: [246, 153, 89], l: 2 },
  { n: 'domyślna', c: [187, 111, 178], l: 3 },
  { n: 'istotności', c: [111, 179, 168], l: 4 },
];
const yy = (y) => (y >= 0 ? y : y / 0.72);
const hz = (x, y) => 0.95 * Math.sqrt(Math.max(0, 1 - (x / 1.35) ** 2 - (yy(y) / 0.92) ** 2));
function maskL(x, y) {
  if ((x / 1.35) ** 2 + (yy(y) / 0.92) ** 2 >= 1) return false;
  if (x > 0.62 && y < -0.28) return false;
  if (x < -0.95 && y < -0.42) return false;
  return true;
}
function maskM(x, y) {
  if (!maskL(x, y)) return false;
  if (((x - 0.02) / 0.62) ** 2 + ((y - 0.06) / 0.12) ** 2 < 1) return false;
  if (y < -0.22 && x > -0.55 && x < 0.62) return false;
  return true;
}
const E = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / (ry || rx)) ** 2 < 1;
// powierzchnia boczna: tył mózgu po ujemnej stronie x, czoło po dodatniej
function netL(x, y) {
  if (y > -0.05 && Math.abs(x - (y - 0.9) * (-0.25 / 0.9)) < 0.12) return 1;
  if (E(x, y, -0.02, -0.2, 0.15, 0.08)) return 1;
  if (x < -0.95 || (x < -0.82 && y < 0.05 && y > -0.4 && !E(x, y, -0.82, -0.12, 0.12))) return 0;
  if (E(x, y, 0.36, -0.03, 0.1, 0.07)) return 5;
  if (E(x, y, -0.55, 0.62, 0.24, 0.18) || E(x, y, -0.82, -0.12, 0.12) || E(x, y, 0.33, 0.62, 0.1)) return 2;
  if (E(x, y, 0.78, 0.36, 0.3, 0.17) || E(x, y, -0.27, 0.32, 0.13, 0.11)) return 3;
  if (E(x, y, -0.6, 0.12, 0.15, 0.13) || E(x, y, 0.42, -0.44, 0.24, 0.11) || E(x, y, 0.05, -0.36, 0.18, 0.07) || (x > 0.85 && y < 0)) return 4;
  return -1;
}
// ściana przyśrodkowa
function netM(x, y) {
  if (x < -0.85) return 0;
  if (E(x, y, 0, 0.76, 0.16, 0.12)) return 1;
  if (E(x, y, 0.32, 0.3, 0.16, 0.1)) return 5;
  if (E(x, y, -0.47, 0.55, 0.13, 0.11)) return 3;
  if (E(x, y, -0.32, 0.24, 0.2, 0.14) || E(x, y, 0.88, 0.22, 0.32, 0.3)) return 4;
  return -1;
}
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }
const rand = rng(28102026);
const PTS = [];
for (let i = 0; i < 5200; i++) { const x = (rand() * 2 - 1) * 1.35, y = rand() * 1.6 - 0.68; if (maskL(x, y)) PTS.push({ p: [x, y, hz(x, y) + 0.05], k: netL(x, y), s: 'L' }); }
for (let i = 0; i < 3600; i++) { const x = (rand() * 2 - 1) * 1.35, y = rand() * 1.6 - 0.68; if (maskM(x, y)) PTS.push({ p: [x, y, 0], k: netM(x, y), s: 'M' }); }
function onL(pl) {
  const a = [];
  for (let i = 0; i < pl.length - 1; i++) for (let s = 0; s < 1; s += 0.08) { const x = pl[i][0] + (pl[i + 1][0] - pl[i][0]) * s, y = pl[i][1] + (pl[i + 1][1] - pl[i][1]) * s; a.push([x, y, hz(x, y) + 0.08]); }
  const l = pl[pl.length - 1]; a.push([l[0], l[1], hz(l[0], l[1]) + 0.08]);
  return a;
}
const ST = [
  { n: 'szlak grzbietowy', c: '#f9d780', d: [], a: onL([[-1.28, 0.04], [-1.0, 0.38], [-0.58, 0.6]]) },
  { n: 'szlak boczny', c: '#6fb3a8', d: [6, 5], a: onL([[-1.28, 0], [-0.84, -0.12], [-0.4, -0.27], [0.1, -0.3]]) },
  { n: 'szlak brzuszny', c: '#ee6b6f', d: [], a: onL([[-1.28, -0.04], [-0.95, -0.36], [-0.4, -0.48], [0.42, -0.44]]) },
];
const SPI = [];
for (let s = 0; s <= 1; s += 0.004) { const r = 0.08 + s * 0.95, a = s * Math.PI * 4.2, x = -1.25 + r * Math.cos(a) * 1.25 + s * 0.9, y = r * Math.sin(a) * 0.6; if (maskL(x, y)) SPI.push([x, y, hz(x, y) + 0.07]); }
const CC = []; for (let a = 0; a <= 6.3; a += 0.1) CC.push([0.02 + 0.62 * Math.cos(a), 0.06 + 0.12 * Math.sin(a), -0.01]);
const ANC = { L: { 0: [-1.15, 0], 1: [0.12, 0.55], 2: [-0.55, 0.62], 3: [0.78, 0.36], 4: [0.42, -0.44], 5: [0.36, -0.03] }, M: { 0: [-1.1, 0.1], 1: [0, 0.76], 3: [-0.47, 0.55], 4: [-0.32, 0.24], 5: [0.32, 0.3] } };
const bell = (x, s) => Math.exp(-(x * x) / (2 * s * s));
const OFF = { 3: 0, 2: 0.5, 1: 1.0, 0: 1.5 }, CYCLE = 1.5 + 0.6 + 2.4, SEQ = [0, 4, 1, 2, 3];

export function mozg(root) {
  const cv = root.querySelector('canvas'), btn = root.querySelector('button'), ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const font = getComputedStyle(root).fontFamily;
  let W = 0, H = 0, S = 1, FS = 13, narrow = false;
  let yaw = Math.PI - 0.35, pitch = 0.18, drag = null, auto = true, t0 = performance.now(), predStart = 0, visible = true, raf = 0;
  const bursts = [];
  function size() {
    const w = root.clientWidth, dpr = Math.min(2, devicePixelRatio || 1);
    narrow = w < 520; W = w; H = Math.round(w * (narrow ? 0.9 : 0.68)); FS = narrow ? 11.5 : 13;
    S = narrow ? w * 0.25 : Math.min(w * 0.24, H * 0.4);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const R = (p) => { let [x, y, z] = p; const c = Math.cos(yaw), n = Math.sin(yaw); [x, z] = [x * c - z * n, x * n + z * c]; const cp = Math.cos(pitch), sp = Math.sin(pitch); return [x, y * cp - z * sp, y * sp + z * cp]; };
  const P = (p) => { const r = R(p); return [W / 2 + r[0] * S, H * 0.5 - r[1] * S, r[2]]; };
  const latFront = () => R([0, 0, 1])[2] < 0;
  function tag(x, y, t, al) {
    ctx.font = '500 ' + FS + 'px ' + font; const w = ctx.measureText(t).width, x0 = al === 'end' ? x - w : al === 'middle' ? x - w / 2 : x;
    ctx.fillStyle = 'rgba(18,17,13,.9)'; ctx.strokeStyle = 'rgba(214,198,166,.42)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(x0 - FS * 0.62, y - FS * 0.95, w + FS * 1.24, FS * 1.5, FS * 0.75); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ebe3d3'; ctx.fillText(t, x0, y + FS * 0.12);
  }
  function poly(a, col, w, dash, front, alpha) {
    ctx.save(); ctx.setLineDash(dash || []); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.globalAlpha = (front ? 1 : 0.15) * alpha;
    ctx.beginPath(); a.forEach((p, i) => { const q = P(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.stroke(); ctx.restore();
  }
  function labels(lf) {
    const side = lf ? 'L' : 'M', items = [];
    for (const k in ANC[side]) { const [x, y] = ANC[side][k]; items.push({ t: NET[k].n, q: P([x, y, side === 'L' ? hz(x, y) + 0.05 : 0]) }); }
    items.push({ t: 'V1', q: lf ? P([-1.3, 0, hz(-1.3, 0) + 0.05]) : P([-1.2, 0.02, 0]) });
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
    const top = FS * 4, legend = FS * 6.5;
    place(items.filter((o) => o.q[0] < W / 2).sort((a, b) => a.q[1] - b.q[1]), pad + 2, 'start', top, H - legend);
    place(items.filter((o) => o.q[0] >= W / 2).sort((a, b) => a.q[1] - b.q[1]), W - pad - 2, 'end', top, H - FS * 1.5);
  }
  function draw(now) {
    const t = (now - t0) / 1000, lf = latFront();
    ctx.clearRect(0, 0, W, H);
    while (bursts.length && t - bursts[0].t > 3) bursts.shift();
    const g = [0, 0, 0, 0, 0]; let env = 0;
    for (const b of bursts) {
      const dt = t - b.t; env = Math.max(env, bell(Math.max(0, dt - 0.2 * b.reach), 0.35));
      for (let i = 0; i <= Math.min(4, b.reach); i++) g[SEQ[i]] = Math.max(g[SEQ[i]], (1.25 - 0.06 * i) * bell(dt - 0.16 * i, 0.2));
    }
    if (bursts.length) { const b = bursts[bursts.length - 1]; predStart = Math.max(predStart, b.t + 0.6 + 0.2 * b.reach); }
    const supp = 1 - Math.min(1, env);
    if (!reduce && t >= predStart) { const tc = (t - predStart) % CYCLE; for (const l of [3, 2, 1, 0]) g[l] = Math.max(g[l], supp * bell(tc - OFF[l], 0.28)); }
    const r0 = Math.max(1.4, S / 110);
    const pr = PTS.map((o) => ({ o, q: P(o.p) })).sort((a, b) => b.q[2] - a.q[2]);
    for (const { o, q } of pr) {
      const front = (o.s === 'L') === lf; let c = [130, 124, 112], gl = 0;
      if (o.k >= 0) { c = NET[o.k].c; gl = g[NET[o.k].l]; }
      const a = Math.min(1, (o.k >= 0 ? 0.2 : 0.09) + gl * 0.72) * (front ? 1 : 0.12);
      ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`; ctx.beginPath(); ctx.arc(q[0], q[1], (front ? r0 : r0 * 0.7) + gl * r0 * 0.6, 0, 6.3); ctx.fill();
    }
    const lw = Math.max(1.4, S / 95);
    poly(CC, '#c8bfae', 1, [4, 5], !lf, 0.6);
    for (const s of ST) poly(s.a, s.c, lw, s.d, lf, 0.8);
    poly(SPI, '#ebe3d3', 1, [2, 6], lf, 0.35);
    const v1 = lf ? P([-1.3, 0, hz(-1.3, 0) + 0.05]) : P([-1.2, 0.02, 0]);
    ctx.strokeStyle = 'rgba(235,227,211,.85)'; ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(v1[0], v1[1], S * 0.05, 0, 6.3); ctx.stroke(); ctx.setLineDash([]);
    for (const b of bursts) { const dt = t - b.t; if (dt < 1.1) { ctx.strokeStyle = `rgba(111,179,168,${0.9 * (1 - dt / 1.1)})`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(v1[0], v1[1], S * 0.05 + dt * S * (0.4 + 0.3 * b.reach), 0, 6.3); ctx.stroke(); } }
    labels(lf);
    const lvl = bursts.length ? bursts[bursts.length - 1].reach : 0;
    tag(W / 2, FS * 1.6, env > 0.15 ? (lvl >= 4 ? 'zaskoczenie sięga sieci domyślnej' : lvl >= 3 ? 'zaskoczenie sięga sieci kontroli' : lvl >= 2 ? 'zaskoczenie sięga uwagi' : 'zaskoczenie: receptory i sieć istotności') : 'predykcje: od sieci do sieci, ku receptorom', 'middle');
    ctx.font = '500 ' + FS + 'px ' + font;
    ST.forEach((s, i) => { const y = H - FS * 5 + i * FS * 1.7; ctx.setLineDash(s.d); ctx.strokeStyle = s.c; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(4, y); ctx.lineTo(4 + FS * 2, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#ebe3d3'; ctx.fillText(s.n, 10 + FS * 2.2, y + FS * 0.35); });
  }
  function loop(now) { if (auto && !reduce) yaw += 0.0025; draw(now); raf = visible ? requestAnimationFrame(loop) : 0; }
  // przeciąganie w poziomie obraca, w pionie przewija stronę (touch-action: pan-y)
  cv.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY]; auto = false; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => { if (!drag) return; yaw += (e.clientX - drag[0]) * 0.01; if (e.pointerType === 'mouse') pitch = Math.max(-0.6, Math.min(0.9, pitch + (e.clientY - drag[1]) * 0.006)); drag = [e.clientX, e.clientY]; if (reduce) draw(performance.now()); });
  const up = () => { drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  btn.addEventListener('click', () => { const t = (performance.now() - t0) / 1000; const recent = bursts.filter((b) => t - b.t < 2.5).length; bursts.push({ t, reach: Math.min(4, recent + 1) }); if (!raf) raf = requestAnimationFrame(loop); });
  new ResizeObserver(() => { size(); draw(performance.now()); }).observe(root);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(cv);
  size(); draw(performance.now());
}
