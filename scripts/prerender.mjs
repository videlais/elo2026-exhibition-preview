/**
 * Pre-renders all static and per-work routes to build/{route}/index.html.
 *
 * Run after client build + SSR build:
 *   vite build && vite build --ssr src/entry-server.tsx && node scripts/prerender.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const buildDir = path.join(projectRoot, 'build');
const ssrBundle = path.join(projectRoot, 'dist-ssr', 'entry-server.js');

/**
 * React 19 + react-helmet-async v3 render head elements (title, meta, link,
 * script, style) at the BEGINNING of the renderToString output before the
 * actual component body. This function splits them so we can inject head
 * elements into the HTML template <head> and body content into <div id="root">.
 */
function splitHeadAndBody(html) {
  // Sticky-match head-level self-closing tags and open/close pairs from pos=0
  const selfClose = /(?:<(?:meta|link|base)(?:\s[^>]*)?\/?>)/y;
  const openClose = /(?:<(?:title|style|script)[^>]*>[\s\S]*?<\/(?:title|style|script)>)/y;

  let pos = 0;
  while (pos < html.length) {
    selfClose.lastIndex = pos;
    openClose.lastIndex = pos;
    const m = selfClose.exec(html) ?? openClose.exec(html);
    if (!m) break;
    pos = m.index + m[0].length;
  }
  return { headMarkup: html.slice(0, pos), bodyMarkup: html.slice(pos) };
}

async function main() {
  // Load the SSR bundle built by: vite build --ssr src/entry-server.tsx
  const { render, getStaticRoutes } = await import(ssrBundle);

  // Read the client-build HTML template.
  // IMPORTANT: read before processing any routes, because the '/' route will
  // overwrite build/index.html.  If it was already pre-rendered from a prior
  // run we won't find '<div id="root"></div>' in it, so normalise it first.
  let template = await fs.readFile(path.join(buildDir, 'index.html'), 'utf-8');

  // If the template was already pre-rendered, strip the root-div content so
  // the replacement works regardless of how many times the script is run.
  // Use greedy [\s\S]* so we match up to the LAST </div> before </body>
  // (lazy *? would stop at the first inner </div> inside pre-rendered content).
  template = template.replace(/<div id="root">[\s\S]*<\/div>(\s*<\/body>)/, '<div id="root"></div>$1');
  // Also strip any previously-injected head tags (bounded by marker comments).
  template = template.replace(/\s*<!--ssr-head-start-->[\s\S]*?<!--ssr-head-end-->/, '');

  const routes = getStaticRoutes();
  console.log(`Pre-rendering ${routes.length} routes…`);

  for (const route of routes) {
    let html;

    try {
      ({ html } = render(route));
    } catch (err) {
      console.warn(`  [skip] ${route} — render error: ${err.message}`);
      continue;
    }

    const { headMarkup, bodyMarkup } = splitHeadAndBody(html);

    // Inject server-rendered head tags and body into the HTML shell.
    // Wrap injected head markup in sentinel comments so re-runs can strip it.
    const fullHtml = template
      .replace('</head>', `    <!--ssr-head-start-->\n    ${headMarkup}\n    <!--ssr-head-end-->\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${bodyMarkup}</div>`);

    // Determine output path: /  → build/index.html, /search → build/search/index.html
    const normalizedRoute = route === '/' ? '' : route;
    const outDir = path.join(buildDir, ...normalizedRoute.split('/').filter(Boolean));
    await fs.mkdir(outDir, { recursive: true });

    const outFile = route === '/'
      ? path.join(buildDir, 'index.html')
      : path.join(outDir, 'index.html');

    await fs.writeFile(outFile, fullHtml, 'utf-8');
    console.log(`  ✓ ${route}`);
  }

  console.log('Pre-rendering complete.');
}

main().catch((err) => {
  console.error('Pre-rendering failed:', err);
  process.exit(1);
});

