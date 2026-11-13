// Mózg Atlasu w trzech wymiarach (jego słowa, 2026-11-11: *can we make C and possible to rotate?*, potem *ok*, *can we add moving the
// brain? When I scroll closely, i want to be able to change the focal point*, *clicking something will show a pop up window with what it
// is*, *go and build it ... Remember to implement the choice between regions and networks*). Powierzchnia mózgu policzona z tej samej
// objętości co przekroje (szablon MNI 2009c, odbity w linii środkowej jak przekroje), każdy jej punkt z siecią Yeo i strukturą Allena.
// Trzy cięcia wycinają ósemkę mózgu od strony widza, przednią górną część na lewo od cięcia strzałkowego, a na ścianach wycięcia leżą
// przekroje (jego słowa, 2026-11-11: *add a 3rd cut on the 3d brain, from lateral to medial to lateral*). Przeciąganie obraca, kółko przybliża w stronę
// wskaźnika, prawy przycisk, Shift albo dwa palce przesuwają, dwuklik wraca do widoku startowego, wskazanie nazywa, a klik zaznacza to, co jest
// w miejscu. Kolory idą za przełącznikiem Sieci | Obszary i za zaznaczeniem Atlasu, które prowadzi `ziarno.js` (zdarzenia
// `atlas-wybor` i `atlas-ciecie` na siatce Atlasu).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const SZARY = '#57524a'; // ziarno sieci, która nie świeci
const CIEMNY = '#3a352d'; // powierzchnia bez koloru
const ZLOTE = '#f0c060'; // zaznaczony obszar

async function gz(url) {
  const r = await fetch(url);
  if (!r.ok || !('DecompressionStream' in window)) throw new Error(url);
  return new Uint8Array(await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
}
// plaster objętości: siatka lewej półkuli odbita w linii środkowej, wiersze od góry (czołowy) albo od przodu (poziomy)
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
function kontur(a, W, H, prog, x0 = 0, y0 = 0, x1 = W - 1, y1 = H - 1) {
  let d = '';
  const P = (x, y) => (x + 0.5).toFixed(2) + ' ' + (y + 0.5).toFixed(2);
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

export async function mozg3d(el) {
  const siatka = document.querySelector('.at-grid');
  if (!el || !siatka) return;
  const O = JSON.parse(siatka.dataset.objetosc);
  const KOL = JSON.parse(siatka.dataset.kolory), NAZWA = JSON.parse(siatka.dataset.nazwy || '{}');
  const REG = JSON.parse(siatka.dataset.regiony || '[]'), STRONY = JSON.parse(siatka.dataset.strony || '{"siec":{}}');
  // widok Płaty: kora płata w jego barwie (jego słowa, 2026-11-11: *we should add płaty to the views*)
  const PLAT_KOL = JSON.parse(siatka.dataset.platy || '{}');
  const platPola = (a) => { const r = a ? A2R[a] : 0; return r && REG[r - 1] ? REG[r - 1][2] : ''; };
  const { JAK, A2R, RODZAJ, NAZWY } = O;
  // grupa sieci Yeo w sieciach strony; sieć, którą span bierze w całości do innej, należy też do niej (`wspolne`, jak na rysunkach:
  // kora limbiczna jest też domyślna, Girn i in. 2024)
  const WSP = JSON.parse(siatka.dataset.wspolne || '[]');
  const FAM = O.sieci.map((s) => { const f = s[1].slice(); for (const { sieci: [a, b] } of WSP) if (f.includes(a) && !f.includes(b)) f.push(b); return f; });
  const BIALA = REG.findIndex((r) => r[0] === 'istota biała przodomózgowia') + 1;
  const trafia = (zr, n) => !!zr && !!n && (zr === n || JAK[zr] === n || (!!JAK[n] && JAK[n] === zr));

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) { el.classList.add('at-3d-brak'); return; }
  let vol, pow;
  try { [vol, pow] = await Promise.all([gz(O.url), gz(el.dataset.powierzchnia)]); } catch (e) { el.classList.add('at-3d-brak'); return; }

  const dv = new DataView(pow.buffer);
  const nv = dv.getUint32(0, true), nf = dv.getUint32(4, true);
  let o = 8;
  const pos16 = new Int16Array(pow.buffer.slice(o, o + nv * 6)); o += nv * 6;
  const ind = new Uint16Array(pow.buffer.slice(o, o + nf * 6)); o += nf * 6;
  const yeo = pow.slice(o, o + nv); o += nv;
  const allen = pow.slice(o, o + nv);
  const pos = new Float32Array(nv * 3);
  for (let i = 0; i < nv * 3; i++) pos[i] = pos16[i] / 10;

  const scena = el.querySelector('.at-3d-scena');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 10, 2000);
  camera.up.set(0, 0, 1);
  camera.position.set(-420, 150, 160);
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  renderer.localClippingEnabled = true;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  scena.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, -17, 5);
  const T0 = controls.target.clone();
  // poniżej 1000 px płótno zajmuje całą ramkę, więc przybliżony mózg przechodzi pod suwakami zamiast urywać się w kwadracie; pasy suwaków
  // (--pas-g, --pas-p, --pas-d, --pas-l w wiki.css) przepuszczają palec do przewijania strony, a mózg w widoku startowym mieści się
  // między nimi (jego nagranie, 2026-11-13: *this is not fixed well*)
  for (const k of ['g', 'd', 'p']) { const d = document.createElement('div'); d.className = 'at-3d-pas at-3d-pas-' + k; d.setAttribute('aria-hidden', 'true'); el.appendChild(d); }
  const pas = () => { const cs = getComputedStyle(el); return ['--pas-g', '--pas-p', '--pas-d', '--pas-l'].map((v) => parseFloat(cs.getPropertyValue(v)) || 0); };
  controls.enablePan = true; controls.screenSpacePanning = true; controls.zoomToCursor = true; controls.enableDamping = false;
  controls.minDistance = 40; controls.maxDistance = 700;
  controls.update();
  controls.saveState();
  // dwuklik i ↻ wracają do widoku startowego; pierwszy klik dwukliku nie otwiera dymka (przegląd Atlasu 2026-11-11)
  let tKlik = 0, tNazwa = 0;
  const odNowa = () => { clearTimeout(tKlik); controls.reset(); zamknij(); };
  renderer.domElement.addEventListener('dblclick', odNowa);
  const przyciskStart = el.querySelector('.at-3d-start');
  if (przyciskStart) przyciskStart.addEventListener('click', () => odNowa());

  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x0d0b08, 0.7));
  const lampa = new THREE.DirectionalLight(0xffffff, 2.2);
  camera.add(lampa); lampa.position.set(80, 120, 0); scene.add(camera);

  // stan Atlasu: tryb, świecące sieci, zaznaczony obszar, położenie cięć
  const stan = { tryb: 'sieci', lit: new Set(Object.keys(KOL)), obszar: 0, plat: '', hot: 0 };
  const cut = {};
  el.querySelectorAll('.at-suwak').forEach((s) => { cut[s.dataset.p] = Number(s.value); });
  const pC = new THREE.Plane(new THREE.Vector3(0, -1, 0), cut.czolowy);
  const pH = new THREE.Plane(new THREE.Vector3(0, 0, -1), cut.poziomy);
  const pS = new THREE.Plane(new THREE.Vector3(1, 0, 0), -cut.strzalkowy);
  const plaszczyzny = [pC, pH, pS];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setIndex(new THREE.BufferAttribute(ind, 1));
  geo.computeVertexNormals();
  const vc = new Float32Array(nv * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(vc, 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0, clippingPlanes: plaszczyzny, clipIntersection: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const kora = new THREE.Mesh(geo, mat);
  scene.add(kora);
  // ziarno na powierzchni: co trzeci punkt, odsunięty o włos od powierzchni
  const nrm = geo.getAttribute('normal').array, KROK = 3, ng = Math.ceil(nv / KROK);
  const gp = new Float32Array(ng * 3), gc = new Float32Array(ng * 3), los1 = new Float32Array(ng);
  let seed = 7;
  const los = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let j = 0; j < ng; j++) {
    const i = j * KROK;
    for (let k = 0; k < 3; k++) gp[j * 3 + k] = pos[i * 3 + k] + nrm[i * 3 + k] * 0.35;
    los1[j] = los();
  }
  const gg = new THREE.BufferGeometry();
  gg.setAttribute('position', new THREE.BufferAttribute(gp, 3));
  gg.setAttribute('color', new THREE.BufferAttribute(gc, 3));
  scene.add(new THREE.Points(gg, new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, clippingPlanes: plaszczyzny, clipIntersection: true })));

  const kol = new THREE.Color(), kol2 = new THREE.Color(), ciem = new THREE.Color(CIEMNY), szary = new THREE.Color(SZARY), zloto = new THREE.Color(ZLOTE), jasny = new THREE.Color('#bdb5a6');
  // sieci punktu, kiedy świeci któraś z nich: miejsce, które świecąca sieć dzieli z inną, świeci kolorem każdej swojej sieci, jak
  // ziarno na rysunkach
  const swieci = (y) => (y && FAM[y - 1].some((k) => stan.lit.has(k)) ? FAM[y - 1] : []);
  function koloruj() {
    for (let i = 0; i < nv; i++) {
      if (stan.tryb === 'platy') {
        const p = platPola(allen[i]), hp = stan.hot && REG[stan.hot - 1] ? REG[stan.hot - 1][2] : '';
        if (p && (!stan.plat || p === stan.plat || p === hp)) kol.set(PLAT_KOL[p]).lerp(ciem, 0.55); else kol.copy(ciem);
      } else if (stan.tryb === 'obszary') {
        const zaz = stan.obszar && trafia(A2R[allen[i]], stan.obszar);
        if (zaz) kol.copy(zloto).lerp(ciem, 0.45); else if (stan.hot && trafia(A2R[allen[i]], stan.hot)) kol.copy(szary).lerp(ciem, 0.35); else kol.copy(ciem);
      } else {
        const f = swieci(yeo[i]);
        if (f.length) { kol.set(KOL[f[0]]); if (f.length > 1) kol.lerp(kol2.set(KOL[f[1]]), 0.5); kol.lerp(ciem, 0.55); } else kol.copy(ciem);
      }
      vc[i * 3] = kol.r; vc[i * 3 + 1] = kol.g; vc[i * 3 + 2] = kol.b;
    }
    geo.getAttribute('color').needsUpdate = true;
    for (let j = 0; j < ng; j++) {
      const i = j * KROK;
      if (stan.tryb === 'platy') { const p = platPola(allen[i]), hp = stan.hot && REG[stan.hot - 1] ? REG[stan.hot - 1][2] : ''; if (p && (!stan.plat || p === stan.plat || p === hp)) kol.set(PLAT_KOL[p]); else kol.copy(szary); }
      else if (stan.tryb === 'obszary') kol.copy(stan.obszar && trafia(A2R[allen[i]], stan.obszar) ? zloto : stan.hot && trafia(A2R[allen[i]], stan.hot) ? jasny : szary);
      else { const f = swieci(yeo[i]); if (f.length) kol.set(KOL[f[Math.floor(los1[j] * f.length)]]); else kol.copy(szary); }
      gc[j * 3] = kol.r; gc[j * 3 + 1] = kol.g; gc[j * 3 + 2] = kol.b;
    }
    gg.getAttribute('color').needsUpdate = true;
  }

  // przekroje na ścianach wycięcia: ten sam plaster co w płaskich przekrojach, z ziarnem w trybie Atlasu
  const [NX, NY, NZ] = O.wymiar, k = O.krok, x0 = O.poczatek[0] - k / 2, Wmm = (2 * NX - 1) * k;
  const yTop = O.poczatek[1] + (NY - 0.5) * k, zTop = O.poczatek[2] + (NZ - 0.5) * k, zBot = O.poczatek[2] - k / 2, yBot = O.poczatek[1] - k / 2;
  const plastry = {};
  function obraz(p) {
    const mm = cut[p];
    const T = plaster(vol, O, 0, p, mm), B = plaster(vol, O, 1, p, mm), A = plaster(vol, O, 2, p, mm), Y = plaster(vol, O, 3, p, mm);
    plastry[p] = { T, B, A, Y };
    const S = 8, cv = document.createElement('canvas'); cv.width = T.W * S; cv.height = T.H * S;
    const g = cv.getContext('2d');
    g.fillStyle = '#1b1813';
    for (let i = 0; i < T.v.length; i++) if (T.v[i] > 127) g.fillRect((i % T.W) * S, Math.floor(i / T.W) * S, S + 1, S + 1);
    let s2 = 11;
    const l2 = () => ((s2 = (s2 * 16807) % 2147483647) / 2147483647);
    for (let yy = 1.75; yy < T.H * S; yy += 3.5) for (let xx = 1.75; xx < T.W * S; xx += 3.5) {
      const i = Math.floor(yy / S) * T.W + Math.floor(xx / S);
      if (T.v[i] <= 127) continue;
      const a = A.v[i], rodz = RODZAJ[a];
      let c = null;
      if (stan.tryb === 'platy') {
        const r = rodz === 'komora' ? 0 : A2R[a];
        if (!r || r === BIALA || JAK[r] === BIALA) continue;
        const pp = REG[r - 1] ? REG[r - 1][2] : '';
        c = pp ? (!stan.plat || pp === stan.plat ? PLAT_KOL[pp] : SZARY) : 'rgba(226,221,212,0.18)';
      } else if (stan.tryb === 'obszary') {
        const r = rodz === 'komora' ? 0 : A2R[a], zaz = stan.obszar && trafia(r, stan.obszar);
        if (!r || ((r === BIALA || JAK[r] === BIALA) && !zaz)) continue;
        c = zaz ? ZLOTE : 'rgba(226,221,212,0.18)';
      } else {
        if (B.v[i] >= 128 || rodz !== 'kora') continue;
        const f = swieci(Y.v[i]);
        c = f.length ? KOL[f[Math.floor(l2() * f.length)]] : SZARY;
      }
      g.fillStyle = c;
      g.beginPath(); g.arc(xx + (l2() - 0.5) * 1.2, yy + (l2() - 0.5) * 1.2, 1.3, 0, 6.283); g.fill();
    }
    let d = kontur(T.v, T.W, T.H, 127.5) + kontur(B.v, T.W, T.H, 127.5);
    const bb = new Map();
    for (let y = 0; y < T.H; y++) for (let x = 0; x < T.W; x++) {
      const a = A.v[y * T.W + x];
      if (!a || (RODZAJ[a] !== 'gleb' && RODZAJ[a] !== 'komora')) continue;
      const b = bb.get(a) || [x, y, x, y];
      bb.set(a, [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)]);
    }
    for (const [a, [ax, ay, bx, by]] of bb) {
      const f = new Float32Array(T.v.length), X0 = Math.max(0, ax - 2), Y0 = Math.max(0, ay - 2), X1 = Math.min(T.W - 1, bx + 2), Y1 = Math.min(T.H - 1, by + 2);
      for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
        let s = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = y + dy, xx = x + dx; if (yy >= 0 && xx >= 0 && yy < T.H && xx < T.W && A.v[yy * T.W + xx] === a) s++; }
        f[y * T.W + x] = s / 9;
      }
      d += kontur(f, T.W, T.H, 0.5, X0, Y0, X1, Y1);
    }
    g.setTransform(S, 0, 0, S, 0, 0); g.strokeStyle = 'rgba(226,221,212,.7)'; g.lineWidth = 1.3 / S; g.stroke(new Path2D(d));
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
    return tx;
  }
  const lico = {};
  const ramka = new THREE.LineBasicMaterial({ color: 0xf0c060, transparent: true, opacity: 0.85 });
  function postawLico(p) {
    if (lico[p]) { scene.remove(lico[p].m, lico[p].r); lico[p].m.geometry.dispose(); lico[p].m.material.map.dispose(); lico[p].m.material.dispose(); lico[p].r.geometry.dispose(); }
    delete lico[p];
    // ściany czołowa i pozioma sięgają od lewego brzegu mózgu do cięcia strzałkowego; obraz obejmuje obie półkule, więc ściana bierze
    // z niego tyle, ile ma szerokości
    const xs = Math.min(x0 + Wmm, cut.strzalkowy), ux = (xs - x0) / Wmm, yc = cut.czolowy, zc = cut.poziomy;
    if (p !== 'strzalkowy' && ux <= 0) return;
    const tx = obraz(p);
    let P, U;
    if (p === 'czolowy') {
      // ściana w y = cięcie, nad cięciem poziomym; obraz biegnie od góry mózgu w dół
      const y = cut.czolowy, z0 = zc, vz = (z0 - zBot) / (zTop - zBot);
      P = [x0, y, z0, xs, y, z0, xs, y, zTop, x0, y, zTop]; U = [0, vz, ux, vz, ux, 1, 0, 1];
    } else if (p === 'poziomy') {
      // ściana w z = cięcie, przed cięciem czołowym; obraz biegnie od przodu mózgu w tył
      const z = cut.poziomy, y0 = yc, vy = (y0 - yBot) / (yTop - yBot);
      P = [x0, y0, z, xs, y0, z, xs, yTop, z, x0, yTop, z]; U = [0, vy, ux, vy, ux, 1, 0, 1];
    } else {
      // ściana w x = cięcie, przed cięciem czołowym i nad poziomym; obraz biegnie od przodu mózgu w tył i od góry w dół
      const x = cut.strzalkowy, y0 = yc, z0 = zc, uy = (yTop - y0) / (yTop - yBot), vz = (z0 - zBot) / (zTop - zBot);
      P = [x, y0, z0, x, yTop, z0, x, yTop, zTop, x, y0, zTop]; U = [uy, vz, 0, vz, 0, 1, uy, 1];
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: tx, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    m.userData.p = p;
    const r = new THREE.LineLoop(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(P, 3)), ramka);
    scene.add(m, r);
    lico[p] = { m, r };
  }

  let czeka = 0;
  const rysuj = () => { if (czeka) return; czeka = requestAnimationFrame(() => { czeka = 0; renderer.render(scene, camera); }); };
  // widok startowy mieści mózg w ramce: odległość kamery liczona z szerokości i wysokości ramki, póki czytelnik nie ruszył mózgu
  let ruszony = false;
  controls.addEventListener('start', () => { ruszony = true; });
  const kierunek = camera.position.clone().sub(controls.target).normalize();
  function wymiar() {
    const w = scena.clientWidth, h = scena.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
    camera.aspect = w / h; camera.updateProjectionMatrix();
    // obrót palcem idzie za wysokością sceny (OrbitControls liczy pełny obrót na jej wysokość), więc na niskiej scenie telefonu ten sam
    // ruch palca obraca mózg tyle, ile ruch myszy na komputerze (jego słowa, 2026-11-13: *the navigation is somewhat off*)
    const [pg, pp, pd, pl] = pas(), poz = w > h;
    controls.rotateSpeed = pg ? Math.min(1, (h - pg - pd) / 600) : 1;
    // obrót telefonu stawia mózg od nowa w widoku startowym nowej ramki: przybliżenie z pionu urywało go w poziomie
    if (pg && bylPoz !== null && poz !== bylPoz && ruszony) { ruszony = false; zamknij(); }
    bylPoz = poz;
    if (!ruszony) {
      if (!pg) {
        // scena pod suwakami (na komputerze) mieści mózg między pasem górnego suwaka a pasem dolnego
        const pol = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), hm = (h - 110) / h;
        const d = Math.min(620, Math.max(320, Math.max(84 / (pol * hm), 112 / (pol * camera.aspect))));
        camera.position.copy(controls.target).addScaledVector(kierunek, d);
      } else wpasuj(w, h, pg, pp, pd, pl);
      controls.update(); controls.saveState();
    }
    rysuj();
  }
  let bylPoz = null;
  // poniżej 1000 px mózg wypełnia ramkę między pasami suwaków: kamera mierzy obrys powierzchni na ekranie, staje tak, żeby jego środek
  // wypadł na środku tego pola, i odsuwa się, aż zajmie je bez 4% marginesu (jego słowa, 2026-11-13: *too small on the vertical view*)
  function wpasuj(w, h, pg, pp, pd, pl) {
    const q = new THREE.Vector3(), pr = new THREE.Vector3(), gr = new THREE.Vector3(), pol = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const xL = -1 + 2 * pl / w, xR = 1 - 2 * pp / w, yG = 1 - 2 * pg / h, yD = -1 + 2 * pd / h;
    const icx = (xL + xR) / 2, icy = (yG + yD) / 2, ihw = (xR - xL) / 2, ihh = (yG - yD) / 2;
    controls.target.copy(T0);
    let d = camera.position.distanceTo(controls.target) || 400;
    for (let k = 0; k < 5; k++) {
      camera.position.copy(controls.target).addScaledVector(kierunek, d);
      camera.lookAt(controls.target); camera.updateMatrixWorld();
      let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
      for (let i = 0; i < nv; i += 4) {
        q.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]).project(camera);
        if (q.x < x0) x0 = q.x; if (q.x > x1) x1 = q.x; if (q.y < y0) y0 = q.y; if (q.y > y1) y1 = q.y;
      }
      const hh = d * pol, hw = hh * camera.aspect;
      pr.setFromMatrixColumn(camera.matrixWorld, 0); gr.setFromMatrixColumn(camera.matrixWorld, 1);
      controls.target.addScaledVector(pr, ((x0 + x1) / 2 - icx) * hw).addScaledVector(gr, ((y0 + y1) / 2 - icy) * hh);
      d = Math.min(controls.maxDistance, Math.max(controls.minDistance, d * Math.max((x1 - x0) / 2 / ihw, (y1 - y0) / 2 / ihh) / 0.96));
    }
    camera.position.copy(controls.target).addScaledVector(kierunek, d);
  }
  const CIECIA = ['czolowy', 'poziomy', 'strzalkowy'];
  const lica = () => CIECIA.forEach(postawLico);
  function wszystko() { koloruj(); lica(); rysuj(); }

  // zaznaczenie i tryb z Atlasu
  const zStanu = (d) => {
    if (!d) return;
    stan.tryb = d.tryb || stan.tryb;
    stan.lit = new Set(d.lit || []);
    stan.obszar = d.wybor && d.wybor.typ === 'obszar' ? d.wybor.n : 0;
    stan.plat = d.wybor && d.wybor.typ === 'plat' ? d.wybor.p : '';
  };
  zStanu(siatka.__stan);
  siatka.addEventListener('atlas-wybor', (e) => {
    // inny widok albo zdjęte zaznaczenie chowa nazwę części, bo nazywała coś, czego już nie ma (przegląd 2026-11-11)
    const byl = stan.tryb;
    zStanu(e.detail);
    if (stan.tryb !== byl || !e.detail.wybor) zamknij();
    wszystko();
  });
  siatka.addEventListener('atlas-ciecie', (e) => {
    cut[e.detail.p] = e.detail.mm; pC.constant = cut.czolowy; pH.constant = cut.poziomy; pS.constant = -cut.strzalkowy;
    lica(); rysuj();
  });

  // wskazanie nazywa część pod wskaźnikiem w kroju znacznika przekrojów: w trybie Obszary strukturę Allena i jej płat, w trybie Sieci
  // sieć Yeo i sieci strony; klik zaznacza to samo, co klik w przekroju, a karta zaznaczenia wczytuje się pod mózgiem bez przewijania
  // (jego słowa, 2026-11-11: *clicking on the 3d brain should highlight the structure and open its card below in the background.
  // hovering over should display a name of the part*); dymek po kliknięciu zszedł
  const nazwa = el.querySelector('.at-3d-nazwa');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const zamknij = () => { if (nazwa) nazwa.hidden = true; };
  function opis(a, y) {
    if (stan.tryb === 'platy') { const p = platPola(a); return p ? '<span><b>' + esc(p) + '</b></span>' : ''; }
    if (stan.tryb === 'obszary') {
      const r = a ? A2R[a] : 0;
      if (!r) return '';
      const reg = REG[r - 1];
      return '<span><b>' + esc(NAZWY[a]) + '</b>' + (reg && reg[2] ? ' ' + esc(reg[2]) : '') + '</span>';
    }
    if (!y) return '';
    const sie = O.sieci[y - 1];
    return '<span class="wk-kod-yeo">' + esc(sie[0]) + '</span>' + sie[1].map((c, j) => '<span' + (j ? ' class="wk-kod-dalej"' : '') + '><b style="color:' + KOL[c] + '">' + c + '</b> ' + esc(NAZWA[c] || '') + '</span>').join('');
  }
  function nazwij(t, x, yy) {
    const h = t ? opis(t[0], t[1]) : '';
    if (!h || !nazwa) { zamknij(); return; }
    nazwa.innerHTML = h;
    nazwa.hidden = false;
    // na prawo od wskaźnika, a gdzie tam brak miejsca na ekranie, na lewo, i nigdy poza ekranem
    const rb = el.getBoundingClientRect(), w = nazwa.offsetWidth, E = document.documentElement.clientWidth;
    const L = x + 14 + w <= E - 4 ? x + 14 : x - 14 - w >= 4 ? x - 14 - w : 4;
    nazwa.style.left = L - rb.left + 'px';
    nazwa.style.top = Math.max(0, yy - rb.top - 10) + 'px';
  }
  const ray = new THREE.Raycaster(), mysz = new THREE.Vector2();
  const usuniete = (q) => q.y > cut.czolowy && q.z > cut.poziomy && q.x < cut.strzalkowy;
  function trafienie(e) {
    const r = renderer.domElement.getBoundingClientRect();
    mysz.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mysz, camera);
    for (const h of ray.intersectObjects([kora, ...CIECIA.filter((p) => lico[p]).map((p) => lico[p].m)], false)) {
      if (h.object === kora) {
        if (usuniete(h.point)) continue;
        const f = h.face;
        let best = f.a, bd = Infinity;
        for (const i of [f.a, f.b, f.c]) { const d = (pos[i * 3] - h.point.x) ** 2 + (pos[i * 3 + 1] - h.point.y) ** 2 + (pos[i * 3 + 2] - h.point.z) ** 2; if (d < bd) { bd = d; best = i; } }
        return [allen[best], yeo[best]];
      }
      const pl = plastry[h.object.userData.p];
      if (!pl || !h.uv) continue;
      const c = Math.min(pl.T.W - 1, Math.floor(h.uv.x * pl.T.W)), rr = Math.min(pl.T.H - 1, Math.floor((1 - h.uv.y) * pl.T.H)), i = rr * pl.T.W + c;
      if (pl.T.v[i] <= 127) continue; // poza tkanką ściana jest przezroczysta
      const czyKora = pl.B.v[i] < 128 && RODZAJ[pl.A.v[i]] === 'kora';
      return [pl.A.v[i], czyKora ? pl.Y.v[i] : 0];
    }
    return null;
  }
  // kółko przybliża mózg, kiedy wskaźnik jest na nim; nad pustym miejscem sceny przewija stronę, bo scena na komputerze ma całą
  // szerokość strony i inaczej strona nie dałaby się przewinąć kółkiem przez mózg
  geo.computeBoundingSphere();
  const kula = geo.boundingSphere, sr = new THREE.Vector3();
  scena.addEventListener('wheel', (e) => {
    const r = renderer.domElement.getBoundingClientRect();
    sr.copy(kula.center).project(camera);
    const cx = r.left + ((sr.x + 1) / 2) * r.width, cy = r.top + ((1 - sr.y) / 2) * r.height;
    const pr = (kula.radius / (camera.position.distanceTo(kula.center) * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))) * (r.height / 2);
    if (Math.hypot(e.clientX - cx, e.clientY - cy) > pr * 0.85) e.stopPropagation();
  }, { capture: true, passive: true });
  let start = null;
  renderer.domElement.addEventListener('pointerdown', (e) => { start = [e.clientX, e.clientY, performance.now()]; });
  renderer.domElement.addEventListener('pointerup', (e) => {
    if (!start || e.button !== 0) { start = null; return; }
    const [sx, sy, t0] = start; start = null;
    // palec drży bardziej niż mysz, więc stuknięcie znosi 12 px ruchu
    const palec = e.pointerType === 'touch';
    if (Math.hypot(e.clientX - sx, e.clientY - sy) > (palec ? 12 : 5) || performance.now() - t0 > 600) return;
    const t = trafienie(e), cx = e.clientX, cy = e.clientY;
    clearTimeout(tKlik);
    // klik czeka 250 ms, więc dwuklik tylko wraca do widoku startowego; palec nie ma wskazania, więc stuknięcie też nazywa część
    tKlik = setTimeout(() => {
      if (!t) return;
      let w = null;
      if (stan.tryb === 'platy') { const p = platPola(t[0]); if (p) w = { typ: 'plat', p }; }
      else if (stan.tryb === 'obszary') { const r = t[0] ? A2R[t[0]] : 0; if (r) w = { typ: 'obszar', n: r }; }
      else if (t[1] && O.sieci[t[1] - 1][1].length) w = { typ: 'siec', kody: O.sieci[t[1] - 1][1].slice() };
      if (w) siatka.dispatchEvent(new CustomEvent('atlas-klik', { detail: w }));
      if (palec) { nazwij(t, cx, cy); clearTimeout(tNazwa); tNazwa = setTimeout(zamknij, 3000); } // na telefonie nazwa nie zostaje na mózgu
    }, 250);
  });
  let ruch = 0, ostatni = null;
  renderer.domElement.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    if (e.buttons) { zamknij(); return; }
    ostatni = e;
    if (ruch) return;
    ruch = requestAnimationFrame(() => { ruch = 0; const t = trafienie(ostatni); nazwij(t, ostatni.clientX, ostatni.clientY); naHot(t ? A2R[t[0]] || 0 : 0); });
  });
  // wskazana struktura jaśnieje w 3D jak w przekrojach (przegląd 2026-11-11), kolory liczą się na nowo tylko przy zmianie
  function naHot(r) { if (stan.tryb === 'sieci') r = 0; if (r === stan.hot) return; stan.hot = r; koloruj(); rysuj(); }
  renderer.domElement.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') { zamknij(); naHot(0); } });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') zamknij(); });
  controls.addEventListener('start', zamknij);
  controls.addEventListener('change', rysuj);

  // suwaki na osiach widoku startowego: dolny biegnie od przodu do tyłu mózgu, boczny od góry do dołu, górny od prawej półkuli do lewej,
  // tak jak mózg leży w ramce; każdy ma długość swojej osi mózgu na ekranie
  const osie = () => {
    const rb = scena.getBoundingClientRect();
    if (!rb.width) return;
    const kam = camera.clone();
    kam.position.copy(controls.position0); kam.up.set(0, 0, 1); kam.lookAt(controls.target0); kam.updateMatrixWorld(); kam.updateProjectionMatrix();
    const ekr = (x, y, z) => { const v = new THREE.Vector3(x, y, z).project(kam); return [(v.x + 1) / 2 * rb.width, (1 - v.y) / 2 * rb.height]; };
    const M = O.mozg, zs = (M.gora + M.dol) / 2, ys = (M.przod + M.tyl) / 2;
    const [px] = ekr(0, M.przod, zs), [tx] = ekr(0, M.tyl, zs), [, gy] = ekr(0, ys, M.gora), [, dy] = ekr(0, ys, M.dol);
    const [lx] = ekr(-M.bok, ys, zs), [rx] = ekr(M.bok, ys, zs);
    const dol = el.querySelector('.at-os-czolowy'), bok = el.querySelector('.at-os-poziomy'), gor = el.querySelector('.at-os-strzalkowy');
    // scena zaczyna się pod górnym suwakiem, więc suwaki liczą się od jej rogu
    // poniżej 1000 px scena to cała ramka, a suwaki trzymają się pola między pasami
    const ox = scena.offsetLeft, oy = scena.offsetTop, [pg, pp, pd, pl] = pas();
    if (dol) { dol.style.left = ox + Math.max(pl, Math.min(px, tx)) + 'px'; dol.style.width = Math.abs(tx - px) + 'px'; }
    // boczny stoi tuż za tyłem mózgu, mierzonym na powierzchni, a gdzie ramka jest za wąska, w pasie przy jej brzegu
    let prawy = 0;
    const q = new THREE.Vector3();
    for (let i = 0; i < nv; i += 5) { q.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]).project(kam); prawy = Math.max(prawy, (q.x + 1) / 2 * rb.width); }
    // z wyłącznikiem pod spodem kończy się na dole sceny, nad dolnym suwakiem
    const bt = Math.max(pg, Math.min(gy, dy));
    if (bok) { bok.style.top = oy + bt + 'px'; bok.style.height = Math.min(Math.abs(dy - gy), rb.height - pd - bt) + 'px'; bok.style.right = 'auto'; bok.style.left = ox + Math.min(rb.width - pp + 6, prawy + 20) + 'px'; }
    // na szerokim ekranie przekrój poziomy staje za pionowym suwakiem, w skali przekrojów z lewej, i nigdy pod nim (przegląd 2026-11-11:
    // suwak szedł przez lewą półkulę przekroju i jego znacznik)
    const gl = el.closest('.at-glowny'), pz = gl && gl.querySelector('.at-boki-prawe'), lw = gl && gl.querySelector('.at-boki-lewe');
    if (pz && bok && lw && getComputedStyle(pz).position === 'absolute') {
      const g = gl.getBoundingClientRect(), sb = bok.getBoundingClientRect(), szer = lw.getBoundingClientRect().width * 0.808;
      const od = sb.right + 10 - g.left, maks = document.documentElement.clientWidth - 8 - g.left;
      pz.style.left = od + 'px'; pz.style.right = 'auto'; pz.style.width = Math.max(120, Math.min(szer, maks - od)) + 'px';
    } else if (pz) { pz.style.left = pz.style.right = pz.style.width = ''; }
    // suwak z wyłącznikiem ma co najmniej 210 px, żeby dało się go przesuwać, i zostaje w ramce
    if (gor) { const w = Math.max(210, Math.abs(rx - lx)), c = (lx + rx) / 2; gor.style.left = ox + Math.max(0, Math.min(rb.width - pp - w, c - w / 2)) + 'px'; gor.style.width = w + 'px'; }
  };
  new ResizeObserver(() => { wymiar(); osie(); }).observe(scena);
  wymiar(); osie();
  wszystko();
  el.classList.add('at-3d-gotowy');
}
