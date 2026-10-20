import { DCLogic } from '../engine.js';

export const template = "<div style=\"max-width: 1360px; margin: 0 auto; padding: 40px 40px 72px\">\n    <div style=\"min-width: 0\">\n      <div style=\"overflow-x: auto; padding-bottom: 8px\">\n        <div style=\"{{gridStyle}}\">\n          <div class=\"pl-side\" style=\"{{sideStyle}}\">\n            <sc-for list=\"{{bands}}\" as=\"b\" hint-placeholder-count=\"5\">\n            <div style=\"{{b.nameStyle}}\">{{b.label}}</div>\n            <span aria-hidden=\"true\" style=\"{{b.railStyle}}\"></span>\n          </sc-for>\n            <sc-for list=\"{{rows}}\" as=\"r\" hint-placeholder-count=\"19\">\n              <span aria-hidden=\"true\" style=\"{{r.sideWarpStyle}}\"></span>\n              <div style=\"{{r.style}}\">\n              <button type=\"button\" class=\"osn-name\" aria-expanded=\"{{r.on}}\" onClick=\"{{r.toggle}}\" style=\"{{r.labelStyle}}\"><span style=\"{{r.nameBg}}\">{{r.name}}</span></button>\n            </div>\n              <sc-if value=\"{{r.on}}\" hint-placeholder-val=\"{{false}}\">\n                <span aria-hidden=\"true\" style=\"{{r.sideBandStyle}}\"></span>\n                <div data-band=\"{{r.idx}}\" style=\"{{r.descStyle}}\">\n                <p style=\"margin: 0; font-size: 13.5px; line-height: 1.55; color: #a09888\">{{r.def}}</p>\n                <div style=\"display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px\">\n                  <sc-for list=\"{{r.r2}}\" as=\"t\" hint-placeholder-count=\"3\">\n                    <span style=\"{{t.style}}\">{{t.name}}</span>\n                  </sc-for>\n                </div>\n              </div>\n              </sc-if>\n            </sc-for>\n          </div>\n          <sc-for list=\"{{cols}}\" as=\"c\" hint-placeholder-count=\"5\">\n            <div style=\"{{c.headStyle}}\">\n              <div style=\"{{c.courseStyle}}\">{{c.course}}</div>\n              <div style=\"{{c.dateStyle}}\">{{c.short}}</div>\n            </div>\n            <sc-if value=\"{{c.future}}\" hint-placeholder-val=\"{{false}}\">\n              <div style=\"{{c.boxStyle}}\"></div>\n            </sc-if>\n          </sc-for>\n          <sc-for list=\"{{rows}}\" as=\"r\" hint-placeholder-count=\"19\">\n            <span aria-hidden=\"true\" style=\"{{r.warpStyle}}\"></span>\n            <sc-if value=\"{{r.on}}\" hint-placeholder-val=\"{{false}}\">\n              <span aria-hidden=\"true\" style=\"{{r.bandStyle}}\"></span>\n              <div data-band=\"{{r.idx}}\" style=\"{{r.cardsStyle}}\">\n                <sc-for list=\"{{r.cards}}\" as=\"k\" hint-placeholder-count=\"2\">\n                  <article style=\"{{k.style}}\">\n                    <p style=\"{{k.kickStyle}}\">{{k.kicker}}</p>\n                    <h3 style=\"margin: 4px 0 0; font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 21px; line-height: 1.15; color: #e2ddd4\">{{k.h}}</h3>\n                    <p style=\"margin: 7px 0 0; font-size: 13.5px; line-height: 1.55; color: #e2ddd4\">{{k.d}}</p>\n                    <div style=\"display: flex; justify-content: flex-end; margin-top: 6px\">\n                      <a class=\"enter\" href=\"{{k.url}}\" aria-label=\"Cała karta\" title=\"Cała karta\" style=\"display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(232,168,76,0.45); color: #e8a84c; text-decoration: none\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 22 22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"4\" r=\"2\" fill=\"currentColor\" stroke=\"none\"></circle><path d=\"M6 7 V12 Q6 16 10 16 H18\"></path><path d=\"M14.5 12.5 L18 16 L14.5 19.5\"></path></svg></a>\n                    </div>\n                  </article>\n                </sc-for>\n              </div>\n            </sc-if>\n          </sc-for>\n          <sc-for list=\"{{halos}}\" as=\"hl\" hint-placeholder-count=\"20\">\n            <span aria-hidden=\"true\" style=\"{{hl.style}}\"></span>\n          </sc-for>\n          <sc-for list=\"{{threads}}\" as=\"t\" hint-placeholder-count=\"2\">\n            <span aria-hidden=\"true\" style=\"{{t.style}}\"></span>\n          </sc-for>\n          <sc-for list=\"{{unders}}\" as=\"u\" hint-placeholder-count=\"16\">\n            <span aria-hidden=\"true\" style=\"{{u.shadowStyle}}\"></span>\n            <span aria-hidden=\"true\" style=\"{{u.patchStyle}}\"></span>\n          </sc-for>\n          <sc-if value=\"{{pop.open}}\" hint-placeholder-val=\"{{true}}\">\n            <button type=\"button\" aria-label=\"Zamknij\" onClick=\"{{pop.close}}\" style=\"position: fixed; inset: 0; z-index: 5; margin: 0; padding: 0; border: 0; background: transparent; cursor: default\"></button>\n          </sc-if>\n          <sc-for list=\"{{knots}}\" as=\"k\" hint-placeholder-count=\"20\">\n            <button type=\"button\" class=\"knot\" aria-label=\"{{k.label}}\" aria-expanded=\"{{k.pressed}}\" onClick=\"{{k.pick}}\" style=\"{{k.style}}\"><span style=\"{{k.dot}}\"></span></button>\n          </sc-for>\n          <sc-if value=\"{{pop.open}}\" hint-placeholder-val=\"{{true}}\">\n            <span aria-hidden=\"true\" style=\"{{pop.b1}}\"></span>\n            <span aria-hidden=\"true\" style=\"{{pop.b2}}\"></span>\n            <div role=\"dialog\" aria-label=\"{{pop.title}}\" style=\"{{pop.style}}\">\n              <h2 style=\"margin: 0; font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 25px; line-height: 1.15; color: #e2ddd4\">{{pop.title}}</h2>\n              <p style=\"margin: 10px 0 0; font-size: 14.5px; line-height: 1.6; color: #e2ddd4\">{{pop.desc}}</p>\n              <div style=\"display: flex; justify-content: flex-end; margin-top: 6px\">\n                <a class=\"enter\" href=\"{{pop.url}}\" aria-label=\"Cała karta\" title=\"Cała karta\" style=\"display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(232,168,76,0.45); color: #e8a84c; text-decoration: none\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 22 22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"4\" r=\"2\" fill=\"currentColor\" stroke=\"none\"></circle><path d=\"M6 7 V12 Q6 16 10 16 H18\"></path><path d=\"M14.5 12.5 L18 16 L14.5 19.5\"></path></svg></a>\n              </div>\n            </div>\n          </sc-if>\n        </div>\n      </div>\n    </div>\n  </div>";

export class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { f: "all", sel: null, on: props.on || [] };
    this.hb = {};
    if (typeof document !== "undefined" && document.fonts) document.fonts.ready.then(() => { if (this._redraw) this._redraw(); });
  }
  D() {
    return this.props.data;
  }
  afterDraw() {
    if (!this.el) return;
    const hb = {};
    this.el.querySelectorAll("[data-band]").forEach((b) => { const i = b.getAttribute("data-band"); hb[i] = Math.max(hb[i] || 0, Math.ceil(b.offsetHeight) + 22); });
    let moved = false;
    for (const i in hb) if (this.hb[i] !== hb[i]) { this.hb[i] = hb[i]; moved = true; }
    if (moved) this._redraw();
  }
  renderVals() {
    const { OS, OP, BAND, GN, LV, CL, SP, CN } = this.D();
    const on = new Set(this.state.on);
    const f = this.state.f;
    const sel = this.state.sel;
    const COL = { i: "#f0c060", n: "#edbbc5" };
    const RGB = { i: "240,192,96", n: "237,187,197" };
    const LT = { i: "255,241,201", n: "244,220,225" };
    const rgba = (c, a) => "rgba(" + RGB[c] + "," + a + ")";
    const TONE = { i: { hi: "#f5da98", base: "#f0c060", dark: "#8c6420" }, n: { hi: "#f4dce1", base: "#edbbc5", dark: "#74444d" } };
    const GR = [
      { ink: "#b3c39b", on: { hi: "#d5e0c2", base: "#8fa274", dark: "#262c1d" }, off: { hi: "#8c9878", base: "#5d6a4c", dark: "#1b2015" } },
      { ink: "#8fc4bf", on: { hi: "#c2e2de", base: "#5f9a96", dark: "#1a2a29" }, off: { hi: "#7e9e9b", base: "#3f6563", dark: "#13201f" } },
      { ink: "#9fb7da", on: { hi: "#c8d6ec", base: "#6585b0", dark: "#1c2433" }, off: { hi: "#8191aa", base: "#435875", dark: "#151b26" } },
      { ink: "#b4aada", on: { hi: "#d6cfec", base: "#8577b3", dark: "#251f35" }, off: { hi: "#8f88aa", base: "#584f77", dark: "#1a1626" } }
    ];
    const GL = ["213,224,194", "194,226,222", "200,214,236", "214,207,236"];
    // osnowy jak na stronie startowej: nić z drobnych świecących trójkątów i punktów w kolorze grupy (jego słowo, 2026-10-20)
    const PT = 240, PH = 11;
    const pyl = (g, pion) => {
      let z = 7 + g * 101 + (pion ? 53 : 0);
      const r = () => { z = (z * 16807) % 2147483647; return (z - 1) / 2147483646; };
      const kol = [GR[g].on.base, GR[g].on.hi];
      let m = "";
      for (let k = 0; k < 78; k++) {
        const x = (k + r()) * PT / 78, y = PH / 2 + (r() - 0.5) * 4.4, rr = 1.2 + r() * 1.3, a = r() * 6.283, o = (0.5 + r() * 0.5).toFixed(2), c = kol[r() < 0.45 ? 1 : 0];
        const [X, Y] = pion ? [y, x] : [x, y];
        const pts = [0, 2.09, 4.19].map((d) => (X + rr * Math.cos(a + d)).toFixed(1) + "," + (Y + rr * Math.sin(a + d)).toFixed(1)).join(" ");
        m += "<polygon points='" + pts + "' fill='none' stroke='" + c + "' stroke-width='0.8' opacity='" + o + "'/>";
      }
      for (let k = 0; k < 40; k++) { const a1 = (r() * PT).toFixed(1), b1 = (PH / 2 - 0.6 + (r() - 0.5) * 4.4).toFixed(1); m += "<rect x='" + (pion ? b1 : a1) + "' y='" + (pion ? a1 : b1) + "' width='1.2' height='1.2' fill='" + kol[0] + "' opacity='" + (0.3 + r() * 0.5).toFixed(2) + "'/>"; }
      return 'url("data:image/svg+xml,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='" + (pion ? PH : PT) + "' height='" + (pion ? PT : PH) + "'>" + m + "</svg>") + '")';
    };
    const PYL = GR.map((_, g) => pyl(g)), PYLV = GR.map((_, g) => pyl(g, 1));
    // nić osnowy zaczyna się w szynie dyscypliny (środek x = RX) i biegnie pod nazwą aż do tkaniny (jego słowo, 2026-10-20)
    const RX = 19, BGC = "#0e0d0b";
    // nazwa dyscypliny nad jej pierwszą osnową, nie w osobnej kolumnie (jego słowo, 2026-10-20)
    const X0 = 290, CW = 96, Y0 = 64, RH = 40, W = X0 + CL.length * CW, LX = 30, KW = 227;
    const BG = 10, LBL = 22;
    const rowY = [], rowG = [], bands = [];
    let yc = Y0;
    const bandH = [];
    BAND.forEach((cnt, b) => {
      const g = GR[b];
      yc += LBL;
      const top = yc;
      for (let k = 0; k < cnt; k++) {
        const i = rowY.length, h = on.has(OS[i]) ? (this.hb[i] || 160) : 0;
        rowY.push(yc); rowG.push(b); bandH.push(h); yc += RH + h;
      }
      bands.push({
        label: GN[b],
        nameStyle: "position:absolute;left:" + (RX - 3) + "px;top:" + (top - LBL + 4) + "px;white-space:nowrap;font-size:11px;line-height:14px;letter-spacing:0.08em;text-transform:uppercase;color:" + g.ink,
        railStyle: "position:absolute;left:" + (RX - PH / 2) + "px;top:" + (top + 6) + "px;width:" + PH + "px;height:" + (yc - top - 12) + "px;background-image:" + PYLV[b] + ";background-size:" + PH + "px " + PT + "px;filter:drop-shadow(0 0 2px rgba(" + GL[b] + ",0.35))"
      });
      yc += BG;
    });
    const YA = 46, YB = yc - BG;
    const WW = 10, WH = 7, TW = 6;
    const colIndex = {};
    CL.forEach((c, j) => { colIndex[c.id] = j; });
    const clsOf = (id) => CL[colIndex[id]];
    const vis = (c) => f === "all" || f === c;
    const cx = (j) => X0 + j * CW + CW / 2;
    const cy = (i) => rowY[i] + RH / 2;
    const hitSet = new Set(SP.map((s) => s.cls + "|" + s.o));
    const isHit = (c, n) => hitSet.has(c.id + "|" + n);
    const held = CL.filter((c) => c.held);
    const tubeH = (t) => "linear-gradient(to bottom," + t.base + " 0%," + t.hi + " 30%," + t.base + " 62%," + t.dark + " 100%)";
    const tubeV = (t) => "linear-gradient(to right," + t.base + " 0%," + t.hi + " 28%," + t.base + " 58%," + t.dark + " 100%)";
    const twist = (deg) => "linear-gradient(" + deg + "deg,rgba(0,0,0,0.12) 25%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.12) 50%,rgba(0,0,0,0.12) 75%,rgba(0,0,0,0) 75%)";
    const twistH = twist(45), twistV = twist(-45);
    const sizes = "100% 100%,100% 100%," + TW + "px " + TW + "px,100% 100%";
    const selS = SP.find((s) => s.id === sel) || null;
    const rel = new Set();
    if (selS) CN.forEach((c) => { if (c.m.indexOf(selS.id) >= 0) c.m.forEach((x) => { if (x !== selS.id) rel.add(x); }); });
    const cols = CL.map((c, j) => ({
      course: c.course, short: c.short, future: !c.held,
      headStyle: "position:absolute;left:" + (X0 + j * CW) + "px;top:0;width:" + CW + "px;height:56px;text-align:center;opacity:" + (vis(c.c) ? 1 : 0.35),
      courseStyle: "font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:" + (c.held ? COL[c.c] : "#8f877a"),
      dateStyle: "font-family:'Cormorant Garamond',serif;font-size:24px;line-height:1.1;color:" + (c.held ? "#e2ddd4" : "#8f877a"),
      boxStyle: "position:absolute;left:" + (X0 + j * CW + 8) + "px;top:" + (Y0 - 2) + "px;width:" + (CW - 16) + "px;height:" + (YB - Y0 + 4) + "px;border-radius:12px;background:rgba(180,155,100,0.04)"
    }));
    const hitRows = new Set(SP.filter((s) => vis(clsOf(s.cls).c)).map((s) => s.o));
    const rows = OS.map((n, i) => {
      const t = GR[rowG[i]].off;
      const lights = ["rgba(0,0,0,0) 0px"];
      const shade = ["rgba(0,0,0,0.14) 0px"];
      const crowns = ["rgba(255,248,225,0) 0px"];
      const L = GL[rowG[i]];
      held.forEach((c) => {
        if (!vis(c.c)) return;
        const x = cx(colIndex[c.id]) - X0;
        const hit = isHit(c, n);
        const a = hit ? 0 : 0.72;
        shade.push("rgba(0,0,0,0.14) " + (x - 18) + "px", "rgba(0,0,0," + a + ") " + (x - 6) + "px", "rgba(0,0,0," + a + ") " + (x + 6) + "px", "rgba(0,0,0,0.14) " + (x + 18) + "px");
        if (hit) lights.push("rgba(" + L + ",0) " + (x - 46) + "px", "rgba(" + L + ",0.28) " + (x - 20) + "px", "rgba(" + L + ",0.5) " + x + "px", "rgba(" + L + ",0.28) " + (x + 20) + "px", "rgba(" + L + ",0) " + (x + 46) + "px");
        if (hit) crowns.push("rgba(255,248,225,0) " + (x - 14) + "px", "rgba(255,248,225,0.3) " + x + "px", "rgba(255,248,225,0) " + (x + 14) + "px");
      });
      shade.push("rgba(0,0,0,0.14) 100%");
      const mask = "linear-gradient(to right,#000 0px,#000 calc(100% - 14px),transparent 100%)";
      const isOn = on.has(n), bt = rowY[i] + RH, ink = GR[rowG[i]].ink;
      return {
        name: n, idx: i, on: isOn,
        toggle: () => { const nn = new Set(this.state.on); if (nn.has(n)) nn.delete(n); else nn.add(n); this.setState({ on: OS.filter((x) => nn.has(x)) }); },
        def: "Co mierzy: " + OP[i][0].charAt(0).toLowerCase() + OP[i][0].slice(1),
        r2: OP[i][1].map((t) => ({ name: t, style: "font-size:12.5px;line-height:1.5;padding:2px 10px;border-radius:999px;border:1px solid " + ink + "66;color:#cfc8bb" })),
        cards: SP.filter((s) => s.o === n && vis(clsOf(s.cls).c)).map((s) => { const c = clsOf(s.cls); return {
          h: s.h, d: s.d, url: s.url, kicker: c.course + " · " + c.short,
          kickStyle: "margin:0;font-size:11px;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:" + COL[c.c],
          style: "box-sizing:border-box;flex:0 0 " + KW + "px;width:" + KW + "px;background:#16140f;border:1px solid " + rgba(c.c, 0.35) + ";border-radius:14px;padding:12px 14px 8px;box-shadow:0 10px 28px rgba(0,0,0,0.5)"
        }; }),
        sideBandStyle: "position:absolute;left:" + (LX - 10) + "px;top:" + (bt - 2) + "px;width:" + (X0 - LX + 10) + "px;height:" + (bandH[i] - 6) + "px;border-radius:12px 0 0 12px;background:rgba(180,155,100,0.035);pointer-events:none",
        bandStyle: "position:absolute;left:" + X0 + "px;top:" + (bt - 2) + "px;width:" + (W - X0) + "px;height:" + (bandH[i] - 6) + "px;border-radius:0 12px 12px 0;background:rgba(180,155,100,0.035);pointer-events:none",
        descStyle: "position:absolute;left:" + LX + "px;top:" + (bt + 4) + "px;width:" + (X0 - LX - 22) + "px",
        cardsStyle: "position:absolute;left:" + (X0 + 14) + "px;top:" + (bt + 4) + "px;width:" + (W - X0 - 14) + "px;display:flex;flex-wrap:wrap;align-items:flex-start;gap:12px;z-index:5",
        style: "position:absolute;left:" + LX + "px;top:" + rowY[i] + "px;width:" + (X0 - LX) + "px;height:" + RH + "px;display:flex;align-items:center",
        labelStyle: "display:block;width:100%;height:100%;margin:0;padding:0 12px 0 0;border:0;background:transparent;cursor:pointer;text-align:left;font-family:'Cormorant Garamond',serif;font-size:18px;line-height:1.1;font-weight:" + (isOn ? 500 : 400) + ";color:" + (isOn ? "#f0e6d2" : (hitRows.has(n) ? "#e2ddd4" : "#8f877a")),
        sideWarpStyle: "position:absolute;left:" + RX + "px;top:" + (cy(i) - PH / 2) + "px;width:" + (X0 - RX) + "px;height:" + PH + "px;pointer-events:none;background-image:" + PYL[rowG[i]] + ";background-size:" + PT + "px 100%;background-position:" + ((((X0 - RX) - i * 67) % PT + PT) % PT) + "px 0;filter:drop-shadow(0 0 2px rgba(" + L + ",0.35))",
        nameBg: "white-space:nowrap;background:" + BGC + ";padding:0 6px;margin-left:2px;box-shadow:0 0 6px 4px " + BGC + ";border-radius:4px",
        warpStyle: "position:absolute;left:" + X0 + "px;top:" + (cy(i) - PH / 2) + "px;width:" + (W - X0) + "px;height:" + PH + "px;border-radius:3px;background-image:linear-gradient(to right," + crowns.join(",") + "),linear-gradient(to right," + shade.join(",") + "),linear-gradient(to right," + lights.join(",") + ")," + PYL[rowG[i]] + ";background-size:100% 100%,100% 100%,100% 100%," + PT + "px 100%;background-position:0 0,0 0,0 0," + (-(i * 67) % PT) + "px 0;filter:drop-shadow(0 0 2px rgba(" + L + ",0.35));-webkit-mask-image:" + mask + ";mask-image:" + mask
      };
    });
    const threads = held.map((c) => {
      const tn = TONE[c.c];
      const shade = OS.map((n, i) => "rgba(0,0,0," + (isHit(c, n) ? 0.36 : 0) + ") " + (cy(i) - YA) + "px");
      const crowns = ["rgba(255,248,225,0) 0px"];
      OS.forEach((n, i) => {
        if (isHit(c, n)) return;
        const y = cy(i) - YA;
        crowns.push("rgba(255,248,225,0) " + (y - 12) + "px", "rgba(255,248,225,0.26) " + y + "px", "rgba(255,248,225,0) " + (y + 12) + "px");
      });
      const mask = "linear-gradient(to bottom,transparent 0px,#000 22px,#000 calc(100% - 30px),transparent 100%)";
      return {
        style: "position:absolute;left:" + (cx(colIndex[c.id]) - WW / 2) + "px;top:" + YA + "px;width:" + WW + "px;height:" + (YB - YA) + "px;border-radius:5px;pointer-events:none;background-image:linear-gradient(to bottom," + crowns.join(",") + "),linear-gradient(to bottom," + shade.join(",") + ")," + twistV + "," + tubeV(tn) + ";background-size:" + sizes + ";box-shadow:1px 2px 5px rgba(0,0,0,0.75);-webkit-mask-image:" + mask + ";mask-image:" + mask + ";opacity:" + (vis(c.c) ? 1 : 0.18)
      };
    });
    const unders = [];
    held.forEach((c) => {
      const x = cx(colIndex[c.id]);
      OS.forEach((n, i) => {
        if (!isHit(c, n)) return;
        const t = GR[rowG[i]].off;
        const L = GL[rowG[i]];
        const left = x - WW / 2 - 4;
        unders.push({
          shadowStyle: "position:absolute;left:" + (x - WW / 2) + "px;top:" + (cy(i) - 11) + "px;width:" + WW + "px;height:22px;pointer-events:none;background:linear-gradient(to bottom,rgba(0,0,0,0) 0px,rgba(0,0,0,0.7) 7px,rgba(0,0,0,0.7) 15px,rgba(0,0,0,0) 22px);opacity:" + (vis(c.c) ? 1 : 0.18),
          patchStyle: "position:absolute;left:" + left + "px;top:" + (cy(i) - PH / 2) + "px;width:" + (WW + 8) + "px;height:" + PH + "px;pointer-events:none;background-image:radial-gradient(ellipse at 50% 50%,rgba(255,248,225,0.3) 0px,rgba(255,248,225,0) 70%),linear-gradient(rgba(" + L + ",0.18),rgba(" + L + ",0.18))," + PYL[rowG[i]] + ";background-size:100% 100%,100% 100%," + PT + "px 100%;background-position:0 0,0 0," + (-((left - X0 + i * 67) % PT)) + "px 0"
        });
      });
    });
    const halos = SP.map((s) => {
      const c = clsOf(s.cls);
      const x = cx(colIndex[s.cls]), y = cy(OS.indexOf(s.o));
      const L = GL[rowG[OS.indexOf(s.o)]];
      return { style: "position:absolute;left:" + (x - 56) + "px;top:" + (y - 13) + "px;width:112px;height:26px;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(" + L + ",0.2) 0%,rgba(" + L + ",0) 70%);opacity:" + (vis(c.c) ? 1 : 0.2) };
    });
    const knots = SP.map((s) => {
      const c = clsOf(s.cls);
      const on = !!selS && s.id === selS.id;
      const r = rel.has(s.id);
      const sheen = "radial-gradient(circle at 50% 50%," + rgba(c.c, on ? 0.22 : 0.1) + " 0px," + rgba(c.c, 0) + " " + (on ? 20 : 18) + "px)";
      const ring = on ? "0 0 0 1.5px #fff4dc,0 0 0 4px " + rgba(c.c, 0.25) + ",0 0 16px " + rgba(c.c, 0.45) : "0 0 0 1.5px " + rgba(c.c, 0.8) + ",0 0 10px " + rgba(c.c, 0.3) + (r ? ",0 0 0 4px " + rgba(c.c, 0.18) : "");
      return {
        label: s.o + ", " + c.course + ", " + c.date,
        pressed: on,
        pick: () => this.setState({ sel: this.state.sel === s.id ? null : s.id }),
        style: "position:absolute;left:" + (cx(colIndex[s.cls]) - 22) + "px;top:" + (cy(OS.indexOf(s.o)) - 16) + "px;width:44px;height:32px;padding:0;border:0;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:16px;z-index:6;opacity:" + (vis(c.c) ? 1 : 0.2),
        dot: "display:block;width:26px;height:26px;border-radius:50%;background:" + sheen + ";box-shadow:" + ring
      };
    });
    let pop = { open: false, close: () => this.setState({ sel: null }) };
    if (selS) {
      const c0 = clsOf(selS.cls);
      const kx = cx(colIndex[selS.cls]), ky = cy(OS.indexOf(selS.o));
      const PW = 290;
      const right = kx + 40 + PW <= W;
      const up = OS.indexOf(selS.o) >= 12;
      const dir = right ? 1 : -1;
      const left = right ? kx + 40 : kx - 40 - PW;
      const bub = (dx, dy, d) => "position:absolute;left:" + (kx + dir * dx - d / 2) + "px;top:" + (ky + dy - d / 2) + "px;width:" + d + "px;height:" + d + "px;border-radius:50%;box-sizing:border-box;background:#16140f;border:1.5px solid " + rgba(c0.c, 0.75) + ";z-index:9;pointer-events:none";
      pop = {
        open: true,
        close: () => this.setState({ sel: null }),
        title: selS.h, desc: selS.d, url: selS.url,
        b1: bub(20, up ? 12 : -12, 7),
        b2: bub(31, up ? 22 : -22, 11),
        style: "position:absolute;left:" + left + "px;top:" + (up ? ky + 34 : ky - 34) + "px;" + (up ? "transform:translateY(-100%);" : "") + "width:" + PW + "px;box-sizing:border-box;padding:16px 18px 8px;background:#16140f;border:1px solid " + rgba(c0.c, 0.55) + ";border-radius:16px;box-shadow:0 14px 40px rgba(0,0,0,0.65);z-index:9;text-align:left"
      };
    }
    return {
      cols, bands, rows, halos, threads, unders, knots,
      gridStyle: "position:relative;width:" + W + "px;height:" + (YB + 8) + "px",
      sideStyle: "width:" + X0 + "px;height:" + (YB + 8) + "px",
      pop
    };
  }
}
