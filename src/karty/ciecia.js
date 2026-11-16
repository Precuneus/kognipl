// Cięcia Atlasu z obu stron (jego słowa, 2026-11-16: *Can we rethink the suwaki.. to make maybe 3 brains right to the 3d brain. And each
// brain... has a suwak to cut in either direction. So I can slice from top and from bottom on one suwak; from left and from right on the
// second, and from front and from back on the third*). Każda oś ma tor z dwiema gałkami; mózg zostaje między nimi, a to, co za gałką,
// mózg w 3D zdejmuje całym plastrem (`mozg3d.js`, zdarzenie `atlas-pudlo`). Suwaki stoją wokół mózgu w 3D (`mozg3d.js` je tam kładzie).
// Na przekroju, w którego płaszczyźnie leży oś, dwie złote linie pokazują cięcia, a odcięta część ciemnieje. Przekrój prostopadły do osi (czołowy dla przodu i tyłu,
// poziomy dla góry i dołu, strzałkowy dla lewej i prawej) pokazuje ścianę gałki przesuniętej ostatnio, przez ukryte pole, które czyta
// `ziarno.js`. Działa też bez WebGL: wtedy tną się same przekroje.
// t to położenie gałki liczone od pierwszego końca toru (góra, lewa, przód) do drugiego; gałka 0 stoi zawsze przed gałką 1.
export function ciecia(siatka) {
  const glowny = siatka && siatka.querySelector('.at-glowny');
  if (!glowny) return;
  const O = JSON.parse(siatka.dataset.objetosc);
  const [NX, NY, NZ] = O.wymiar, k = O.krok, [X0, Y0, Z0] = O.poczatek;
  const x0 = X0 - k / 2, yTop = Y0 + (NY - 0.5) * k, zTop = Z0 + (NZ - 0.5) * k;
  const NS = 'http://www.w3.org/2000/svg';
  const ODSTEP = 3; // mm, które gałki zostawiają między sobą
  // gałka na końcu toru stoi w całości na torze, więc nie zasłania nazwy końca: tor ma 10 px zapasu z każdej strony
  const ZAPAS = 10;
  const naTorze = (t) => 'calc(' + ZAPAS + 'px + ' + (t * 100).toFixed(3) + '% - ' + (t * 2 * ZAPAS).toFixed(2) + 'px)';
  const OS = {};
  glowny.querySelectorAll('.at-cie').forEach((el) => {
    const os = el.dataset.os, lo = Number(el.dataset.lo), hi = Number(el.dataset.hi);
    // pierwszy koniec toru: góra i przód to większe współrzędne, lewa mniejsza
    const a = os === 'x' ? lo : hi, b = os === 'x' ? hi : lo;
    const fig = glowny.querySelector('.at-blok-' + os + ' .wk-zywy svg');
    const o = { el, os, lo, hi, a, b, t: [0, 1], gal: [...el.querySelectorAll('.at-gal')], tor: el.querySelector('.at-tor'), pas: el.querySelector('.at-zostaje'),
      plaster: el.dataset.plaster, spocz: Number(el.dataset.domysl), fig, linie: null, g: ODSTEP / (hi - lo), wymiar: el.dataset.wymiar,
      strona: { z: ['od góry', 'od dołu'], x: ['od lewej', 'od prawej'], y: ['od przodu', 'od tyłu'] }[os] };
    if (fig) {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'at-cie-linie');
      g.innerHTML = '<rect class="at-cie-cien"/><rect class="at-cie-cien"/><line class="at-cie-linia"/><line class="at-cie-linia"/>';
      fig.appendChild(g);
      o.linie = g;
    }
    OS[os] = o;
  });
  const mm = (o, t) => o.a + t * (o.b - o.a);
  const doT = (o, v) => (v - o.a) / (o.b - o.a);
  const pudlo = () => {
    const p = {};
    for (const os in OS) { const o = OS[os], u = mm(o, o.t[0]), w = mm(o, o.t[1]); p[os] = [Math.min(u, w), Math.max(u, w)]; }
    // bez cięcia na końcu toru: mózg w 3D nie stawia tam ściany
    p.tnie = {};
    for (const os in OS) p.tnie[os] = [OS[os].t[0] > 0.0005, OS[os].t[1] < 0.9995];
    return p;
  };
  // na przekroju, w którego płaszczyźnie leży oś: odcięte części w cieniu, cięcia złotymi liniami; współrzędne w milimetrach ramki przekroju
  function linie(o) {
    if (!o.linie) return;
    const vb = o.fig.viewBox.baseVal, W = vb.width, H = vb.height;
    const [c0, c1, l0, l1] = o.linie.children;
    // miejsce na przekroju: z w dół od góry ramki, x od lewej, y od przodu; każda gałka zaciemnia odcinek od swojego końca toru do siebie
    const m = o.os === 'z' ? (v) => Math.max(0, Math.min(H, zTop - v)) : (v) => Math.max(0, Math.min(W, o.os === 'x' ? v - x0 : yTop - v));
    const E = [m(o.a), m(o.b)], P = [m(mm(o, o.t[0])), m(mm(o, o.t[1]))], tnie = [o.t[0] > 0.0005, o.t[1] < 0.9995];
    [c0, c1].forEach((c, i) => { const u = Math.min(E[i], P[i]), d = Math.abs(E[i] - P[i]); if (o.os === 'z') ust(c, 0, u, W, d); else ust(c, u, 0, d, H); });
    [l0, l1].forEach((l, i) => { if (o.os === 'z') lin(l, 0, P[i], W, P[i], tnie[i]); else lin(l, P[i], 0, P[i], H, tnie[i]); });
  }
  const ust = (r, x, y, w, h) => { r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', Math.max(0, w)); r.setAttribute('height', Math.max(0, h)); };
  const lin = (l, xa, ya, xb, yb, widac) => { l.setAttribute('x1', xa); l.setAttribute('y1', ya); l.setAttribute('x2', xb); l.setAttribute('y2', yb); l.style.display = widac ? '' : 'none'; };
  function rysuj(o) {
    const pion = o.os === 'z', bok = pion ? 'top' : 'left';
    o.gal.forEach((g, i) => {
      g.style[bok] = naTorze(o.t[i]);
      const ciete = i ? 1 - o.t[1] : o.t[0], proc = Math.round(ciete * 100);
      // wartość to położenie gałki na torze, rosnące w prawo i w górę, jak w każdym suwaku; słowa mówią, ile wysokości, szerokości albo
      // długości ramki odcina (audyt 2026-11-16: *N% mózgu* obiecywało część mózgu, a liczba mierzy tor)
      g.setAttribute('aria-valuemin', '0'); g.setAttribute('aria-valuemax', '100'); g.setAttribute('aria-valuenow', String(Math.round((pion ? 1 - o.t[i] : o.t[i]) * 100)));
      g.setAttribute('aria-valuetext', proc ? 'odcięto ' + proc + '% ' + o.wymiar + ' ' + o.strona[i] : 'bez cięcia');
    });
    o.pas.style[bok] = naTorze(o.t[0]);
    o.pas.style[pion ? 'height' : 'width'] = 'calc(' + ((o.t[1] - o.t[0]) * 100).toFixed(3) + '% - ' + ((o.t[1] - o.t[0]) * 2 * ZAPAS).toFixed(2) + 'px)';
    linie(o);
  }
  // gałka przesunięta ostatnio wyznacza przekrój prostopadły do swojej osi; gałka na końcu toru niczego nie tnie, więc przekrój bierze
  // drugą gałkę, a gdy i ta stoi na końcu, miejsce spoczynku przekroju: startowe, a po wyborze obszaru jego punkt (przegląd 2026-11-16:
  // gałka cofnięta na koniec toru wyrzucała wybrany obszar z przekroju)
  function plaster(o, i) {
    const s = glowny.querySelector('.at-suwak[data-p="' + o.plaster + '"]');
    if (!s) return;
    const naKoncu = (j) => (j ? o.t[1] > 0.9995 : o.t[0] < 0.0005);
    const v = !naKoncu(i) ? mm(o, o.t[i]) : !naKoncu(1 - i) ? mm(o, o.t[1 - i]) : o.spocz;
    s.value = String(v);
    s.dispatchEvent(new Event('input'));
  }
  const oglos = () => { siatka.__pudlo = pudlo(); siatka.dispatchEvent(new CustomEvent('atlas-pudlo', { detail: siatka.__pudlo })); };
  function ustaw(o, i, t, przekroj = true) {
    t = i ? Math.max(o.t[0] + o.g, Math.min(1, t)) : Math.max(0, Math.min(o.t[1] - o.g, t));
    if (Math.abs(t - o.t[i]) < 1e-6) return;
    o.t[i] = t;
    rysuj(o);
    if (przekroj) plaster(o, i);
    oglos();
  }
  for (const os in OS) {
    const o = OS[os], pion = os === 'z';
    rysuj(o);
    // palec i mysz biorą tor w każdym miejscu; rusza się gałka bliższa wskazanemu miejscu (jego słowa, 2026-11-13: *changing the cut is
    // difficult*)
    const tPod = (e) => { const r = o.tor.getBoundingClientRect(); return pion ? (e.clientY - r.top - ZAPAS) / (r.height - 2 * ZAPAS) : (e.clientX - r.left - ZAPAS) / (r.width - 2 * ZAPAS); };
    // gałki zsunięte na jedno miejsce: którą wziąć, mówi pierwszy ruch, w stronę pierwszego końca dolna, w stronę drugiego górna
    // (przegląd 2026-11-16: przy obu gałkach na końcu toru chwyt za środek widocznej gałki niczego nie ruszał)
    let ciagnie = -1, start = 0;
    const PIKSEL = () => 1 / ((pion ? o.tor.clientHeight : o.tor.clientWidth) - 2 * ZAPAS);
    o.tor.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const t = tPod(e);
      o.tor.setPointerCapture(e.pointerId);
      e.preventDefault();
      if ((o.t[1] - o.t[0]) / PIKSEL() < 18 && Math.abs(t - (o.t[0] + o.t[1]) / 2) / PIKSEL() < 14) { ciagnie = 2; start = t; return; }
      ciagnie = t <= o.t[0] ? 0 : t >= o.t[1] ? 1 : (t - o.t[0] < o.t[1] - t ? 0 : 1);
      o.gal[ciagnie].focus({ preventScroll: true });
      ustaw(o, ciagnie, t);
    });
    o.tor.addEventListener('pointermove', (e) => {
      if (ciagnie < 0) return;
      const t = tPod(e);
      if (ciagnie === 2) {
        if (Math.abs(t - start) / PIKSEL() < 3) return;
        ciagnie = t < start ? 0 : 1;
        o.gal[ciagnie].focus({ preventScroll: true });
      }
      ustaw(o, ciagnie, t);
    });
    const pusc = () => { ciagnie = -1; };
    o.tor.addEventListener('pointerup', pusc);
    o.tor.addEventListener('pointercancel', pusc);
    // klawiatura: strzałki o 1,5 mm, z Shiftem o 15 mm, Home i End do granic gałki
    o.gal.forEach((g, i) => g.addEventListener('keydown', (e) => {
      const krok = (e.shiftKey ? 15 : 1.5) / (o.hi - o.lo);
      // strzałka w prawo i w górę, PageUp i End podnoszą wartość, jak w każdym suwaku; na pionowym torze t rośnie w dół
      const w = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key];
      let t = null;
      if (w) t = o.t[i] + (pion ? -w : w) * krok;
      else if (e.key === 'Home') t = pion ? 1 : 0;
      else if (e.key === 'End') t = pion ? 0 : 1;
      if (t === null) return;
      e.preventDefault();
      ustaw(o, i, t);
    }));
  }
  // obszar wybrany z listy, z adresu albo z linku: przekroje już przechodzą przez jego punkt (`ziarno.js`), a mózg w 3D, oglądany od
  // lewej, zdejmuje lewy plaster aż do niego, więc obszar leży na ścianie, którą widać
  siatka.addEventListener('atlas-punkt', (e) => {
    const o = OS.x;
    if (!o || !e.detail) return;
    // cięcia z góry, z dołu, z przodu i z tyłu wracają na końce, bo mogłyby zdjąć obszar; przekroje spoczywają w jego punkcie
    o.spocz = e.detail.x;
    if (OS.z) OS.z.spocz = e.detail.z;
    if (OS.y) OS.y.spocz = e.detail.y;
    // lewa półkula stoi bliżej, więc cięcie od lewej (gałka 0, pierwszy koniec toru) odsłania ścianę, którą widać
    o.t[1] = 1;
    ustaw(o, 0, doT(o, e.detail.x), false);
    rysuj(o);
    if (OS.z) { OS.z.t = [0, 1]; rysuj(OS.z); }
    if (OS.y) { OS.y.t = [0, 1]; rysuj(OS.y); }
    oglos();
  });
  // widok startowy (↻, dwuklik) to cały mózg: cięcia wracają na końce torów, a przekroje na miejsca startowe
  siatka.addEventListener('atlas-start', () => {
    for (const os in OS) {
      const o = OS[os];
      o.t = [0, 1]; o.spocz = Number(o.el.dataset.domysl); rysuj(o);
      const s = glowny.querySelector('.at-suwak[data-p="' + o.plaster + '"]');
      if (s) { s.value = String(o.spocz); s.dispatchEvent(new Event('input')); }
    }
    oglos();
  });
  // przekrój przerysowany na nowo w innej wielkości: linie liczą się w jego ramce, więc wystarczy je postawić jeszcze raz
  for (const os in OS) linie(OS[os]);
  // skala przekrojów: na komputerze kolumna mieści trzy przekroje w wysokości sceny, na węższym ekranie dwa stoją obok siebie
  // w szerokości strony; jedna skala dla trzech, w pikselach na milimetr
  // na komputerze narzut kolumny (podpisy pod przekrojami) mierzy się z niej samej, więc kolumna nie wychodzi poza scenę (audyt
  // 2026-11-16: przy 1100 × 850 wychodziła o 22 px)
  const OBRAZY = (NZ + NY + NZ) * k;
  const skaluj = () => {
    const szer = glowny.clientWidth, wys = glowny.clientHeight, kol = glowny.querySelector('.at-kol'), cs = kol && getComputedStyle(kol);
    // odstępy między blokami należą do narzutu kolumny
    const luki = cs ? 2 * (parseFloat(cs.rowGap) || 0) + (parseFloat(cs.paddingTop) || 0) : 0;
    const komputer = matchMedia('(min-width:1000px)').matches && !glowny.querySelector('.at-3d-brak');
    let s = (szer - 26 - 2) / (2 * (2 * NX - 1) * k);
    if (komputer) {
      s = (wys - 170) / OBRAZY;
      for (let n = 0; n < 2; n++) {
        glowny.style.setProperty('--s', Math.max(0.5, Math.min(1.6, s)).toFixed(3));
        const bloki = [...glowny.querySelectorAll('.at-blok')].reduce((a, b) => a + b.offsetHeight, 0);
        const teraz = Number(glowny.style.getPropertyValue('--s'));
        s = (wys - 12 - luki - (bloki - OBRAZY * teraz)) / OBRAZY;
      }
    }
    // skala zaokrąglona w dół: zaokrąglona w górę o ułamek piksela przerzucała przekrój poziomy do następnego wiersza (przegląd 2026-11-16)
    glowny.style.setProperty('--s', (Math.floor(Math.max(0.5, Math.min(1.6, s)) * 1000) / 1000).toFixed(3));
  };
  skaluj();
  new ResizeObserver(skaluj).observe(glowny);
  oglos();
}
