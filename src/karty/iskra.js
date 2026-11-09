// Iskra na karcie (jego wybór A, 2026-11-09): kropka nad ı w logo budzi się, mruga, wylatuje łukiem i oświetla akapit kursu snopem,
// który zostaje ciepłą plamą światła; mruga co jakiś czas. Na górze strony wraca do logo (jego słowo o stronie startowej: *when
// the page is at the top, Iskra should be in the logo*). Bez ruchu (przełącznik albo ustawienie systemu) siedzi od razu przy akapicie,
// a plama świeci od początku.
export function iskraKursu() {
  const cicho = document.documentElement.classList.contains('roj-cicho');
  // przełącznik działa także na kartach bez akapitu kursu, gdzie rusza się tylko ziarno mózgu
  const btn = document.querySelector('.wk-anim');
  if (btn) {
    btn.setAttribute('aria-checked', String(!cicho));
    btn.addEventListener('click', () => {
      try { localStorage.setItem('kogni-animacje', cicho ? 'on' : 'off'); } catch (e) {}
      location.reload();
    });
  }
  const kurs = document.querySelector('.wk-kurs');
  if (!kurs) return;
  const knot = document.querySelector('.rocznik-knot');

  const is = document.createElement('span');
  is.className = 'wk-iskra';
  is.setAttribute('aria-hidden', 'true');
  document.body.appendChild(is);
  const size = () => (knot ? Math.max(6, knot.getBoundingClientRect().width) : 7);
  const S = size();
  is.style.width = is.style.height = S + 'px';

  const docXY = (el, fx, fy) => { const r = el.getBoundingClientRect(); return [r.left + scrollX + r.width * fx, r.top + scrollY + r.height * fy]; };
  const home = () => (knot ? docXY(knot, 0.5, 0.5) : [scrollX + 24, 24]);
  // przy lewym górnym rogu akapitu, tuż poza plamą, jak snop padający z góry
  const perch = () => { const r = kurs.getBoundingClientRect(); return [r.left + scrollX + 2, r.top + scrollY - S * 0.9]; };
  let pos = home();
  const place = (p) => { pos = p; is.style.left = (p[0] - S / 2) + 'px'; is.style.top = (p[1] - S / 2) + 'px'; };

  let blinkT = 0;
  const blink = () => { is.classList.add('mruga'); setTimeout(() => is.classList.remove('mruga'), 150); };
  const blinks = () => {
    clearTimeout(blinkT);
    const next = () => { blinkT = setTimeout(() => { if (where === 'kurs' && !flying) blink(); next(); }, 3200 + Math.random() * 4200); };
    next();
  };

  let where = 'home';
  if (cicho) {
    // bez ruchu Iskra jest w jednym miejscu naraz, jak z ruchem: przy akapicie, kiedy go widać, w logo na górze strony; zmiana
    // miejsca jest natychmiastowa, a plama świeci cały czas (audyt 2026-11-09: dwie kropki naraz)
    kurs.classList.add('lit');
    const at = (w) => {
      where = w;
      if (w === 'kurs') { place(perch()); is.classList.add('widac'); if (knot) knot.style.visibility = 'hidden'; }
      else { is.classList.remove('widac'); if (knot) knot.style.visibility = ''; }
    };
    const still = () => {
      const r = kurs.getBoundingClientRect();
      const inView = r.top < innerHeight * 0.75 && r.bottom > innerHeight * 0.25;
      if (inView && where !== 'kurs') at('kurs');
      else if (!inView && scrollY < 60 && where === 'kurs') at('home');
    };
    addEventListener('scroll', still, { passive: true });
    addEventListener('resize', () => { if (where === 'kurs') place(perch()); });
    still();
    return;
  }

  place(home());
  let flying = 0;
  const fly = (to, done) => {
    cancelAnimationFrame(flying);
    const from = pos.slice();
    const dx = to[0] - from[0], dy = to[1] - from[1], d = Math.hypot(dx, dy);
    const T = Math.min(1600, Math.max(700, d * 0.55));
    const lift = Math.min(140, d * 0.18);
    const t0 = performance.now();
    const step = (t) => {
      let k = Math.min(1, (t - t0) / T);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      place([from[0] + dx * e, from[1] + dy * e - Math.sin(Math.PI * e) * lift]);
      if (k < 1) flying = requestAnimationFrame(step);
      else { flying = 0; done && done(); }
    };
    flying = requestAnimationFrame(step);
  };

  const leave = () => {
    where = 'lot';
    if (knot) knot.style.visibility = 'hidden';
    is.classList.add('widac');
    blink();
    setTimeout(() => blink(), 320);
    setTimeout(() => fly(perch(), () => { where = 'kurs'; kurs.classList.add('lit'); blinks(); }), 650);
  };
  const back = () => {
    where = 'lot';
    kurs.classList.remove('lit');
    fly(home(), () => { where = 'home'; is.classList.remove('widac'); if (knot) knot.style.visibility = ''; });
  };

  let tick = 0;
  const check = () => {
    tick = 0;
    const r = kurs.getBoundingClientRect();
    const inView = r.top < innerHeight * 0.75 && r.bottom > innerHeight * 0.25;
    if (inView && where === 'home') leave();
    else if (!inView && scrollY < 60 && where === 'kurs') back();
  };
  addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(check); }, { passive: true });
  addEventListener('resize', () => { if (where === 'kurs') place(perch()); else if (where === 'home') place(home()); });
  check();
}
