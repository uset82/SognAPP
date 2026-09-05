/**
 * Phase 3 fidelity gate for the React Native logo component.
 *
 * We cannot boot a simulator here, so instead of eyeballing a screenshot we
 * prove the port is the same drawing as the vector master:
 *
 *   1. Parse assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg into an ordered
 *      list of draw operations (path, line).
 *   2. Reconstruct the same list from the geometry compiled into
 *      src/components/brand/SognSafeLogo.tsx.
 *   3. Compare operation-by-operation, in draw order.
 *
 * Draw order matters: these shapes overlap, so a correct set of paths in the
 * wrong sequence is a visibly different icon. This catches coordinate typos,
 * dropped layers, wrong fills and reordering in one pass.
 *
 * Run: node tests/logo-geometry.test.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const iconDir = join(repoRoot, 'assets', 'sogn-safe-icon');

const MASTER_SVG = join(iconDir, 'SOGN-SAFE-App-Icon-1024.svg');
const SMALL_SVG = join(iconDir, 'SOGN-SAFE-App-Icon-Small.svg');
const COMPONENT = join(repoRoot, 'src', 'components', 'brand', 'SognSafeLogo.tsx');

/* ---------- parse the master SVG ---------- */

function getAttr(attrs, name) {
  const hit = new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(attrs);
  return hit ? hit[1] : undefined;
}

function parseSvg(file) {
  const xml = readFileSync(file, 'utf8');
  const layers = [];

  // <path id=... d=... fill=... opacity=... />
  const pathRe = /<path\s+([^>]*?)\/>/g;
  let m;
  while ((m = pathRe.exec(xml)) !== null) {
    const a = m[1];
    layers.push({
      kind: 'path',
      id: getAttr(a, 'id'),
      d: getAttr(a, 'd'),
      fill: getAttr(a, 'fill'),
      opacity: getAttr(a, 'opacity'),
    });
  }

  // <line id=... x1=... y1=... x2=... y2=... stroke=... strokeWidth=... />
  const lineRe = /<line\s+([^>]*?)\/>/g;
  while ((m = lineRe.exec(xml)) !== null) {
    const a = m[1];
    layers.push({
      kind: 'line',
      id: getAttr(a, 'id'),
      x1: getAttr(a, 'x1'),
      y1: getAttr(a, 'y1'),
      x2: getAttr(a, 'x2'),
      y2: getAttr(a, 'y2'),
      stroke: getAttr(a, 'stroke'),
      strokeWidth: getAttr(a, 'stroke-width'),
    });
  }

  return layers;
}

/* ---------- reconstruct what the component draws ---------- */

const src = readFileSync(COMPONENT, 'utf8');

/**
 * Grab the GEO object literal from the component source and eval it. The
 * object contains plain numeric/string data so this is safe; we only execute
 * our own file.
 */
function grabObject(name) {
  const anchor = `const ${name}: LogoGeometry = {`;
  const start = src.indexOf(anchor);
  if (start === -1) throw new Error(`Could not find ${name} in the component`);
  const open = src.indexOf('{', start);
  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === '{') depth += 1;
    else if (src[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  return eval(`(${src.slice(open, end + 1)})`);
}

const GEO = grabObject('GEO');

/** Convert a point set to an SVG path. */
function pointsToPath(points, close = true) {
  let d = '';
  for (let i = 0; i < points.length; i++) {
    d += `${i === 0 ? 'M' : 'L'} ${points[i].x} ${points[i].y} `;
  }
  if (close) d += 'Z';
  return d.trim();
}

/** Convert an SVG line to its canonical "M x1 y1 L x2 y2" form for comparison. */
function lineToPath(x1, y1, x2, y2) {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

const PALETTE = {
  seam: '#0B1013',
};

/**
 * Mirrors the JSX in SognSafeLogo.tsx for a metallic (non-mono) variant.
 * Fills are normalised to a token the SVG also uses so the comparison is
 * about geometry and intent, not about url(#...) id naming.
 */
function componentLayers(geo) {
  const b = geo.shipBow;
  const layers = [];

  // Ship bow (4 faces).
  layers.push({
    kind: 'path',
    id: 'Ship Top Left',
    d: pointsToPath([b.apex, b.leftShoulder, { x: 512, y: b.leftShoulder.y }]),
    fill: 'url(#bowTL)',
  });
  layers.push({
    kind: 'path',
    id: 'Ship Top Right',
    d: pointsToPath([b.apex, b.rightShoulder, { x: 512, y: b.rightShoulder.y }]),
    fill: 'url(#bowTR)',
  });
  layers.push({
    kind: 'path',
    id: 'Ship Bevel Left',
    d: pointsToPath([
      b.leftShoulder,
      b.leftBase,
      b.bottomCenter,
      { x: 512, y: b.leftShoulder.y },
    ]),
    fill: 'url(#bowBevelL)',
  });
  layers.push({
    kind: 'path',
    id: 'Ship Bevel Right',
    d: pointsToPath([
      b.rightShoulder,
      b.rightBase,
      b.bottomCenter,
      { x: 512, y: b.rightShoulder.y },
    ]),
    fill: 'url(#bowBevelR)',
  });

  // Three chevron waves + the diamond.
  for (const [n, c] of [
    [1, geo.wave1],
    [2, geo.wave2],
    [3, geo.wave3],
    [4, geo.diamond],
  ]) {
    layers.push({
      kind: 'path',
      id: n === 4 ? 'Diamond Top' : `Wave ${n} Top`,
      d: pointsToPath([c.topLeft, c.topRight, c.seamRight, c.seamLeft]),
      fill: 'url(#chevTop)',
    });
    layers.push({
      kind: 'path',
      id: n === 4 ? 'Diamond Bottom' : `Wave ${n} Bottom`,
      d: pointsToPath([c.seamLeft, c.seamRight, c.point]),
      fill: 'url(#chevBottom)',
    });
  }

  // Seams (lines).
  layers.push({
    kind: 'line',
    id: 'Ship Horizontal Seam',
    x1: b.leftShoulder.x,
    y1: b.leftShoulder.y,
    x2: b.rightShoulder.x,
    y2: b.rightShoulder.y,
    stroke: PALETTE.seam,
    strokeWidth: '3',
  });
  layers.push({
    kind: 'line',
    id: 'Ship Vertical Seam',
    x1: b.apex.x,
    y1: b.apex.y,
    x2: b.bottomCenter.x,
    y2: b.bottomCenter.y,
    stroke: PALETTE.seam,
    strokeWidth: '3',
  });
  for (const [n, c] of [
    [1, geo.wave1],
    [2, geo.wave2],
    [3, geo.wave3],
    [4, geo.diamond],
  ]) {
    layers.push({
      kind: 'line',
      id: n === 4 ? 'Diamond Seam' : `Wave ${n} Seam`,
      x1: c.seamLeft.x,
      y1: c.seamLeft.y,
      x2: c.seamRight.x,
      y2: c.seamRight.y,
      stroke: PALETTE.seam,
      strokeWidth: '3',
    });
  }

  return layers;
}

/* ---------- compare ---------- */

function compare(label, expected, actual) {
  const problems = [];

  if (expected.length !== actual.length) {
    problems.push(
      `layer count ${expected.length} (svg) vs ${actual.length} (component)`,
    );
  }

  const n = Math.max(expected.length, actual.length);
  for (let i = 0; i < n; i += 1) {
    const e = expected[i];
    const a = actual[i];
    if (!e) {
      problems.push(`[${i}] component draws extra layer "${a.id}"`);
      continue;
    }
    if (!a) {
      problems.push(`[${i}] component is missing layer "${e.id}"`);
      continue;
    }
    if (e.kind !== a.kind) {
      problems.push(`[${i}] kind "${e.kind}" vs "${a.kind}" for "${e.id}"`);
      continue;
    }
    if (e.id !== a.id) {
      problems.push(`[${i}] layer id "${e.id}" vs "${a.id}"`);
    }
    if (e.kind === 'path') {
      if (normalise(e.d) !== normalise(a.d)) {
        problems.push(`[${i}] ${e.id} path data differs`);
        problems.push(`      svg : ${e.d}`);
        problems.push(`      comp: ${a.d}`);
      }
      if ((e.fill ?? '') !== (a.fill ?? '')) {
        problems.push(`[${i}] ${e.id} fill "${e.fill}" vs "${a.fill}"`);
      }
      if ((e.opacity ?? '1') !== (a.opacity ?? '1')) {
        problems.push(`[${i}] ${e.id} opacity "${e.opacity}" vs "${a.opacity}"`);
      }
    } else {
      // line - compare as canonical M/L string for tolerance to attribute order
      const ePath = lineToPath(e.x1, e.y1, e.x2, e.y2);
      const aPath = lineToPath(a.x1, a.y1, a.x2, a.y2);
      if (normalise(ePath) !== normalise(aPath)) {
        problems.push(`[${i}] ${e.id} line endpoints differ`);
        problems.push(`      svg : ${ePath}`);
        problems.push(`      comp: ${aPath}`);
      }
      if ((e.stroke ?? '') !== (a.stroke ?? '')) {
        problems.push(`[${i}] ${e.id} stroke "${e.stroke}" vs "${a.stroke}"`);
      }
      if ((e.strokeWidth ?? '') !== (a.strokeWidth ?? '')) {
        problems.push(
          `[${i}] ${e.id} stroke-width "${e.strokeWidth}" vs "${a.strokeWidth}"`,
        );
      }
    }
  }

  const ok = problems.length === 0;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}  (${expected.length} layers)`);
  problems.forEach((p) => console.log(`      ${p}`));
  return ok;
}

function normalise(d = '') {
  return d.trim().replace(/\s+/g, ' ');
}

const master = parseSvg(MASTER_SVG);
const small = parseSvg(SMALL_SVG);

console.log('SOGN SAFE logo port verification');
console.log('================================\n');

const standardOk = compare(
  'standard geometry  <- SOGN-SAFE-App-Icon-1024.svg',
  master,
  componentLayers(GEO),
);

console.log('');
const pass = standardOk;
console.log(
  pass
    ? 'PASS - the component draws byte-identical geometry to the vector master'
    : 'FAIL - the component has drifted from the vector master',
);
process.exit(pass ? 0 : 1);