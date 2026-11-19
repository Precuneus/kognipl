// Mózg Atlasu w trzech wymiarach (jego słowa, 2026-11-11: *can we make C and possible to rotate?*, potem *ok*, *can we add moving the
// brain? When I scroll closely, i want to be able to change the focal point*, *clicking something will show a pop up window with what it
// is*, *go and build it ... Remember to implement the choice between regions and networks*). Powierzchnia mózgu policzona z tej samej
// objętości co przekroje (szablon MNI 2009c, odbity w linii środkowej jak przekroje), każdy jej punkt z siecią Yeo i strukturą Allena.
// Mózg tnie się z każdej strony: suwak każdej osi ma dwie gałki, mózg zostaje między nimi, a to, co za gałką, schodzi całym plastrem;
// na każdej ścianie cięcia leży przekrój (jego słowa, 2026-11-16: *So I can slice from top and from bottom on one suwak; from left and
// from right on the second, and from front and from back on the third*; pudło cięć liczy `ciecia.js`, zdarzenie `atlas-pudlo`). Przeciąganie obraca, kółko przybliża w stronę
// wskaźnika, prawy przycisk, Shift albo dwa palce przesuwają, dwuklik wraca do widoku startowego, wskazanie nazywa, a klik zaznacza to, co jest
// w miejscu. Kolory idą za przełącznikiem Sieci | Obszary i za zaznaczeniem Atlasu, które prowadzi `ziarno.js` (zdarzenia
// `atlas-wybor` na siatce Atlasu).
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { wczytajPolaczenia, plasterParcel, razem, indeks, RAZEM, KREM, BIALE } from './polaczenia.js';

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
  // zaznaczona grupa zapala swoje części na każdym szczeblu, a zaznaczona część tylko swoją grupę, szczebel wyżej (przegląd 2026-11-16:
  // ciało suteczkowate zapalało całe podwzgórze, a samo było 23 % złota)
  const wyzej = (a, g) => { for (let x = JAK[a], i = 0; x && i < 8; x = JAK[x], i++) if (x === g) return true; return false; };
  const trafia = (zr, n) => !!zr && !!n && (zr === n || wyzej(zr, n) || JAK[n] === zr);
  // obszar wprost: sam obszar i jego części; grupa zaznaczonej części świeci bladym złotem, więc część nie tonie w niej (przegląd
  // 2026-11-16: jądra przednie wzgórza świeciły obwódką całego wzgórza)
  const wprost = (zr, n) => !!zr && !!n && (zr === n || wyzej(zr, n));

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (e) { el.classList.add('at-3d-brak'); return; }
  let vol, pow;
  try { [vol, pow] = await Promise.all([gz(O.url), gz(el.dataset.powierzchnia)]); } catch (e) { el.classList.add('at-3d-brak'); return; }

  const dv = new DataView(pow.buffer);
  const nv0 = dv.getUint32(0, true), nf = dv.getUint32(4, true);
  let o = 8;
  const pos16 = new Int16Array(pow.buffer.slice(o, o + nv0 * 6)); o += nv0 * 6;
  const ind = new Uint16Array(pow.buffer.slice(o, o + nf * 6)); o += nf * 6;
  const yeo0 = pow.slice(o, o + nv0); o += nv0;
  const allen0 = pow.slice(o, o + nv0); o += nv0;
  // czapa pod móżdżkiem (jego zrzut, 2026-11-19: *removing the cerebellum leaves a hole in the cerebrum*): powierzchnia mózgu liczona
  // z objętości, w której móżdżek, jego istota biała i przylegająca tkanka bez etykiety są zerem (`mozdzek.py --czapa`); ogon pliku zawiera
  // jej punkty, których stara powierzchnia nie ma, i jej trójkąty, które biorą punkty starej powierzchni na szwie, więc szew jest szczelny;
  // `blisko` to najbliższy punkt starej powierzchni poza móżdżkiem, od którego nowy punkt bierze parcelę połączeń
  let nc = 0, capI = new Uint16Array(0), blisko = new Uint16Array(0), posC = new Int16Array(0), yeoC = new Uint8Array(0), allenC = new Uint8Array(0);
  if (pow.length > o + 8) {
    nc = dv.getUint32(o, true); const nt = dv.getUint32(o + 4, true); o += 8;
    posC = new Int16Array(pow.buffer.slice(o, o + nc * 6)); o += nc * 6;
    capI = new Uint16Array(pow.buffer.slice(o, o + nt * 6)); o += nt * 6;
    yeoC = pow.slice(o, o + nc); o += nc;
    allenC = pow.slice(o, o + nc); o += nc;
    blisko = new Uint16Array(pow.buffer.slice(o, o + nc * 2));
  }
  const nv = nv0 + nc;
  const yeo = new Uint8Array(nv), allen = new Uint8Array(nv);
  yeo.set(yeo0); yeo.set(yeoC, nv0); allen.set(allen0); allen.set(allenC, nv0);
  const pos = new Float32Array(nv * 3);
  for (let i = 0; i < nv0 * 3; i++) pos[i] = pos16[i] / 10;
  for (let i = 0; i < nc * 3; i++) pos[nv0 * 3 + i] = posC[i] / 10;

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
  // widok startowy to też cały mózg: ↻ i dwuklik zdejmują cięcia (`ciecia.js`, zdarzenie `atlas-start`; przegląd 2026-11-16: po
  // cięciach ↻ wracał tylko kamerą, a mózg zostawał pocięty)
  const odNowa = () => { clearTimeout(tKlik); controls.reset(); zamknij(); mozdzek(true); siatka.dispatchEvent(new CustomEvent('atlas-start')); };
  renderer.domElement.addEventListener('dblclick', odNowa);
  const przyciskStart = el.querySelector('.at-3d-start');
  if (przyciskStart) przyciskStart.addEventListener('click', () => odNowa());

  scene.add(new THREE.HemisphereLight(0xfff1dc, 0x0d0b08, 0.7));
  const lampa = new THREE.DirectionalLight(0xffffff, 2.2);
  camera.add(lampa); lampa.position.set(80, 120, 0); scene.add(camera);

  // stan Atlasu: tryb, świecące sieci, zaznaczony obszar, położenie cięć
  const stan = { tryb: 'sieci', lit: new Set(Object.keys(KOL)), obszar: 0, plat: '', hot: 0, parcela: -1, hotPar: -1 };
  // tryb Połączenia (jego słowa, 2026-11-18: *I want the connections on the atlas, not the landing page*, potem *ok, start preparing the
  // first option*): parcele wczytują się przy pierwszym wejściu w tryb; vpar to parcela każdego punktu powierzchni (indeks w macierzy)
  let D = null, vpar = null;
  const POL_URL = siatka.dataset.polaczenia || '';
  const nazwaParceli = (k) => { const m = D && D.meta.parcele[k]; if (!m) return ''; return k >= 400 ? D.meta.pod[(k - 400) % 7] : NAZWY[m[1]] || ''; };
  const sieciParceli = (k) => { const m = D && D.meta.parcele[k]; return m && m[2] ? O.sieci[m[2] - 1][1] : []; };
  function zPolaczeniami() {
    if (!POL_URL || D) return;
    wczytajPolaczenia(POL_URL).then((d) => {
      if (D) return;
      D = d; vpar = new Int16Array(nv);
      for (let i = 0; i < nv; i++) vpar[i] = indeks(D.wierz[i < nv0 ? i : blisko[i - nv0]], pos[i * 3] < 0 ? 0 : 1);
      wszystko();
    }).catch(() => {});
  }
  // pudło cięć: na każdej osi mózg zostaje między dwiema gałkami; płaszczyzna zostawia punkty, których odległość jest nieujemna
  let P = siatka.__pudlo || { x: [-999, 999], y: [-999, 999], z: [-999, 999], tnie: { x: [false, false], y: [false, false], z: [false, false] } };
  const plaszczyzny = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map(([a, b, c]) => new THREE.Plane(new THREE.Vector3(a, b, c), 0));
  const ustawPlaszczyzny = () => {
    plaszczyzny[0].constant = -P.x[0]; plaszczyzny[1].constant = P.x[1];
    plaszczyzny[2].constant = -P.y[0]; plaszczyzny[3].constant = P.y[1];
    plaszczyzny[4].constant = -P.z[0]; plaszczyzny[5].constant = P.z[1];
  };
  ustawPlaszczyzny();
  // gałka 0 stoi na początku toru: lewa to mniejsze x, góra i przód to większe z i y
  const tnie = (os, j) => { const t = P.tnie[os]; return os === 'x' ? t[j] : t[1 - j]; };

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  // móżdżek do schowania (jego słowa, 2026-11-19: *we want to add a button to remove the cerebellum, as it covers the ventral part of
  // the cerebrum*): powierzchnia i jej ziarno bez trójkątów i punktów móżdżku, grupy Allena CB z częściami, a na ich miejscu czapa;
  // pień z konarami zostaje; widok startowy to cały mózg, więc ↻ móżdżek przywraca
  const CB = REG.findIndex((r) => r[0] === 'móżdżek') + 1;
  const wMozdzku = (a) => { const r = a ? A2R[a] : 0; return !!CB && !!r && (r === CB || wyzej(r, CB)); };
  const indBez = [];
  for (let f = 0; f < ind.length; f += 3) if (!wMozdzku(allen[ind[f]]) && !wMozdzku(allen[ind[f + 1]]) && !wMozdzku(allen[ind[f + 2]])) indBez.push(ind[f], ind[f + 1], ind[f + 2]);
  for (let f = 0; f < capI.length; f++) indBez.push(capI[f]);
  // normalne punktów czapy liczone na powierzchni bez móżdżku, reszta na całej
  geo.setIndex(new THREE.BufferAttribute(new Uint16Array(indBez), 1));
  geo.computeVertexNormals();
  const nrmC = geo.getAttribute('normal').array.slice(nv0 * 3);
  geo.setIndex(new THREE.BufferAttribute(ind, 1));
  geo.computeVertexNormals();
  geo.getAttribute('normal').array.set(nrmC, nv0 * 3);
  const vc = new Float32Array(nv * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(vc, 3));
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0, clippingPlanes: plaszczyzny, clipIntersection: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
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
  scene.add(new THREE.Points(gg, new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, clippingPlanes: plaszczyzny, clipIntersection: false })));
  const ziarnoCale = [], ziarnoBez = [];
  for (let j = 0; j < ng; j++) { if (j * KROK < nv0) ziarnoCale.push(j); if (!wMozdzku(allen[j * KROK])) ziarnoBez.push(j); }
  const korIdx = [geo.getIndex(), new THREE.BufferAttribute(new Uint16Array(indBez), 1)];
  const ziaIdx = [new THREE.BufferAttribute(new Uint32Array(ziarnoCale), 1), new THREE.BufferAttribute(new Uint32Array(ziarnoBez), 1)];
  gg.setIndex(ziaIdx[0]);
  const przyciskMozdzek = el.querySelector('.at-mozdzek');
  let bezMozdzku = false;
  function mozdzek(widac) {
    const zmiana = bezMozdzku === widac; bezMozdzku = !widac;
    geo.setIndex(korIdx[widac ? 0 : 1]); gg.setIndex(ziaIdx[widac ? 0 : 1]);
    if (przyciskMozdzek) przyciskMozdzek.setAttribute('aria-checked', String(widac));
    if (zmiana && typeof lica === 'function') lica(true);
    if (typeof rysuj === 'function') rysuj();
  }
  if (przyciskMozdzek) przyciskMozdzek.addEventListener('click', () => mozdzek(przyciskMozdzek.getAttribute('aria-checked') !== 'true'));

  const kol = new THREE.Color(), kol2 = new THREE.Color(), ciem = new THREE.Color(CIEMNY), szary = new THREE.Color(SZARY), zloto = new THREE.Color(ZLOTE), blade = new THREE.Color(ZLOTE).lerp(new THREE.Color(SZARY), 0.55), jasny = new THREE.Color('#bdb5a6');
  // sieci punktu, kiedy świeci któraś z nich: miejsce, które świecąca sieć dzieli z inną, świeci kolorem każdej swojej sieci, jak
  // ziarno na rysunkach
  const swieci = (y) => (y && FAM[y - 1].some((k) => stan.lit.has(k)) ? FAM[y - 1] : []);
  const krem = new THREE.Color(KREM);
  function koloruj() {
    const pol = stan.tryb === 'polaczenia', sel = stan.parcela;
    for (let i = 0; i < nv; i++) {
      if (pol) {
        // parcela zaznaczona złotem, reszta w ciepłej bieli tym jaśniejszej, im bliżej jej aktywność idzie z zaznaczoną; bez zaznaczenia
        // ciemna powierzchnia, parcela pod wskaźnikiem jaśniejsza
        const p = vpar ? vpar[i] : -1;
        if (p < 0) kol.copy(ciem);
        else if (sel >= 0) { if (p === sel) kol.copy(zloto).lerp(ciem, 0.3); else kol.copy(ciem).lerp(krem, razem(D, sel, p) * 0.8); }
        else kol.copy(p === stan.hotPar ? szary : ciem);
      } else if (stan.tryb === 'platy') {
        const p = platPola(allen[i]), hp = stan.hot && REG[stan.hot - 1] ? REG[stan.hot - 1][2] : '';
        if (p && (!stan.plat || p === stan.plat || p === hp)) kol.set(PLAT_KOL[p]).lerp(ciem, 0.55); else kol.copy(ciem);
      } else if (stan.tryb === 'obszary') {
        const zaz = stan.obszar && trafia(A2R[allen[i]], stan.obszar);
        if (zaz) kol.copy(zloto).lerp(ciem, wprost(A2R[allen[i]], stan.obszar) ? 0.45 : 0.78); else if (stan.hot && trafia(A2R[allen[i]], stan.hot)) kol.copy(szary).lerp(ciem, 0.35); else kol.copy(ciem);
      } else {
        const f = swieci(yeo[i]);
        if (f.length) { kol.set(KOL[f[0]]); if (f.length > 1) kol.lerp(kol2.set(KOL[f[1]]), 0.5); kol.lerp(ciem, 0.55); } else kol.copy(ciem);
      }
      vc[i * 3] = kol.r; vc[i * 3 + 1] = kol.g; vc[i * 3 + 2] = kol.b;
    }
    geo.getAttribute('color').needsUpdate = true;
    for (let j = 0; j < ng; j++) {
      const i = j * KROK;
      if (pol) {
        const p = vpar ? vpar[i] : -1;
        if (p < 0) kol.copy(szary);
        else if (sel >= 0) { if (p === sel) kol.copy(zloto); else kol.copy(szary).lerp(krem, razem(D, sel, p)); }
        else kol.copy(p === stan.hotPar ? jasny : szary);
      } else if (stan.tryb === 'platy') { const p = platPola(allen[i]), hp = stan.hot && REG[stan.hot - 1] ? REG[stan.hot - 1][2] : ''; if (p && (!stan.plat || p === stan.plat || p === hp)) kol.set(PLAT_KOL[p]); else kol.copy(szary); }
      else if (stan.tryb === 'obszary') kol.copy(stan.obszar && trafia(A2R[allen[i]], stan.obszar) ? (wprost(A2R[allen[i]], stan.obszar) ? zloto : blade) : stan.hot && trafia(A2R[allen[i]], stan.hot) ? jasny : szary);
      else { const f = swieci(yeo[i]); if (f.length) kol.set(KOL[f[Math.floor(los1[j] * f.length)]]); else kol.copy(szary); }
      gc[j * 3] = kol.r; gc[j * 3 + 1] = kol.g; gc[j * 3 + 2] = kol.b;
    }
    gg.getAttribute('color').needsUpdate = true;
  }

  // przekroje na ścianach cięć: ten sam plaster co w płaskich przekrojach, z ziarnem w trybie Atlasu
  const [NX, NY, NZ] = O.wymiar, k = O.krok, x0 = O.poczatek[0] - k / 2, Wmm = (2 * NX - 1) * k;
  const yTop = O.poczatek[1] + (NY - 0.5) * k, zTop = O.poczatek[2] + (NZ - 0.5) * k, zBot = O.poczatek[2] - k / 2, yBot = O.poczatek[1] - k / 2;
  const plastry = {};
  // istota biała tyłomózgowia (Allen HWM) to i pień, i drzewo móżdżku (ponowny audyt 2026-11-19: przy wyłączonym móżdżku ściana rysowała
  // jego rozgałęzioną istotę białą); pole HWM należy do móżdżku, kiedy przez samą istotę białą najbliżej mu do kory lub jąder móżdżku,
  // a do pnia, kiedy najbliżej do istoty szarej pnia. Konary i komory nie są źródłem, więc podział wypada tam, gdzie konary wchodzą
  // w móżdżek; liczone raz, przy pierwszym wyłączeniu
  let MASKA_HWM = null;
  function bialaMozdzku() {
    if (MASKA_HWM) return MASKA_HWM;
    const [nx, ny, nz] = O.wymiar, NV = nx * ny * nz, fA = 2 * NV;
    const HWM = NAZWY.indexOf('istota biała tyłomózgowia');
    const kto = new Int8Array(NV), q = new Int32Array(NV);
    let h = 0, t = 0;
    for (let i = 0; i < NV; i++) {
      const a = vol[fA + i];
      if (!a || a === HWM || RODZAJ[a] === 'komora' || /^konar/.test(NAZWY[a] || '')) continue;
      kto[i] = wMozdzku(a) ? 1 : 2; q[t++] = i;
    }
    const kroki = [1, -1, nx, -nx, nx * nz, -nx * nz];
    while (h < t) {
      const i = q[h++], xi = i % nx;
      for (const d of kroki) {
        if ((d === 1 && xi === nx - 1) || (d === -1 && xi === 0)) continue;
        const n = i + d;
        if (n < 0 || n >= NV || kto[n] || vol[fA + n] !== HWM) continue;
        kto[n] = kto[i]; q[t++] = n;
      }
    }
    MASKA_HWM = new Uint8Array(NV);
    for (let i = 0; i < NV; i++) if (kto[i] === 1 && vol[fA + i] === HWM) MASKA_HWM[i] = 1;
    return MASKA_HWM;
  }
  function obraz(p, mm, id) {
    const T = plaster(vol, O, 0, p, mm), B = plaster(vol, O, 1, p, mm), A = plaster(vol, O, 2, p, mm), Y = plaster(vol, O, 3, p, mm);
    const PAR = D ? plasterParcel(D, O, p, mm).v.slice() : null;
    // ściany cięć idą za wyłącznikiem móżdżku (audyt 2026-11-19: po cięciu od tyłu ściana rysowała plaster móżdżku z całej objętości, a
    // wskaźnik nazywał na niej część boczną półkuli): pola grupy CB i przylegająca do nich tkanka bez etykiety znikają z obrazu i ze
    // wskazania; płaskie przekroje zostają całe, bo móżdżek niczego w nich nie zasłania
    if (bezMozdzku) {
      const kolejka = [];
      const zgas = (i) => { T.v[i] = 0; B.v[i] = 0; A.v[i] = 0; Y.v[i] = 0; if (PAR) PAR[i] = 0; kolejka.push(i); };
      const M = plaster(bialaMozdzku(), O, 0, p, mm).v;
      for (let i = 0; i < T.v.length; i++) if (wMozdzku(A.v[i]) || M[i]) zgas(i);
      while (kolejka.length) {
        const i = kolejka.pop(), x = i % T.W, y = (i / T.W) | 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const xx = x + dx, yy = y + dy, n = yy * T.W + xx;
          if (xx >= 0 && yy >= 0 && xx < T.W && yy < T.H && !A.v[n] && T.v[n] > 127) zgas(n);
        }
      }
    }
    plastry[id] = { T, B, A, Y, PAR };
    const S = 8, cv = document.createElement('canvas'); cv.width = T.W * S; cv.height = T.H * S;
    const g = cv.getContext('2d');
    // komory też są ścianą: przez dziurę w ścianie widać było od środka ścianę komory na powierzchni 3D, a każdy jej punkt nosi strukturę,
    // której dotyka, więc zaznaczone jądro przy komorze (jądro łożyskowe prążka krańcowego) świeciło plamami za liniami przekroju (jego
    // zrzut, 2026-11-16: *it marks strange structures and they are on top of each other*)
    // brzeg komory bez etykiety komory (pole tkanki poniżej progu w promieniu 2 pól od komory) też zamyka ścianę (przegląd 2026-11-16:
    // 481 takich pól zostawało przezroczystych)
    const K = new Uint8Array(T.v.length);
    for (let i = 0; i < T.v.length; i++) {
      if (RODZAJ[A.v[i]] !== 'komora') continue;
      const x = i % T.W, y = (i / T.W) | 0;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < T.W && yy < T.H) K[yy * T.W + xx] = 1; }
    }
    plastry[id].K = K;
    // ramka ściany obejmuje tkankę przekroju, a nie całą ramkę objętości (przegląd 2026-11-16: przy 1920 px złota ramka szła przez
    // przekrój w kolumnie i urywała się na dole sceny); tkanka to pole ze strukturą Allena albo siecią, z polem zapasu z każdej strony
    let c0 = T.W, c1 = -1, r0 = T.H, r1 = -1;
    for (let i = 0; i < T.v.length; i++) if (A.v[i] || Y.v[i]) { const x = i % T.W, y = (i / T.W) | 0; if (x < c0) c0 = x; if (x > c1) c1 = x; if (y < r0) r0 = y; if (y > r1) r1 = y; }
    plastry[id].bb = c1 < 0 ? null : [Math.max(0, c0 - 1) / T.W, Math.min(T.W, c1 + 2) / T.W, 1 - Math.min(T.H, r1 + 2) / T.H, 1 - Math.max(0, r0 - 1) / T.H];
    for (let i = 0; i < T.v.length; i++) {
      const kom = T.v[i] <= 127 && (RODZAJ[A.v[i]] === 'komora' || K[i]);
      if (T.v[i] > 127 || kom) { g.fillStyle = kom ? '#100e0b' : '#1b1813'; g.fillRect((i % T.W) * S, Math.floor(i / T.W) * S, S + 1, S + 1); }
    }
    let s2 = 11;
    const l2 = () => ((s2 = (s2 * 16807) % 2147483647) / 2147483647);
    for (let yy = 1.75; yy < T.H * S; yy += 3.5) for (let xx = 1.75; xx < T.W * S; xx += 3.5) {
      const i = Math.floor(yy / S) * T.W + Math.floor(xx / S);
      if (T.v[i] <= 127) continue;
      const a = A.v[i], rodz = RODZAJ[a];
      let c = null;
      if (stan.tryb === 'polaczenia') {
        // jak w płaskich przekrojach: parcela zaznaczona złotem, reszta w barwie aktywności razem, partnerów włókien obrysowuje biała linia
        const pk = PAR ? PAR[i] - 1 : -1, sel = stan.parcela;
        if (pk < 0) continue;
        if (sel >= 0) c = pk === sel ? ZLOTE : RAZEM[Math.round(razem(D, sel, pk) * (RAZEM.length - 1))];
        else c = pk === stan.hotPar ? 'rgba(226,221,212,0.42)' : SZARY;
      } else if (stan.tryb === 'platy') {
        const r = rodz === 'komora' ? 0 : A2R[a];
        if (!r || r === BIALA || JAK[r] === BIALA) continue;
        const pp = REG[r - 1] ? REG[r - 1][2] : '';
        c = pp ? (!stan.plat || pp === stan.plat ? PLAT_KOL[pp] : SZARY) : 'rgba(226,221,212,0.18)';
      } else if (stan.tryb === 'obszary') {
        const r = rodz === 'komora' ? 0 : A2R[a], zaz = stan.obszar && trafia(r, stan.obszar);
        if (!r || ((r === BIALA || JAK[r] === BIALA) && !zaz)) continue;
        c = zaz ? (wprost(r, stan.obszar) ? ZLOTE : 'rgba(240,192,96,0.4)') : 'rgba(226,221,212,0.18)';
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
    if (stan.tryb === 'polaczenia' && stan.parcela >= 0 && PAR) {
      const s = D.sasiad[stan.parcela], m = new Float32Array(PAR.length);
      for (let i = 0; i < PAR.length; i++) m[i] = PAR[i] && PAR[i] - 1 !== stan.parcela && s.has(PAR[i] - 1) ? 1 : 0;
      g.strokeStyle = BIALE; g.lineWidth = 1.6 / S; g.stroke(new Path2D(kontur(m, T.W, T.H, 0.5)));
    }
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
    return tx;
  }
  // ściana cięcia: przekrój w miejscu gałki, na szerokość tego, co z mózgu zostało na dwóch pozostałych osiach; obraz ściany liczy się
  // na nowo tylko wtedy, kiedy jej gałka się ruszyła albo zmieniło się zaznaczenie, a ruch innej osi przycina tylko jej ramę
  const lico = {};
  const ramka = new THREE.LineBasicMaterial({ color: 0xf0c060, transparent: true, opacity: 0.85 });
  const PRZEKROJ = { x: 'strzalkowy', y: 'czolowy', z: 'poziomy' };
  const usunLico = (id, zTeksturą) => {
    const L = lico[id];
    if (!L) return;
    scene.remove(L.m, L.r); L.m.geometry.dispose(); L.m.material.dispose(); L.r.geometry.dispose();
    if (zTeksturą) { L.tx.dispose(); delete lico[id]; }
  };
  function postawLico(os, j, sila) {
    const id = os + j, v = P[os][j], L = lico[id];
    if (!tnie(os, j)) { usunLico(id, true); return; }
    const nowa = !L || sila || Math.abs(L.mm - v) > 0.01;
    const tx = nowa ? obraz(PRZEKROJ[os], v, id) : L.tx;
    if (L) { usunLico(id, nowa); }
    let xa = Math.max(P.x[0], x0), xb = Math.min(P.x[1], x0 + Wmm), ya = Math.max(P.y[0], yBot), yb = Math.min(P.y[1], yTop), za = Math.max(P.z[0], zBot), zb = Math.min(P.z[1], zTop);
    const bb = plastry[id] && plastry[id].bb, Dy = yTop - yBot, Dz = zTop - zBot;
    if (bb) {
      const [u0, u1, v0, v1] = bb;
      if (os !== 'x') { xa = Math.max(xa, x0 + u0 * Wmm); xb = Math.min(xb, x0 + u1 * Wmm); }
      else { ya = Math.max(ya, yTop - u1 * Dy); yb = Math.min(yb, yTop - u0 * Dy); }
      if (os === 'z') { ya = Math.max(ya, yBot + v0 * Dy); yb = Math.min(yb, yBot + v1 * Dy); }
      else { za = Math.max(za, zBot + v0 * Dz); zb = Math.min(zb, zBot + v1 * Dz); }
    }
    if (xa >= xb || ya >= yb || za >= zb) { if (nowa) tx.dispose(); delete lico[id]; return; }
    const ux = (x) => (x - x0) / Wmm, vy = (y) => (y - yBot) / (yTop - yBot), vz = (z) => (z - zBot) / (zTop - zBot), uy = (y) => (yTop - y) / (yTop - yBot);
    let Pp, U;
    // poziomy: obraz od przodu mózgu w tył; czołowy: od góry w dół; strzałkowy: od przodu w tył i od góry w dół, przód po lewej
    if (os === 'z') { Pp = [xa, ya, v, xb, ya, v, xb, yb, v, xa, yb, v]; U = [ux(xa), vy(ya), ux(xb), vy(ya), ux(xb), vy(yb), ux(xa), vy(yb)]; }
    else if (os === 'y') { Pp = [xa, v, za, xb, v, za, xb, v, zb, xa, v, zb]; U = [ux(xa), vz(za), ux(xb), vz(za), ux(xb), vz(zb), ux(xa), vz(zb)]; }
    else { Pp = [v, ya, za, v, yb, za, v, yb, zb, v, ya, zb]; U = [uy(ya), vz(za), uy(yb), vz(za), uy(yb), vz(zb), uy(ya), vz(zb)]; }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(Pp, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ map: tx, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    m.userData.id = id;
    const r = new THREE.LineLoop(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Pp, 3)), ramka);
    scene.add(m, r);
    lico[id] = { m, r, tx, mm: v };
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
      // na komputerze scena ma całą szerokość strony, a mózg mieści się w polu od lewego brzegu strony do kolumny przekrojów
      if (!pg) wpasuj(w, h, ...pole());
      else wpasuj(w, h, pg, pp, pd, pl);
      controls.update(); controls.saveState();
    }
    rysuj();
  }
  let bylPoz = null;
  const pole = () => {
    const rs = scena.getBoundingClientRect(), gl = el.closest('.at-glowny'), kol = gl && gl.querySelector('.at-kol');
    const g = gl ? gl.getBoundingClientRect() : rs, kr = kol ? kol.getBoundingClientRect() : null;
    // pas nad mózgiem, pod nim i z prawej trzyma suwaki cięć, a lewy brzeg zostawia miejsce na ↻ i nazwę przodu
    const prawo = kr && kr.width ? rs.right - kr.left + 28 + 84 : rs.right - g.right;
    return [56, Math.max(0, prawo), 60, Math.max(0, g.left - rs.left + 56)];
  };
  // poniżej 1000 px mózg wypełnia ramkę między pasami suwaków: kamera mierzy obrys powierzchni na ekranie i odsuwa się, aż zajmie pole
  // bez 4% marginesu (jego słowa, 2026-11-13: *too small on the vertical view*). Mózg obraca się w miejscu (jego słowa, 2026-11-19: *the
  // rotating of the brain is somewhat odd*): środek obrotu zostaje w środku mózgu, a na środek pola przesuwa go przesunięcie obrazu
  // kamery (setViewOffset); przesunięty środek obrotu kołysał mózgiem przez całą ramkę, pod suwak i w kolumnę przekrojów
  function wpasuj(w, h, pg, pp, pd, pl) {
    const q = new THREE.Vector3();
    const xL = -1 + 2 * pl / w, xR = 1 - 2 * pp / w, yG = 1 - 2 * pg / h, yD = -1 + 2 * pd / h;
    const icx = (xL + xR) / 2, icy = (yG + yD) / 2, ihw = (xR - xL) / 2, ihh = (yG - yD) / 2;
    controls.target.copy(T0);
    camera.clearViewOffset();
    let d = camera.position.distanceTo(controls.target) || 400, cx = 0, cy = 0;
    for (let k = 0; k < 6; k++) {
      camera.position.copy(controls.target).addScaledVector(kierunek, d);
      camera.lookAt(controls.target); camera.updateMatrixWorld();
      let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
      for (let i = 0; i < nv; i += 4) {
        q.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]).project(camera);
        if (q.x < x0) x0 = q.x; if (q.x > x1) x1 = q.x; if (q.y < y0) y0 = q.y; if (q.y > y1) y1 = q.y;
      }
      cx = (x0 + x1) / 2; cy = (y0 + y1) / 2;
      if (k < 5) d = Math.min(controls.maxDistance, Math.max(controls.minDistance, d * Math.max((x1 - x0) / 2 / ihw, (y1 - y0) / 2 / ihh) / 0.96));
    }
    camera.setViewOffset(w, h, -(icx - cx) * w / 2, (icy - cy) * h / 2, w, h);
  }
  const SCIANY = [['x', 0], ['x', 1], ['y', 0], ['y', 1], ['z', 0], ['z', 1]];
  const lica = (sila) => SCIANY.forEach(([os, j]) => postawLico(os, j, sila));
  function wszystko() { koloruj(); lica(true); luki(); rysuj(); przypiete(); }

  // łuki włókien: od środka zaznaczonej parceli do środka każdego partnera, wygięte ku środkowi mózgu, grubsze przy silniejszym połączeniu.
  // Jasny łuk widać tam, gdzie tkankę zdjęło cięcie, a jego cień prześwituje przez korę, jak cień przypiętej bryły; złota kropka stoi
  // w środku zaznaczonej parceli
  const SRODEK = new THREE.Vector3(0, -18, 8);
  let lukiGrupa = null;
  function luki() {
    if (lukiGrupa) { scene.remove(lukiGrupa); lukiGrupa.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); lukiGrupa = null; }
    const sel = stan.parcela;
    if (stan.tryb !== 'polaczenia' || sel < 0 || !D) return;
    const C = D.cen, a = new THREE.Vector3(C[sel * 3], C[sel * 3 + 1], C[sel * 3 + 2]), b = new THREE.Vector3(), m = new THREE.Vector3();
    const geos = [];
    for (const [j, w] of D.wlokna[sel]) {
      b.set(C[j * 3], C[j * 3 + 1], C[j * 3 + 2]);
      m.copy(a).add(b).multiplyScalar(0.5).lerp(SRODEK, 0.35);
      const krzywa = new THREE.QuadraticBezierCurve3(a.clone(), m.clone(), b.clone());
      geos.push(new THREE.TubeGeometry(krzywa, 24, 0.22 + 0.7 * w * w, 5, false));
    }
    lukiGrupa = new THREE.Group();
    if (geos.length) {
      const g = mergeGeometries(geos);
      geos.forEach((x) => x.dispose());
      const jasny = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xf7f4ee, transparent: true, opacity: 0.9 }));
      const cien = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0xf7f4ee, transparent: true, opacity: 0.2, depthTest: false, depthWrite: false }));
      cien.renderOrder = 9;
      lukiGrupa.add(jasny, cien);
    }
    const kropka = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12), new THREE.MeshBasicMaterial({ color: ZLOTE, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false }));
    kropka.position.copy(a); kropka.renderOrder = 11;
    lukiGrupa.add(kropka);
    scene.add(lukiGrupa);
  }

  // przypinanie (jego notatki, 2026-11-15: *User selects any structure (midbrain, basal ganglia, thalamic nucleus) and it stays as a 3D mesh
  // regardless of sagittal/coronal/axial slice positions. Not clipped by slice planes. Multiple pinned structures, each with its own
  // toggle*): zaznaczony obszar przypina się chipem pod mózgiem; przypięty stoi jako bryła liczona z objętości, bez płaszczyzn cięcia,
  // w obu półkulach, a jej cień prześwituje przez tkankę, więc widać, gdzie leży, także pod korą; chip pokazuje i chowa bryłę, × ją odpina
  const PIN_KOL = ['#e8d8b0', '#9fd0e0', '#e6a58c', '#b9d48c', '#c9a8e0', '#e8b8d0', '#8fd6b8', '#d8b878'];
  const piny = [];
  const pinBox = el.closest('.at-glowny') ? el.closest('.at-glowny').querySelector('.at-przypiete') : null;
  function bryla(n) {
    // pola obszaru n i jego części na każdym szczeblu, lewa półkula odbita w linii środkowej jak w przekrojach
    const NV = NX * NY * NZ, f = 2 * NV, ok = new Uint8Array(256);
    for (let a = 1; a < 256; a++) ok[a] = A2R[a] && (A2R[a] === n || wyzej(A2R[a], n)) ? 1 : 0;
    let bx = NX, by0 = NY, by1 = -1, bz0 = NZ, bz1 = -1;
    for (let yi = 0; yi < NY; yi++) for (let zi = 0; zi < NZ; zi++) {
      const b = f + (yi * NZ + zi) * NX;
      for (let xi = 0; xi < NX; xi++) if (ok[vol[b + xi]]) { if (xi < bx) bx = xi; if (yi < by0) by0 = yi; if (yi > by1) by1 = yi; if (zi < bz0) bz0 = zi; if (zi > bz1) bz1 = zi; }
    }
    if (by1 < 0) return null;
    const c0 = bx - 2, A = 2 * (NX - 1 - bx) + 5, B = by1 - by0 + 5, C = bz1 - bz0 + 5;
    const s = new Uint8Array(A * B * C), S = (i, j, l) => s[(i * B + j) * C + l];
    for (let i = 0; i < A; i++) {
      const c = c0 + i, xi = c < NX ? c : 2 * (NX - 1) - c;
      if (xi < 0 || xi >= NX || c > 2 * (NX - 1)) continue;
      for (let j = 0; j < B; j++) {
        const yi = by0 - 2 + j; if (yi < 0 || yi >= NY) continue;
        for (let l = 0; l < C; l++) { const zi = bz0 - 2 + l; if (zi >= 0 && zi < NZ && ok[vol[f + (yi * NZ + zi) * NX + xi]]) s[(i * B + j) * C + l] = 1; }
      }
    }
    // siatka powierzchni (surface nets): wierzchołek w każdej komórce na granicy, w środku jej przecięć, ściana na każdej krawędzi granicy
    const ci = new Int32Array((A - 1) * (B - 1) * (C - 1)).fill(-1), CI = (i, j, l) => ci[(i * (B - 1) + j) * (C - 1) + l];
    const P = [];
    for (let i = 0; i < A - 1; i++) for (let j = 0; j < B - 1; j++) for (let l = 0; l < C - 1; l++) {
      let n0 = 0, sx = 0, sy = 0, sz = 0, m = 0;
      for (let d = 0; d < 8; d++) n0 += S(i + (d & 1), j + ((d >> 1) & 1), l + (d >> 2));
      if (n0 === 0 || n0 === 8) continue;
      for (let d = 0; d < 8; d++) for (const e of [1, 2, 4]) {
        if (d & e) continue;
        const a = S(i + (d & 1), j + ((d >> 1) & 1), l + (d >> 2)), d2 = d | e, b = S(i + (d2 & 1), j + ((d2 >> 1) & 1), l + (d2 >> 2));
        if (a === b) continue;
        sx += (d & 1) + (e === 1 ? 0.5 : 0); sy += ((d >> 1) & 1) + (e === 2 ? 0.5 : 0); sz += (d >> 2) + (e === 4 ? 0.5 : 0); m++;
      }
      ci[(i * (B - 1) + j) * (C - 1) + l] = P.length / 3;
      P.push(i + sx / m, j + sy / m, l + sz / m);
    }
    const I = [], quad = (a, b, c, d, w) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; if (w) I.push(a, b, c, a, c, d); else I.push(a, d, c, a, c, b); };
    for (let i = 0; i < A - 1; i++) for (let j = 1; j < B - 1; j++) for (let l = 1; l < C - 1; l++) {
      const a = S(i, j, l); if (a !== S(i + 1, j, l)) quad(CI(i, j - 1, l - 1), CI(i, j, l - 1), CI(i, j, l), CI(i, j - 1, l), a);
    }
    for (let i = 1; i < A - 1; i++) for (let j = 0; j < B - 1; j++) for (let l = 1; l < C - 1; l++) {
      const a = S(i, j, l); if (a !== S(i, j + 1, l)) quad(CI(i - 1, j, l - 1), CI(i - 1, j, l), CI(i, j, l), CI(i, j, l - 1), a);
    }
    for (let i = 1; i < A - 1; i++) for (let j = 1; j < B - 1; j++) for (let l = 0; l < C - 1; l++) {
      const a = S(i, j, l); if (a !== S(i, j, l + 1)) quad(CI(i - 1, j - 1, l), CI(i, j - 1, l), CI(i, j, l), CI(i - 1, j, l), a);
    }
    // wygładzenie Taubina, jak powierzchnia mózgu: schodki pól znikają, a bryła nie kurczy się
    const nv2 = P.length / 3, sas = Array.from({ length: nv2 }, () => new Set());
    for (let t = 0; t < I.length; t += 3) for (let q = 0; q < 3; q++) { sas[I[t + q]].add(I[t + (q + 1) % 3]); sas[I[t + q]].add(I[t + (q + 2) % 3]); }
    let p = Float32Array.from(P);
    for (let it = 0; it < 12; it++) {
      const w = it % 2 ? -0.53 : 0.5, q = new Float32Array(p.length);
      for (let v = 0; v < nv2; v++) {
        let mx = 0, my = 0, mz = 0; const ns = sas[v];
        for (const u of ns) { mx += p[u * 3]; my += p[u * 3 + 1]; mz += p[u * 3 + 2]; }
        const k2 = ns.size || 1;
        q[v * 3] = p[v * 3] + w * (mx / k2 - p[v * 3]); q[v * 3 + 1] = p[v * 3 + 1] + w * (my / k2 - p[v * 3 + 1]); q[v * 3 + 2] = p[v * 3 + 2] + w * (mz / k2 - p[v * 3 + 2]);
      }
      p = q;
    }
    for (let v = 0; v < nv2; v++) { p[v * 3] = O.poczatek[0] + (c0 + p[v * 3]) * k; p[v * 3 + 1] = O.poczatek[1] + (by0 - 2 + p[v * 3 + 1]) * k; p[v * 3 + 2] = O.poczatek[2] + (bz0 - 2 + p[v * 3 + 2]) * k; }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    g.setIndex(nv2 > 65535 ? new THREE.Uint32BufferAttribute(I, 1) : new THREE.Uint16BufferAttribute(I, 1));
    g.computeVertexNormals();
    return g;
  }
  function przypnij(n) {
    if (piny.some((p) => p.n === n)) return;
    const g = bryla(n);
    if (!g) return;
    // barwa, której nie nosi żadna przypięta bryła; po wyczerpaniu ta, którą nosi najmniej brył (przegląd 2026-11-16: po odpięciu dwie bryły
    // dostawały tę samą barwę)
    const kolor = PIN_KOL.slice().sort((a, b) => piny.filter((p) => p.kolor === a).length - piny.filter((p) => p.kolor === b).length)[0];
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: kolor, roughness: 0.55, metalness: 0, emissive: kolor, emissiveIntensity: 0.12 }));
    const cien = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: kolor, transparent: true, opacity: 0.42, depthTest: false, depthWrite: false }));
    cien.renderOrder = 10; m.userData.n = n;
    scene.add(m, cien);
    piny.push({ n, kolor, m, cien, widac: true });
  }
  function odepnij(n) {
    const i = piny.findIndex((p) => p.n === n);
    if (i < 0) return;
    const p = piny[i];
    scene.remove(p.m, p.cien); p.m.geometry.dispose(); p.m.material.dispose(); p.cien.material.dispose();
    piny.splice(i, 1);
  }
  function przypiete() {
    if (!pinBox) return;
    const n = stan.obszar;
    let h = '';
    if (n && REG[n - 1] && !piny.some((p) => p.n === n)) h += '<button type="button" class="at-pin-nowy" data-n="' + n + '" data-podpis="przypnij w 3D">+ ' + esc(REG[n - 1][0]) + '</button>';
    for (const p of piny) {
      const nz = esc(REG[p.n - 1][0]);
      h += '<span class="at-pin"><button type="button" class="at-pin-pokaz" data-n="' + p.n + '" aria-pressed="' + p.widac + '" data-podpis="' + (p.widac ? 'schowaj' : 'pokaż') + '"><i style="background:' + p.kolor + '"></i>' + nz + '</button>'
        + '<button type="button" class="at-pin-x" data-n="' + p.n + '" aria-label="Odepnij: ' + nz + '" data-podpis="odepnij">×</button></span>';
    }
    pinBox.innerHTML = h;
    pinBox.hidden = !h;
  }
  if (pinBox) pinBox.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-n]');
    if (!b) return;
    const n = Number(b.dataset.n), p = piny.find((q) => q.n === n);
    if (b.classList.contains('at-pin-nowy')) przypnij(n);
    else if (b.classList.contains('at-pin-x')) odepnij(n);
    else if (p) { p.widac = !p.widac; p.m.visible = p.cien.visible = p.widac; }
    przypiete(); rysuj();
    const f = pinBox.querySelector('button[data-n="' + n + '"]');
    if (f && e.detail === 0) f.focus();
  });

  // zaznaczenie i tryb z Atlasu
  const zStanu = (d) => {
    if (!d) return;
    stan.tryb = d.tryb || stan.tryb;
    stan.lit = new Set(d.lit || []);
    stan.obszar = d.wybor && d.wybor.typ === 'obszar' ? d.wybor.n : 0;
    stan.plat = d.wybor && d.wybor.typ === 'plat' ? d.wybor.p : '';
    stan.parcela = d.wybor && d.wybor.typ === 'parcela' ? d.wybor.k : -1;
    if (stan.tryb === 'polaczenia') zPolaczeniami();
  };
  zStanu(siatka.__stan);
  siatka.addEventListener('atlas-wybor', (e) => {
    // inny widok albo zdjęte zaznaczenie chowa nazwę części, bo nazywała coś, czego już nie ma (przegląd 2026-11-11)
    const byl = stan.tryb;
    zStanu(e.detail);
    if (stan.tryb !== byl || !e.detail.wybor) zamknij();
    wszystko();
  });
  // gałka się rusza: płaszczyzny od razu, ściany raz na klatkę
  let licaCzeka = 0;
  siatka.addEventListener('atlas-pudlo', (e) => {
    P = e.detail; ustawPlaszczyzny(); rysuj();
    if (licaCzeka) return;
    licaCzeka = requestAnimationFrame(() => { licaCzeka = 0; lica(false); rysuj(); });
  });

  // wskazanie nazywa część pod wskaźnikiem w kroju znacznika przekrojów: w trybie Obszary strukturę Allena i jej płat, w trybie Sieci
  // sieć Yeo i sieci strony; klik zaznacza to samo, co klik w przekroju, a karta zaznaczenia wczytuje się pod mózgiem bez przewijania
  // (jego słowa, 2026-11-11: *clicking on the 3d brain should highlight the structure and open its card below in the background.
  // hovering over should display a name of the part*); dymek po kliknięciu zszedł
  const nazwa = el.querySelector('.at-3d-nazwa');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const zamknij = () => { if (nazwa) nazwa.hidden = true; };
  function opis(a, y, p) {
    // Połączenia: struktura pod wskaźnikiem albo struktura parceli, jej sieci i, przy zaznaczeniu, włókna do zaznaczonej parceli
    if (stan.tryb === 'polaczenia') {
      if (!p || !D) return '';
      const k = p - 1, sel = stan.parcela, st = a && RODZAJ[a] !== 'biala' && RODZAJ[a] !== 'komora' ? NAZWY[a] : nazwaParceli(k);
      return '<span><b>' + esc(st) + '</b></span>' + sieciParceli(k).map((c) => '<span class="wk-kod-dalej"><b style="color:' + KOL[c] + '">' + c + '</b> ' + esc(NAZWA[c] || '') + '</span>').join('')
        + (sel >= 0 && sel !== k && D.sasiad[sel].has(k) ? '<span class="wk-kod-dalej wk-kod-wlokna">włókna</span>' : '');
    }
    // jądro pod korą nazywa się w każdym widoku, bo w Sieciach i Płatach nie ma sieci ani płata (2026-11-16)
    const jadro = a && RODZAJ[a] === 'gleb' && A2R[a] && REG[A2R[a] - 1] ? A2R[a] : 0;
    if (jadro && stan.tryb !== 'obszary') return '<span><b>' + esc(REG[jadro - 1][0]) + '</b></span>';
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
    const h = t ? opis(t[0], t[1], t[2]) : '';
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
  const usuniete = (q) => q.x < P.x[0] || q.x > P.x[1] || q.y < P.y[0] || q.y > P.y[1] || q.z < P.z[0] || q.z > P.z[1];
  function trafienie(e) {
    const r = renderer.domElement.getBoundingClientRect();
    mysz.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(mysz, camera);
    // przypięta bryła bierze klik przed tkanką, bo jej cień leży na wierzchu: klik trafia w to, co oko widzi na górze (2026-11-16)
    const naPinie = ray.intersectObjects(piny.filter((p) => p.widac).map((p) => p.m), false);
    for (const h of naPinie.concat(ray.intersectObjects([kora, ...Object.values(lico).map((L) => L.m)], false))) {
      if (h.object.userData.n) {
        // bryła przypiętego obszaru: struktura pola, w którym leży punkt, albo najbliższego pola tej bryły
        const n = h.object.userData.n, xi = Math.round((-Math.abs(h.point.x) - O.poczatek[0]) / k), yi = Math.round((h.point.y - O.poczatek[1]) / k), zi = Math.round((h.point.z - O.poczatek[2]) / k);
        let a = 0;
        for (let r = 0; r <= 2 && !a; r++) for (let dy = -r; dy <= r && !a; dy++) for (let dz = -r; dz <= r && !a; dz++) for (let dx = -r; dx <= r && !a; dx++) {
          const x = xi + dx, y = yi + dy, z = zi + dz;
          if (x < 0 || y < 0 || z < 0 || x >= NX || y >= NY || z >= NZ) continue;
          const v = vol[2 * NX * NY * NZ + (y * NZ + z) * NX + x];
          if (v && (v === n || wyzej(v, n))) a = v;
        }
        return [a || n, 0, 0];
      }
      if (h.object === kora) {
        if (usuniete(h.point)) continue;
        const f = h.face;
        let best = f.a, bd = Infinity;
        for (const i of [f.a, f.b, f.c]) { const d = (pos[i * 3] - h.point.x) ** 2 + (pos[i * 3 + 1] - h.point.y) ** 2 + (pos[i * 3 + 2] - h.point.z) ** 2; if (d < bd) { bd = d; best = i; } }
        return [allen[best], yeo[best], vpar && vpar[best] >= 0 ? vpar[best] + 1 : 0];
      }
      const pl = plastry[h.object.userData.id];
      if (!pl || !h.uv) continue;
      const c = Math.min(pl.T.W - 1, Math.floor(h.uv.x * pl.T.W)), rr = Math.min(pl.T.H - 1, Math.floor((1 - h.uv.y) * pl.T.H)), i = rr * pl.T.W + c;
      // poza tkanką ściana jest przezroczysta, ale komora ją zamyka: wskazanie w komorze nie sięga ściany komory za nią
      if (pl.T.v[i] <= 127) { if (RODZAJ[pl.A.v[i]] === 'komora' || (pl.K && pl.K[i])) return null; continue; }
      const czyKora = pl.B.v[i] < 128 && RODZAJ[pl.A.v[i]] === 'kora';
      return [pl.A.v[i], czyKora ? pl.Y.v[i] : 0, pl.PAR ? pl.PAR[i] : 0];
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
      const jadro = t[0] && RODZAJ[t[0]] === 'gleb' && A2R[t[0]] ? A2R[t[0]] : 0;
      if (stan.tryb === 'polaczenia') { if (t[2]) w = { typ: 'parcela', k: t[2] - 1 }; }
      else if (jadro && stan.tryb !== 'obszary') w = { typ: 'obszar', n: jadro };
      else if (stan.tryb === 'platy') { const p = platPola(t[0]); if (p) w = { typ: 'plat', p }; }
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
    ruch = requestAnimationFrame(() => { ruch = 0; const t = trafienie(ostatni); nazwij(t, ostatni.clientX, ostatni.clientY); if (stan.tryb === 'polaczenia') naHotPar(t && t[2] ? t[2] - 1 : -1); else naHot(t ? A2R[t[0]] || 0 : 0); });
  });
  // wskazana struktura jaśnieje w 3D jak w przekrojach (przegląd 2026-11-11), kolory liczą się na nowo tylko przy zmianie
  function naHot(r) { if (stan.tryb === 'sieci' || stan.tryb === 'polaczenia') r = 0; if (r === stan.hot) return; stan.hot = r; koloruj(); rysuj(); }
  // w Połączeniach bez zaznaczenia parcela pod wskaźnikiem jaśnieje; przy zaznaczeniu barwy stoją, a wskazanie tylko nazywa
  function naHotPar(k) { if (k === stan.hotPar) return; stan.hotPar = k; if (stan.parcela < 0) { koloruj(); rysuj(); } }
  renderer.domElement.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') { zamknij(); naHot(0); naHotPar(-1); } });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') zamknij(); });
  controls.addEventListener('start', zamknij);
  controls.addEventListener('change', rysuj);

  // suwaki cięć wokół mózgu w widoku startowym (jego słowa, 2026-11-16: *make the suwaki above, below, and to the right of the brain in
  // 3d. keep the 2d brains where they are. Mind to show it well on mobile*): nad mózgiem lewa i prawa, lewa po lewej (jego słowa,
  // 2026-11-17), pod nim przód i tył, z prawej pionowo góra i dół. Końce toru to końce ramki objętości na ekranie; tor za krótki do
  // chwycenia rośnie wokół swojego środka, a brak miejsca na nazwę końca skraca go od tej strony
  const osie = () => {
    const rb = scena.getBoundingClientRect();
    const cx = el.querySelector('.at-cie-x'), cy = el.querySelector('.at-cie-y'), cz = el.querySelector('.at-cie-z');
    if (!rb.width || !cx || !cy || !cz) return;
    const W = rb.width, H = rb.height, ox = scena.offsetLeft, oy = scena.offsetTop;
    const kam = camera.clone();
    kam.position.copy(controls.position0); kam.lookAt(controls.target0); kam.updateMatrixWorld(); kam.updateProjectionMatrix();
    const q = new THREE.Vector3();
    const ekr = (x, y, z) => { q.set(x, y, z).project(kam); return [(q.x + 1) / 2 * W, (1 - q.y) / 2 * H]; };
    let L = 1e9, P = -1e9, G = 1e9, D = -1e9;
    for (let i = 0; i < nv; i += 5) {
      const [sx, sy] = ekr(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      if (sx < L) L = sx; if (sx > P) P = sx; if (sy < G) G = sy; if (sy > D) D = sy;
    }
    const R = (c) => [Number(c.dataset.lo), Number(c.dataset.hi)];
    const [yl, yh] = R(cy), [zl, zh] = R(cz), ys = (yl + yh) / 2, zs = (zl + zh) / 2;
    // z prawej granicą jest kolumna przekrojów, gdy stoi na scenie, inaczej brzeg ramki
    const gl = el.closest('.at-glowny'), kol = gl && gl.querySelector('.at-kol');
    const kr = kol && getComputedStyle(kol).position === 'absolute' ? kol.getBoundingClientRect() : null;
    const prawo = (kr && kr.width ? kr.left - rb.left : W) - 8, lewo = 6;
    // na telefonie nazwy końców stoją nad górnym torem i pod dolnym, więc mózg dostaje całą szerokość ramki
    const wys = cx.offsetHeight || 28, nad = matchMedia('(max-width:720px)').matches ? 13 : 0;
    const yD = Math.min(D + 8, H - wys - 6 - nad), yG = Math.max(6 + nad, G - 8 - wys);
    // tor lewa–prawa tak długi jak tor przód–tył (jego słowa, 2026-11-19: *we want to expand the left-right suwak to the length of the
    // przod-tyl one*): oba tory biorą jeden przedział, końce mózgu na osi przód–tył, przycięty nazwami końców obu torów
    const zaY = cy.querySelector('.at-za').offsetWidth + 14, zaX = cx.querySelector('.at-za').offsetWidth + 14;
    const naY = nad ? 10 : cy.querySelector('.at-koniec-a').offsetWidth + 14, naX = nad ? 10 : cx.querySelector('.at-koniec-a').offsetWidth + 14;
    let t0 = Math.min(ekr(0, yh, zs)[0], ekr(0, yl, zs)[0]), t1 = Math.max(ekr(0, yh, zs)[0], ekr(0, yl, zs)[0]);
    if (t1 - t0 < 160) { const sr = (t0 + t1) / 2; t0 = sr - 80; t1 = sr + 80; }
    t0 = Math.max(lewo + Math.max(naY, naX), t0); t1 = Math.min(prawo - Math.max(zaY, zaX), t1);
    for (const [c, y] of [[cy, yD], [cx, yG]]) { c.style.left = ox + t0 + 'px'; c.style.width = Math.max(48, t1 - t0) + 'px'; c.style.top = oy + y + 'px'; }
    // pionowy stoi tuż za tyłem mózgu; z nazwą dołu i wyłącznikiem pod nią kończy się nad dolnym suwakiem
    const za = cz.querySelector('.at-za').offsetHeight - 12, szer = 34 + cz.querySelector('.at-koniec-a').offsetWidth;
    const gora = Math.max(yG + wys + 18, ekr(0, ys, zh)[1]), dol = Math.min(ekr(0, ys, zl)[1], yD - 10 - za);
    cz.style.left = ox + Math.min(prawo - Math.max(szer, za ? 64 : 0), P + 16) + 'px';
    cz.style.top = oy + gora + 'px'; cz.style.height = Math.max(60, dol - gora) + 'px';
    el.classList.add('at-3d-osie');
  };
  const odswiez = () => { wymiar(); osie(); };
  new ResizeObserver(odswiez).observe(scena);
  if (el.closest('.at-glowny') && el.closest('.at-glowny').querySelector('.at-kol')) new ResizeObserver(odswiez).observe(el.closest('.at-glowny').querySelector('.at-kol'));
  if (document.fonts) document.fonts.ready.then(osie);
  wymiar(); osie();
  wszystko();
  el.classList.add('at-3d-gotowy');
}
