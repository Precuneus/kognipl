import { DCLogic } from '../engine.js';

export const template = "<div style=\"position: relative; max-width: 1120px; margin: 0 auto; padding: 36px 32px 80px\">\n    <span aria-hidden=\"true\" class=\"w-nic\" style=\"{{threadStyle}}\"></span>\n    <div class=\"w-axis\" style=\"position: relative; height: 84px\">\n      <span aria-hidden=\"true\" style=\"{{axisStyle}}\"></span>\n      <nav aria-label=\"Zajęcia\" style=\"position: absolute; inset: 0; overflow: hidden; -webkit-mask-image: linear-gradient(to right, transparent 0px, #000 48px, #000 calc(100% - 48px), transparent 100%); mask-image: linear-gradient(to right, transparent 0px, #000 48px, #000 calc(100% - 48px), transparent 100%)\">\n        <div style=\"{{stripStyle}}\">\n          <sc-for list=\"{{stops}}\" as=\"st\" hint-placeholder-count=\"5\">\n            <div style=\"{{st.wrapStyle}}\">\n              <span style=\"{{st.courseStyle}}\">{{st.course}}</span>\n              <span style=\"{{st.dateStyle}}\">{{st.short}}</span>\n              <sc-if value=\"{{st.link}}\" hint-placeholder-val=\"{{true}}\">\n                <button type=\"button\" aria-label=\"{{st.label}}\" title=\"{{st.label}}\" onClick=\"{{st.pick}}\" style=\"{{st.btnStyle}}\"><span style=\"{{st.tick}}\"></span></button>\n              </sc-if>\n              <sc-if value=\"{{st.plain}}\" hint-placeholder-val=\"{{false}}\">\n                <span aria-current=\"{{st.current}}\" title=\"{{st.label}}\" style=\"{{st.btnStyle}}\"><span style=\"{{st.tick}}\"></span></span>\n              </sc-if>\n            </div>\n          </sc-for>\n        </div>\n      </nav>\n      <span aria-hidden=\"true\" style=\"{{dotStyle}}\"></span>\n    </div>\n    <div style=\"display: flex; align-items: stretch\">\n      <div class=\"w-label\" style=\"flex: 0 0 248px; width: 248px\"></div>\n      <div class=\"w-cordzone\" style=\"flex: 0 0 40px; width: 40px\"></div>\n      <div style=\"flex: 0 0 44px\"></div>\n      <h1 style=\"flex: 1 1 auto; min-width: 0; margin: 4px 0 34px 14px; max-width: 640px; font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 50px; line-height: 1.05; color: #e2ddd4\">{{title}}</h1>\n    </div>\n    <sc-for list=\"{{rows}}\" as=\"r\" hint-placeholder-count=\"19\">\n      <div id=\"{{r.anchor}}\" style=\"display: flex; align-items: stretch\">\n        <div class=\"w-label\" style=\"flex: 0 0 248px; width: 248px; box-sizing: border-box; padding: 10px 0 10px; text-align: right\">\n          <h2 style=\"{{r.nameStyle}}\">{{r.name}}</h2>\n          <sc-if value=\"{{r.hit}}\" hint-placeholder-val=\"{{true}}\">\n            <p style=\"{{r.r2Style}}\">{{r.r2}}</p>\n          </sc-if>\n        </div>\n        <div class=\"w-cordzone\" style=\"flex: 0 0 40px; width: 40px\"></div>\n        <div aria-hidden=\"true\" style=\"position: relative; flex: 0 0 44px\">\n          <span style=\"{{r.shadeStyle}}\"></span>\n          <sc-if value=\"{{r.hit}}\" hint-placeholder-val=\"{{true}}\">\n            <span style=\"{{r.castStyle}}\"></span>\n          </sc-if>\n          <span style=\"{{r.warpStyle}}\"></span>\n          <sc-if value=\"{{r.hit}}\" hint-placeholder-val=\"{{true}}\">\n            <span style=\"{{r.knotStyle}}\"></span>\n          </sc-if>\n        </div>\n        <div style=\"flex: 1 1 auto; min-width: 0; min-height: 48px\">\n          <sc-if value=\"{{r.hit}}\" hint-placeholder-val=\"{{true}}\">\n            <article style=\"{{r.cardStyle}}\">\n              <div style=\"display: flex; margin: 0 0 6px\">\n                    <div style=\"position: relative; flex: 1 1 auto; min-width: 0; height: 42px\">\n                      <span aria-hidden=\"true\" style=\"{{r.tlCord}}\"></span>\n                      <sc-for list=\"{{r.tl}}\" as=\"k\" hint-placeholder-count=\"5\">\n                        <div style=\"{{k.wrapStyle}}\">\n                          <sc-if value=\"{{k.link}}\" hint-placeholder-val=\"{{true}}\">\n                            <button type=\"button\" aria-label=\"{{k.label}}\" title=\"{{k.label}}\" onClick=\"{{k.pick}}\" style=\"{{k.btnStyle}}\"><span style=\"{{k.dot}}\"></span></button>\n                          </sc-if>\n                          <sc-if value=\"{{k.plain}}\" hint-placeholder-val=\"{{false}}\">\n                            <span title=\"{{k.label}}\" style=\"{{k.spotStyle}}\"><span style=\"{{k.dot}}\"></span></span>\n                          </sc-if>\n                          <span style=\"{{k.dateStyle}}\">{{k.short}}</span>\n                        </div>\n                      </sc-for>\n                    </div>\n              </div>\n              <h3 style=\"margin: 0; font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 23px; line-height: 1.15; color: #e2ddd4\">{{r.h}}</h3>\n              <p style=\"margin: 8px 0 0; font-size: 14.5px; line-height: 1.6; color: #e2ddd4\">{{r.d}}</p>\n              <div style=\"display: flex; justify-content: flex-end; margin-top: 8px\">\n                <a class=\"enter\" href=\"{{r.url}}\" aria-label=\"Cała karta\" title=\"Cała karta\" style=\"flex: 0 0 auto; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(232,168,76,0.45); color: #e8a84c; text-decoration: none\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 22 22\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"6\" cy=\"4\" r=\"2\" fill=\"currentColor\" stroke=\"none\"></circle><path d=\"M6 7 V12 Q6 16 10 16 H18\"></path><path d=\"M14.5 12.5 L18 16 L14.5 19.5\"></path></svg></a>\n              </div>\n            </article>\n          </sc-if>\n        </div>\n      </div>\n    </sc-for>\n  </div>";

export class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { cls: props.cls, focus: null };
  }
  D() {
    return this.props.data;
  }
  renderVals() {
    const { OS, BAND, GN, LV, CL, SP, CN } = this.D();
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
    const groupOf = {};
    BAND.reduce((start, cnt, b) => { for (let k = 0; k < cnt; k++) groupOf[OS[start + k][0]] = b; return start + cnt; }, 0);
    // osnowa timeline: one knot per class along this osnowa
    const timeline = (osName, curId, pickFn) => {
      const n = CL.length;
      return CL.map((c, k) => {
        const s = SP.find((x) => x.o === osName && x.cls === c.id);
        const cur = !!s && s.id === curId;
        const pos = "calc(10px + (100% - 20px) * " + (n > 1 ? k / (n - 1) : 0.5) + ")";
        const dot = cur
          ? "display:none"
          : (s ? "display:block;width:10px;height:10px;border-radius:50%;background:" + COL[c.c] + ";box-shadow:0 0 0 2px " + rgba(c.c, 0.3) + ",0 0 6px " + rgba(c.c, 0.3)
               : "display:block;width:6px;height:6px;border-radius:50%;background:#0e0d0b;border:1px solid " + (c.held ? "rgba(180,155,100,0.45)" : "rgba(180,155,100,0.2)"));
        return {
          link: !!s && !cur, plain: !s || cur,
          label: c.course + " " + c.short + (s ? ": " + s.h : ""),
          pick: s ? () => pickFn(s, c) : () => {},
          wrapStyle: "position:absolute;top:0;left:" + pos + ";transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:3px",
          btnStyle: "display:flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;border:0;border-radius:50%;background:transparent;cursor:pointer",
          spotStyle: "display:flex;align-items:center;justify-content:center;width:24px;height:24px",
          dot,
          short: c.short,
          dateStyle: "font-size:10px;line-height:12px;white-space:nowrap;color:" + (cur ? "#e2ddd4" : (s ? COL[c.c] : "#6f685d"))
        };
      });
    };
    const held = CL.filter((c) => c.held);
    const k = Math.max(0, held.findIndex((c) => c.id === this.state.cls));
    const c0 = held[k];
    const col = COL[c0.c];
    const prev = held[k - 1], next = held[k + 1];
    const navStyle = (on) => "font-family:'Inter',sans-serif;font-size:14px;font-weight:400;min-height:44px;padding:8px 18px;border-radius:999px;border:1px solid rgba(180,155,100,0.25);background:transparent;cursor:" + (on ? "pointer" : "default") + ";color:" + (on ? "#e8a84c" : "#5f584d");
    const tn = TONE[c0.c];
    const threadMask = "linear-gradient(to bottom,#000 0px,#000 calc(100% - 40px),transparent 100%)";
    const threadStyle = "position:absolute;left:337px;top:94px;bottom:80px;width:10px;border-radius:5px;z-index:2;pointer-events:none;background-image:" + twist(-45) + "," + tubeV(tn) + ";background-size:6px 6px,100% 100%;box-shadow:1px 2px 5px rgba(0,0,0,0.75);-webkit-mask-image:" + threadMask + ";mask-image:" + threadMask;
    const hitOf = (i) => SP.some((x) => x.cls === c0.id && x.o === OS[i][0]);
    const dip = (i) => (hitOf(i) ? 0.36 : 0);
    const edge = (i) => (i <= 0 ? dip(0) : (i >= OS.length ? dip(OS.length - 1) : (dip(i - 1) + dip(i)) / 2));
    const warpMask = "linear-gradient(to right,transparent 0px,#000 14px,#000 calc(100% - 10px),transparent 100%)";
    const joinMask = "linear-gradient(to right,transparent 0px,#000 14px)";
    const topMask = "linear-gradient(to bottom,transparent 0px,#000 28px)";
    const endMask = "linear-gradient(to bottom,#000 0px,#000 calc(100% - 40px),transparent 100%)";
    const CY = 24;
    // top axis: the wątki in order on one line; the current one slides under the dot where the page's wątek starts
    const S = 96;
    const curIdx = CL.findIndex((c) => c.id === c0.id);
    const stops = CL.map((c, j) => {
      const cur = j === curIdx;
      return {
        link: c.held && !cur, plain: !c.held || cur, current: cur ? "page" : "false",
        label: c.course + " " + c.short + (c.held ? ": " + c.title : ""),
        pick: c.held ? () => this.setState({ cls: c.id, focus: null }) : () => {},
        course: c.course, short: c.short,
        wrapStyle: "position:absolute;top:0;left:" + (j * S) + "px;width:" + S + "px;margin-left:" + (-S / 2) + "px;display:flex;flex-direction:column;align-items:center",
        courseStyle: "font-size:10.5px;line-height:14px;letter-spacing:0.14em;text-transform:uppercase;white-space:nowrap;color:" + (c.held ? COL[c.c] : "#6f685d"),
        dateStyle: "font-family:'Cormorant Garamond',serif;font-size:19px;line-height:22px;white-space:nowrap;color:" + (cur ? "#e2ddd4" : (c.held ? "#a09888" : "#6f685d")),
        btnStyle: "display:flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:transparent;cursor:" + (c.held && !cur ? "pointer" : "default"),
        tick: "display:block;width:6px;height:30px;border-radius:3px;background:" + (c.held ? twist(-45) + "," + tubeV(TONE[c.c]) : "linear-gradient(to right,#3a352d 0%,#4d473c 35%,#2a2620 100%)") + ";background-size:" + (c.held ? "6px 6px,100% 100%" : "100% 100%") + ";box-shadow:1px 1px 3px rgba(0,0,0,0.6)"
      };
    });
    const AY = 58;
    const axisStyle = "position:absolute;left:0;right:0;top:" + (AY - 1) + "px;height:2px;border-radius:1px;background:linear-gradient(to right,rgba(180,155,100,0) 0%,rgba(180,155,100,0.4) 8%,rgba(180,155,100,0.4) 92%,rgba(180,155,100,0) 100%)";
    const stripStyle = "position:absolute;left:0;top:0;height:84px;width:" + (CL.length * S) + "px;transform:translateX(calc(var(--tx, 310px) - " + (curIdx * S) + "px));transition:transform .5s cubic-bezier(.4,0,.2,1)";
    const dotStyle = "position:absolute;top:" + AY + "px;left:var(--tx, 310px);width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;z-index:3;pointer-events:none;background:" + col + ";box-shadow:0 0 0 2.5px #0e0d0b,0 0 0 4px " + rgba(c0.c, 0.8) + ",0 0 10px 3px " + rgba(c0.c, 0.3) + ";transition:background-color .5s ease,box-shadow .5s ease";
    const rows = OS.map((pair, i) => {
      const name = pair[0];
      const s = SP.find((x) => x.cls === c0.id && x.o === name);
      const hit = !!s;
      const g = groupOf[name];
      const focused = hit && this.state.focus === s.id;
      return {
        anchor: "os-" + i, name, hit, miss: !hit,
        nameStyle: "margin:0;padding-right:4px;font-family:'Cormorant Garamond',serif;font-weight:" + (hit ? 500 : 400) + ";font-size:" + (hit ? "21px" : "18px") + ";line-height:1.2;color:" + (hit ? "#e2ddd4" : "#8f877a"),
        r2: hit ? s.r2.join(" · ") : "",
        r2Style: "margin:3px 0 0;padding-right:4px;font-size:12.5px;line-height:1.45;color:" + INK[g],
        shadeStyle: "position:absolute;left:17px;top:0;bottom:0;width:10px;z-index:2;pointer-events:none;background-image:linear-gradient(to bottom,rgba(255,248,225,0) 0px,rgba(255,248,225,0) " + (CY - 12) + "px,rgba(255,248,225," + (hit ? 0 : 0.26) + ") " + CY + "px,rgba(255,248,225,0) " + (CY + 12) + "px),linear-gradient(to bottom,rgba(0,0,0," + edge(i) + ") 0px,rgba(0,0,0," + dip(i) + ") " + CY + "px,rgba(0,0,0," + edge(i + 1) + ") 100%)" + (i === 0 ? ";-webkit-mask-image:" + topMask + ";mask-image:" + topMask : (i === OS.length - 1 ? ";-webkit-mask-image:" + endMask + ";mask-image:" + endMask : "")),
        castStyle: "position:absolute;left:17px;top:" + (CY - 11) + "px;width:10px;height:22px;z-index:3;pointer-events:none;background:linear-gradient(to bottom,rgba(0,0,0,0) 0px,rgba(0,0,0,0.7) 7px,rgba(0,0,0,0.7) 15px,rgba(0,0,0,0) 22px)",
        warpStyle: "position:absolute;left:-40px;top:" + (CY - 3.5) + "px;width:98px;height:7px;z-index:" + (hit ? 3 : 1) + ";pointer-events:none;background-image:" + (hit ? "radial-gradient(ellipse 16px 6px at 62px 50%,rgba(255,248,225,0.3) 0px,rgba(255,248,225,0) 100%),linear-gradient(to right,rgba(" + GL[g] + ",0) 26px,rgba(" + GL[g] + ",0.3) 46px,rgba(" + GL[g] + ",0.5) 62px,rgba(" + GL[g] + ",0.3) 78px,rgba(" + GL[g] + ",0) 98px)" : "linear-gradient(to right,rgba(0,0,0,0.14) 0px,rgba(0,0,0,0.14) 50px,rgba(0,0,0,0.72) 56px,rgba(0,0,0,0.72) 68px,rgba(0,0,0,0.14) 74px),linear-gradient(transparent,transparent)") + "," + twist(45) + "," + tubeH(GR[g].off) + ";background-size:100% 100%,100% 100%,6px 6px,100% 100%;-webkit-mask-image:" + (hit ? joinMask : warpMask) + ";mask-image:" + (hit ? joinMask : warpMask),
        knotStyle: "position:absolute;left:9px;top:" + (CY - 13) + "px;width:26px;height:26px;border-radius:50%;z-index:4;pointer-events:none;background:radial-gradient(circle at 50% 50%," + rgba(c0.c, focused ? 0.22 : 0.1) + " 0px," + rgba(c0.c, 0) + " " + (focused ? 20 : 18) + "px);box-shadow:" + (focused ? "0 0 0 1.5px #fff4dc,0 0 0 4px " + rgba(c0.c, 0.25) + ",0 0 16px " + rgba(c0.c, 0.45) : "0 0 0 1.5px " + rgba(c0.c, 0.8) + ",0 0 10px " + rgba(c0.c, 0.3)),
        cardStyle: "margin:1px 0 22px 14px;max-width:600px;box-sizing:border-box;background:#16140f;border:1px solid " + (focused ? col : "rgba(180,155,100,0.2)") + ";border-radius:14px;padding:10px 16px 10px",
        h: hit ? s.h : "", d: hit ? s.d : "", url: hit ? s.url : "",
        tlCord: "position:absolute;left:-17px;right:-17px;top:8.5px;height:7px;background-image:" + twist(45) + "," + tubeH(GR[g].off) + ";background-size:6px 6px,100% 100%;-webkit-mask-image:linear-gradient(to right,#000 0px,#000 calc(100% - 30px),transparent 100%);mask-image:linear-gradient(to right,#000 0px,#000 calc(100% - 30px),transparent 100%)",
        tl: hit ? timeline(name, s.id, (s2, c2) => this.setState({ cls: c2.id, focus: s2.id })) : []
      };
    });
    return {
      course: c0.course, date: c0.date, title: c0.title,
      kickerStyle: "margin:0;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:" + col,
      after: c0.after, hasAfter: c0.after.length > 0,
      prevLabel: prev ? prev.course + " " + prev.short : "Początek", nextLabel: next ? next.course + " " + next.short : "Następne zajęcia",
      noPrev: !prev, noNext: !next,
      prevStyle: navStyle(!!prev), nextStyle: navStyle(!!next),
      goPrev: () => { if (prev) this.setState({ cls: prev.id, focus: null }); },
      goNext: () => { if (next) this.setState({ cls: next.id, focus: null }); },
      rows, threadStyle, stops, axisStyle, dotStyle, stripStyle
    };
  }
  setState(s) {
    const was = this.state.cls;
    super.setState(s);
    if (s.cls && s.cls !== was && typeof history !== "undefined") {
      const c = this.props.data.CL.find((x) => x.id === s.cls);
      if (c) history.pushState({ cls: s.cls }, "", c.url);
    }
    if (typeof document !== "undefined" && "cls" in s) {
      const D = this.props.data;
      const sp = s.focus && D.SP.find((x) => x.id === s.focus);
      const row = sp && document.getElementById("os-" + D.OS.findIndex((o) => o[0] === sp.o));
      if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
}
