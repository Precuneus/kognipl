import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://kogni.pl';
const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
});

function wykonczenie() {
  return {
    name: 'wykonczenie',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        const urls = [];
        for (const f of walk(root)) {
          const html = readFileSync(f, 'utf8').replace(/<!--(?!\[if|<!|\s*astro)[\s\S]*?-->/g, '');
          writeFileSync(f, html);
          const rel = relative(root, f).split(sep).join('/');
          if (rel === '404.html') continue;
          if (/http-equiv="refresh"|name="robots" content="noindex"|id="gate"/.test(html)) continue;
          urls.push(SITE + '/' + rel.replace(/index\.html$/, ''));
        }
        urls.sort();
        writeFileSync(join(root, 'sitemap.xml'),
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map((u) => `<url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>\n');
      },
    },
  };
}

export default defineConfig({
  site: SITE,
  integrations: [react(), wykonczenie()],
});
