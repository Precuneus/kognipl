import { DCLogic } from '../engine.js';

export const template = "<main style=\"max-width: 1180px; margin: 0 auto; padding: 40px 32px 80px\">\n    <div style=\"overflow-x: auto; padding-bottom: 12px\">\n      <div style=\"width: max-content; min-width: 100%\">\n        <div style=\"display: flex; align-items: stretch\">\n          <div style=\"position: sticky; left: 0; z-index: 8; flex: 0 0 320px; width: 320px; background: #0e0d0b; display: flex; align-items: center\">\n            <button type=\"button\" role=\"switch\" aria-checked=\"{{descOn}}\" onClick=\"{{toggleDesc}}\" style=\"display: inline-flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 4px; border: 0; background: transparent; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 400; letter-spacing: 0.06em; color: #a09888\">\n              <span aria-hidden=\"true\" style=\"position: relative; display: inline-block; width: 46px; height: 18px\">\n                <span style=\"{{swTrack}}\"></span>\n                <span style=\"{{swKnot}}\"></span>\n              </span>\n              Opisy\n            </button>\n          </div>\n          <sc-for list=\"{{heads}}\" as=\"h\" hint-placeholder-count=\"5\">\n            <div style=\"{{h.style}}\">\n              <div style=\"{{h.courseStyle}}\">{{h.course}}</div>\n              <div style=\"{{h.dateStyle}}\">{{h.short}}</div>\n            </div>\n          </sc-for>\n        </div>\n        <sc-for list=\"{{rows}}\" as=\"r\" hint-placeholder-count=\"19\">\n          <div style=\"display: flex; align-items: stretch\">\n            <div style=\"{{r.labelStyle}}\">\n              <div style=\"flex: 0 0 100px; width: 100px; padding-right: 12px; box-sizing: border-box; text-align: right\">\n                <sc-if value=\"{{r.hasGroup}}\" hint-placeholder-val=\"{{false}}\">\n                  <span style=\"{{r.groupStyle}}\">{{r.group}}</span>\n                </sc-if>\n              </div>\n              <div style=\"flex: 1 1 auto; min-width: 0; padding-right: 14px\">\n                <button type=\"button\" class=\"osn-name\" aria-expanded=\"{{r.on}}\" onClick=\"{{r.toggle}}\" style=\"{{r.nameStyle}}\">{{r.name}}</button>\n                <sc-if value=\"{{r.showDesc}}\" hint-placeholder-val=\"{{false}}\">\n                  <p style=\"margin: 6px 0 0; font-size: 13.5px; line-height: 1.55; color: #a09888\">{{r.def}}</p>\n                  <div style=\"display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0 18px\">\n                    <sc-for list=\"{{r.r2}}\" as=\"t\" hint-placeholder-count=\"3\">\n                      <span style=\"{{t.style}}\">{{t.name}}</span>\n                    </sc-for>\n                  </div>\n                </sc-if>\n              </div>\n            </div>\n            <sc-for list=\"{{r.cells}}\" as=\"c\" hint-placeholder-count=\"5\">\n              <div style=\"{{c.style}}\">\n                <span aria-hidden=\"true\" style=\"{{c.threadStyle}}\"></span>\n                <sc-if value=\"{{c.cast}}\" hint-placeholder-val=\"{{false}}\">\n                  <span aria-hidden=\"true\" style=\"{{c.castStyle}}\"></span>\n                </sc-if>\n                <span aria-hidden=\"true\" style=\"{{c.cordStyle}}\"></span>\n                <sc-if value=\"{{c.hit}}\" hint-placeholder-val=\"{{false}}\">\n                  <span aria-hidden=\"true\" style=\"{{c.haloStyle}}\"></span>\n                  <span aria-hidden=\"true\" style=\"{{c.knotStyle}}\"></span>\n                </sc-if>\n                <div style=\"height: 40px\"></div>\n                <sc-if value=\"{{c.card}}\" hint-placeholder-val=\"{{false}}\">\n                  <article style=\"position: relative; z-index: 5; margin: 4px 10px 22px 40px; box-sizing: border-box; background: #16140f; border: 1px solid rgba(180,155,100,0.2); border-radius: 14px; padding: 14px 16px 10px\">\n                    <h2 style=\"margin: 0; font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 22px; line-height: 1.15; color: #e2ddd4\">{{c.h}}</h2>\n                    <sc-if value=\"{{c.showD}}\" hint-placeholder-val=\"{{true}}\">\n                      <p style=\"margin: 8px 0 0; font-size: 14px; line-height: 1.6; color: #e2ddd4\">{{c.d}}</p>\n                    </sc-if>\n                    <div style=\"display: flex; justify-content: flex-end; margin-top: 8px\">\n                      <a class=\"enter\" href=\"{{c.url}}\" aria-label=\"Cała karta\" title=\"Cała karta\" style=\"display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(232,168,76,0.45); color: #e8a84c; text-decoration: none\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 22 22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"4\" r=\"2\" fill=\"currentColor\" stroke=\"none\"></circle><path d=\"M6 7 V12 Q6 16 10 16 H18\"></path><path d=\"M14.5 12.5 L18 16 L14.5 19.5\"></path></svg></a>\n                    </div>\n                  </article>\n                </sc-if>\n              </div>\n            </sc-for>\n          </div>\n        </sc-for>\n      </div>\n    </div>\n  </main>";

export class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { on: props.on || [], desc: true };
  }
  D() {
    return this.props.data;
  }
  renderVals() {
    const { OS, BAND, GN, LV, CL, SP, CN } = this.D();
    const on = new Set(this.state.on);
    const desc = this.state.desc;
    const COL = { i: "#f0c060", n: "#edbbc5" };
    const RGB = { i: "240,192,96", n: "237,187,197" };
    const LT = { i: "255,241,201", n: "244,220,225" };
    const rgba = (c, a) => "rgba(" + RGB[c] + "," + a + ")";
    const GL = ["213,224,194", "194,226,222", "200,214,236", "214,207,236"];
    const INK = ["#b3c39b", "#8fc4bf", "#9fb7da", "#b4aada"];
    const GR = [
      { on: { hi: "#d5e0c2", base: "#8fa274", dark: "#262c1d" }, off: { hi: "#8c9878", base: "#5d6a4c", dark: "#1b2015" } },
      { on: { hi: "#c2e2de", base: "#5f9a96", dark: "#1a2a29" }, off: { hi: "#7e9e9b", base: "#3f6563", dark: "#13201f" } },
      { on: { hi: "#c8d6ec", base: "#6585b0", dark: "#1c2433" }, off: { hi: "#8191aa", base: "#435875", dark: "#151b26" } },
      { on: { hi: "#d6cfec", base: "#8577b3", dark: "#251f35" }, off: { hi: "#8f88aa", base: "#584f77", dark: "#1a1626" } }
    ];
    const TONE = { i: { hi: "#f5da98", base: "#f0c060", dark: "#8c6420" }, n: { hi: "#f4dce1", base: "#edbbc5", dark: "#74444d" } };
    const twist = (deg) => "linear-gradient(" + deg + "deg,rgba(0,0,0,0.12) 25%,rgba(0,0,0,0) 25%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.12) 50%,rgba(0,0,0,0.12) 75%,rgba(0,0,0,0) 75%)";
    const tubeH = (t) => "linear-gradient(to bottom," + t.base + " 0%," + t.hi + " 30%," + t.base + " 62%," + t.dark + " 100%)";
    const tubeV = (t) => "linear-gradient(to right," + t.base + " 0%," + t.hi + " 28%," + t.base + " 58%," + t.dark + " 100%)";
    const groupOf = [], firstOf = {};
    BAND.reduce((start, cnt, b) => { firstOf[start] = GN[b]; for (let k = 0; k < cnt; k++) groupOf.push(b); return start + cnt; }, 0);
    const hitOf = (o, c) => SP.find((s) => s.o === o && s.cls === c.id);
    const wide = CL.map((c) => c.held && OS.some((o) => on.has(o[0]) && !!hitOf(o[0], c)));
    const CWD = CL.map((c, j) => (wide[j] ? 300 : 60));
    const touched = new Set(SP.map((s) => s.o));
    const dip = (i, j) => { const c = CL[j]; if (!c.held) return 0; return hitOf(OS[i][0], c) ? 0.36 : 0; };
    const edge = (i, j) => (i <= 0 ? dip(0, j) : (i >= OS.length ? dip(OS.length - 1, j) : (dip(i - 1, j) + dip(i, j)) / 2));
    const heads = CL.map((c, j) => ({
      course: wide[j] ? c.course : "", short: c.short,
      style: "flex:0 0 " + CWD[j] + "px;width:" + CWD[j] + "px;box-sizing:border-box;padding:0 0 8px 8px",
      courseStyle: "height:16px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;white-space:nowrap;color:" + (c.held ? COL[c.c] : "#8f877a"),
      dateStyle: "font-family:'Cormorant Garamond',serif;font-size:22px;line-height:1.2;white-space:nowrap;color:" + (c.held ? "#e2ddd4" : "#6f685d")
    }));
    const rows = OS.map((o, i) => {
      const name = o[0], g = groupOf[i];
      const isOn = on.has(name);
      const cordT = GR[g].off;
      const last = i === OS.length - 1;
      const cells = CL.map((c, j) => {
        const s = hitOf(name, c);
        const hit = !!s;
        const tn = TONE[c.c];
        const alpha = c.held ? 1 : 0.28;
        const W = CWD[j];
        const crown = (!hit && c.held) ? "linear-gradient(to bottom,rgba(255,248,225,0) 8px,rgba(255,248,225,0.26) 20px,rgba(255,248,225,0) 32px)," : "";
        const shade = "linear-gradient(to bottom,rgba(0,0,0," + edge(i, j) + ") 0px,rgba(0,0,0," + dip(i, j) + ") 20px,rgba(0,0,0," + edge(i + 1, j) + ") 100%)";
        const mask = i === 0 ? ";-webkit-mask-image:linear-gradient(to bottom,transparent 0px,#000 16px);mask-image:linear-gradient(to bottom,transparent 0px,#000 16px)" : (last ? ";-webkit-mask-image:linear-gradient(to bottom,#000 0px,#000 20px,transparent 100%);mask-image:linear-gradient(to bottom,#000 0px,#000 20px,transparent 100%)" : "");
        const cordMask = j === 0 ? ";-webkit-mask-image:linear-gradient(to right,transparent 0px,#000 10px);mask-image:linear-gradient(to right,transparent 0px,#000 10px)" : (j === CL.length - 1 ? ";-webkit-mask-image:linear-gradient(to right,#000 0px,#000 calc(100% - 20px),transparent 100%);mask-image:linear-gradient(to right,#000 0px,#000 calc(100% - 20px),transparent 100%)" : "");
        return {
          hit, miss: !hit, cast: hit, card: hit && isOn, showD: desc,
          h: hit ? s.h : "", d: hit ? s.d : "", url: hit ? s.url : "",
          style: "position:relative;flex:0 0 " + W + "px;width:" + W + "px;display:flex;flex-direction:column",
          threadStyle: "position:absolute;left:15px;top:0;bottom:0;width:10px;z-index:2;pointer-events:none;opacity:" + alpha + ";background-image:" + crown + shade + "," + tubeV(tn) + ";box-shadow:1px 0 4px rgba(0,0,0,0.6)" + mask,
          castStyle: "position:absolute;left:15px;top:9px;width:10px;height:22px;z-index:3;pointer-events:none;opacity:" + alpha + ";background:linear-gradient(to bottom,rgba(0,0,0,0) 0px,rgba(0,0,0,0.7) 7px,rgba(0,0,0,0.7) 15px,rgba(0,0,0,0) 22px)",
          cordStyle: "position:absolute;left:0;right:0;top:16.5px;height:7px;z-index:" + (hit ? 3 : 1) + ";pointer-events:none;background-image:" + (hit ? "radial-gradient(ellipse 16px 6px at 20px 50%,rgba(255,248,225,0.3) 0px,rgba(255,248,225,0) 100%),linear-gradient(to right,rgba(" + GL[g] + ",0) 0px,rgba(" + GL[g] + ",0.4) 12px,rgba(" + GL[g] + ",0.5) 20px,rgba(" + GL[g] + ",0.4) 28px,rgba(" + GL[g] + ",0) 60px)" : "linear-gradient(to right,rgba(0,0,0,0.14) 0px,rgba(0,0,0," + (c.held ? 0.72 : 0.14) + ") 14px,rgba(0,0,0," + (c.held ? 0.72 : 0.14) + ") 26px,rgba(0,0,0,0.14) 40px,rgba(0,0,0,0.14) 100%),linear-gradient(transparent,transparent)") + "," + twist(45) + "," + tubeH(cordT) + ";background-size:100% 100%,100% 100%,6px 6px,100% 100%" + cordMask,
          haloStyle: "position:absolute;left:-36px;top:7px;width:112px;height:26px;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,rgba(" + GL[g] + ",0.2) 0%,rgba(" + GL[g] + ",0) 70%)",
          knotStyle: "position:absolute;left:7px;top:7px;width:26px;height:26px;border-radius:50%;z-index:4;pointer-events:none;background:radial-gradient(circle at 50% 50%," + rgba(c.c, 0.1) + " 0px," + rgba(c.c, 0) + " 18px);box-shadow:0 0 0 1.5px " + rgba(c.c, 0.8) + ",0 0 10px " + rgba(c.c, 0.3)
        };
      });
      return {
        name, on: isOn, hasGroup: !!firstOf[i], group: firstOf[i] || "",
        groupStyle: "display:block;padding-top:" + (firstOf[i] ? 12 : 0) + "px;font-size:11px;line-height:14px;letter-spacing:0.06em;text-transform:uppercase;color:" + INK[g],
        labelStyle: "position:sticky;left:0;z-index:8;flex:0 0 320px;width:320px;background:#0e0d0b;display:flex;align-items:flex-start",
        nameStyle: "display:block;width:100%;text-align:left;min-height:40px;padding:6px 0;border:0;background:transparent;cursor:pointer;font-family:'Cormorant Garamond',serif;font-size:19px;line-height:1.2;font-weight:" + (isOn ? 500 : 400) + ";color:" + (isOn ? "#e2ddd4" : (touched.has(name) ? "#b8b0a2" : "#7d766b")),
        toggle: () => { const n = new Set(this.state.on); if (n.has(name)) n.delete(name); else n.add(name); this.setState({ on: OS.map((x) => x[0]).filter((x) => n.has(x)) }); },
        showDesc: isOn && desc,
        def: "Co mierzy: " + o[1].charAt(0).toLowerCase() + o[1].slice(1),
        r2: o[2].map((t) => ({ name: t, style: "font-size:12.5px;padding:2px 10px;border-radius:999px;border:1px solid " + INK[g] + "66;color:#cfc8bb" })),
        cells
      };
    });
    return {
      heads, rows, descOn: desc,
      toggleDesc: () => this.setState({ desc: !this.state.desc }),
      swTrack: "position:absolute;left:0;right:0;top:6px;height:6px;border-radius:3px;background:linear-gradient(to bottom,#8d7a55 0%,#d2c193 30%,#8d7a55 62%,#2a2418 100%);opacity:" + (desc ? 1 : 0.5),
      swKnot: "position:absolute;top:2px;left:" + (desc ? 30 : 2) + "px;width:14px;height:14px;border-radius:50%;transition:left .18s ease;background:" + (desc ? "#f0c060" : "#5f584d") + ";box-shadow:" + (desc ? "0 0 0 2px rgba(240,192,96,0.3),0 0 12px rgba(240,192,96,0.8)" : "0 0 0 2px rgba(0,0,0,0.4)")
    };
  }
}
