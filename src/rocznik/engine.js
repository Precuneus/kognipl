// Tkanina: renders the Rocznik views from their HTML templates.
// The same code runs at build time (static HTML) and in the browser (interaction).
// Template syntax: {{path}} in text and attributes, <sc-for list="{{path}}" as="x">,
// <sc-if value="{{path}}">, onClick="{{path}}" for a handler.

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

export function parse(src) {
  const root = { tag: '#root', attrs: [], kids: [] };
  const stack = [root];
  let i = 0;
  const top = () => stack[stack.length - 1];
  while (i < src.length) {
    if (src.startsWith('<!--', i)) {
      const j = src.indexOf('-->', i);
      i = j < 0 ? src.length : j + 3;
      continue;
    }
    if (src[i] === '<' && src[i + 1] === '/') {
      const j = src.indexOf('>', i);
      const name = src.slice(i + 2, j).trim();
      while (stack.length > 1 && top().tag !== name) stack.pop();
      if (stack.length > 1) stack.pop();
      i = j + 1;
      continue;
    }
    if (src[i] === '<' && /[a-zA-Z]/.test(src[i + 1] || '')) {
      let j = i + 1;
      while (j < src.length && /[^\s/>]/.test(src[j])) j++;
      const tag = src.slice(i + 1, j);
      const attrs = [];
      let selfClose = false;
      while (j < src.length) {
        while (/\s/.test(src[j])) j++;
        if (src[j] === '>') { j++; break; }
        if (src[j] === '/' && src[j + 1] === '>') { selfClose = true; j += 2; break; }
        let k = j;
        while (k < src.length && /[^\s=/>]/.test(src[k])) k++;
        const name = src.slice(j, k);
        j = k;
        let value = null;
        if (src[j] === '=') {
          j++;
          const q = src[j];
          if (q === '"' || q === "'") {
            const e = src.indexOf(q, j + 1);
            value = src.slice(j + 1, e);
            j = e + 1;
          } else {
            let e = j;
            while (e < src.length && /[^\s>]/.test(src[e])) e++;
            value = src.slice(j, e);
            j = e;
          }
        }
        if (name) attrs.push([name, value]);
      }
      const node = { tag, attrs, kids: [] };
      top().kids.push(node);
      if (!selfClose && !VOID.has(tag.toLowerCase())) stack.push(node);
      i = j;
      continue;
    }
    const j = src.indexOf('<', i + 1);
    const end = j < 0 ? src.length : j;
    top().kids.push({ text: src.slice(i, end) });
    i = end;
  }
  return root;
}

const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
const ONLY = /^\{\{\s*([^}]+?)\s*\}\}$/;

function look(path, scope) {
  const parts = path.split('.');
  let v;
  for (let s = scope; s; s = s.up) {
    if (Object.prototype.hasOwnProperty.call(s.vars, parts[0])) { v = s.vars[parts[0]]; break; }
  }
  for (let k = 1; k < parts.length; k++) v = v == null ? undefined : v[parts[k]];
  return v;
}

function emit(node, scope, out, handlers) {
  if (node.text !== undefined) {
    out.push(node.text.replace(HOLE, (_, p) => esc(look(p, scope))));
    return;
  }
  const at = Object.fromEntries(node.attrs);
  if (node.tag === 'sc-for') {
    const list = look(ONLY.exec(at.list)[1], scope) || [];
    for (const item of list) {
      const inner = { vars: { [at.as]: item }, up: scope };
      for (const k of node.kids) emit(k, inner, out, handlers);
    }
    return;
  }
  if (node.tag === 'sc-if') {
    if (look(ONLY.exec(at.value)[1], scope)) for (const k of node.kids) emit(k, scope, out, handlers);
    return;
  }
  if (node.tag === '#root') {
    for (const k of node.kids) emit(k, scope, out, handlers);
    return;
  }
  out.push('<' + node.tag);
  for (const [name, value] of node.attrs) {
    if (name.startsWith('hint-')) continue;
    if (value === null) { out.push(' ' + name); continue; }
    if (/^on[A-Z]/.test(name)) {
      const fn = look(ONLY.exec(value)[1], scope);
      handlers.push(fn);
      out.push(' data-ev="' + (handlers.length - 1) + '"');
      continue;
    }
    out.push(' ' + name + '="' + value.replace(HOLE, (_, p) => esc(look(p, scope))) + '"');
  }
  out.push('>');
  if (VOID.has(node.tag.toLowerCase())) return;
  for (const k of node.kids) emit(k, scope, out, handlers);
  out.push('</' + node.tag + '>');
}

export function render(tree, vals) {
  const out = [];
  const handlers = [];
  emit(tree, { vars: vals, up: null }, out, handlers);
  return { html: out.join(''), handlers };
}

export class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
  }
  setState(s) {
    Object.assign(this.state, s);
    if (this._redraw) this._redraw();
  }
}

// Build time: the first paint, as a string.
export function toHTML(view, props) {
  const c = new view.Component(props);
  return render(parse(view.template), c.renderVals()).html;
}

// Browser: take over the static HTML and keep it in step with state.
export function mount(el, view, props) {
  const tree = parse(view.template);
  const c = new view.Component(props);
  c.el = el;
  let handlers = [];
  const draw = () => {
    const r = render(tree, c.renderVals());
    handlers = r.handlers;
    const t = document.createElement('template');
    t.innerHTML = r.html;
    morph(el, t.content);
    if (c.afterDraw) c.afterDraw();
  };
  c._redraw = draw;
  el.addEventListener('click', (e) => {
    const t = e.target.closest('[data-ev]');
    if (t && el.contains(t)) handlers[+t.getAttribute('data-ev')]?.(e);
  });
  draw();
  return c;
}

// Update the live DOM in place, so CSS transitions run and focus stays put.
function morph(live, next) {
  const a = Array.from(live.childNodes);
  const b = Array.from(next.childNodes);
  for (let k = 0; k < b.length; k++) {
    const x = a[k], y = b[k];
    if (!x) { live.appendChild(y.cloneNode(true)); continue; }
    if (x.nodeType !== y.nodeType || x.nodeName !== y.nodeName) { live.replaceChild(y.cloneNode(true), x); continue; }
    if (x.nodeType === 3 || x.nodeType === 8) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; continue; }
    for (const at of Array.from(x.attributes)) if (!y.hasAttribute(at.name)) x.removeAttribute(at.name);
    for (const at of Array.from(y.attributes)) if (x.getAttribute(at.name) !== at.value) x.setAttribute(at.name, at.value);
    morph(x, y);
  }
  for (let k = a.length - 1; k >= b.length; k--) live.removeChild(a[k]);
}
